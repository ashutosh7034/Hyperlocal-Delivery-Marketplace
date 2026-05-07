import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, LoadingSpinner, ErrorAlert, SuccessAlert } from '../components/BaseComponents';
import { adminAPI } from '../api/endpoints';

const AdminVendorsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadVendors = async () => {
    const response = await adminAPI.getVendors();
    setVendors(response.data.data || []);
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadVendors()
      .catch((vendorsError) => setError(vendorsError.response?.data?.message || 'Unable to load vendors.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate, user]);

  const updateVendor = async (vendorId, action) => {
    setUpdatingId(vendorId);
    setError('');
    setSuccess('');

    try {
      if (action === 'approve') {
        await adminAPI.approveVendor(vendorId);
        setSuccess('Vendor approved.');
      } else {
        await adminAPI.rejectVendor(vendorId, 'Rejected by admin');
        setSuccess('Vendor rejected.');
      }
      await loadVendors();
    } catch (updateError) {
      setError(updateError.response?.data?.message || 'Unable to update vendor.');
    } finally {
      setUpdatingId(null);
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
            <h1 className="text-4xl font-bold text-slate-950">Manage Vendors</h1>
            <p className="mt-2 text-slate-600">Approve, reject, and review vendor profiles.</p>
          </div>
          <Button onClick={() => navigate('/admin/dashboard')} className="bg-slate-100 text-slate-900">Dashboard</Button>
        </div>

        {error ? <ErrorAlert message={error} onClose={() => setError('')} /> : null}
        {success ? <SuccessAlert message={success} onClose={() => setSuccess('')} /> : null}

        <Card className="border border-slate-200 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Shop</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-950">{vendor.shop_name}</p>
                      <p className="text-xs text-slate-500">{vendor.category || 'No category'}</p>
                    </td>
                    <td className="px-4 py-3">{vendor.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{vendor.city}, {vendor.state}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {vendor.approval_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          disabled={updatingId === vendor.id || vendor.approval_status === 'approved'}
                          onClick={() => updateVendor(vendor.id, 'approve')}
                          className="font-semibold text-green-700 disabled:text-slate-300"
                        >
                          Approve
                        </button>
                        <button
                          disabled={updatingId === vendor.id || vendor.approval_status === 'rejected'}
                          onClick={() => updateVendor(vendor.id, 'reject')}
                          className="font-semibold text-red-600 disabled:text-slate-300"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vendors.length === 0 ? <p className="py-8 text-center text-slate-500">No vendors found.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminVendorsPage;
