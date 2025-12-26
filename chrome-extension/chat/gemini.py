from google import genai
from google.genai import types
import asyncio
import os
from pathlib import Path


GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyD1TXg8nFSWW2y8rZfqJ9ykqfuz0U9451o")

PROMPT = """

    """

async def process_video(video_path: Path) -> :

    client = genai.Client(api_key=GEMINI_API_KEY)
    
    # Read video bytes
    with open(video_path, 'rb') as f:
        video_bytes = f.read()
    
    # Run the API call in a thread pool to avoid blocking
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: client.models.generate_content(
            model='gemini-3-pro-preview',
            contents=[
                types.Part(
                    inline_data=types.Blob(data=video_bytes, mime_type='video/mp4'),
                    video_metadata=types.VideoMetadata(fps=10)
                ),
                types.Part(text=PROMPT)
            ]
        )
    )
    
    # Parse the structured response
    # prediction = Prediction.model_validate_json(response.text)
    
    # return prediction
    return response.text

        
async def main():
    """Main function to process a video."""
    try:
        result = await process_video()
        print(f"\nResult:")
        print(result)

    except Exception as e:
        print(f"Error processing video: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())

