import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, employeeLogin, clearError } from '../redux/slices/authSlice';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    mobileNumber: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'admin') {
      await dispatch(adminLogin({ email: formData.email, mobile: formData.mobile, password: formData.password }));
    } else {
      await dispatch(employeeLogin({ mobileNumber: formData.mobileNumber, password: formData.password }));
    }
  };

  if (user) {
    navigate(user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">GNM Lead Management</h1>
        
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-lg ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg ${role === 'employee' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setRole('employee')}
          >
            Employee
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
            <button className="ml-2" onClick={() => dispatch(clearError())}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {role === 'admin' ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email or Mobile</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Email or Mobile"
                  value={formData.email || formData.mobile}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.includes('@')) {
                      setFormData({ ...formData, email: val, mobile: '' });
                    } else {
                      setFormData({ ...formData, mobile: val, email: '' });
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
