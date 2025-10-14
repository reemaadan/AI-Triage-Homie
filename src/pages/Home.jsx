import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const phrase = "Faster, Smarter, Safer.";
  const [text, setText] = useState("");
  const [mode, setMode] = useState("type"); // "type" | "delete"

  useEffect(() => {
    const typeMs = 45; // smoother typing
    const deleteMs = 35; // smoother deleting
    const pauseFull = 1200; // pause when full
    const pauseEmpty = 400; // pause when empty

    let t;

    if (mode === "type") {
      if (text === phrase) {
        t = setTimeout(() => setMode("delete"), pauseFull);
      } else {
        t = setTimeout(() => {
          setText(phrase.slice(0, text.length + 1));
        }, typeMs);
      }
    } else {
      if (text.length === 0) {
        t = setTimeout(() => setMode("type"), pauseEmpty);
      } else {
        t = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deleteMs);
      }
    }

    return () => clearTimeout(t);
  }, [text, mode]);

  return (
    <main className="main">
      <div className="hero">
        <h1>From Symptoms to Solutions,</h1>

        {/* fixed height to prevent layout jump */}
        <h1 className="highlight typing-line">
          <span className="typing">{text || "\u00A0"}</span>
          <span className="cursor" aria-hidden="true"></span>
        </h1>

        <p className="muted">Smarter healthcare, powered by AI.</p>
        <Link className="button" to="/login">
          Login
        </Link>
      </div>
    </main>
  );
}
