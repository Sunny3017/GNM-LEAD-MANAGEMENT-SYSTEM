import { useEffect, useState } from 'react';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const EmployeeLeads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const leadColumns = [
    { key: 'customerName', header: 'Customer Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'budget', header: 'Budget' },
    { key: 'purchaseType', header: 'Purchase Type' },
    { key: 'leadStatus', header: 'Status' },
  ];

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data.leads);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchNotes = async (leadId) => {
    try {
      const res = await api.get(`/leads/${leadId}/notes`);
      setNotes(res.data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    fetchNotes(lead._id);
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote) return;
    try {
      await api.post(`/leads/${selectedLead._id}/notes`, { note: newNote });
      setNewNote('');
      fetchNotes(selectedLead._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedLead) return;
    try {
      await api.put(`/leads/${selectedLead._id}`, { leadStatus: status });
      fetchLeads();
      setSelectedLead({ ...selectedLead, leadStatus: status });
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    exportToPDF(leads, leadColumns, 'My Leads', `leads-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportExcel = () => {
    exportToExcel(leads, leadColumns, `leads-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const statuses = [
    'New Lead',
    'Contacted',
    'Follow-Up',
    'Site Visit Scheduled',
    'Negotiation',
    'Closed',
    'Lost',
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          My Leads
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead._id}
                onClick={() => handleSelectLead(lead)}
                className={`premium-card p-4 cursor-pointer transition-all ${
                  selectedLead?._id === lead._id 
                    ? 'ring-2 ring-primary-400' 
                    : ''
                }`}
              >
                <h3 className="font-bold">{lead.customerName}</h3>
                <p className="text-primary-400 text-sm">{lead.mobileNumber}</p>
                <p className="text-primary-400 text-sm">{lead.purchaseType}</p>
                {lead.description && (
                  <p className="text-primary-400 text-sm mt-2 line-clamp-2">
                    {lead.description}
                  </p>
                )}
                <p className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead.leadStatus === 'Closed' 
                      ? 'bg-green-500/20 text-green-700 border border-green-500/30' 
                      : lead.leadStatus === 'Lost' 
                      ? 'bg-red-500/20 text-red-700 border border-red-500/30' 
                      : 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                  }`}>
                    {lead.leadStatus}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedLead ? (
            <div className="premium-card p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedLead.customerName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-primary-400 text-sm">Mobile Number</p>
                  <p className="font-semibold">{selectedLead.mobileNumber}</p>
                </div>
                {selectedLead.budget && (
                  <div>
                    <p className="text-primary-400 text-sm">Budget</p>
                    <p className="font-semibold">₹{selectedLead.budget.toLocaleString()}</p>
                  </div>
                )}
                {selectedLead.preferredSociety && (
                  <div>
                    <p className="text-primary-400 text-sm">Preferred Society</p>
                    <p className="font-semibold">{selectedLead.preferredSociety}</p>
                  </div>
                )}
                {selectedLead.preferredConfiguration && (
                  <div>
                    <p className="text-primary-400 text-sm">Preferred Configuration</p>
                    <p className="font-semibold">{selectedLead.preferredConfiguration}</p>
                  </div>
                )}
                <div>
                  <p className="text-primary-400 text-sm">Purchase Type</p>
                  <p className="font-semibold">{selectedLead.purchaseType}</p>
                </div>
              </div>
              {selectedLead.description && (
                <div className="mb-6">
                  <p className="text-primary-400 text-sm">Description</p>
                  <p className="text-primary-600 mt-1 border-l-2 border-primary-400 pl-3 italic">
                    {selectedLead.description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-primary-400 text-sm mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedLead.leadStatus === status
                          ? 'bg-primary-400 text-white'
                          : 'border border-primary-300 text-primary-400 hover:bg-primary-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Notes</h3>
                <div className="flex mb-4">
                  <input
                    type="text"
                    className="premium-input rounded-l-lg rounded-r-none"
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <button
                    onClick={handleAddNote}
                    className="premium-button rounded-l-none"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note._id} className="bg-primary-50 p-3 rounded-lg">
                      <p className="text-sm text-primary-600">{note.note}</p>
                      <p className="text-xs text-primary-400 mt-1">
                        {note.addedBy.employeeName} • {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-card p-6 flex items-center justify-center text-primary-400">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeads;
