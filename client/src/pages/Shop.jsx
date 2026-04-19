import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (currentPage, currentSearch) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/products", {
        params: {
          page: currentPage,
          limit,
          search: currentSearch,
        },
      });

      const nextProducts = Array.isArray(res.data?.products) ? res.data.products : [];
      setProducts(nextProducts);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts(page, search);
  }, [page, search, fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 border-b border-[#d8d2ca] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#6f6a63]">Shop</p>
          <h1 className="text-4xl" style={{ fontFamily: "serif" }}>
            Product Archive
          </h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl gap-2">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-[#d8d2ca] bg-transparent p-3 outline-none"
          />
          <button type="submit" className="border border-[#1d1b19] px-5 text-xs uppercase tracking-[0.16em]">
            Search
          </button>
          <button
            type="button"
            onClick={handleClearSearch}
            className="border border-[#d8d2ca] px-5 text-xs uppercase tracking-[0.16em]"
          >
            Clear
          </button>
        </form>
      </section>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <section className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="group space-y-4">
              <Link to={`/products/${p.id}`} className="block">
                <div className="aspect-[4/5] overflow-hidden bg-[#e9e5df]">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#6f6a63]">
                      No image
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-lg" style={{ fontFamily: "serif" }}>
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#6f6a63]">${p.price ?? 0}</p>
                  <p className="mt-1 text-sm text-[#6f6a63]">
                    {Number(p.stock ?? 0) > 0 ? `In stock: ${p.stock}` : "Sold out"}
                  </p>
                </div>

                <div className="mt-3 text-xs uppercase tracking-[0.16em] text-[#6f6a63] group-hover:text-[#1d1b19]">
                  View details
                </div>
              </Link>
            </article>
          ))}
        </section>
      )}

      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="border border-[#d8d2ca] px-4 py-2 text-xs uppercase tracking-[0.16em] disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-[#6f6a63]">
          Page {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          disabled={page >= totalPages}
          className="border border-[#d8d2ca] px-4 py-2 text-xs uppercase tracking-[0.16em] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

