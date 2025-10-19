import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

const PATIENTS = {
  a1: {
    name: "Sarah Johnson",
    meta: "45 yrs, Female • Patient ID: SJ12345",
    complaint:
      "Patient reports persistent headaches for the past two weeks, accompanied by occasional dizziness. Worse in afternoons. No visual disturbances or nausea. Increased stress at work.",
    lastVisit: {
      date: "September 22, 2025 – 02:30 PM",
      type: "Follow-up Visit",
      assessment: "Tension headaches – improving with conservative management",
      treatment: "Stress management, PRN ibuprofen",
      notes:
        "Improvement after stress management techniques. Headaches reduced from daily to 2–3 times/week with good relief from ibuprofen.",
    },
    soap: [
      { date: "September 22, 2025", time: "02:30 PM" },
      { date: "August 15, 2025", time: "10:00 AM" },
      { date: "June 10, 2025", time: "03:15 PM" },
      { date: "March 28, 2025", time: "11:30 AM" },
    ],
  },
  b1: {
    name: "Priya Nair",
    meta: "36 yrs, Female • Patient ID: PN88420",
    complaint:
      "Allergy flare-up and sinus pressure for 5 days. Worse in mornings. No fever. OTC antihistamines with mild relief.",
    lastVisit: {
      date: "July 02, 2025 – 11:10 AM",
      type: "Initial Consult",
      assessment: "Seasonal allergic rhinitis",
      treatment: "Daily antihistamine, saline rinse",
      notes:
        "Trigger avoidance advised; follow up if symptoms persist beyond 2 weeks.",
    },
    soap: [
      { date: "July 02, 2025", time: "11:10 AM" },
      { date: "May 10, 2025", time: "09:45 AM" },
    ],
  },
};

const OPTS = [
  {
    id: "upload",
    icon: "📤",
    title: "Upload Conversation",
    sub: "File type (mp4, etc.)",
  },
  {
    id: "recap",
    icon: "💬",
    title: "Recap Call",
    sub: "Chat with AI and summarize",
  },
  {
    id: "voice",
    icon: "🎙️",
    title: "Voice Record",
    sub: "Dictate notes in real-time",
  },
  {
    id: "call",
    icon: "📞",
    title: "Commence Call",
    sub: "Call the patient directly",
  },
];

export default function PatientDetail() {
  const { pid } = useParams();
  const data = PATIENTS[pid] || PATIENTS.a1;

  const [selected, setSelected] = useState(null); // "upload" | "recap" | "voice" | "call"
  const [started, setStarted] = useState(false);

  // simple recap chat mock
  const [messages, setMessages] = useState([
    { role: "system", text: "You can chat with AI here after you start." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages((m) => [...m, { role: "user", text: chatInput }]);
    setChatInput("");
  };

  const left = useMemo(() => {
    const initials = data.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("");
    return (
      <>
        <div className="pd-breadcrumb">
          <Link to="/dashboard" className="pd-back">
            ← Back to dashboard
          </Link>
        </div>

        <header className="pd-header">
          <div className="pd-avatar">{initials}</div>
          <div>
            <h1 className="pd-name">{data.name}</h1>
            <div className="pd-meta">{data.meta}</div>
          </div>
        </header>

        <div className="pd-card">
          <h3 className="pd-card-title">Chief Complaint</h3>
          <p className="pd-par">{data.complaint}</p>
        </div>

        <div className="pd-card">
          <div className="pd-lastvisit">
            <div className="pd-lastvisit-date">{data.lastVisit.date}</div>
            <div className="pd-lastvisit-type">{data.lastVisit.type}</div>
          </div>
          <div className="pd-row">
            <div>
              <div className="pd-label">Assessment</div>
              <div className="pd-val">{data.lastVisit.assessment}</div>
            </div>
            <div>
              <div className="pd-label">Treatment</div>
              <div className="pd-val">{data.lastVisit.treatment}</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="pd-label">Notes</div>
            <div className="pd-val">{data.lastVisit.notes}</div>
          </div>
        </div>

        <div className="pd-card">
          <h3 className="pd-card-title">Previous SOAP Notes</h3>
          <div className="pd-accordion">
            {data.soap.map((s, i) => (
              <details key={i} className="pd-acc-item">
                <summary>
                  <span>{s.date}</span>
                  <span className="pd-muted">{s.time}</span>
                </summary>
                <div className="pd-acc-body">
                  <p className="pd-par">
                    Example SOAP content for {s.date}. (Replace with real data
                    later.)
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </>
    );
  }, [data]);

  const renderWorkspace = () => {
    if (!started || !selected) {
      return (
        <div className="pd-hint">
          Select an option and click <strong>Start</strong>.
        </div>
      );
    }
    if (selected === "upload") {
      return (
        <div className="pd-work">
          <div className="pd-dropzone">
            <input
              type="file"
              id="upload-file"
              className="pd-file"
              onChange={(e) => {
                /* hook to backend later */
              }}
            />
            <label htmlFor="upload-file">
              <strong>Drop file here</strong> or{" "}
              <span className="link">browse</span>
              <div className="pd-sub">Supported: mp4, mp3, wav</div>
            </label>
          </div>
        </div>
      );
    }
    if (selected === "recap") {
      return (
        <div className="pd-work">
          <div className="pd-chat">
            <div className="pd-chat-body">
              {messages.map((m, i) => (
                <div key={i} className={`pd-msg ${m.role}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form className="pd-chat-input" onSubmit={sendChat}>
              <button
                type="button"
                className="button pd-voice-btn"
                title="Toggle voice"
              >
                🔊
              </button>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message…"
              />
              <button className="button" type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      );
    }
    if (selected === "voice") {
      return (
        <div className="pd-work pd-center">
          <div className="pd-mic">🎙️</div>
          <div className="pd-sub">
            Recording (mock)… connect to GPT Voice later.
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              className="button"
              onClick={() => alert("Mock: stop recording")}
            >
              Stop
            </button>
          </div>
        </div>
      );
    }
    if (selected === "call") {
      return (
        <div className="pd-work">
          <div className="pd-field">
            <label>Platform</label>
            <select className="input" defaultValue="zoom">
              <option value="zoom">Zoom</option>
              <option value="meet">Google Meet</option>
              <option value="phone">Phone</option>
            </select>
          </div>
          <button
            className="button"
            onClick={() => alert("Mock: launching call…")}
          >
            Start Call
          </button>
          <div className="pd-sub" style={{ marginTop: 8 }}>
            This launches inside this panel; patient details remain on the left.
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="pd-main">
      <div className="container pd-grid">
        {/* LEFT */}
        <section className="pd-left">{left}</section>

        {/* RIGHT: full-height panel with single-select options + workspace */}
        <aside className="pd-right">
          <div className="pd-panel">
            <div className="pd-panel-scroll">
              <div className="pd-options">
                {OPTS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`pd-opt ${selected === o.id ? "selected" : ""}`}
                    onClick={() => {
                      setSelected(o.id); /* single-select */
                    }}
                    aria-pressed={selected === o.id}
                  >
                    <div className="pd-opt-icon">{o.icon}</div>
                    <div className="pd-opt-body">
                      <strong>{o.title}</strong>
                      <div className="pd-sub">{o.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className={`button pd-cta ${!selected ? "disabled" : ""}`}
                disabled={!selected}
                onClick={() => setStarted(true)}
              >
                Start
              </button>

              <div className="pd-divider" />

              {/* Workspace area swaps based on selected option after Start */}
              {renderWorkspace()}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
