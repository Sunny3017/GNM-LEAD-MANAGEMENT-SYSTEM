import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { getMe } from './redux/slices/authSlice';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminDashboard from './admin-panel/Dashboard';
import Employees from './admin-panel/Employees';
import AdminProperties from './admin-panel/Properties';
import AdminLeads from './admin-panel/Leads';
import EmployeeDashboard from './employee-panel/Dashboard';
import EmployeeProperties from './employee-panel/Properties';
import MyProperties from './employee-panel/MyProperties';
import EmployeeLeads from './employee-panel/Leads';

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [token, user, dispatch]);

  const ProtectedRoute = ({ children, role }) => {
    if (!token) return <Navigate to="/" />;
    if (role && user?.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} /> : <Login />} />
        
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>

        <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="properties" element={<EmployeeProperties />} />
          <Route path="my-properties" element={<MyProperties />} />
          <Route path="leads" element={<EmployeeLeads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
