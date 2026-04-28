#!/usr/bin/env python3
"""Edge TTS micro-server for Catecismo Digital.
Runs on port 8006, no auth needed (internal use).
Provides: GET /tts?text=...  → returns MP3 audio stream."""

import asyncio
import urllib.parse
import os
from fastapi import FastAPI, Query, Response
from fastapi.middleware.cors import CORSMiddleware
import edge_tts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

VOICE_ES = os.environ.get("TTS_VOICE_ES", "es-MX-DaliaNeural")
VOICE_EN = os.environ.get("TTS_VOICE_EN", "en-US-JennyNeural")
RATE = os.environ.get("TTS_RATE", "-10%")


@app.get("/tts")
async def text_to_speech(
    text: str = Query(..., min_length=1, max_length=10000),
    lang: str = Query("es", regex="^(es|en)$"),
):
    try:
        text_decoded = urllib.parse.unquote(text)
        voice = VOICE_ES if lang == "es" else VOICE_EN
        communicate = edge_tts.Communicate(text_decoded, voice=voice, rate=RATE)
        mp3_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                mp3_data += chunk["data"]
        if not mp3_data:
            return Response("TTS generation failed", status_code=500)
        return Response(content=mp3_data, media_type="audio/mpeg")
    except Exception as e:
        return Response(f"Error: {str(e)}", status_code=500)

@app.get("/health")
async def health():
    return {"status": "ok", "voice": "es-MX-DaliaNeural"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8006)
