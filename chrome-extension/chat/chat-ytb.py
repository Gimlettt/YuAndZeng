import requests

headers = {"Authorization": "Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI2NTg1OTEyNjU2NDA5MDI2NTYiLCJzdWIiOiJ7XCJhY2NvdW50XCI6XCI5b2F0cmY0a21qQGNvbWZ5dGhpbmdzLmNvbVwiLFwiZmlyc3RSZWdpc3RlclwiOmZhbHNlLFwiaWRcIjo2NTM4NDk0NjkxNjc0ODkwMjQsXCJsYXN0Q2hhbmdlUGFzc3dvcmRUaW1lXCI6MTc2NTM0OTA2MTAwMCxcIm5hbWVcIjpcIjlvYXRyZjRrbWpcIixcInN0YXR1c1wiOlwiRU5BQkxFRFwifSIsImlzcyI6IndoaiIsImlhdCI6MTc2NjQ3OTU5MywiZXhwIjoxNzY3MDg0MzkzfQ.SuqyJOFXZn3x222EJZ6UK7IeBbk_Ito3BytbATZ51n7vLjxeQWxVTo-XaLxNSXvVVBcX94J4-nq36WYSg6asCZ-2DWqwhBP8yl45Ix4l8iW3iIT5TawT7LI_8EO-eVZCyA4BJQ4BN7lNOxbQOD9gsftD1RDcTnmbWbQvmR_7bdDPMpwX2Kx5LcP03VDjkuNRZBtEy0g17CqrWne00pZbIoV4Ydgt2zwQnv_rHxasvEzPu7K-ukb1n6gVMfohWvdngZPvxSspthXoizaVFLGO8ppGS6VV2XfCdl8r80N-OfXK9QECpDg7iIUdqnf3D1FXmD3OkMKdJsUfVpI6jP1nRg"}  # API key

data = {
    "msg": 'https://www.youtube.com/shorts/Fa-vq2C4-D0 describe this video',
    "videoNoList":[]
}

response = requests.post(
    "https://ppe-backend.memories.ai/serve/video/chat",
    headers=headers,
    json=data
)
print(response.text)