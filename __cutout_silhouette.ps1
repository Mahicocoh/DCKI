param(
  [string]$InPath = "assets\\a48e2531-28c5-4e36-88c9-c211fc88fd93.png",
  [string]$OutPath = "assets\\a48e2531-28c5-4e36-88c9-c211fc88fd93-cutout.png",
  [int]$Threshold = 238
)

Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::new($InPath)
$w = $src.Width
$h = $src.Height
$dst = [System.Drawing.Bitmap]::new($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$rect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$srcData = $null
$dstData = $null

try {
  $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  $srcStride = $srcData.Stride
  $dstStride = $dstData.Stride

  $srcBytes = [byte[]]::new($srcStride * $h)
  [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcBytes, 0, $srcBytes.Length)

  $mask = [byte[]]::new($w * $h)
  $queue = [int[]]::new($w * $h)
  $head = 0
  $tail = 0

  function IsBg([int]$x, [int]$y) {
    $i = $y * $script:srcStride + $x * 3
    $b = [int]$script:srcBytes[$i]
    $g = [int]$script:srcBytes[$i + 1]
    $r = [int]$script:srcBytes[$i + 2]
    return ($r -ge $script:Threshold -and $g -ge $script:Threshold -and $b -ge $script:Threshold)
  }

  for ($x = 0; $x -lt $w; $x += 1) {
    if (IsBg $x 0) {
      $idx = $x
      if ($mask[$idx] -eq 0) { $mask[$idx] = 1; $queue[$tail] = $idx; $tail += 1 }
    }
    if (IsBg $x ($h - 1)) {
      $idx = ($h - 1) * $w + $x
      if ($mask[$idx] -eq 0) { $mask[$idx] = 1; $queue[$tail] = $idx; $tail += 1 }
    }
  }

  for ($y = 0; $y -lt $h; $y += 1) {
    if (IsBg 0 $y) {
      $idx = $y * $w
      if ($mask[$idx] -eq 0) { $mask[$idx] = 1; $queue[$tail] = $idx; $tail += 1 }
    }
    if (IsBg ($w - 1) $y) {
      $idx = $y * $w + ($w - 1)
      if ($mask[$idx] -eq 0) { $mask[$idx] = 1; $queue[$tail] = $idx; $tail += 1 }
    }
  }

  while ($head -lt $tail) {
    $idx = $queue[$head]
    $head += 1

    $x = $idx % $w
    $y = [int](($idx - $x) / $w)

    if ($x -gt 0) {
      $n = $idx - 1
      if ($mask[$n] -eq 0 -and (IsBg ($x - 1) $y)) { $mask[$n] = 1; $queue[$tail] = $n; $tail += 1 }
    }
    if ($x -lt ($w - 1)) {
      $n = $idx + 1
      if ($mask[$n] -eq 0 -and (IsBg ($x + 1) $y)) { $mask[$n] = 1; $queue[$tail] = $n; $tail += 1 }
    }
    if ($y -gt 0) {
      $n = $idx - $w
      if ($mask[$n] -eq 0 -and (IsBg $x ($y - 1))) { $mask[$n] = 1; $queue[$tail] = $n; $tail += 1 }
    }
    if ($y -lt ($h - 1)) {
      $n = $idx + $w
      if ($mask[$n] -eq 0 -and (IsBg $x ($y + 1))) { $mask[$n] = 1; $queue[$tail] = $n; $tail += 1 }
    }
  }

  $dstBytes = [byte[]]::new($dstStride * $h)
  for ($yy = 0; $yy -lt $h; $yy += 1) {
    $srcRow = $yy * $srcStride
    $dstRow = $yy * $dstStride
    $rowBase = $yy * $w
    for ($xx = 0; $xx -lt $w; $xx += 1) {
      $srcI = $srcRow + $xx * 3
      $dstI = $dstRow + $xx * 4

      $b = $srcBytes[$srcI]
      $g = $srcBytes[$srcI + 1]
      $r = $srcBytes[$srcI + 2]

      $isBg = ($mask[$rowBase + $xx] -eq 1)

      $dstBytes[$dstI] = $b
      $dstBytes[$dstI + 1] = $g
      $dstBytes[$dstI + 2] = $r
      $dstBytes[$dstI + 3] = $(if ($isBg) { 0 } else { 255 })
    }
  }

  [System.Runtime.InteropServices.Marshal]::Copy($dstBytes, 0, $dstData.Scan0, $dstBytes.Length)

  $src.UnlockBits($srcData)
  $dst.UnlockBits($dstData)
  $srcData = $null
  $dstData = $null

  $dst.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  if ($srcData) { $src.UnlockBits($srcData) }
  if ($dstData) { $dst.UnlockBits($dstData) }
  if ($src) { $src.Dispose() }
  if ($dst) { $dst.Dispose() }
}

Write-Output $OutPath
