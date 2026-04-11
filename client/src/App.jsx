import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import { getStoredToken, getStoredUser, logout } from "./utils/auth";

function AppLayout() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-[rgba(245,241,234,0.86)] backdrop-blur">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-6 px-5 py-5 md:px-8">
          <Link
            to="/"
            className="text-lg uppercase tracking-[0.4em] md:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Vintage Inventory
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              to="/products"
              className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              Shop
            </Link>
            <Link
              to="/"
              className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              Collection
            </Link>
            <Link
              to="/"
              className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              About
            </Link>
            <Link
              to="/products"
              className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              Inventory
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-sm text-[var(--muted)] md:inline">
                {user.name}
              </span>
            )}

            {!token && (
              <>
                <Link
                  to="/login"
                  className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-[var(--ink)] px-4 py-2 text-[11px] uppercase tracking-[0.28em] transition hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                >
                  Create Account
                </Link>
              </>
            )}

            {token && (
              <button
                onClick={handleLogout}
                className="border border-[var(--ink)] px-4 py-2 text-[11px] uppercase tracking-[0.28em] transition hover:bg-[var(--ink)] hover:text-[var(--paper)]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[92rem] px-5 py-8 md:px-8 md:py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
