$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/search/founders" -Method Post -ContentType "application/json" -Body '{"query": "ActionIQ", "top_k": 1}'
Write-Host "Full Response:"
Write-Host ($response | ConvertTo-Json -Depth 5)
