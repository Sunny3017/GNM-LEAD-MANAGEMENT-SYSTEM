import { useEffect, useState } from 'react';
import api from '../services/api';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: 'Flat',
    purpose: 'Sale',
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
  });

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties/my');
      setProperties(res.data.properties);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

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
      });
      fetchProperties();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Property
        </button>
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
            <p className="text-gray-600">{prop.area} sq ft</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Property</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Property Type *</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
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
                <label className="block text-gray-700 text-sm font-bold mb-2">Purpose *</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  required
                >
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Society Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.societyName}
                  onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Configuration *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 2BHK"
                  value={formData.configuration}
                  onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Area (sq ft) *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Price *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Availability Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
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
                <label className="block text-gray-700 text-sm font-bold mb-2">Property Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.propertyTitle}
                  onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Floor Number</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Total Floors</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.totalFloors}
                  onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Furnishing Status</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.furnishingStatus}
                  onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Facing</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.facing}
                  onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Property Age (years)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.propertyAge}
                  onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Tower</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.tower}
                  onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Unit Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
