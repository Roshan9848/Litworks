# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

$logoPath = "C:\Users\madan\.gemini\antigravity\scratch\litworks\public\logo.png"
$faviconPngPath = "C:\Users\madan\.gemini\antigravity\scratch\litworks\public\favicon.png"
$faviconIcoPath = "C:\Users\madan\.gemini\antigravity\scratch\litworks\public\favicon.ico"

if (Test-Path $logoPath) {
    # Load original cropped logo
    $logo = [System.Drawing.Image]::FromFile($logoPath)
    Write-Output "Logo Width: $($logo.Width), Height: $($logo.Height)"
    
    # We want a square crop of height x height from the left (which contains the symbol)
    $size = $logo.Height # 86 pixels
    
    # Create new blank bitmap
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality rendering options
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    # Draw cropped area
    # Source rect: x=0, y=0, w=size, h=size
    # Dest rect: x=0, y=0, w=size, h=size
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $srcRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    
    $graphics.DrawImage($logo, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Save as PNG
    $bitmap.Save($faviconPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Successfully saved square PNG favicon to $faviconPngPath"
    
    # Clean up original image reference to release file lock before overwriting favicon.ico
    $logo.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()

    # Copy the PNG over to favicon.ico (modern browsers accept PNG content inside favicon.ico extension)
    if (Test-Path $faviconIcoPath) {
        Remove-Item $faviconIcoPath -Force
    }
    Copy-Item $faviconPngPath $faviconIcoPath -Force
    Write-Output "Successfully replaced favicon.ico with square favicon"
} else {
    Write-Output "Error: logo.png not found at $logoPath"
}
