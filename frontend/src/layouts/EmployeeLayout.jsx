import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useState, useEffect } from 'react';

const EmployeeLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Close sidebar on desktop resize
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { path: '/employee/dashboard', label: 'Dashboard' },
    { path: '/employee/properties', label: 'Properties' },
    { path: '/employee/my-properties', label: 'My Properties' },
    { path: '/employee/leads', label: 'Leads' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-primary-300/20 shadow-premium transform transition-all duration-500 ease-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-primary-300/20 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center shadow-premium">
                <span className="text-xl font-bold text-white">G</span>
              </div>
              <h2 className="text-xl font-bold text-primary-600 tracking-tight">GNM Employee</h2>
            </div>
            <p className="text-primary-400 text-sm">Lead & Property Management</p>
          </div>
          <button 
            className="md:hidden p-3 rounded-xl hover:bg-primary-50 text-primary-600 transition-all"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`block px-5 py-3.5 rounded-xl transition-all duration-300 font-medium tracking-wide ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-premium' 
                      : 'text-primary-600 hover:bg-primary-50 hover:shadow-soft'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-primary-300/20">
          <button 
            onClick={handleLogout} 
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3.5 px-5 rounded-xl shadow-card hover:shadow-premium transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-soft p-4 sm:p-6 flex items-center border-b border-primary-300/20 sticky top-0 z-30">
          <button 
            className="md:hidden p-3 rounded-xl hover:bg-primary-50 text-primary-600 transition-all mr-3"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-600">Welcome, {user?.name} 👋</h1>
            <p className="text-primary-400 text-sm hidden sm:block mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
