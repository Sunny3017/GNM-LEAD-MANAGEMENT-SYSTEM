import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    societyName: '',
    purpose: '',
    approvalStatus: '',
  });

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.properties);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/properties/${id}/approve`, { approvalStatus: status });
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Properties</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Society Name"
          className="px-3 py-2 border rounded-lg"
          value={filters.societyName}
          onChange={(e) => setFilters({ ...filters, societyName: e.target.value })}
        />
        <select
          className="px-3 py-2 border rounded-lg"
          value={filters.purpose}
          onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
        >
          <option value="">All Purpose</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>
        <select
          className="px-3 py-2 border rounded-lg"
          value={filters.approvalStatus}
          onChange={(e) => setFilters({ ...filters, approvalStatus: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Pending Approval">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{prop.societyName}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                prop.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                prop.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {prop.approvalStatus}
              </span>
            </div>
            <p className="text-gray-600">{prop.configuration} • {prop.propertyType}</p>
            <p className="text-gray-600">{prop.purpose}</p>
            <p className="text-xl font-bold mt-2">₹{prop.price.toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Added by: {prop.addedBy.employeeName}</p>
            {prop.approvalStatus === 'Pending Approval' && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleApprove(prop._id, 'Approved')}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprove(prop._id, 'Rejected')}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProperties;
