import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    budget: '',
    preferredSociety: '',
    preferredConfiguration: '',
    purchaseType: 'Sale',
    leadStatus: 'New Lead',
    assignedEmployee: '',
  });

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data.leads);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
      });
      setShowModal(false);
      setFormData({
        customerName: '',
        mobileNumber: '',
        budget: '',
        preferredSociety: '',
        preferredConfiguration: '',
        purchaseType: 'Sale',
        leadStatus: 'New Lead',
        assignedEmployee: '',
      });
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold">{lead.customerName}</h3>
            <p className="text-gray-600">Mobile: {lead.mobileNumber}</p>
            {lead.budget && <p className="text-gray-600">Budget: ₹{lead.budget.toLocaleString()}</p>}
            {lead.preferredSociety && <p className="text-gray-600">Society: {lead.preferredSociety}</p>}
            {lead.preferredConfiguration && <p className="text-gray-600">Config: {lead.preferredConfiguration}</p>}
            <p className="text-gray-600">Type: {lead.purchaseType}</p>
            <p className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${
                lead.leadStatus === 'Closed' ? 'bg-green-100 text-green-800' :
                lead.leadStatus === 'Lost' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {lead.leadStatus}
              </span>
            </p>
            {lead.assignedEmployee && (
              <p className="text-gray-500 text-sm mt-2">Assigned to: {lead.assignedEmployee.fullName}</p>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Lead</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Customer Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Budget</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Society</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.preferredSociety}
                  onChange={(e) => setFormData({ ...formData, preferredSociety: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Configuration</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.preferredConfiguration}
                  onChange={(e) => setFormData({ ...formData, preferredConfiguration: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Purchase Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.purchaseType}
                  onChange={(e) => setFormData({ ...formData, purchaseType: e.target.value })}
                >
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Assign to Employee</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.assignedEmployee}
                  onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
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

export default AdminLeads;
