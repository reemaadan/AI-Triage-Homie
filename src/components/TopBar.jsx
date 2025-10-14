import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          E-Hospital
        </Link>
        <nav>
          <Link className="button" to="/login">
            Log out
          </Link>
        </nav>
      </div>
    </header>
  );
}
