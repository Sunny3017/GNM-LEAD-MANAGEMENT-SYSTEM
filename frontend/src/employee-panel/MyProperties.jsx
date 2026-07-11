import { useEffect, useState } from 'react';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [showNewSocietyInput, setShowNewSocietyInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
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
  });

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
    { key: 'ownerType', header: 'Owner Type' },
    { key: 'ownerName', header: 'Owner Name' },
    { key: 'ownerPhone', header: 'Owner Phone' },
    { key: 'description', header: 'Description' },
    { key: 'availabilityStatus', header: 'Availability Status' },
    { key: 'approvalStatus', header: 'Approval Status' },
  ];

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties/my');
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
  }, []);

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
    });
    setShowEditModal(true);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/properties/${editingProperty._id}`, {
        ...formData,
        area: Number(formData.area),
        price: Number(formData.price),
        floorNumber: formData.floorNumber ? Number(formData.floorNumber) : undefined,
        totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
        propertyAge: formData.propertyAge ? Number(formData.propertyAge) : undefined,
      });
      setShowEditModal(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = (property) => {
    const text = `🏠 ${property.societyName}
📋 ${property.configuration} • ${property.propertyType}
💵 ₹${property.price.toLocaleString()}
📐 ${property.area} sq ft
${property.tower ? `🏢 Tower: ${property.tower}\n` : ''}
${property.unitNumber ? `🏠 Unit: ${property.unitNumber}\n` : ''}
${property.floorNumber ? `🏢 Floor: ${property.floorNumber}${property.totalFloors ? ` of ${property.totalFloors}` : ''}\n` : ''}
${property.furnishingStatus ? `🛋️ Furnishing: ${property.furnishingStatus}\n` : ''}
${property.facing ? `🧭 Facing: ${property.facing}\n` : ''}
${property.propertyAge ? `📅 Age: ${property.propertyAge} years\n` : ''}
${property.suitableFor ? `👨‍👩‍👧 Suitable For: ${property.suitableFor}\n` : ''}
${property.description ? `📝 ${property.description}` : ''}`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Property details copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/properties', {
        ...formData,
        area: Number(formData.area),
        price: Number(formData.price),
        floorNumber: formData.floorNumber ? Number(formData.floorNumber) : undefined,
        totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
        propertyAge: formData.propertyAge ? Number(formData.propertyAge) : undefined,
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
      });
      setShowNewSocietyInput(false);
      fetchProperties();
      fetchSocieties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(properties, propertyColumns, 'My Properties', `my-properties-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportExcel = () => {
    exportToExcel(properties, propertyColumns, `my-properties-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          My Properties
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-5 rounded-lg hover:from-red-600 hover:to-red-800 transition-all shadow-lg"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-2 px-5 rounded-lg hover:from-green-600 hover:to-green-800 transition-all shadow-lg"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop._id} className="premium-card p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{prop.societyName}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                prop.approvalStatus === 'Approved' 
                  ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                  : prop.approvalStatus === 'Rejected' 
                  ? 'bg-red-500/20 text-red-700 border border-red-500/30' 
                  : 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
              }`}>
                {prop.approvalStatus}
              </span>
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
            {prop.description && <p className="text-primary-400 text-sm mt-2">{prop.description}</p>}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(prop)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleCopy(prop)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Copy
              </button>
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
              <form id="emp-add-property-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button type="submit" form="emp-add-property-form" className="premium-button">
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
              <form id="emp-edit-property-form" onSubmit={handleUpdateProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button type="submit" form="emp-edit-property-form" className="premium-button">
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

export default MyProperties;
