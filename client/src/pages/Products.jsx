import { useCallback, useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: "",
    measurementsText: "",
    conditionText: "",
    overallScore: "",
    materials: "",
    sashikoNotes: "",
    careInstructions: "",
    patchZones: "",
    patchFabric: "",
    patchStyle: "visible",
    patchNotes: "",
    repairDifficulty: "medium",
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
      setTotalPages(res.data?.totalPages || 1);
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

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      imageUrl: "",
      description: "",
      measurementsText: "",
      conditionText: "",
      overallScore: "",
      materials: "",
      sashikoNotes: "",
      careInstructions: "",
      patchZones: "",
      patchFabric: "",
      patchStyle: "visible",
      patchNotes: "",
      repairDifficulty: "medium",
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
        description: form.description?.trim() || null,
        measurementsText: form.measurementsText?.trim() || null,
        conditionText: form.conditionText?.trim() || null,
        overallScore: form.overallScore?.trim() ? Number(form.overallScore) : null,
        materials: form.materials?.trim() || null,
        sashikoNotes: form.sashikoNotes?.trim() || null,
        careInstructions: form.careInstructions?.trim() || null,
        patchZones: form.patchZones?.trim() || null,
        patchFabric: form.patchFabric?.trim() || null,
        patchStyle: form.patchStyle?.trim() || null,
        patchNotes: form.patchNotes?.trim() || null,
        repairDifficulty: form.repairDifficulty?.trim() || null,
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
      description: product.description ?? "",
      measurementsText: product.measurementsText ?? "",
      conditionText: product.conditionText ?? "",
      overallScore:
        product.overallScore === null || product.overallScore === undefined
          ? ""
          : String(product.overallScore),
      materials: product.materials ?? "",
      sashikoNotes: product.sashikoNotes ?? "",
      careInstructions: product.careInstructions ?? "",
      patchZones: product.patchZones ?? "",
      patchFabric: product.patchFabric ?? "",
      patchStyle: product.patchStyle ?? "visible",
      patchNotes: product.patchNotes ?? "",
      repairDifficulty: product.repairDifficulty ?? "medium",
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
            Inventory
          </p>
          <h1 className="text-4xl" style={{ fontFamily: "serif" }}>
            Inventory Studio
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

      <section className="grid gap-6 border border-[#d8d2ca] bg-[#f8f6f2] p-6 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-[#6f6a63]">Admin Studio</p>
          <h2 className="text-3xl" style={{ fontFamily: "serif" }}>
            {editingId ? "Edit Product" : "Add Product"}
          </h2>
          <p className="max-w-md text-sm text-[#6f6a63]">
            Keep the catalog tight and image-forward. Add measurements + condition notes so customers can read
            the piece before they buy. Patch fields below let you describe exactly how a repair should be
            added to the garment.
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

          <textarea
            name="description"
            placeholder="Description (editorial notes, materials, fabric feel)"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
          />
          <textarea
            name="measurementsText"
            placeholder="Measurements (e.g. Pit to pit, Front length, Back length)"
            value={form.measurementsText}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <textarea
              name="conditionText"
              placeholder="Condition notes (defects, wear points, repairs)"
              value={form.conditionText}
              onChange={handleChange}
              rows={3}
              className="resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
            />
            <input
              type="number"
              name="overallScore"
              placeholder="Overall score (/10)"
              value={form.overallScore}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            />
          </div>

          <input
            type="text"
            name="materials"
            placeholder="Materials (optional)"
            value={form.materials}
            onChange={handleChange}
            className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
          />
          <textarea
            name="sashikoNotes"
            placeholder="Sashiko notes (what to reinforce, where, thread suggestion)"
            value={form.sashikoNotes}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
          />
          <textarea
            name="patchZones"
            placeholder="Patch zones (e.g. left elbow, right cuff edge, back hem split)"
            value={form.patchZones}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="patchFabric"
              placeholder="Patch fabric (e.g. indigo chambray, herringbone twill)"
              value={form.patchFabric}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            />
            <select
              name="patchStyle"
              value={form.patchStyle}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            >
              <option value="visible">Visible repair</option>
              <option value="blended">Blended repair</option>
              <option value="boro-stack">Boro stack</option>
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              name="repairDifficulty"
              value={form.repairDifficulty}
              onChange={handleChange}
              className="w-full border border-[#d8d2ca] bg-white p-3 outline-none"
            >
              <option value="low">Repair difficulty: Low</option>
              <option value="medium">Repair difficulty: Medium</option>
              <option value="high">Repair difficulty: High</option>
            </select>
            <textarea
              name="patchNotes"
              placeholder="Patch notes (shape, overlap, story, stitch mood)"
              value={form.patchNotes}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
            />
          </div>
          <textarea
            name="careInstructions"
            placeholder="Care instructions (how to wash/air/brush + repair mindset)"
            value={form.careInstructions}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none border border-[#d8d2ca] bg-white p-3 outline-none"
          />

          <div className="flex gap-2 pt-2">
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
