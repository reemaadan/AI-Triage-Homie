import { useMemo, useState } from "react";

/* ----- Patient sets ----- */
const SET_A = [
  {
    name: "Sarah Johnson",
    age: 45,
    sex: "F",
    time: "09:00 AM",
    note: "Persistent headaches for two weeks, occasional dizziness.",
  },
  {
    name: "Michael Chen",
    age: 32,
    sex: "M",
    time: "10:30 AM",
    note: "Hypertension follow-up and medication review.",
  },
  {
    name: "Emma Rodriguez",
    age: 28,
    sex: "F",
    time: "11:00 AM",
    note: "Acute lower back pain after lifting boxes.",
  },
  {
    name: "James Wilson",
    age: 56,
    sex: "M",
    time: "01:00 PM",
    note: "Routine exam and blood work review.",
  },
  {
    name: "Lisa Anderson",
    age: 41,
    sex: "F",
    time: "02:30 PM",
    note: "Respiratory symptoms with persistent cough.",
  },
  {
    name: "David Martinez",
    age: 63,
    sex: "M",
    time: "03:30 PM",
    note: "Diabetes consult and A1C discussion.",
  },
]; // 6 cards

const SET_B = [
  {
    name: "Priya Nair",
    age: 36,
    sex: "F",
    time: "09:15 AM",
    note: "Allergy flare-up and sinus pressure.",
  },
  {
    name: "Noah Brown",
    age: 29,
    sex: "M",
    time: "10:00 AM",
    note: "Sports injury—ankle sprain evaluation.",
  },
  {
    name: "Hana Suzuki",
    age: 52,
    sex: "F",
    time: "11:40 AM",
    note: "Thyroid panel review and dosage check.",
  },
  {
    name: "Oliver Smith",
    age: 47,
    sex: "M",
    time: "01:30 PM",
    note: "Chest discomfort—non-urgent assessment.",
  },
]; // 4 cards

/* ----- Local date helpers (avoid UTC shift) ----- */
const toYmdLocal = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const parseYmdLocal = (ymd) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtLongLocal = (ymd) =>
  parseYmdLocal(ymd).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function Dashboard() {
  // start on today → Set A
  const [ymd, setYmd] = useState(toYmdLocal(new Date()));
  const [pickCount, setPickCount] = useState(0); // increments each change

  const dayString = useMemo(() => fmtLongLocal(ymd), [ymd]);

  // 0 -> A (6), 1 -> B (4), 2 -> none, 3 -> A, 4 -> B, 5 -> none, ...
  const variant = pickCount % 3;
  const list = variant === 0 ? SET_A : variant === 1 ? SET_B : [];

  const onDateChange = (e) => {
    const next = e.target.value;
    if (next && next !== ymd) {
      setYmd(next);
      setPickCount((c) => c + 1);
    }
  };

  return (
    <main className="dash-main">
      <div className="container">
        <h1 className="dash-hello">
          Hello, <span className="dash-name">Dr. Jane</span>
        </h1>

        <div className="dash-header">
          <div className="date-display">{dayString}</div>
          <div className="date-control">
            <label htmlFor="date" className="sr-only">
              Choose date
            </label>
            <input
              id="date"
              className="date-input"
              type="date"
              value={ymd}
              onChange={onDateChange}
            />
          </div>
        </div>

        <h2 className="dash-title">Patient Dashboard</h2>

        <div className="cards">
          {list.length === 0 ? (
            <div className="empty">No appointments for this day.</div>
          ) : (
            list.map((p, i) => (
              <article key={i} className="card">
                <h3 className="card-name">{p.name}</h3>
                <div className="card-meta">
                  {p.age}, {p.sex}
                </div>
                <div className="card-time">{p.time}</div>
                <hr className="card-rule" />
                <div className="card-label">Primary Complaint</div>
                <p className="card-note">{p.note}</p>
                <a
                  href={
                    i === 0
                      ? variant === 0
                        ? "/patient/a1"
                        : "/patient/b1"
                      : "#select"
                  }
                  className="card-link"
                >
                  Select &gt;
                </a>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
