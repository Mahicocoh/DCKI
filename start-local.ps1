param(
  [int]$Port = 5510
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$serve = Join-Path $root "serve.ps1"

Start-Process -FilePath "powershell" -WorkingDirectory $root -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy",
  "Bypass",
  "-File",
  $serve,
  "-Port",
  $Port,
  "-Root",
  $root
)

Write-Host "Serveur lancé: http://localhost:$Port/"
