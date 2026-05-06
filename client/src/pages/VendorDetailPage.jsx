import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { productAPI, vendorAPI } from '../api/endpoints';

const VendorDetailPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const [vendorsRes, productsRes] = await Promise.all([
          vendorAPI.getNearbyVendors(),
          productAPI.getByVendor(vendorId),
        ]);
        const selectedVendor = (vendorsRes.data.data || []).find((item) => String(item.id) === String(vendorId));
        setVendor(selectedVendor || null);
        setProducts(productsRes.data.data || []);
      } catch (shopError) {
        setError(shopError.response?.data?.message || 'Unable to load this shop.');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [vendorId]);

  const totalItems = useMemo(() => products.reduce((sum, product) => sum + Number(product.stock || 0), 0), [products]);

  if (loading) {
    return <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}

        <Card className="mb-8 border border-slate-200 bg-white shadow-lg">
          <Button onClick={() => navigate('/vendors')} className="mb-5 bg-slate-100 text-slate-900">Back to Vendors</Button>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <h1 className="text-4xl font-bold text-slate-950">{vendor?.shop_name || 'Vendor Shop'}</h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                {vendor?.description || vendor?.category || 'Browse available products from this vendor.'}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {vendor ? `${vendor.address}, ${vendor.city}, ${vendor.state} - ${vendor.pin_code}` : 'Vendor details unavailable'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Products</p>
                <p className="text-2xl font-bold text-slate-950">{products.length}</p>
              </div>
              <div className="rounded bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Stock</p>
                <p className="text-2xl font-bold text-slate-950">{totalItems}</p>
              </div>
            </div>
          </div>
        </Card>

        {products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="border border-slate-200 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">{product.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{product.category || product.unit || 'Product'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? 'In stock' : 'Out'}
                  </span>
                </div>
                <p className="mt-4 min-h-[48px] text-sm text-slate-600">{product.description || 'No description added.'}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-950">Rs. {product.price}</p>
                    {product.mrp ? <p className="text-sm text-slate-400 line-through">Rs. {product.mrp}</p> : null}
                  </div>
                  <Button disabled={product.stock <= 0} className="bg-primary text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                    Add
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-slate-200 text-center">
            <p className="text-slate-600">This vendor has not added available products yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorDetailPage;
