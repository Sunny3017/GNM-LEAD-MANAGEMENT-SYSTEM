import { useEffect, useState } from 'react';
import api from '../services/api';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const assignmentReportColumns = [
    { key: 'customerName', header: 'Customer Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'assignedEmployeeName', header: 'Assigned To' },
    { key: 'assignedByName', header: 'Assigned By' },
    { key: 'assignedDate', header: 'Assigned Date' },
    { key: 'leadStatus', header: 'Status' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employeesRes, propertiesRes, leadsRes] = await Promise.all([
          api.get('/employees'),
          api.get('/properties'),
          api.get('/leads'),
        ]);
        
        setLeads(leadsRes.data.leads.filter(lead => lead.assignedEmployee).map(lead => ({
          ...lead,
          assignedEmployeeName: lead.assignedEmployee ? lead.assignedEmployee.fullName : 'Unassigned',
          assignedByName: lead.assignedBy ? lead.assignedBy.fullName : 'N/A',
          assignedDate: lead.assignedAt ? new Date(lead.assignedAt).toLocaleDateString('en-IN') : 'N/A',
        })));
        
        setStats({
          employees: employeesRes.data.employees.length,
          activeEmployees: employeesRes.data.employees.filter((e) => e.status === 'Active').length,
          properties: propertiesRes.data.total,
          approvedProperties: propertiesRes.data.properties.filter((p) => p.approvalStatus === 'Approved').length,
          pendingProperties: propertiesRes.data.properties.filter((p) => p.approvalStatus === 'Pending Approval').length,
          leads: leadsRes.data.leads.length,
          closedLeads: leadsRes.data.leads.filter((l) => l.leadStatus === 'Closed').length,
          assignedLeads: leadsRes.data.leads.filter((l) => l.assignedEmployee).length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportPDF = () => {
    exportToPDF(leads, assignmentReportColumns, 'Lead Assignment Report', `lead-assignments-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportExcel = () => {
    exportToExcel(leads, assignmentReportColumns, `lead-assignments-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return <div>Loading...</div>;

  const statsCards = [
    { label: 'Total Employees', value: stats.employees },
    { label: 'Active Employees', value: stats.activeEmployees },
    { label: 'Total Properties', value: stats.properties },
    { label: 'Approved Properties', value: stats.approvedProperties },
    { label: 'Pending Properties', value: stats.pendingProperties },
    { label: 'Total Leads', value: stats.leads },
    { label: 'Assigned Leads', value: stats.assignedLeads },
    { label: 'Closed Deals', value: stats.closedLeads },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsCards.map((stat, index) => (
          <div key={index} className="premium-card p-6">
            <h3 className="text-lg font-medium text-primary-400">{stat.label}</h3>
            <p className="text-4xl font-bold mt-2 premium-gradient-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Lead Assignment Report
          </h2>
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

        <div className="premium-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-300/30">
                {assignmentReportColumns.map((col) => (
                  <th key={col.key} className="text-left py-3 px-4 text-primary-400 font-semibold">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={assignmentReportColumns.length} className="py-8 text-center text-primary-400">
                    No assigned leads yet
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-primary-300/20 hover:bg-primary-50/50">
                    <td className="py-3 px-4 text-primary-800">{lead.customerName}</td>
                    <td className="py-3 px-4 text-primary-800">{lead.mobileNumber}</td>
                    <td className="py-3 px-4 text-primary-800">{lead.assignedEmployeeName}</td>
                    <td className="py-3 px-4 text-primary-800">{lead.assignedByName}</td>
                    <td className="py-3 px-4 text-primary-800">{lead.assignedDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        lead.leadStatus === 'Closed' ? 'bg-green-500/20 text-green-700 border border-green-500/30' :
                        lead.leadStatus === 'Lost' ? 'bg-red-500/20 text-red-700 border border-red-500/30' :
                        'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                      }`}>
                        {lead.leadStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
