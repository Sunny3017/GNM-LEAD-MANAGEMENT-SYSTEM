import { useEffect, useState } from 'react';
import api from '../services/api';

const EmployeeProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    societyName: '',
    purpose: '',
    propertyType: '',
    configuration: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    availabilityStatus: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append('page', page.toString());
      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.properties);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Property Search</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          >
            <option value="">All Type</option>
            <option value="Flat">Flat</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Shop">Shop</option>
            <option value="Office">Office</option>
          </select>
          <input
            type="text"
            placeholder="Configuration (e.g., 2BHK)"
            className="px-3 py-2 border rounded-lg"
            value={filters.configuration}
            onChange={(e) => setFilters({ ...filters, configuration: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="px-3 py-2 border rounded-lg"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="px-3 py-2 border rounded-lg"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Area (sq ft)"
            className="px-3 py-2 border rounded-lg"
            value={filters.minArea}
            onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Area (sq ft)"
            className="px-3 py-2 border rounded-lg"
            value={filters.maxArea}
            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
          />
          <select
            className="px-3 py-2 border rounded-lg"
            value={filters.availabilityStatus}
            onChange={(e) => setFilters({ ...filters, availabilityStatus: e.target.value })}
          >
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop._id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold">{prop.societyName}</h3>
            <p className="text-gray-600">{prop.configuration} • {prop.propertyType}</p>
            <p className="text-gray-600">{prop.purpose}</p>
            <p className="text-xl font-bold mt-2">₹{prop.price.toLocaleString()}</p>
            <p className="text-gray-600">{prop.area} sq ft</p>
            {prop.furnishingStatus && <p className="text-gray-600">Furnishing: {prop.furnishingStatus}</p>}
            {prop.facing && <p className="text-gray-600">Facing: {prop.facing}</p>}
            {prop.propertyAge && <p className="text-gray-600">Age: {prop.propertyAge} years</p>}
            <p className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                prop.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {prop.availabilityStatus}
              </span>
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded ${page === p ? 'bg-blue-600 text-white' : 'border'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeProperties;
