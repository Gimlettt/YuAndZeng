import requests

headers = {"Authorization": ""}  # API key

data = {
    "prompt": 'https://www.youtube.com/shorts/Fa-vq2C4-D0 describe this video',
    "isFast":"Y",
    "videoNoList":[]
}

response = requests.post(
    "https://ppe-backend.memories.ai/serve/open/video/chat",
    headers=headers,
    json=data
)
print(response.text)