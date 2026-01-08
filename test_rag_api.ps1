$maxRetries = 10
$retryInterval = 2

for ($i = 0; $i -lt $maxRetries; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/search/founders" -Method Post -ContentType "application/json" -Body '{"query": "ai", "top_k": 1}'
        Write-Host "Success!"
        Write-Host ($response | ConvertTo-Json -Depth 5)
        exit 0
    } catch {
        Write-Host "Attempt $($i+1) failed: $_"
        Start-Sleep -Seconds $retryInterval
    }
}
Write-Host "Failed to connect after $maxRetries attempts."
exit 1
