import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          E-Hospital
        </Link>
        <nav className="menu">
          <NavLink to="/" end className="menu-link">
            Home
          </NavLink>
          <NavLink to="/login" className="menu-link">
            Login
          </NavLink>
          <a className="button cta" href="#register">
            Register Now →
          </a>
        </nav>
      </div>
    </header>
  );
}
