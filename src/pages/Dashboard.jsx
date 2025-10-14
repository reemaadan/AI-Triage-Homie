export default function Dashboard() {
  const name = sessionStorage.getItem("doctorName") || "Dr. Jane";
  return (
    <main className="container" style={{ padding: "32px 16px" }}>
      <h1 className="dash-hello">
        Hello, <span className="dash-name">{name}</span>
      </h1>
    </main>
  );
}
