import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import { getMe, initializeWithoutToken } from './redux/slices/authSlice';
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { token, isInitialized } = useSelector((state) => state.auth);

  // Only run once on mount and when token/isInitialized change
  useEffect(() => {
    if (!isInitialized) {
      if (token) {
        dispatch(getMe());
      } else {
        dispatch(initializeWithoutToken());
      }
    }
  }, [token, isInitialized, dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return <MainRoutes />;
}

function MainRoutes() {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Routes><Route path="*" element={<Login />} /></Routes>;
  }

  if (!user) {
    return <Routes><Route path="*" element={<Login />} /></Routes>;
  }

  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/employee/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  if (user.role === 'employee') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="properties" element={<EmployeeProperties />} />
          <Route path="my-properties" element={<MyProperties />} />
          <Route path="leads" element={<EmployeeLeads />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/employee/dashboard" replace />} />
      </Routes>
    );
  }

  return <Routes><Route path="*" element={<Login />} /></Routes>;
}

export default App;
