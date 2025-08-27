import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import './Dashboard.css';

// Constants
const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
];

const METRICS = [
  { 
    id: 'GDP', 
    name: 'GDP (Current USD)', 
    indicator: 'NY.GDP.MKTP.CD', 
    icon: '💰',
    description: 'Gross Domestic Product at current market prices'
  },
  { 
    id: 'GDPPC', 
    name: 'GDP per Capita', 
    indicator: 'NY.GDP.PCAP.CD', 
    icon: '👤',
    description: 'GDP divided by midyear population'
  },
  { 
    id: 'POP', 
    name: 'Population', 
    indicator: 'SP.POP.TOTL', 
    icon: '🌍',
    description: 'Total population count'
  },
];

const TIME_RANGES = [
  { value: '5', label: 'Last 5 Years' },
  { value: '10', label: 'Last 10 Years' },
  { value: '20', label: 'Last 20 Years' }
];

// Custom Hooks
const useWorldBankData = (country, selectedMetric, timeRange) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    if (!country || !selectedMetric || !timeRange) return;

    setLoading(true);
    setError(null);

    try {
      const metric = METRICS.find(m => m.id === selectedMetric);
      const url = `https://api.worldbank.org/v2/country/${country}/indicator/${metric.indicator}?format=json&per_page=${timeRange}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result || !result[1] || result[1].length === 0) {
        throw new Error('No data available for selected parameters');
      }

      const validData = result[1]
        .filter(item => item.value !== null && item.value !== undefined)
        .sort((a, b) => parseInt(a.date) - parseInt(b.date));

      if (validData.length === 0) {
        throw new Error('No valid data points found');
      }

      setData(validData);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [country, selectedMetric, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refetch: fetchData };
};

const useDataAnalysis = (data) => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        latest: null,
        growthRate: 0,
        trend: 'neutral',
        changeFromPrevious: 0
      };
    }

    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;
    
    let growthRate = 0;
    let changeFromPrevious = 0;
    
    if (previous && previous.value) {
      growthRate = ((latest.value - previous.value) / previous.value) * 100;
      changeFromPrevious = latest.value - previous.value;
    }

    const trend = growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'neutral';

    return {
      latest,
      growthRate,
      trend,
      changeFromPrevious
    };
  }, [data]);
};

// Utility Functions
const formatValue = (value, metricId) => {
  if (!value || value === 0) return 'N/A';
  
  const formatters = {
    GDP: (val) => {
      if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
      if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
      return `$${(val / 1e6).toFixed(2)}M`;
    },
    GDPPC: (val) => `$${val.toLocaleString()}`,
    POP: (val) => {
      if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
      return val.toLocaleString();
    }
  };

  return formatters[metricId] ? formatters[metricId](value) : value.toLocaleString();
};

const exportToCSV = (data, countryName, metricName) => {
  if (!data || data.length === 0) return;

  const csvContent = [
    ['Year', metricName, 'Country'],
    ...data.map(item => [item.date, item.value || 'N/A', countryName])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${countryName}-${metricName}-${new Date().getFullYear()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Components
const MiniChart = ({ data, color = '#3b82f6', height = 60 }) => {
  if (!data || data.length < 2) {
    return (
      <div className="mini-chart-placeholder" style={{ height }}>
        <span className="text-xs text-gray-400">Insufficient data</span>
      </div>
    );
  }

  const values = data.map(d => d.value).filter(v => v !== null && v !== undefined);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) {
    return (
      <div className="mini-chart-placeholder" style={{ height }}>
        <span className="text-xs text-gray-400">No variation</span>
      </div>
    );
  }

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = ((max - value) / range) * 80 + 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="mini-chart" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#gradient-${color})`}
          points={`0,100 ${points} 100,100`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color = 'blue', subtitle }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const colorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100'
  };

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon ${colorClasses[color]}`}>
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
        <div className="stat-trend">
          {getTrendIcon()}
        </div>
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="loading-state">
    <div className="loading-spinner">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
    <h3 className="loading-title">Loading Economic Data</h3>
    <p className="loading-subtitle">Fetching latest information from World Bank...</p>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="error-state">
    <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
    <h3 className="error-title">Data Loading Error</h3>
    <p className="error-message">{error}</p>
    <button onClick={onRetry} className="error-retry-btn">
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </button>
  </div>
);

const DataTable = ({ data, selectedMetric, lastUpdated }) => {
  const metric = METRICS.find(m => m.id === selectedMetric);

  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <div>
          <h3 className="data-table-title">
            Historical Data - {metric?.name}
          </h3>
          <p className="data-table-description">{metric?.description}</p>
        </div>
        {lastUpdated && (
          <p className="data-table-updated">Last updated: {lastUpdated}</p>
        )}
      </div>
      
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Value</th>
              <th>Change</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const previousValue = index > 0 ? data[index - 1].value : null;
              const change = previousValue ? 
                ((item.value - previousValue) / previousValue * 100).toFixed(2) : null;
              
              return (
                <tr key={item.date}>
                  <td className="font-medium">{item.date}</td>
                  <td>{formatValue(item.value, selectedMetric)}</td>
                  <td>
                    {change ? (
                      <span className={`change-badge ${parseFloat(change) >= 0 ? 'positive' : 'negative'}`}>
                        {change}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <div className="trend-cell">
                      <MiniChart 
                        data={data.slice(0, index + 1)} 
                        color={change && parseFloat(change) >= 0 ? '#10b981' : '#ef4444'} 
                        height={40}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component
const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedMetric, setSelectedMetric] = useState('GDP');
  const [timeRange, setTimeRange] = useState('10');

  const { data, loading, error, lastUpdated, refetch } = useWorldBankData(
    selectedCountry, 
    selectedMetric, 
    timeRange
  );

  const analysis = useDataAnalysis(data);
  
  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);
  const selectedMetricData = METRICS.find(m => m.id === selectedMetric);

  const handleExport = useCallback(() => {
    exportToCSV(data, selectedCountryData?.name, selectedMetricData?.name);
  }, [data, selectedCountryData, selectedMetricData]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <div className="brand-icon">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="dashboard-title">Global Economic Dashboard</h1>
              <p className="dashboard-subtitle">Real-time insights from World Bank data</p>
            </div>
          </div>

          <div className="dashboard-controls">
            {/* Country Selector */}
            <div className="control-group">
              <Globe className="control-icon" />
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="dashboard-select"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Selector */}
            <div className="control-group">
              <TrendingUp className="control-icon" />
              <select 
                value={selectedMetric} 
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="dashboard-select"
              >
                {METRICS.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.icon} {metric.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div className="control-group">
              <Calendar className="control-icon" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="dashboard-select"
              >
                {TIME_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="dashboard-actions">
              <button
                onClick={refetch}
                className="action-btn"
                title="Refresh Data"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExport}
                disabled={!data.length || loading}
                className="action-btn"
                title="Export Data"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {loading && <LoadingState />}
        
        {error && !loading && (
          <ErrorState error={error} onRetry={refetch} />
        )}

        {!loading && !error && data.length > 0 && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard
                title="Country"
                value={selectedCountryData?.name}
                icon="🏛️"
                color="blue"
              />
              
              <StatCard
                title={`Latest ${selectedMetric}`}
                value={formatValue(analysis.latest?.value, selectedMetric)}
                icon={selectedMetricData?.icon}
                trend={analysis.trend}
                color="green"
                subtitle={analysis.latest?.date}
              />
              
              <StatCard
                title="Growth Rate"
                value={`${analysis.growthRate.toFixed(2)}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend={analysis.trend}
                color="purple"
                subtitle="Year-over-year"
              />
              
              <StatCard
                title="Data Period"
                value={`${data[0]?.date} - ${data[data.length - 1]?.date}`}
                icon={<Calendar className="w-5 h-5" />}
                color="orange"
                subtitle={`${data.length} data points`}
              />
            </div>

            {/* Data Table */}
            <DataTable 
              data={data}
              selectedMetric={selectedMetric}
              lastUpdated={lastUpdated}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;