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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg shadow-md text-white bg-blue-500">
          <h3 className="text-lg font-medium">Properties Added</h3>
          <p className="text-3xl font-bold mt-2">{stats.propertiesAdded}</p>
        </div>
        <div className="p-6 rounded-lg shadow-md text-white bg-green-500">
          <h3 className="text-lg font-medium">Approved Properties</h3>
          <p className="text-3xl font-bold mt-2">{stats.approvedProperties}</p>
        </div>
        <div className="p-6 rounded-lg shadow-md text-white bg-orange-500">
          <h3 className="text-lg font-medium">Pending Properties</h3>
          <p className="text-3xl font-bold mt-2">{stats.pendingProperties}</p>
        </div>
        <div className="p-6 rounded-lg shadow-md text-white bg-purple-500">
          <h3 className="text-lg font-medium">Assigned Leads</h3>
          <p className="text-3xl font-bold mt-2">{stats.assignedLeads}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
