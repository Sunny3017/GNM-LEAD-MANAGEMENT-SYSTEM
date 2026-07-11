import { useEffect, useState } from 'react';
import api from '../services/api';

const EmployeeLeads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h1 className="text-2xl font-bold mb-6">My Leads</h1>
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead._id}
              onClick={() => handleSelectLead(lead)}
              className={`bg-white rounded-lg shadow-md p-4 cursor-pointer ${
                selectedLead?._id === lead._id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <h3 className="font-semibold">{lead.customerName}</h3>
              <p className="text-gray-600 text-sm">{lead.purchaseType}</p>
              <p className="mt-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  lead.leadStatus === 'Closed' ? 'bg-green-100 text-green-800' :
                  lead.leadStatus === 'Lost' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{selectedLead.customerName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedLead.budget && (
                <div>
                  <p className="text-gray-500 text-sm">Budget</p>
                  <p className="font-semibold">₹{selectedLead.budget.toLocaleString()}</p>
                </div>
              )}
              {selectedLead.preferredSociety && (
                <div>
                  <p className="text-gray-500 text-sm">Preferred Society</p>
                  <p className="font-semibold">{selectedLead.preferredSociety}</p>
                </div>
              )}
              {selectedLead.preferredConfiguration && (
                <div>
                  <p className="text-gray-500 text-sm">Preferred Configuration</p>
                  <p className="font-semibold">{selectedLead.preferredConfiguration}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm">Purchase Type</p>
                <p className="font-semibold">{selectedLead.purchaseType}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className={`px-3 py-1 rounded text-xs ${
                      selectedLead.leadStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Notes</h3>
              <div className="flex mb-4">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-l-lg"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note._id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {note.addedBy.employeeName} • {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-gray-500">
            Select a lead to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeads;
