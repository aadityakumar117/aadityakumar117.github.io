# Local preview server. Run:  powershell -ExecutionPolicy Bypass -File serve.ps1
# then open http://localhost:8000  (Ctrl+C to stop)
param([int]$Port = 8000)

$root = $PSScriptRoot
$types = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
    '.js'   = 'text/javascript; charset=utf-8'; '.md' = 'text/markdown; charset=utf-8'
    '.svg'  = 'image/svg+xml'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
    '.png'  = 'image/png'; '.gif' = 'image/gif'; '.ico' = 'image/x-icon'; '.pdf' = 'application/pdf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/  (Ctrl+C to stop)"

try {
    while ($listener.IsListening) {
        $task = $listener.GetContextAsync()
        while (-not $task.AsyncWaitHandle.WaitOne(200)) { }   # keeps Ctrl+C responsive
        $context = $task.Result
        $response = $context.Response
        try {
            $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
            if ($relative -eq '') { $relative = 'index.html' }
            $path = [IO.Path]::GetFullPath((Join-Path $root $relative))

            if ($path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path $path -PathType Leaf)) {
                $bytes = [IO.File]::ReadAllBytes($path)
                $type = $types[[IO.Path]::GetExtension($path).ToLower()]
                if (-not $type) { $type = 'application/octet-stream' }
                $response.ContentType = $type
                $response.Headers['Last-Modified'] = (Get-Item $path).LastWriteTimeUtc.ToString('R')
                $response.Headers['Cache-Control'] = 'no-cache'
                $response.ContentLength64 = $bytes.Length
                if ($context.Request.HttpMethod -ne 'HEAD') { $response.OutputStream.Write($bytes, 0, $bytes.Length) }
            } else {
                $response.StatusCode = 404
            }
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
}
