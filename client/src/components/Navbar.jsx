import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LogOut, 
  User, 
  ChevronDown, 
  Settings, 
  Bell, 
  Menu, 
  X,
  Home,
  Database,
  TrendingUp,
  FileText
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ userName = "Dashboard User", userEmail = "user@example.com" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown') && !event.target.closest('.notifications-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear any user data
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setDropdownOpen(false);
  };

  // Navigation items for dashboard
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/data', label: 'Data Explorer', icon: Database },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText }
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav">
        {/* Brand Section */}
        <div className="nav-brand" onClick={() => navigate('/dashboard')}>
          <div className="brand-icon">
            <BarChart3 className="brand-icon-svg" />
          </div>
          <h2 className="brand-title">WorldBank Stats</h2>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-center">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <IconComponent className="nav-item-icon" />
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {/* Notifications */}
          <div className="notifications-container">
            <button className="notification-btn">
              <Bell className="notification-icon" />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          </div>

          {/* User Section */}
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                <User className="avatar-icon" />
                <span className="avatar-text">{getInitials(userName)}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{userName}</span>
                <span className="user-email">{userEmail}</span>
              </div>
            </div>

            <div className="user-dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <ChevronDown className={`dropdown-icon ${dropdownOpen ? 'rotated' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {getInitials(userName)}
                    </div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-name">{userName}</div>
                      <div className="dropdown-email">{userEmail}</div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button 
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <User className="dropdown-item-icon" />
                    <span>Profile</span>
                  </button>

                  <button 
                    className="dropdown-item"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="dropdown-item-icon" />
                    <span>Settings</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut className="dropdown-item-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-user-info">
              <div className="mobile-avatar">
                {getInitials(userName)}
              </div>
              <div className="mobile-user-details">
                <div className="mobile-user-name">{userName}</div>
                <div className="mobile-user-email">{userEmail}</div>
              </div>
            </div>
          </div>

          <div className="mobile-nav-items">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <IconComponent className="mobile-nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mobile-menu-footer">
            <button 
              className="mobile-menu-item"
              onClick={handleProfileClick}
            >
              <User className="mobile-menu-icon" />
              <span>Profile</span>
            </button>

            <button 
              className="mobile-menu-item"
              onClick={handleSettingsClick}
            >
              <Settings className="mobile-menu-icon" />
              <span>Settings</span>
            </button>

            <button 
              className="mobile-logout-btn"
              onClick={handleLogout}
            >
              <LogOut className="mobile-menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;