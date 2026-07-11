import { useEffect, useState } from 'react';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
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
    description: '',
  });

  const leadColumns = [
    { key: 'customerName', header: 'Customer Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'budget', header: 'Budget' },
    { key: 'preferredSociety', header: 'Preferred Society' },
    { key: 'preferredConfiguration', header: 'Preferred Config' },
    { key: 'purchaseType', header: 'Purchase Type' },
    { key: 'leadStatus', header: 'Status' },
    { key: 'assignedEmployeeName', header: 'Assigned To' },
  ];

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data.leads.map(lead => ({
        ...lead,
        assignedEmployeeName: lead.assignedEmployee ? lead.assignedEmployee.fullName : 'Unassigned'
      })));
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
        description: '',
      });
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      customerName: lead.customerName,
      mobileNumber: lead.mobileNumber,
      budget: lead.budget ? lead.budget.toString() : '',
      preferredSociety: lead.preferredSociety || '',
      preferredConfiguration: lead.preferredConfiguration || '',
      purchaseType: lead.purchaseType,
      leadStatus: lead.leadStatus,
      assignedEmployee: lead.assignedEmployee ? lead.assignedEmployee._id : '',
      description: lead.description || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leads/${editingLead._id}`, {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
      });
      setShowEditModal(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(leads, leadColumns, 'Leads Report', `leads-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportExcel = () => {
    exportToExcel(leads, leadColumns, `leads-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Leads
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
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div key={lead._id} className="premium-card p-5">
            <h3 className="text-xl font-bold">{lead.customerName}</h3>
            <p className="text-primary-400">Mobile: {lead.mobileNumber}</p>
            {lead.budget && <p className="text-primary-400">Budget: ₹{lead.budget.toLocaleString()}</p>}
            {lead.preferredSociety && <p className="text-primary-400">Society: {lead.preferredSociety}</p>}
            {lead.preferredConfiguration && <p className="text-primary-400">Config: {lead.preferredConfiguration}</p>}
            <p className="text-primary-400">Type: {lead.purchaseType}</p>
            {lead.description && (
              <p className="text-primary-400 text-sm mt-2 border-l-2 border-primary-400 pl-3 italic">
                {lead.description}
              </p>
            )}
            <p className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                lead.leadStatus === 'Closed' ? 'bg-green-500/20 text-green-700 border border-green-500/30' :
                lead.leadStatus === 'Lost' ? 'bg-red-500/20 text-red-700 border border-red-500/30' :
                'bg-blue-500/20 text-blue-700 border border-blue-500/30'
              }`}>
                {lead.leadStatus}
              </span>
            </p>
            {lead.assignedEmployee && (
              <p className="text-primary-400 text-sm mt-3">Assigned to: {lead.assignedEmployee.fullName}</p>
            )}
            {lead.assignedAt && (
              <p className="text-primary-400 text-sm mt-1">
                Assigned on: {new Date(lead.assignedAt).toLocaleDateString('en-IN')}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(lead)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all"
              >
                Edit / Assign
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="premium-card w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white p-6 pb-2 rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-primary-600">Add Lead</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <form id="add-lead-form" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Customer Name</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Mobile Number</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Budget</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Preferred Society</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.preferredSociety}
                    onChange={(e) => setFormData({ ...formData, preferredSociety: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Preferred Configuration</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.preferredConfiguration}
                    onChange={(e) => setFormData({ ...formData, preferredConfiguration: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Purchase Type</label>
                  <select
                    className="premium-select"
                    value={formData.purchaseType}
                    onChange={(e) => setFormData({ ...formData, purchaseType: e.target.value })}
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Assign to Employee</label>
                  <select
                    className="premium-select"
                    value={formData.assignedEmployee}
                    onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Description</label>
                  <textarea
                    className="premium-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter any additional details about this lead"
                    rows="3"
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
                <button type="submit" form="add-lead-form" className="premium-button">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="premium-card w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white p-6 pb-2 rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-primary-600">Edit Lead</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <form id="edit-lead-form" onSubmit={handleUpdateLead}>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Customer Name</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Mobile Number</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Budget</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Preferred Society</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.preferredSociety}
                    onChange={(e) => setFormData({ ...formData, preferredSociety: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Preferred Configuration</label>
                  <input
                    type="text"
                    className="premium-input"
                    value={formData.preferredConfiguration}
                    onChange={(e) => setFormData({ ...formData, preferredConfiguration: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Purchase Type</label>
                  <select
                    className="premium-select"
                    value={formData.purchaseType}
                    onChange={(e) => setFormData({ ...formData, purchaseType: e.target.value })}
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Lead Status</label>
                  <select
                    className="premium-select"
                    value={formData.leadStatus}
                    onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-Up">Follow-Up</option>
                    <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Assign to Employee</label>
                  <select
                    className="premium-select"
                    value={formData.assignedEmployee}
                    onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-primary-400 text-sm font-bold mb-2">Description</label>
                  <textarea
                    className="premium-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter any additional details about this lead"
                    rows="3"
                  />
                </div>
                <div className="h-20" /> {/* Spacer for sticky buttons */}
              </form>
            </div>
            <div className="sticky bottom-0 bg-white p-6 pt-2 rounded-b-2xl border-t border-primary-200">
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="premium-button-outline"
                >
                  Cancel
                </button>
                <button type="submit" form="edit-lead-form" className="premium-button">
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

export default AdminLeads;
