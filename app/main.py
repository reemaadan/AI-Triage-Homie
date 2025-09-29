
# app/main.py
from fastapi import FastAPI
from app.routes import snapshot

app = FastAPI()

@app.get("/")
def home():
    return {"message": "API is running. Try /health or /docs"}

@app.get("/health")
def health():
    return {"ok": True}

# Mount app routes
app.include_router(snapshot.router, tags=["app"])

# app/services/snapshot_builder.py
import os
from typing import Any, Dict, List
from datetime import datetime
import httpx
from dotenv import load_dotenv
import asyncio

load_dotenv()

BASE = os.getenv("E_HOSPITAL_BASE_URL", "").rstrip("/")
if not BASE:
    raise RuntimeError("E_HOSPITAL_BASE_URL not set. Add it to your .env and restart the server.")


def _parse_dt(x: Any) -> datetime:
    if not x:
        return datetime.min
    fmts = (
        "%Y-%m-%d",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%SZ",
    )
    for f in fmts:
        try:
            return datetime.strptime(str(x), f)
        except ValueError:
            pass
    try:
        return datetime.fromisoformat(str(x).replace("Z", "+00:00"))
    except Exception:
        return datetime.min


def _filter_sort_trim(rows: List[Dict[str, Any]], patient_id: int, date_keys: List[str], limit: int) -> List[Dict[str, Any]]:
    filtered = [r for r in rows if str(r.get("patient_id")) == str(patient_id)]
    def sk(r):
        for k in date_keys:
            if k in r and r[k]:
                return _parse_dt(r[k])
        return datetime.min
    filtered.sort(key=sk, reverse=True)
    return filtered[:limit]


async def _get_table(client: httpx.AsyncClient, name: str) -> List[Dict[str, Any]]:
    url = f"{BASE}/table/{name}"
    headers = {}
    token = os.getenv("E_HOSPITAL_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    resp = await client.get(url, headers=headers)
    resp.raise_for_status()
    data = resp.json()
    return data.get("data", data)


async def build_snapshot(patient_id: int) -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=20.0) as client:
        mh_task = _get_table(client, "medical_history")
        pr_task = _get_table(client, "prescription")
        ar_task = _get_table(client, "allergy_records")
        rx_task = _get_table(client, "allergy_reaction")
        lb_task = _get_table(client, "lab_tests")
        dx_task = _get_table(client, "diagnosis")
        mh, pr, ar, rx, lb, dx = await asyncio.gather(mh_task, pr_task, ar_task, rx_task, lb_task, dx_task)

    mh_trim = _filter_sort_trim(mh, patient_id, ["last_updated", "diagnosis_date"], 3)
    pr_trim = _filter_sort_trim(pr, patient_id, ["issued_on", "start_date", "end_date"], 3)
    ar_trim = _filter_sort_trim(ar, patient_id, ["recorded_on"], 3)
    lb_trim = _filter_sort_trim(lb, patient_id, ["test_date", "uploaded_on"], 3)
    dx_trim = _filter_sort_trim(dx, patient_id, ["diagnosis_date"], 3)

    # Attach last 2 reactions per kept allergy record
    keep_ids = {a.get("record_id") for a in ar_trim}
    rx_for_keep = [r for r in rx if r.get("allergy_record_id") in keep_ids]
    rx_for_keep.sort(key=lambda r: _parse_dt(r.get("reaction_date")), reverse=True)

    by_record: Dict[int, List[Dict[str, Any]]] = {}
    for r in rx_for_keep:
        rid = r.get("allergy_record_id")
        lst = by_record.setdefault(rid, [])
        if len(lst) < 2:
            lst.append(r)

    for a in ar_trim:
        a["reactions"] = by_record.get(a.get("record_id"), [])

    return {
        "patient_id": patient_id,
        "visits": [],
        "medical_history": mh_trim,
        "medications": pr_trim,
        "allergies": ar_trim,
        "labs": lb_trim,
        "diagnoses": dx_trim,
    }

