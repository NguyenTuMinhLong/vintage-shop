import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user?.role === "admin" ? "/admin/inventory" : "/products");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="space-y-3 border-b border-[#d8d2ca] pb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#6f6a63]">
          Account
        </p>
        <h1 className="text-4xl" style={{ fontFamily: "serif" }}>
          Login
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-[#d8d2ca] bg-[#f8f6f2] p-6"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
        />

        <button
          type="submit"
          className="border border-[#1d1b19] px-6 py-3 text-xs uppercase tracking-[0.16em] transition hover:bg-[#1d1b19] hover:text-white"
        >
          Login
        </button>

        {error && <p className="text-red-600">{error}</p>}

        <p className="text-sm text-[#6f6a63]">
          No account yet?{" "}
          <Link to="/register" className="text-[#1d1b19] underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}