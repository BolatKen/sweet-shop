"use client"

import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, createVariant, deleteVariant, getCategories} from '@/lib/actions/products'
import Button from '@/components/Button'

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [imageInput, setImageInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    isActive: true,
    images: [] as string[],
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])


  const loadProducts = async () => {
    setLoading(true)
    try {
        const data = await getProducts()
        setProducts(data)
    } catch {
        setError('Failed to load products')
    } finally {
        setLoading(false)
    }
  }

  const loadCategories = async () => {
    const data = await getCategories()
    setCategories(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) {
        await updateProduct(editingId, formData)
      } else {
        await createProduct(formData)
      }
      resetForm()
      await loadProducts()
    } catch {
      setError('Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

    const startEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        categoryId: product.categoryId || '',
        isActive: product.isActive,
        images: product.images || [],
    })
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({ name: '', slug: '', description: '', categoryId: '', isActive: true, images: [] })
        setImageInput('')
    }

  const [variantForm, setVariantForm] = useState({
    size: '', color: '', price: '', stock: ''
    })

    const handleAddVariant = async () => {
    if (!editingId) return
    try {
        await createVariant(editingId, {
        size: variantForm.size,
        color: variantForm.color,
        price: Number(variantForm.price) * 100,
        stock: Number(variantForm.stock)
        })
        setVariantForm({ size: '', color: '', price: '', stock: '' })
        await loadProducts()
    } catch {
        setError('Failed to add variant')
    }
    }

    const handleDeleteVariant = async (productId: string, variantId: string) => {
    if (!confirm('Delete this variant?')) return
    try {
        await deleteVariant(productId, variantId)
        await loadProducts()
    } catch {
        setError('Failed to delete variant')
    }
    }

    const handleAddImage = () => {
        if (!imageInput) return
        setFormData({ ...formData, images: [...formData.images, imageInput] })
        setImageInput('')
    }

    return (
    <div>
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold mb-4">{editingId ? 'Edit Product' : 'Create New Product'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
            />
            </div>
            <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-4 py-2"
            />
            <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="flex gap-2 mb-2">
                    <input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 border rounded-lg px-4 py-2"
                    />
                    <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                    >
                    Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm">
                        <span className="max-w-xs truncate">{img}</span>
                        <button
                        type="button"
                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                        className="text-red-500 ml-1"
                        >
                        ×
                        </button>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">Category ID</label>
            <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
            >
                <option value="">Select category</option>
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            </div>

            <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
            </div>
            <div className="md:col-span-2 flex gap-3">
            <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
            {editingId && <Button type="button" onClick={resetForm}>Cancel</Button>}
            </div>
        </form>
        </div>

        {/* Variants Section — separate block */}
        {editingId && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold mb-4">Variants</h2>
            <table className="w-full mb-6">
            <thead className="bg-gray-50 border-b">
                <tr>
                <th className="text-left px-4 py-2 text-sm">Size</th>
                <th className="text-left px-4 py-2 text-sm">Color</th>
                <th className="text-left px-4 py-2 text-sm">Price (₸)</th>
                <th className="text-left px-4 py-2 text-sm">Stock</th>
                <th className="text-right px-4 py-2 text-sm">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.find(p => p.id === editingId)?.variants?.map((variant: any) => (
                <tr key={variant.id} className="border-b">
                    <td className="px-4 py-2">{variant.size}</td>
                    <td className="px-4 py-2">{variant.color}</td>
                    <td className="px-4 py-2">{(variant.price / 100).toLocaleString()}</td>
                    <td className="px-4 py-2">{variant.stock}</td>
                    <td className="px-4 py-2 text-right">
                    <button
                        onClick={() => handleDeleteVariant(editingId, variant.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            <h3 className="font-medium mb-3">Add Variant</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <input
                value={variantForm.size}
                onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                value={variantForm.color}
                onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Price (₸)</label>
                <input
                type="number"
                value={variantForm.price}
                onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                type="number"
                value={variantForm.stock}
                onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                />
            </div>
            </div>
            <Button onClick={handleAddVariant} className="mt-3">Add Variant</Button>
        </div>
        )}

        {/* Products Table */}
        {loading ? (
        <div>Loading...</div>
        ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
            <thead className="bg-gray-50 border-b">
                <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.slug}</td>
                    <td className="px-6 py-4">{product.categoryId || '-'}</td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                        Delete
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
    </div>
    )
}