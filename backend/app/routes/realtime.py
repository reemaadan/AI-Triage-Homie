# app/routes/realtime.py
import os
import httpx
from fastapi import APIRouter, HTTPException
from typing import Any, Dict
from pydantic import BaseModel
from app.routes.snapshot import CONSENT
from app.services.snapshot_builder import build_snapshot

router = APIRouter()

SYSTEM_PROMPT = (
    "You are a clinical assistant. Use ONLY patient data returned by tools.\n"
    "- If data is missing, say so and suggest safe next steps.\n"
    "- Never invent medications or labs.\n"
    "- Watch for allergy conflicts and warn clearly if suspected.\n"
    "- Structure answers as: Summary; Clarifying Questions; Next Steps."
)

def _tools_definition():
    # Tool the model can call to get patient context
    return [
        {
            "type": "function",
            "name": "get_patient_snapshot",
            "description": "Return recent conditions, diagnoses, medications, allergies(+reactions), labs for a patient.",
            "parameters": {
                "type": "object",
                "properties": {"patient_id": {"type": "integer"}},
                "required": ["patient_id"]
            }
        }
    ]

@router.get("/realtime/token")
async def get_realtime_token():
    """
    Mint a short-lived Realtime session for the browser (WebRTC). Returns the session JSON
    containing a client_secret that the browser uses to authenticate its WebRTC offer.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY missing")

    url = "https://api.openai.com/v1/realtime/sessions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1",
    }
    body = {
        "model": os.getenv("OPENAI_REALTIME_MODEL", "gpt-4o-realtime-preview"),
        # Voice selection for Realtime speech output:
        "voice": os.getenv("OPENAI_VOICE", "verse"),
        "modalities": ["text", "audio"],
        "audio": {"voice": os.getenv("OPENAI_VOICE", "verse"), "format": "wav"},
        # Give the model guardrails + format:
        "instructions": SYSTEM_PROMPT,
        # Attach tool(s) so the model can call back for patient context:
        "tools": _tools_definition(),
    }
    if not body["instructions"]:
        body["instructions"] = SYSTEM_PROMPT
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(url, headers=headers, json=body)
        if r.status_code >= 400:
            raise HTTPException(status_code=r.status_code, detail=r.text)
        # Return the session object. The browser will use the ephemeral token inside it.
        return r.json()

class ToolCall(BaseModel):
    name: str
    args: Dict[str, Any]

@router.post("/realtime/toolcall")
async def tool_call(tool_call: ToolCall):
    if tool_call.name != "get_patient_snapshot":
        raise HTTPException(status_code=400, detail="Unsupported tool name")

    patient_id = tool_call.args.get("patient_id")
    if patient_id is None:
        raise HTTPException(status_code=400, detail="patient_id is required")

    consent = CONSENT.get(patient_id)
    if not consent:
        raise HTTPException(status_code=403, detail="Consent required for patient data access")

    snap = await build_snapshot(patient_id)
    return {"ok": True, "snapshot": snap}