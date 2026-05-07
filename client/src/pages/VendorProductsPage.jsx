import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Input, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/BaseComponents';
import { productAPI } from '../api/endpoints';

const emptyProduct = {
  name: '',
  description: '',
  category: '',
  unit: '',
  price: '',
  mrp: '',
  stock: '',
};

const VendorProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = async () => {
    const response = await productAPI.getMyProducts();
    setProducts(response.data.data || []);
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'vendor') {
      navigate('/login');
      return;
    }

    loadProducts()
      .catch((productsError) => setError(productsError.response?.data?.message || 'Unable to load products.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyProduct);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      unit: product.unit || '',
      price: product.price || '',
      mrp: product.mrp || '',
      stock: product.stock || 0,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
        setSuccess('Product updated successfully.');
      } else {
        await productAPI.create(formData);
        setSuccess('Product added successfully.');
      }
      resetForm();
      await loadProducts();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    setError('');
    setSuccess('');

    try {
      await productAPI.delete(productId);
      setSuccess('Product deleted.');
      await loadProducts();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete product.');
    }
  };

  if (loading) {
    return <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">My Products</h1>
            <p className="mt-2 text-slate-600">Add, update, and remove products from your shop.</p>
          </div>
          <Button onClick={() => navigate('/vendor/dashboard')} className="bg-slate-100 text-slate-900">Dashboard</Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}
        {success ? <SuccessAlert message={success} onClose={() => setSuccess('')} /> : null}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-slate-200 bg-white shadow-lg">
            <h2 className="text-xl font-bold text-slate-950">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <form className="mt-5" onSubmit={handleSubmit}>
              <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
              <Input label="Unit" name="unit" value={formData.unit} onChange={handleChange} placeholder="1 kg, 1 pack" />
              <Input label="Price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
              <Input label="MRP" name="mrp" type="number" min="0" step="0.01" value={formData.mrp} onChange={handleChange} />
              <Input label="Stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} />
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[96px] w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="flex-1 bg-primary text-white">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </Button>
                {editingId ? <Button type="button" onClick={resetForm} className="bg-slate-100 text-slate-900">Cancel</Button> : null}
              </div>
            </form>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-lg">
            <h2 className="mb-5 text-xl font-bold text-slate-950">Product List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3 font-semibold text-slate-950">{product.name}</td>
                      <td className="px-4 py-3">Rs. {product.price}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">{product.is_available ? 'Available' : 'Hidden'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => handleEdit(product)} className="font-semibold text-primary">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="font-semibold text-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 ? <p className="py-8 text-center text-slate-500">No products yet.</p> : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProductsPage;
