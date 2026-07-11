import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      const path = user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'admin') {
      await dispatch(adminLogin({ email: formData.email, mobile: formData.mobile, password: formData.password }));
    } else {
      await dispatch(employeeLogin({ mobileNumber: formData.mobileNumber, password: formData.password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
      
      <div className="premium-card p-8 sm:p-12 w-full max-w-lg relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl mb-6 shadow-premium">
            <span className="text-3xl font-bold text-white">G</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 premium-gradient-text">GNM Lead Management</h1>
          <p className="text-primary-400 text-lg">Sign in to your account</p>
        </div>
        
        <div className="flex mb-8 bg-primary-50 p-2 rounded-2xl">
          <button
            className={`flex-1 py-3.5 px-5 rounded-xl font-semibold transition-all duration-300 ${role === 'admin' ? 'bg-primary-400 text-white shadow-card' : 'text-primary-400 hover:bg-primary-100'}`}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button
            className={`flex-1 py-3.5 px-5 rounded-xl font-semibold transition-all duration-300 ${role === 'employee' ? 'bg-primary-400 text-white shadow-card' : 'text-primary-400 hover:bg-primary-100'}`}
            onClick={() => setRole('employee')}
          >
            Employee
          </button>
        </div>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-700 p-5 rounded-2xl mb-8 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </span>
            <button className="text-red-700 hover:text-red-900 font-bold text-xl leading-none" onClick={() => dispatch(clearError())}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {role === 'admin' ? (
            <>
              <div>
                <label className="block text-primary-600 text-sm font-semibold mb-3 tracking-wide">Email or Mobile</label>
                <input
                  type="text"
                  className="premium-input w-full"
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
            <div>
              <label className="block text-primary-600 text-sm font-semibold mb-3 tracking-wide">Mobile Number</label>
              <input
                type="text"
                className="premium-input w-full"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-primary-600 text-sm font-semibold mb-3 tracking-wide">Password</label>
            <input
              type="password"
              className="premium-input w-full"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="premium-button w-full mt-4 text-lg py-4"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
