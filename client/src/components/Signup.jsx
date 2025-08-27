import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'username':
        if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        // Calculate password strength
        calculatePasswordStrength(value);
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: errors[name]
    }));
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError("");
    
    // Real-time validation
    validateField(name, value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate all fields
    const { username, email, password, confirmPassword } = formData;
    
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      triggerShakeAnimation();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      triggerShakeAnimation();
      return;
    }

    if (Object.keys(validationErrors).some(key => validationErrors[key])) {
      setError("Please fix the validation errors");
      setLoading(false);
      triggerShakeAnimation();
      return;
    }

    try {
      await axios.post(
        "https://deepq-ai-backend.onrender.com/api/register/",
        { username, password, email },
        { headers: { "Content-Type": "application/json" } }
      );
      
      // Success animation
      const container = document.querySelector('.signup-container');
      const form = document.querySelector('.signup-form');
      container.classList.add('success');
      form.classList.add('success');
      
      // Show success message
      setError("");
      
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Account created successfully! Please sign in." }
        });
      }, 1500);
      
    } catch (err) {
      console.error(err.response?.data);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Error creating account. Please try again.";
      setError(errorMessage);
      triggerShakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const triggerShakeAnimation = () => {
    const form = document.querySelector('.signup-form');
    form.classList.add('shake');
    setTimeout(() => {
      form.classList.remove('shake');
    }, 500);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: case 1: return 'Weak';
      case 2: case 3: return 'Medium';
      case 4: case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 0: case 1: return 'weak';
      case 2: case 3: return 'medium';
      case 4: case 5: return 'strong';
      default: return '';
    }
  };

  return (
    <div className="signup-page">
      {/* Enhanced Background */}
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>
      
      <div className={`signup-container ${isVisible ? 'visible' : ''}`}>
        <div className="signup-form">
          {/* Progress Steps */}
          <div className="signup-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <span>Account Details</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-number">2</div>
              <span>Verification</span>
            </div>
          </div>

          <div className="form-header">
            <div className="brand-logo">
              <div className="logo-icon">
                <span>📊</span>
                <div className="logo-glow"></div>
              </div>
              <h1 className="brand-title">WorldBank Stats</h1>
            </div>
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-subtitle">Join thousands of data professionals worldwide</p>
          </div>
          
          <form onSubmit={handleSignup} className="form">
            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <span className="error-text">{error}</span>
                  <button 
                    type="button" 
                    className="error-close"
                    onClick={() => setError("")}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div className="form-grid">
              {/* Username Field */}
              <div className="input-group">
                <label htmlFor="username" className="input-label">Username</label>
                <div className="input-wrapper">
                  <div className="input-icon">👤</div>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.username ? 'error' : ''}`}
                    required
                  />
                  <div className="input-border"></div>
                </div>
                {validationErrors.username && (
                  <div className="field-error">{validationErrors.username}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <div className="input-icon">✉️</div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.email ? 'error' : ''}`}
                    required
                  />
                  <div className="input-border"></div>
                </div>
                {validationErrors.email && (
                  <div className="field-error">{validationErrors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="input-group">
                <label htmlFor="password" className="input-label">Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">🔒</div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.password ? 'error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <div className="input-border"></div>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill ${getPasswordStrengthClass()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`strength-text ${getPasswordStrengthClass()}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">🔓</div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <div className="input-border"></div>
                </div>
                {validationErrors.confirmPassword && (
                  <div className="field-error">{validationErrors.confirmPassword}</div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <label className="checkbox-container">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and{' '}
                  <a href="#privacy" className="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button
              type="submit"
              className={`signup-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="button-loading">
                  <div className="loading-spinner"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="button-content">
                  <span>Create Account</span>
                  <div className="button-icon">→</div>
                  <div className="button-shine"></div>
                </div>
              )}
              <div className="button-ripple"></div>
            </button>

           
          </form>
          
          <div className="form-footer">
            <p className="login-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                <span>Sign in</span>
                <div className="link-underline"></div>
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="signup-benefits">
          <h3>Why Join WorldBank Stats?</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">🚀</div>
              <div className="benefit-content">
                <h4>Instant Access</h4>
                <p>Get immediate access to 1,400+ development indicators</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <div className="benefit-content">
                <h4>Advanced Analytics</h4>
                <p>Powerful visualization and analysis tools</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🌍</div>
              <div className="benefit-content">
                <h4>Global Data</h4>
                <p>Comprehensive data from 217 countries worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;