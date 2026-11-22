"use client";

import React, { useState } from "react";
import { AppContent, ProductItem } from "@/types/content";
import ImageField from "../ImageField";
import {
  BsPlusLg,
  BsPencilSquare,
  BsTrash3,
  BsBoxSeam,
  BsCheckCircleFill,
  BsXCircleFill,
  BsExclamationCircleFill,
  BsSearch,
  BsX,
} from "react-icons/bs";

interface ProductsTabProps {
  content: AppContent;
  onChange: (newContent: AppContent) => void;
  onRequestDeleteConfirm: (title: string, onConfirm: () => void) => void;
}

export default function ProductsTab({
  content,
  onChange,
  onRequestDeleteConfirm,
}: ProductsTabProps) {
  const products = content.products || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State
  const [formState, setFormState] = useState<ProductItem>({
    id: "",
    name: "",
    category: "Add-on",
    price: 50000,
    unit: "per ride",
    description: "",
    image: "",
    status: "active",
    stock: 10,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenCreateModal = () => {
    setEditingIndex(null);
    setFormState({
      id: `prod-${Date.now()}`,
      name: "",
      category: "Add-on",
      price: 50000,
      unit: "per ride",
      description: "",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
      status: "active",
      stock: 10,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index: number) => {
    setEditingIndex(index);
    setFormState({ ...products[index] });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formState.name.trim()) errors.name = "Product name is required.";
    if (!formState.category.trim()) errors.category = "Category is required.";
    if (formState.price < 0 || isNaN(formState.price)) errors.price = "Valid price is required.";
    if (formState.stock < 0 || isNaN(formState.stock)) errors.stock = "Valid stock is required.";
    if (!formState.description.trim()) errors.description = "Description is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProducts = [...products];

    if (editingIndex === null) {
      // Create
      newProducts.unshift(formState);
    } else {
      // Update
      newProducts[editingIndex] = formState;
    }

    onChange({
      ...content,
      products: newProducts,
    });

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (index: number) => {
    const product = products[index];
    onRequestDeleteConfirm(
      `Are you sure you want to delete "${product.name}"? This will be removed from your catalog.`,
      () => {
        const newProducts = [...products];
        newProducts.splice(index, 1);
        onChange({
          ...content,
          products: newProducts,
        });
      }
    );
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Search and Create button */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <BsBoxSeam className="text-pawcab-gold" />
              <span>Products & Services Catalog</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Manage extra pet equipment rentals, add-on waiting hours, care packages, and service add-ons.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight rounded-xl font-bold text-xs transition cursor-pointer shadow-md"
          >
            <BsPlusLg /> Add New Product
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <BsSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, category, or description..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-700/80 rounded-xl text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs">
            {["all", "active", "inactive", "out_of_stock"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs capitalize transition cursor-pointer ${
                  filterStatus === status
                    ? "bg-neutral-800 text-pawcab-gold font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-900/50 uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod, idx) => {
                  const originalIndex = products.findIndex((p) => p.id === prod.id);

                  return (
                    <tr key={prod.id || idx} className="hover:bg-neutral-800/30 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {prod.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BsBoxSeam className="text-neutral-600 text-base" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-100 text-xs">
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs mt-0.5">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-neutral-300">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px]">
                          {prod.category}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-pawcab-gold">
                        Rp {prod.price.toLocaleString("id-ID")}{" "}
                        <span className="text-[10px] text-neutral-500 font-normal">
                          {prod.unit}
                        </span>
                      </td>

                      <td className="p-3.5 text-neutral-300 font-mono">
                        {prod.stock} units
                      </td>

                      <td className="p-3.5">
                        {prod.status === "active" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <BsCheckCircleFill className="text-[9px]" /> Active
                          </span>
                        )}
                        {prod.status === "inactive" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                            <BsXCircleFill className="text-[9px]" /> Inactive
                          </span>
                        )}
                        {prod.status === "out_of_stock" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <BsExclamationCircleFill className="text-[9px]" /> Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(originalIndex)}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                            title="Edit Product"
                          >
                            <BsPencilSquare className="text-xs" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(originalIndex)}
                            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <BsTrash3 className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition p-1 cursor-pointer"
            >
              <BsX className="text-xl" />
            </button>

            <h3 className="font-display text-xl font-bold text-white mb-1">
              {editingIndex === null ? "Add New Product" : "Edit Product"}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Fill in product details, pricing, stock, status, and upload product photo.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Product / Add-on Name *
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Medium Travel Crate Rental"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-red-400 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({ ...formState, category: e.target.value })
                    }
                    placeholder="Equipment / Add-on / Care Kit"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.target.value as ProductItem["status"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="inactive">Inactive (Draft)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={formState.price}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        price: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-pawcab-gold font-bold text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Pricing Unit
                  </label>
                  <input
                    type="text"
                    value={formState.unit}
                    onChange={(e) => setFormState({ ...formState, unit: e.target.value })}
                    placeholder="per ride / per session"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formState.stock}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        stock: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState({ ...formState, description: e.target.value })
                    }
                    placeholder="Details about this product or add-on..."
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-pawcab-gold"
                  />
                  {formErrors.description && (
                    <p className="text-[11px] text-red-400 mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <ImageField
                    label="Product Image"
                    value={formState.image}
                    onChange={(val) => setFormState({ ...formState, image: val })}
                    helperText="Input image URL or upload image (&le; 1 MB) to commit directly to GitHub repository."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-medium transition cursor-pointer text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pawcab-gold hover:bg-pawcab-gold/90 text-midnight text-xs font-bold transition cursor-pointer shadow-lg"
                >
                  {editingIndex === null ? "Add to Catalog" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

