import { useEffect, useState } from 'react';
import api from '../services/api';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [myPropsRes, leadsRes] = await Promise.all([
          api.get('/properties/my'),
          api.get('/leads'),
        ]);
        const myProps = myPropsRes.data.properties;
        setStats({
          propertiesAdded: myProps.length,
          approvedProperties: myProps.filter((p) => p.approvalStatus === 'Approved').length,
          pendingProperties: myProps.filter((p) => p.approvalStatus === 'Pending Approval').length,
          assignedLeads: leadsRes.data.leads.length,
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
    { label: 'Properties Added', value: stats.propertiesAdded },
    { label: 'Approved Properties', value: stats.approvedProperties },
    { label: 'Pending Properties', value: stats.pendingProperties },
    { label: 'Assigned Leads', value: stats.assignedLeads },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="premium-card p-6">
            <h3 className="text-lg font-medium text-primary-400">{stat.label}</h3>
            <p className="text-4xl font-bold mt-2 premium-gradient-text">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
