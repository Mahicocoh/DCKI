$Port = 5173
$Root = (Get-Location).Path
$Prefix = "http://localhost:$Port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($Prefix)
$listener.Start()

Write-Host "Preview: $Prefix"
Write-Host "Root: $Root"

function Get-ContentType([string]$Path) {
  $ext = [IO.Path]::GetExtension($Path).ToLowerInvariant()
  switch ($ext) {
    ".html" { return "text/html; charset=utf-8" }
    ".css" { return "text/css" }
    ".js" { return "application/javascript" }
    ".json" { return "application/json" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".svg" { return "image/svg+xml" }
    ".webp" { return "image/webp" }
    ".gif" { return "image/gif" }
    ".ico" { return "image/x-icon" }
    default { return "application/octet-stream" }
  }
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $req = $ctx.Request
    $res = $ctx.Response

    $rel = $req.Url.AbsolutePath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }

    $candidate = Join-Path $Root $rel
    $full = [IO.Path]::GetFullPath($candidate)
    if (-not $full.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $bytes = [Text.Encoding]::UTF8.GetBytes("403 Forbidden")
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
      continue
    }

    if (-not (Test-Path $full -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
      continue
    }

    $res.ContentType = Get-ContentType $full
    $bytes = [IO.File]::ReadAllBytes($full)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.Close()
  } catch {
    try { $ctx.Response.StatusCode = 500; $ctx.Response.Close() } catch {}
  }
}

