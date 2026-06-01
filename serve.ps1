param(
  [int]$Port = 5500,
  [string]$Root = (Get-Location).Path
)

$rootFull = [System.IO.Path]::GetFullPath($Root)
$listener = [System.Net.HttpListener]::new()
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "Impossible de démarrer le serveur sur $prefix"
  Write-Host "Si le port est occupé, essaye un autre port: -Port 5501"
  throw
}

Write-Host "Serveur démarré: $prefix"
Write-Host "Dossier: $rootFull"
Write-Host "Stop: Ctrl+C"

function Get-ContentType([string]$ext) {
  switch ($ext.ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "application/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".svg" { "image/svg+xml" }
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".webp" { "image/webp" }
    ".gif" { "image/gif" }
    ".ico" { "image/x-icon" }
    ".woff" { "font/woff" }
    ".woff2" { "font/woff2" }
    ".ttf" { "font/ttf" }
    ".mp4" { "video/mp4" }
    default { "application/octet-stream" }
  }
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response

  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $candidate = Join-Path $rootFull $rel
    $full = [System.IO.Path]::GetFullPath($candidate)

    if (-not $full.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
      $res.ContentType = "text/plain; charset=utf-8"
      try { $res.ContentLength64 = $bytes.Length } catch {}
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      continue
    }

    if ((Test-Path -LiteralPath $full -PathType Container)) {
      $full = Join-Path $full "index.html"
    }

    if (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.ContentType = "text/plain; charset=utf-8"
      try { $res.ContentLength64 = $bytes.Length } catch {}
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      continue
    }

    $ext = [System.IO.Path]::GetExtension($full)
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.StatusCode = 200
    $res.ContentType = Get-ContentType $ext
    try { $res.ContentLength64 = $bytes.Length } catch {}
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 500
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("500 Server Error")
    $res.ContentType = "text/plain; charset=utf-8"
    try { $res.ContentLength64 = $bytes.Length } catch {}
    try { $res.OutputStream.Write($bytes, 0, $bytes.Length) } catch {}
  } finally {
    $res.OutputStream.Close()
  }
}

try { $listener.Stop() } catch {}
