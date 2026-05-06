import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/BaseComponents';
import { vendorAPI } from '../api/endpoints';

const BrowseVendorsPage = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await vendorAPI.getNearbyVendors();
        setVendors(response.data.data || []);
      } catch (vendorError) {
        setError(vendorError.response?.data?.message || 'Unable to load vendors.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12"><LoadingSpinner /></div>;
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-160px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">Nearby Vendors</h1>
            <p className="mt-2 text-slate-600">Browse approved stores and open a shop to view products.</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="bg-slate-100 text-slate-900">Dashboard</Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}

        {vendors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="border border-slate-200 bg-white shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{vendor.shop_name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{vendor.category || 'Local essentials'}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Open</span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{vendor.description || `${vendor.address}, ${vendor.city}`}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded bg-slate-50 p-3">
                    <p className="text-slate-500">Delivery radius</p>
                    <p className="font-semibold text-slate-950">{vendor.delivery_radius_km} km</p>
                  </div>
                  <div className="rounded bg-slate-50 p-3">
                    <p className="text-slate-500">Min order</p>
                    <p className="font-semibold text-slate-950">Rs. {vendor.min_order_amount}</p>
                  </div>
                </div>
                <Button onClick={() => navigate(`/vendor/${vendor.id}`)} className="mt-5 w-full bg-primary text-white">
                  View Shop
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-slate-200 text-center">
            <p className="text-slate-600">No approved vendors are available yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrowseVendorsPage;
