import { useEffect, useState } from 'react';
import api from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', formData);
      setShowModal(false);
      setFormData({
        fullName: '',
        mobileNumber: '',
        password: '',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
      });
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/employees/${id}`, { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        console.log('Deleting employee with ID:', id);
        const response = await api.delete(`/employees/${id}`);
        console.log('Delete response:', response);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error.response || error);
        alert('Failed to delete employee: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          onClick={() => setShowModal(true)}
          className="premium-button"
        >
          Add Employee
        </button>
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase">Joining Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-300">
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="px-6 py-4">{emp.fullName}</td>
                <td className="px-6 py-4">{emp.mobileNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${emp.status === 'Active' ? 'bg-green-500/20 text-green-700 border border-green-500/30' : 'bg-red-500/20 text-red-700 border border-red-500/30'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => toggleStatus(emp._id, emp.status)}
                    className="premium-gradient-text hover:text-primary-500 font-semibold"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="premium-card w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-primary-400 text-sm font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  className="premium-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                <label className="block text-primary-400 text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  className="premium-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="premium-button-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="premium-button">
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

export default Employees;
