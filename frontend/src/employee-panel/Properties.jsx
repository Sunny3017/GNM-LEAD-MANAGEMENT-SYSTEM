import { useEffect, useState } from 'react';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const EmployeeProperties = () => {
  const [properties, setProperties] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [filters, setFilters] = useState({
    societyName: '',
    purpose: '',
    propertyType: '',
    configuration: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    furnishingStatus: '',
    suitableFor: '',
    availabilityStatus: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const propertyColumns = [
    { key: 'societyName', header: 'Society Name' },
    { key: 'propertyTitle', header: 'Property Title' },
    { key: 'configuration', header: 'Configuration' },
    { key: 'propertyType', header: 'Property Type' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'suitableFor', header: 'Suitable For' },
    { key: 'price', header: 'Price' },
    { key: 'area', header: 'Area (sq ft)' },
    { key: 'tower', header: 'Tower' },
    { key: 'floorNumber', header: 'Floor Number' },
    { key: 'totalFloors', header: 'Total Floors' },
    { key: 'furnishingStatus', header: 'Furnishing Status' },
    { key: 'facing', header: 'Facing' },
    { key: 'propertyAge', header: 'Property Age (years)' },
    { key: 'description', header: 'Description' },
    { key: 'availabilityStatus', header: 'Availability Status' },
  ];

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

  const fetchSocieties = async () => {
    try {
      const res = await api.get('/properties/societies');
      setSocieties(res.data.societies);
    } catch (error) {
      console.error('Error fetching societies:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchSocieties();
  }, [filters, page]);

  const handleExportPDF = () => {
    exportToPDF(properties, propertyColumns, 'Property Report', `properties-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleCopy = (property) => {
    const text = `🏠 ${property.societyName}
📋 ${property.configuration} • ${property.propertyType}
💵 ₹${property.price.toLocaleString()}
📐 ${property.area} sq ft
${property.tower ? `🏢 Tower: ${property.tower}\n` : ''}
${property.floorNumber ? `🏢 Floor: ${property.floorNumber}${property.totalFloors ? ` of ${property.totalFloors}` : ''}\n` : ''}
${property.furnishingStatus ? `🛋️ Furnishing: ${property.furnishingStatus}\n` : ''}
${property.facing ? `🧭 Facing: ${property.facing}\n` : ''}
${property.propertyAge ? `📅 Age: ${property.propertyAge} years\n` : ''}
${property.suitableFor ? `👨‍👩‍👧 Suitable For: ${property.suitableFor}\n` : ''}
${property.hasVideo ? `🎬 Video Available\n` : ''}
${property.description ? `📝 ${property.description}` : ''}`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Property details copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleExportExcel = () => {
    exportToExcel(properties, propertyColumns, `properties-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Property Search
        </h1>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-3 md:px-5 rounded-lg hover:from-red-600 hover:to-red-800 transition-all shadow-lg"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-2 px-3 md:px-5 rounded-lg hover:from-green-600 hover:to-green-800 transition-all shadow-lg"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="premium-card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            className="premium-select"
            value={filters.societyName}
            onChange={(e) => setFilters({ ...filters, societyName: e.target.value })}
          >
            <option value="">All Societies</option>
            {societies.map((society, index) => (
              <option key={index} value={society}>{society}</option>
            ))}
          </select>
          <select
            className="premium-select"
            value={filters.purpose}
            onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
          >
            <option value="">All Purpose</option>
            <option value="Sale">Sale</option>
            <option value="Rent">Rent</option>
          </select>
          {filters.purpose === 'Rent' && (
            <select
              className="premium-select"
              value={filters.suitableFor}
              onChange={(e) => setFilters({ ...filters, suitableFor: e.target.value })}
            >
              <option value="">All Suitable For</option>
              <option value="Family">Family</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Both">Both</option>
            </select>
          )}
          <select
            className="premium-select"
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
          <select
            className="premium-select"
            value={filters.configuration}
            onChange={(e) => setFilters({ ...filters, configuration: e.target.value })}
          >
            <option value="">All Configurations</option>
            <option value="1BHK">1BHK</option>
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
            <option value="4BHK">4BHK</option>
          </select>
          <select
            className="premium-select"
            value={filters.furnishingStatus}
            onChange={(e) => setFilters({ ...filters, furnishingStatus: e.target.value })}
          >
            <option value="">All Furnishing</option>
            <option value="Raw">Raw</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            className="premium-input"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="premium-input"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Area"
            className="premium-input"
            value={filters.minArea}
            onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Area"
            className="premium-input"
            value={filters.maxArea}
            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
          />
          <select
            className="premium-select"
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
          <div key={prop._id} className="premium-card p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{prop.societyName}</h3>
              {prop.hasVideo && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 border border-blue-500/30">
                  🎬 Video
                </span>
              )}
            </div>
            {prop.propertyTitle && <p className="text-primary-200 text-sm">{prop.propertyTitle}</p>}
            <p className="text-primary-400">{prop.configuration} • {prop.propertyType}</p>
            <p className="text-primary-400">{prop.purpose}</p>
            {prop.suitableFor && (
              <p className="text-primary-400 text-sm">Suitable For: {prop.suitableFor}</p>
            )}
            <p className="text-2xl font-bold premium-gradient-text mt-2">
              ₹{prop.price.toLocaleString()}
            </p>
            <p className="text-primary-400">{prop.area} sq ft</p>
            {prop.tower && <p className="text-primary-400 text-sm">Tower: {prop.tower}</p>}
            {prop.floorNumber && <p className="text-primary-400 text-sm">Floor: {prop.floorNumber} {prop.totalFloors ? `of ${prop.totalFloors}` : ''}</p>}
            {prop.furnishingStatus && <p className="text-primary-400">Furnishing: {prop.furnishingStatus}</p>}
            {prop.facing && <p className="text-primary-400">Facing: {prop.facing}</p>}
            {prop.propertyAge && <p className="text-primary-400">Age: {prop.propertyAge} years</p>}
            {prop.description && (
              <div className="mt-2">
                <p className={`text-primary-400 text-sm break-words hyphens-auto ${expandedDescriptions[prop._id] ? '' : 'line-clamp-1'}`}>
                  {prop.description}
                </p>
                <button
                  onClick={() => toggleDescription(prop._id)}
                  className="text-primary-600 text-xs font-semibold mt-1 hover:text-primary-800"
                >
                  {expandedDescriptions[prop._id] ? 'Less' : 'More...'}
                </button>
              </div>
            )}
            <p className="mt-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                prop.availabilityStatus === 'Available' 
                  ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
              }`}>
                {prop.availabilityStatus}
              </span>
            </p>
            <button
              onClick={() => handleCopy(prop)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg transition-all ${
                page === p 
                  ? 'premium-button' 
                  : 'border border-primary-300 text-primary-400 hover:bg-primary-50'
              }`}
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
