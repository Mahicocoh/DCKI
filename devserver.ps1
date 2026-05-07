param(
  [int]$Port = 8000,
  [string]$Root = "."
)

$rootPath = (Resolve-Path $Root).Path.TrimEnd('\')
$prefixLocalhost = "http://localhost:$Port/"
$prefixLoopback = "http://127.0.0.1:$Port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefixLocalhost)
$listener.Prefixes.Add($prefixLoopback)
$listener.Start()

Write-Host "Serving $rootPath at $prefixLocalhost"
Write-Host "Serving $rootPath at $prefixLoopback"

function Get-ContentType([string]$path) {
  $ext = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  switch ($ext) {
    ".html" { "text/html; charset=utf-8" }
    ".htm" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "application/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".svg" { "image/svg+xml" }
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".webp" { "image/webp" }
    ".avif" { "image/avif" }
    ".gif" { "image/gif" }
    ".mp4" { "video/mp4" }
    ".pdf" { "application/pdf" }
    ".woff" { "font/woff" }
    ".woff2" { "font/woff2" }
    ".ttf" { "font/ttf" }
    default { "application/octet-stream" }
  }
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $urlPath = $req.Url.AbsolutePath
    if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "/" }

    $decodedPath = [System.Uri]::UnescapeDataString($urlPath)
    if ([string]::IsNullOrWhiteSpace($decodedPath)) { $decodedPath = "/" }

    $rel = $decodedPath.TrimStart("/") -replace "/", "\"
    $filePath = Join-Path $rootPath $rel

    if ((Test-Path $filePath) -and (Get-Item $filePath).PSIsContainer) {
      $filePath = Join-Path $filePath "index.html"
    }
    if ($decodedPath -eq "/") {
      $filePath = Join-Path $rootPath "index.html"
    }

    if (-not (Test-Path $filePath)) {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.ContentType = "text/plain; charset=utf-8"
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
      continue
    }

    $full = (Resolve-Path $filePath).Path
    if (-not $full.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
      $res.ContentType = "text/plain; charset=utf-8"
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
      continue
    }

    $res.StatusCode = 200
    $res.ContentType = Get-ContentType $full
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.Close()
  } catch {
    try { if ($res) { $res.StatusCode = 500; $res.Close() } } catch {}
  }
}
