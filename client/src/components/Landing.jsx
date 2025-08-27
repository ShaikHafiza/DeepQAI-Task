import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Special handling for stats counter animation
          if (entry.target.classList.contains('stats-grid')) {
            animateCounters();
          }
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Initial hero animation
    setTimeout(() => setIsVisible(true), 100);

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          if (target.includes('+')) {
            counter.textContent = Math.floor(current) + '+';
          } else if (target.includes('M')) {
            counter.textContent = (current / 1000000).toFixed(1) + 'M+';
          } else {
            counter.textContent = Math.floor(current);
          }
          setTimeout(updateCounter, 20);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    });
  };

  const features = [
  {
    icon: "🤖",
    title: "Smart Forecasting",
    description:
      "Leverage AI-powered predictive models to anticipate future trends in economics, health, and education with high accuracy.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "⚡",
    title: "Instant Alerts",
    description:
      "Stay informed with real-time notifications whenever critical global indicators change or new reports are published.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: "📊",
    title: "Interactive Dashboards",
    description:
      "Customize dynamic dashboards to visualize KPIs, compare country statistics, and share insights effortlessly.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: "🌍",
    title: "Global Insights",
    description:
      "Access in-depth reports and analytics covering 220+ countries, economies, and regions worldwide.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: "🔗",
    title: "Seamless Integration",
    description:
      "Connect data into your workflow with robust REST APIs and SDKs for quick integration into apps and tools.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: "📌",
    title: "Data-Driven Strategy",
    description:
      "Turn raw data into actionable strategies with automated analysis, reporting, and visualization tools.",
    color: "from-red-500 to-red-600",
  },
];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <span>📊</span>
              </div>
              <h2 className="brand-title">WorldBank Stats</h2>
            </div>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link signup-btn">
              <span>Sign Up</span>
              <div className="button-shine"></div>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className={`hero-content ${isVisible ? 'hero-visible' : ''}`}>
          <div className="hero-badge">
            <span className="badge-text">🚀 New Features Available</span>
          </div>
          <h1 className="hero-title">
            Unlock Global Economic Insights with 
            <span className="highlight"> WorldBank Data</span>
            <div className="title-underline"></div>
          </h1>
          <p className="hero-subtitle">
            Access comprehensive economic indicators, development statistics, and financial data 
            from over 200 countries and territories worldwide. Transform data into actionable insights.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              <span>Get Started Free</span>
              <div className="btn-glow"></div>
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <span>Explore Data</span>
              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>
          <div className="hero-stats-mini">
            <div className="mini-stat">
              <div className="mini-stat-number">1.4K+</div>
              <div className="mini-stat-label">Indicators</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-number">217</div>
              <div className="mini-stat-label">Countries</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-number">50+</div>
              <div className="mini-stat-label">Years Data</div>
            </div>
          </div>
        </div>
        <div className={`hero-visual ${isVisible ? 'hero-visible' : ''}`}>
          <div className="chart-container">
            <div className="chart-mockup">
              <div className="chart-header">
                <div className="chart-title">Global GDP Growth</div>
                <div className="chart-controls">
                  <div className="control-dot active"></div>
                  <div className="control-dot"></div>
                  <div className="control-dot"></div>
                </div>
              </div>
              <div className="chart-bars">
                {[60, 80, 45, 90, 70, 85, 75].map((height, index) => (
                  <div 
                    key={index}
                    className="bar" 
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="bar-tooltip">{height}%</div>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                {['2018', '2019', '2020', '2021', '2022', '2023', '2024'].map(year => (
                  <span key={year} className="chart-label">{year}</span>
                ))}
              </div>
            </div>
            <div className="floating-cards">
              <div className="data-card card-1">
                <div className="card-icon">🌍</div>
                <div className="card-text">Real-time Data</div>
              </div>
              <div className="data-card card-2">
                <div className="card-icon">📈</div>
                <div className="card-text">Advanced Analytics</div>
              </div>
              <div className="data-card card-3">
                <div className="card-icon">💡</div>
                <div className="card-text">AI Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header animate-on-scroll">
            
            <h2 className="section-title"> Ready to Unlock the Story Behind the Stats?</h2>
            <p className="section-subtitle">
              Discover the powerful tools and insights that make us the preferred choice for global economic data analysis.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card animate-on-scroll ${activeFeature === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-card-inner">
                  <div className={`feature-icon-wrapper bg-gradient-to-r ${feature.color}`}>
                    <div className="feature-icon">{feature.icon}</div>
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                  <div className="feature-hover-effect"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
     <section className="stats-section" ref={statsRef}>
  <div className="container">
    <div className="stats-container animate-on-scroll">
      <div className="stats-header">
        <h2>Trusted by Data Professionals Worldwide</h2>
        <p>Join thousands who rely on our platform for critical economic insights</p>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number" data-target="1400+">1400+</div>
          <div className="stat-label">Key Development Metrics</div>
          <div className="stat-description">Comprehensive coverage across all sectors</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" data-target="217">217</div>
          <div className="stat-label">Global Economies Tracked</div>
          <div className="stat-description">Global reach and coverage</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" data-target="50+">50+</div>
          <div className="stat-label">Years of Data Archives</div>
          <div className="stat-description">Long-term trend analysis</div>
        </div>
        <div className="stat-item">
          <div className="stat-number" data-target="1M+">1M+</div>
          <div className="stat-label">Daily Insights Delivered</div>
          <div className="stat-description">Trusted by professionals worldwide</div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <div className="cta-glow"></div>
            <h2 className="cta-title">Ready to Explore Global Economics?</h2>
            <p className="cta-subtitle">
              Join thousands of researchers, analysts, and decision-makers who trust WorldBank Stats for their data needs.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                <span>Start Your Free Trial</span>
                <div className="btn-particles"></div>
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                <span>Sign In</span>
              </Link>
            </div>
            <div className="cta-trust">
              <p>No credit card required • Free 14-day trial • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section footer-main">
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="logo-icon">
                    <span>📊</span>
                  </div>
                  <h3>WorldBank Stats</h3>
                </div>
                <p>Your gateway to global economic data and insights. Empowering better decisions through comprehensive data analysis.</p>
              </div>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#api">API</a></li>
                <li><a href="#integrations">Integrations</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#support">Support</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#tutorials">Tutorials</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 WorldBank Stats. All rights reserved.</p>
              <div className="footer-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#cookies">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;