import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { getStoredToken } from "../utils/auth";

export default function Products() {
  const token = getStoredToken();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async (currentPage = page, currentSearch = search) => {
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

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search);
  }, [page, search]);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      imageUrl: "",
    });
    setEditingId(null);
  };

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
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        imageUrl: form.imageUrl,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setSuccess("Product updated successfully");
      } else {
        await api.post("/products", payload);
        setSuccess("Product added successfully");
      }

      resetForm();
      await fetchProducts(page, search);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      imageUrl: product.imageUrl || "",
    });
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      setSuccess("");

      await api.delete(`/products/${id}`);
      setSuccess("Product deleted successfully");

      const nextPage = products.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await fetchProducts(page, search);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to delete product");
    }
  };

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
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#6f6a63]">
            Shop
          </p>
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
          <button
            type="submit"
            className="border border-[#1d1b19] px-5 text-xs uppercase tracking-[0.16em]"
          >
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

      {!token && (
        <div className="border border-[#d8d2ca] bg-[#f8f6f2] p-4 text-sm text-[#6f6a63]">
          Browse is public. Login to add, edit, and delete products.
        </div>
      )}

      {token && (
        <section className="grid gap-6 border border-[#d8d2ca] bg-[#f8f6f2] p-6 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[#6f6a63]">
              Admin Studio
            </p>
            <h2 className="text-3xl" style={{ fontFamily: "serif" }}>
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <p className="max-w-md text-sm text-[#6f6a63]">
              Keep the catalog tight and image-forward. Use clean titles and one strong visual per item.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="border border-[#1d1b19] px-5 py-3 text-xs uppercase tracking-[0.16em] disabled:opacity-50"
              >
                {submitting
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[#d8d2ca] px-5 py-3 text-xs uppercase tracking-[0.16em]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-700">{success}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <section className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="group space-y-4">
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

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg" style={{ fontFamily: "serif" }}>
                    {p.name}
                  </h3>
                  <p className="text-sm text-[#6f6a63]">${p.price ?? 0}</p>
                  <p className="text-sm text-[#6f6a63]">Stock: {p.stock ?? 0}</p>
                </div>

                {token && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs uppercase tracking-[0.16em] text-[#6f6a63] hover:text-[#1d1b19]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs uppercase tracking-[0.16em] text-[#6f6a63] hover:text-[#1d1b19]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
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