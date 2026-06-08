param(
  [int]$Port = 5173,
  [string]$Root = (Get-Location).Path
)

$rootPath = (Resolve-Path -LiteralPath $Root).Path

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".mjs"  = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".avif" = "image/avif"
  ".ico"  = "image/x-icon"
  ".mp4"  = "video/mp4"
  ".pdf"  = "application/pdf"
  ".txt"  = "text/plain; charset=utf-8"
}

function Get-ContentType([string]$path) {
  $ext = [IO.Path]::GetExtension($path).ToLowerInvariant()
  if ($mime.ContainsKey($ext)) { return $mime[$ext] }
  return "application/octet-stream"
}

function Send-Text([System.Net.HttpListenerResponse]$res, [int]$status, [string]$text) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($text)
  $res.StatusCode = $status
  $res.ContentType = "text/plain; charset=utf-8"
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
  $res.OutputStream.Close()
}

$prefix = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "DCKI local server: $prefix"
Write-Output "Root: $rootPath"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    try {
      $urlPath = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart("/"))
      if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }
      if ($urlPath.EndsWith("/")) { $urlPath = $urlPath + "index.html" }

      $candidate = Join-Path $rootPath $urlPath
      $full = (Resolve-Path -LiteralPath $candidate -ErrorAction SilentlyContinue)
      if (-not $full) {
        Send-Text $res 404 "Not Found"
        continue
      }
      $fullPath = $full.Path
      if (-not $fullPath.StartsWith($rootPath, [StringComparison]::OrdinalIgnoreCase)) {
        Send-Text $res 403 "Forbidden"
        continue
      }
      if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        Send-Text $res 404 "Not Found"
        continue
      }

      $fi = [IO.FileInfo]::new($fullPath)
      $len = $fi.Length
      $res.Headers["Cache-Control"] = "no-store"
      $res.Headers["Accept-Ranges"] = "bytes"
      $res.ContentType = (Get-ContentType $fullPath)

      $range = $req.Headers["Range"]
      if ($range -and $range -match "^bytes=(\d+)-(\d*)$") {
        $start = [int64]$Matches[1]
        $end = if ([string]::IsNullOrWhiteSpace($Matches[2])) { $len - 1 } else { [int64]$Matches[2] }
        if ($start -ge $len) {
          $res.StatusCode = 416
          $res.Headers["Content-Range"] = "bytes */$len"
          $res.OutputStream.Close()
          continue
        }
        if ($end -ge $len) { $end = $len - 1 }
        if ($end -lt $start) { $end = $start }

        $count = $end - $start + 1
        $res.StatusCode = 206
        $res.Headers["Content-Range"] = "bytes $start-$end/$len"
        $res.ContentLength64 = $count

        $fs = [IO.File]::Open($fullPath, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
        try {
          $null = $fs.Seek($start, [IO.SeekOrigin]::Begin)
          $buf = New-Object byte[] 65536
          $remaining = $count
          while ($remaining -gt 0) {
            $toRead = [int][Math]::Min($buf.Length, $remaining)
            $read = $fs.Read($buf, 0, $toRead)
            if ($read -le 0) { break }
            $res.OutputStream.Write($buf, 0, $read)
            $remaining -= $read
          }
        } finally {
          $fs.Close()
          $res.OutputStream.Close()
        }
        continue
      }

      $res.StatusCode = 200
      $res.ContentLength64 = $len
      $fs2 = [IO.File]::Open($fullPath, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
      try {
        $buf2 = New-Object byte[] 65536
        while (($read2 = $fs2.Read($buf2, 0, $buf2.Length)) -gt 0) {
          $res.OutputStream.Write($buf2, 0, $read2)
        }
      } finally {
        $fs2.Close()
        $res.OutputStream.Close()
      }
    } catch {
      try { Send-Text $res 500 "Internal Server Error" } catch {}
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}

