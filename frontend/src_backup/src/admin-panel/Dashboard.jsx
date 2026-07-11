import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employeesRes, propertiesRes, leadsRes] = await Promise.all([
          api.get('/employees'),
          api.get('/properties'),
          api.get('/leads'),
        ]);
        setStats({
          employees: employeesRes.data.employees.length,
          activeEmployees: employeesRes.data.employees.filter((e) => e.status === 'Active').length,
          properties: propertiesRes.data.total,
          approvedProperties: propertiesRes.data.properties.filter((p) => p.approvalStatus === 'Approved').length,
          pendingProperties: propertiesRes.data.properties.filter((p) => p.approvalStatus === 'Pending Approval').length,
          leads: leadsRes.data.leads.length,
          closedLeads: leadsRes.data.leads.filter((l) => l.leadStatus === 'Closed').length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  const statsCards = [
    { label: 'Total Employees', value: stats.employees, color: 'blue' },
    { label: 'Active Employees', value: stats.activeEmployees, color: 'green' },
    { label: 'Total Properties', value: stats.properties, color: 'purple' },
    { label: 'Approved Properties', value: stats.approvedProperties, color: 'indigo' },
    { label: 'Pending Properties', value: stats.pendingProperties, color: 'orange' },
    { label: 'Total Leads', value: stats.leads, color: 'pink' },
    { label: 'Closed Deals', value: stats.closedLeads, color: 'green' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-md text-white bg-${stat.color}-500`}>
            <h3 className="text-lg font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
