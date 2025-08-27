import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post("https://deepq-ai-backend.onrender.com/api/login/", {
        username,
        password,
      });

      // Save token with expiry
      const tokenData = {
        value: res.data.token,
        expiry: Date.now() + 60 * 60 * 1000 // 1 hour expiry
      };

      localStorage.setItem("token", JSON.stringify(tokenData));
      
      // Success animation
      document.querySelector('.login-container').classList.add('success');
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (err) {
      // Error animation
      document.querySelector('.login-form').classList.add('shake');
      setTimeout(() => {
        document.querySelector('.login-form')?.classList.remove('shake');
      }, 500);
      
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      
      <div className="login-container">
        <div className="login-form">
          <div className="form-header">
            <div className="brand-logo">
              <div className="logo-icon">📊</div>
              <h1 className="brand-title">WorldBank Stats</h1>
            </div>
            <p className="form-subtitle">Unlock the power of your analytics</p>
          </div>
          
          <form onSubmit={handleLogin} className="form space-y-4">
  {/* Username Field */}
  <div className="input-group">
    <label className="block text-sm font-medium mb-1">Username</label>
    <div className="input-wrapper flex items-center border rounded-lg px-3 py-2">
      <span className="input-icon mr-2">👨‍💻</span>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-input flex-1 outline-none bg-transparent"
        required
      />
    </div>
  </div>

  {/* Password Field */}
  <div className="input-group">
    <label className="block text-sm font-medium mb-1">Password</label>
    <div className="input-wrapper flex items-center border rounded-lg px-3 py-2">
      <span className="input-icon mr-2">🔑</span>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input flex-1 outline-none bg-transparent"
        required
      />
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className={`login-button w-full flex justify-center items-center gap-2 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${loading ? 'loading opacity-75' : ''}`}
    disabled={loading}
  >
    {loading ? (
      <div className="loading-spinner"></div>
    ) : (
      <>
        <span>Sign In</span>
        <span className="button-icon">→</span>
      </>
    )}
  </button>
</form>

          
          <div className="form-footer">
            <p className="signup-text">
              Don't have an account? 
              <br/><br/>
              <Link to="/signup" className="signup-link">Sign up</Link>
            </p>
          </div>

          
        </div>
        <div className="login-info">
          <div className="info-card">
            <h3>Access Global Economic Data</h3>
            <ul>
              <li>Real-time World Bank statistics</li>
              <li>Interactive visualization tools</li>
              <li>Custom data filtering</li>
              <li>Export and share insights</li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;