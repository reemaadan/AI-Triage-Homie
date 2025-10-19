import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/dashboard" className="brand">
          E-Hospital
        </Link>
        <nav>
          <Link className="button" to="/">
            Log out
          </Link>
        </nav>
      </div>
    </header>
  );
}
