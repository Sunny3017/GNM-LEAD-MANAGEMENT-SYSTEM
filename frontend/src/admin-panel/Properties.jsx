import { useEffect, useState } from 'react';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [showNewSocietyInput, setShowNewSocietyInput] = useState(false);
  const [filters, setFilters] = useState({
    societyName: '',
    purpose: '',
    configuration: '',
    furnishingStatus: '',
    suitableFor: '',
    approvalStatus: '',
    minArea: '',
    maxArea: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [formData, setFormData] = useState({
    propertyType: 'Flat',
    purpose: 'Sale',
    suitableFor: '',
    societyName: '',
    configuration: '',
    area: '',
    price: '',
    availabilityStatus: 'Available',
    propertyTitle: '',
    floorNumber: '',
    totalFloors: '',
    furnishingStatus: '',
    facing: '',
    propertyAge: '',
    description: '',
    tower: '',
    unitNumber: '',
    ownerType: 'Owner',
    ownerName: '',
    ownerPhone: '',
    hasVideo: false,
  });

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
    { key: 'unitNumber', header: 'Unit/Flat No' },
    { key: 'floorNumber', header: 'Floor Number' },
    { key: 'totalFloors', header: 'Total Floors' },
    { key: 'furnishingStatus', header: 'Furnishing Status' },
    { key: 'facing', header: 'Facing' },
    { key: 'propertyAge', header: 'Property Age (years)' },
    { key: 'hasVideo', header: 'Video Available' },
    { key: 'ownerType', header: 'Owner Type' },
    { key: 'ownerName', header: 'Owner Name' },
    { key: 'ownerPhone', header: 'Owner Phone' },
    { key: 'description', header: 'Description' },
    { key: 'availabilityStatus', header: 'Availability Status' },
    { key: 'approvalStatus', header: 'Approval Status' },
    { key: 'addedBy.employeeName', header: 'Added By' },
  ];

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

  const fetchSocieties = async () => {  
    try {
      const res = await api.get('/properties/societies');
      setSocieties(res.data.societies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchSocieties();
  }, [filters]);

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/properties/${id}/approve`, { approvalStatus: status });
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      propertyType: property.propertyType,
      purpose: property.purpose,
      suitableFor: property.suitableFor || '',
      societyName: property.societyName,
      configuration: property.configuration,
      area: property.area,
      price: property.price,
      availabilityStatus: property.availabilityStatus,
      propertyTitle: property.propertyTitle || '',
      floorNumber: property.floorNumber || '',
      totalFloors: property.totalFloors || '',
      furnishingStatus: property.furnishingStatus || '',
      facing: property.facing || '',
      propertyAge: property.propertyAge || '',
      description: property.description || '',
      tower: property.tower || '',
      unitNumber: property.unitNumber || '',
      ownerType: property.ownerType || 'Owner',
      ownerName: property.ownerName || '',
      ownerPhone: property.ownerPhone || '',
      hasVideo: property.hasVideo || false,
    });
    setShowEditModal(true);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    try {
      const trimmedFormData = {};
      for (const [key, value] of Object.entries(formData)) {
        trimmedFormData[key] = typeof value === 'string' ? value.trim() : value;
      }

      await api.put(`/properties/${editingProperty._id}`, {
        ...trimmedFormData,
        area: Number(trimmedFormData.area),
        price: Number(trimmedFormData.price),
        floorNumber: trimmedFormData.floorNumber ? Number(trimmedFormData.floorNumber) : undefined,
        totalFloors: trimmedFormData.totalFloors ? Number(trimmedFormData.totalFloors) : undefined,
        propertyAge: trimmedFormData.propertyAge ? Number(trimmedFormData.propertyAge) : undefined,
      });
      setShowEditModal(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${id}`);
        fetchProperties();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim all string inputs on frontend
    const trimmedFormData = {};
    for (const [key, value] of Object.entries(formData)) {
      trimmedFormData[key] = typeof value === 'string' ? value.trim() : value;
    }
    
    try {
      await api.post('/properties', {
        ...trimmedFormData,
        area: Number(trimmedFormData.area),
        price: Number(trimmedFormData.price),
        floorNumber: trimmedFormData.floorNumber ? Number(trimmedFormData.floorNumber) : undefined,
        totalFloors: trimmedFormData.totalFloors ? Number(trimmedFormData.totalFloors) : undefined,
        propertyAge: trimmedFormData.propertyAge ? Number(trimmedFormData.propertyAge) : undefined,
      });
      setShowModal(false);
      setFormData({
        propertyType: 'Flat',
        purpose: 'Sale',
        suitableFor: '',
        societyName: '',
        configuration: '',
        area: '',
        price: '',
        availabilityStatus: 'Available',
        propertyTitle: '',
        floorNumber: '',
        totalFloors: '',
        furnishingStatus: '',
        facing: '',
        propertyAge: '',
        description: '',
        tower: '',
        unitNumber: '',
        ownerType: 'Owner',
        ownerName: '',
        ownerPhone: '',
        hasVideo: false,
      });
      setShowNewSocietyInput(false);
      fetchProperties();
      fetchSocieties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(properties, propertyColumns, 'Properties Report', `properties-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportExcel = () => {
    exportToExcel(properties, propertyColumns, `properties-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Properties
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
          <button
            onClick={() => setShowModal(true)}
            className="premium-button"
          >
            Add Property
          </button>
        </div>
      </div>

      <div className="premium-card p-4 mb-6 flex flex-wrap gap-3">
        <select
          className="premium-select flex-1 min-w-[150px]"
          value={filters.societyName}
          onChange={(e) => setFilters({ ...filters, societyName: e.target.value })}
        >
          <option value="">All Societies</option>
          {societies.map((society, index) => (
            <option key={index} value={society}>{society}</option>
          ))}
        </select>
        <select
          className="premium-select flex-1 min-w-[120px]"
          value={filters.purpose}
          onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
        >
          <option value="">All Purpose</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>
        <select
          className="premium-select flex-1 min-w-[140px]"
          value={filters.configuration || ''}
          onChange={(e) => setFilters({ ...filters, configuration: e.target.value })}
        >
          <option value="">All Configurations</option>
          <option value="1BHK">1BHK</option>
          <option value="2BHK">2BHK</option>
          <option value="3BHK">3BHK</option>
          <option value="4BHK">4BHK</option>
        </select>
        {filters.purpose === 'Rent' && (
          <select
            className="premium-select flex-1 min-w-[140px]"
            value={filters.suitableFor || ''}
            onChange={(e) => setFilters({ ...filters, suitableFor: e.target.value })}
          >
            <option value="">All Suitable For</option>
            <option value="Family">Family</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Both">Both</option>
          </select>
        )}
        <select
          className="premium-select flex-1 min-w-[140px]"
          value={filters.furnishingStatus || ''}
          onChange={(e) => setFilters({ ...filters, furnishingStatus: e.target.value })}
        >
          <option value="">All Furnishing</option>
          <option value="Raw">Raw</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Fully Furnished">Fully Furnished</option>
        </select>
        <select
          className="premium-select flex-1 min-w-[120px]"
          value={filters.approvalStatus}
          onChange={(e) => setFilters({ ...filters, approvalStatus: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Pending Approval">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="number"
          placeholder="Min Area"
          className="premium-input flex-1 min-w-[120px]"
          value={filters.minArea}
          onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Area"
          className="premium-input flex-1 min-w-[120px]"
          value={filters.maxArea}
          onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop._id} className="premium-card p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{prop.societyName}</h3>
              <div className="flex gap-2">
                {prop.hasVideo && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 border border-blue-500/30">
                    🎬 Video
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  prop.approvalStatus === 'Approved' ? 'bg-green-500/20 text-green-700 border border-green-500/30' :
                  prop.approvalStatus === 'Rejected' ? 'bg-red-500/20 text-red-700 border border-red-500/30' :
                  'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                }`}>
                  {prop.approvalStatus}
                </span>
              </div>
            </div>
            {prop.propertyTitle && <p className="text-primary-200 text-sm">{prop.propertyTitle}</p>}
            <p className="text-primary-400">{prop.configuration} • {prop.propertyType}</p>
            <p className="text-primary-400">{prop.purpose}</p>
            {prop.suitableFor && (
              <p className="text-primary-400 text-sm">Suitable For: {prop.suitableFor}</p>
            )}
            <p className="text-2xl font-bold premium-gradient-text mt-3">
              ₹{prop.price.toLocaleString()}
            </p>
            <p className="text-primary-400 text-sm">Area: {prop.area} sq ft</p>
            {prop.tower && <p className="text-primary-400 text-sm">Tower: {prop.tower}</p>}
            {prop.unitNumber && (
              <p className="text-primary-400 text-sm">Unit/Flat No: {prop.unitNumber}</p>
            )}
            {prop.floorNumber && <p className="text-primary-400 text-sm">Floor: {prop.floorNumber} {prop.totalFloors ? `of ${prop.totalFloors}` : ''}</p>}
            {prop.furnishingStatus && <p className="text-primary-400 text-sm">Furnishing: {prop.furnishingStatus}</p>}
            {prop.facing && <p className="text-primary-400 text-sm">Facing: {prop.facing}</p>}
            {prop.propertyAge && <p className="text-primary-400 text-sm">Property Age: {prop.propertyAge} years</p>}
            {prop.ownerName && (
              <p className="text-primary-400 text-sm">Owner: {prop.ownerName} ({prop.ownerType})</p>
            )}
            {prop.ownerPhone && (
              <p className="text-primary-400 text-sm">Phone: {prop.ownerPhone}</p>
            )}
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
            <p className="text-primary-400 text-sm mt-2">Added by: {prop.addedBy.employeeName}</p>
            <div className="mt-4 space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(prop)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prop._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  Delete
                </button>
              </div>
              {prop.approvalStatus === 'Pending Approval' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(prop._id, 'Approved')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApprove(prop._id, 'Rejected')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="premium-card w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white p-6 pb-2 rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-primary-600">Add Property</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <form id="add-property-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Property Type *</label>
                  <select
                    className="premium-select"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    required
                  >
                    <option value="Flat">Flat</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Shop">Shop</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Purpose *</label>
                  <select
                    className="premium-select"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                {formData.purpose === 'Rent' && (
                  <div>
                    <label className="block text-primary-400 text-sm font-bold mb-2">Suitable For</label>
                    <select
                      className="premium-select"
                      value={formData.suitableFor}
                      onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Family">Family</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Society Name *</label>
                  {!showNewSocietyInput ? (
                    <select
                      className="premium-select"
                      value={formData.societyName || ""}
                      onChange={(e) => {
                        if (e.target.value === "add-new") {
                          setShowNewSocietyInput(true);
                          setFormData({ ...formData, societyName: "" });
                        } else {
                          setFormData({ ...formData, societyName: e.target.value });
                        }
                      }}
                      required
                    >
                      <option value="">Select Society</option>
                      <option value="add-new">✨ Add New Society</option>
                      {societies.map((society, index) => (
                        <option key={index} value={society}>{society}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="premium-input"
                        placeholder="Enter new society name"
                        value={formData.societyName}
                        onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewSocietyInput(false)}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        ← Cancel, select from existing
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Configuration *</label>
                  {formData.propertyType === 'Flat' ? (
                    <select
                      className="premium-select"
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      required
                    >
                      <option value="">Select Configuration</option>
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="4BHK">4BHK</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="premium-input"
                      placeholder="Enter configuration"
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Area (sq ft) *</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Price *</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Availability Status</label>
                  <select
                    className="premium-select"
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Property Title</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.propertyTitle}
                    onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Floor Number</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Total Floors</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Furnishing Status</label>
                  <select
                    className="premium-select"
                    value={formData.furnishingStatus}
                    onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
                  >
                    <option value="">Select Furnishing Status</option>
                    <option value="Raw">Raw</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Facing</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Property Age (years)</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.propertyAge}
                    onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Description</label>
                  <textarea
                    className="premium-input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Tower</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.tower}
                    onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Unit Number</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Owner Type</label>
                  <select
                    className="premium-select"
                    value={formData.ownerType}
                    onChange={(e) => setFormData({ ...formData, ownerType: e.target.value })}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Broker">Broker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Owner Name</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Owner Phone</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Video</label>
                  <select
                    className="premium-select"
                    value={formData.hasVideo ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, hasVideo: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="h-20" /> {/* Spacer for sticky buttons */}
              </form>
            </div>
            <div className="sticky bottom-0 bg-white p-6 pt-2 rounded-b-2xl border-t border-primary-200">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="premium-button-outline"
                >
                  Cancel
                </button>
                <button type="submit" form="add-property-form" className="premium-button">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="premium-card w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white p-6 pb-2 rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-primary-600">Edit Property</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <form id="edit-property-form" onSubmit={handleUpdateProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Property Type *</label>
                  <select
                    className="premium-select"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    required
                  >
                    <option value="Flat">Flat</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Shop">Shop</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Purpose *</label>
                  <select
                    className="premium-select"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                {formData.purpose === 'Rent' && (
                  <div>
                    <label className="block text-primary-400 text-sm font-bold mb-2">Suitable For</label>
                    <select
                      className="premium-select"
                      value={formData.suitableFor}
                      onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="Family">Family</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Society Name *</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.societyName}
                    onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Configuration *</label>
                  {formData.propertyType === 'Flat' ? (
                    <select
                      className="premium-select"
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      required
                    >
                      <option value="">Select Configuration</option>
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="4BHK">4BHK</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="premium-input"
                      placeholder="Enter configuration"
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Area (sq ft) *</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Price *</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Availability Status</label>
                  <select
                    className="premium-select"
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Property Title</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.propertyTitle}
                    onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Floor Number</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Total Floors</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Furnishing Status</label>
                  <select
                    className="premium-select"
                    value={formData.furnishingStatus}
                    onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
                  >
                    <option value="">Select Furnishing Status</option>
                    <option value="Raw">Raw</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Facing</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Property Age (years)</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.propertyAge}
                    onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Description</label>
                  <textarea
                    className="premium-input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Tower</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.tower}
                    onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Unit Number</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Owner Type</label>
                  <select
                    className="premium-select"
                    value={formData.ownerType}
                    onChange={(e) => setFormData({ ...formData, ownerType: e.target.value })}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Broker">Broker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Owner Name</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Owner Phone</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-primary-400 text-sm font-bold mb-2">Video</label>
                  <select
                    className="premium-select"
                    value={formData.hasVideo ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, hasVideo: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div className="h-20" /> {/* Spacer for sticky buttons */}
              </form>
            </div>
            <div className="sticky bottom-0 bg-white p-6 pt-2 rounded-b-2xl border-t border-primary-200">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProperty(null);
                  }}
                  className="premium-button-outline"
                >
                  Cancel
                </button>
                <button type="submit" form="edit-property-form" className="premium-button">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
