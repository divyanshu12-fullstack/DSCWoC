import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGitHub, signOut } from '../lib/supabase';
import Starfield from '../components/Starfield';
import {
  Users,
  FolderGit2,
  GitPullRequest,
  TrendingUp,
  Award,
  AlertCircle,
  RefreshCw,
  Mail,
  LogOut,
  Shield,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const normalizeApiBaseUrl = (raw) => {
  if (!raw) return 'http://localhost:5000/api/v1';
  const base = String(raw).replace(/\/+$/, '');
  if (base.endsWith('/api/v1')) return base;
  if (base.endsWith('/api')) return `${base}/v1`;
  if (base.includes('/api/v1')) return base;
  return `${base}/api/v1`;
};

const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL
);

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [prs, setPrs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState('checking'); // 'checking', 'not_logged_in', 'not_admin', 'authorized'
  const [accessError, setAccessError] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (!storedUser || !accessToken) {
      setAuthState('not_logged_in');
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'Admin') {
        setAuthState('not_admin');
        setAccessError(
          `Access Denied: You are logged in as "${parsedUser.role}". Only Administrators can access this panel.`
        );
        setUser(parsedUser);
        setLoading(false);
        return;
      }
      setUser(parsedUser);
      setAuthState('authorized');
    } catch (err) {
      setAuthState('not_logged_in');
      setLoading(false);
    }
  }, []);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // Handle admin login
  const handleAdminLogin = async () => {
    try {
      setLoginLoading(true);
      setAccessError('');

      // Clear any existing data before login
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');

      // Set intended role as admin
      localStorage.setItem('intended_role', 'admin');

      await signInWithGitHub('admin');
    } catch (err) {
      console.error('Login error:', err);
      setAccessError('Failed to sign in with GitHub. Please try again.');
      setLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      setAuthState('not_logged_in');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Fetch overview data
  const fetchOverview = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
          return;
        }
        throw new Error('Failed to fetch overview');
      }

      const data = await response.json();
      setOverview(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data?.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/projects?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.data?.projects || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch PRs
  const fetchPRs = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/prs?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch PRs');
      const data = await response.json();
      setPrs(data.data?.prs || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/contacts?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data.data?.contacts || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      if (authState !== 'authorized') return;
      setLoading(true);
      await fetchOverview();
      setLoading(false);
    };
    loadData();
  }, [authState]);

  // Load data based on active tab
  useEffect(() => {
    if (authState !== 'authorized') return;
    if (activeTab === 'users' && users.length === 0) fetchUsers();
    if (activeTab === 'projects' && projects.length === 0) fetchProjects();
    if (activeTab === 'prs' && prs.length === 0) fetchPRs();
    if (activeTab === 'contacts' && contacts.length === 0) fetchContacts();
  }, [activeTab, authState]);

  // Not logged in - show admin login
  if (authState === 'not_logged_in' || authState === 'checking') {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-[#0f162c] to-slate-950">
        <Starfield />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                <p className="text-gray-300">Administrator authentication required</p>
              </div>

              {accessError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{accessError}</p>
                </div>
              )}

              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-300 text-sm">
                  ⚠️ This area is restricted to <strong>Administrators only</strong>.
                </p>
              </div>

              <button
                onClick={handleAdminLogin}
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {loginLoading ? 'Authenticating...' : 'Login with GitHub'}
              </button>

              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not admin - show access denied
  if (authState === 'not_admin') {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-[#0f162c] to-slate-950">
        <Starfield />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
              </div>

              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm text-center">{accessError}</p>
              </div>

              {user && (
                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar_url}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium">{user.fullName}</p>
                      <p className="text-gray-400 text-sm">
                        Role: <span className="text-amber-400">{user.role}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout & Try Different Account
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 bg-stellar-cyan/20 hover:bg-stellar-cyan/30 text-stellar-cyan font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full text-gray-400 hover:text-white transition-colors py-2"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f162c] to-slate-950 flex items-center justify-center">
        <Starfield />
        <div className="text-white text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  // Authorized - show admin panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f162c] to-slate-950">
      <Starfield />

      <div className="relative z-10">
        {/* Admin Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                  <p className="text-gray-400 text-xs">Mission Control</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                    <img
                      src={user.avatar_url}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="hidden sm:block">
                      <p className="text-white text-sm font-medium">{user.fullName}</p>
                      <p className="text-gray-400 text-xs">@{user.github_username}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'import', label: 'Import Projects', icon: Upload },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'projects', label: 'Projects', icon: FolderGit2 },
              { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
              { id: 'contacts', label: 'Contacts', icon: Mail },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && overview && <OverviewSection data={overview} />}
          {activeTab === 'import' && <ImportSection getAuthToken={getAuthToken} onSuccess={fetchProjects} />}
          {activeTab === 'users' && <UsersSection users={users} onRefresh={fetchUsers} />}
          {activeTab === 'projects' && <ProjectsSection projects={projects} onRefresh={fetchProjects} />}
          {activeTab === 'prs' && <PRsSection prs={prs} onRefresh={fetchPRs} />}
          {activeTab === 'contacts' && <ContactsSection contacts={contacts} onRefresh={fetchContacts} />}
        </main>
      </div>
    </div>
  );
};

// Import Section Component - Drag & Drop CSV/Sheet Import
const ImportSection = ({ getAuthToken, onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [overwrite, setOverwrite] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvData(e.target.result);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvData.trim()) return;

    setImporting(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/import/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ csvData, overwrite }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({ success: true, data: data.data });
        if (onSuccess) onSuccess();
      } else {
        setResult({ success: false, error: data.message });
      }
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setImporting(false);
    }
  };

  const csvTemplate = `project_name,github_url,description,difficulty,mentor_github,tech_stack,tags
StreamVerse,https://github.com/Abhishekhack2909/StreamVerse,A streaming platform,Intermediate,Abhishekhack2909,"React,Node.js,MongoDB","web,fullstack"`;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Import Projects from CSV/Google Sheet
        </h3>
        <div className="text-gray-300 text-sm space-y-2">
          <p>Upload a CSV file or paste data from Google Sheets to bulk import projects.</p>
          <p className="text-gray-400">Required columns: <code className="bg-white/10 px-1 rounded">project_name</code>, <code className="bg-white/10 px-1 rounded">github_url</code></p>
          <p className="text-gray-400">Optional columns: <code className="bg-white/10 px-1 rounded">description</code>, <code className="bg-white/10 px-1 rounded">difficulty</code>, <code className="bg-white/10 px-1 rounded">mentor_github</code>, <code className="bg-white/10 px-1 rounded">tech_stack</code>, <code className="bg-white/10 px-1 rounded">tags</code></p>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-red-500 bg-red-500/10'
            : 'border-white/20 bg-white/5 hover:border-white/40'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-red-400' : 'text-gray-400'}`} />
        <p className="text-white font-medium mb-2">
          {isDragging ? 'Drop file here' : 'Drag & drop CSV file here'}
        </p>
        <p className="text-gray-400 text-sm mb-4">or</p>
        <label className="inline-block">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <span className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition-colors">
            Browse Files
          </span>
        </label>
      </div>

      {/* CSV Data Preview/Edit */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">CSV Data</h3>
          <button
            onClick={() => setCsvData(csvTemplate)}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Load Template
          </button>
        </div>
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder="Paste CSV data here or drag & drop a file above..."
          className="w-full h-48 bg-black/30 border border-white/10 rounded-lg p-4 text-white text-sm font-mono resize-none focus:outline-none focus:border-red-500"
        />
        
        {/* Options */}
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500"
            />
            Overwrite existing projects
          </label>
        </div>

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={!csvData.trim() || importing}
          className="mt-4 w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {importing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Import Projects
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`rounded-xl p-6 ${result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h4 className={`font-semibold ${result.success ? 'text-green-300' : 'text-red-300'}`}>
                {result.success ? 'Import Successful!' : 'Import Failed'}
              </h4>
              {result.success && result.data && (
                <div className="mt-2 text-sm text-gray-300 space-y-1">
                  <p>Total rows: {result.data.total}</p>
                  <p className="text-green-400">Created: {result.data.created}</p>
                  <p className="text-blue-400">Updated: {result.data.updated}</p>
                  <p className="text-yellow-400">Skipped: {result.data.skipped}</p>
                  {result.data.errors?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-400">Errors:</p>
                      <ul className="list-disc list-inside text-red-300 text-xs">
                        {result.data.errors.slice(0, 5).map((err, idx) => (
                          <li key={idx}>Row {err.row}: {err.error}</li>
                        ))}
                        {result.data.errors.length > 5 && (
                          <li>...and {result.data.errors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {!result.success && (
                <p className="mt-2 text-sm text-red-300">{result.error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Overview Section Component
const OverviewSection = ({ data }) => {
  const stats = [
    { label: 'Total Users', value: data.stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Contributors', value: data.stats?.activeContributors || 0, icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Projects', value: data.stats?.totalProjects || 0, icon: FolderGit2, color: 'from-purple-500 to-pink-500' },
    { label: 'Total PRs', value: data.stats?.totalPRs || 0, icon: GitPullRequest, color: 'from-orange-500 to-red-500' },
    { label: 'Merged PRs', value: data.stats?.mergedPRs || 0, icon: GitPullRequest, color: 'from-teal-500 to-cyan-500' },
    { label: 'Points Distributed', value: data.stats?.totalPointsDistributed || 0, icon: Award, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {data.alerts && (data.alerts.pendingPRs > 0 || data.alerts.inactiveProjects > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Alerts
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            {data.alerts.pendingPRs > 0 && <p>• {data.alerts.pendingPRs} pending PR(s) need review</p>}
            {data.alerts.inactiveProjects > 0 && <p>• {data.alerts.inactiveProjects} project(s) with no activity in 7 days</p>}
          </div>
        </div>
      )}

      {data.topContributors && data.topContributors.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Top 5 Contributors</h3>
          <div className="space-y-3">
            {data.topContributors.map((contributor, idx) => (
              <div key={contributor._id || idx} className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-500 w-8">{idx + 1}</span>
                <img src={contributor.avatar_url} alt={contributor.username} className="w-10 h-10 rounded-full border-2 border-red-500" />
                <div className="flex-1">
                  <p className="text-white font-medium">{contributor.fullName}</p>
                  <p className="text-gray-400 text-sm">@{contributor.username}</p>
                </div>
                <span className="text-red-400 font-bold">{contributor.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Users Section Component
const UsersSection = ({ users, onRefresh }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold">User Management</h3>
      <button onClick={onRefresh} className="text-red-400 hover:text-red-300 transition-colors">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="pb-3 text-gray-400 text-sm font-medium">User</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">Role</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">Points</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-white/5">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <img src={u.avatar_url} alt={u.username} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-white text-sm font-medium">{u.fullName}</p>
                    <p className="text-gray-400 text-xs">@{u.username}</p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  u.role === 'Admin' ? 'bg-red-500/20 text-red-300' :
                  u.role === 'Mentor' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>{u.role}</span>
              </td>
              <td className="py-3 text-white font-medium">{u.totalPoints || 0}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Projects Section Component
const ProjectsSection = ({ projects, onRefresh }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold">Projects Management</h3>
      <button onClick={onRefresh} className="text-red-400 hover:text-red-300 transition-colors">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="pb-3 text-gray-400 text-sm font-medium">Project</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">Difficulty</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">Mentor</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">PRs</th>
            <th className="pb-3 text-gray-400 text-sm font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id} className="border-b border-white/5">
              <td className="py-3">
                <p className="text-white text-sm font-medium">{p.name}</p>
                <a href={p.github_url || p.repoLink} target="_blank" rel="noopener noreferrer" className="text-red-400 text-xs hover:underline">
                  {p.github_url || p.repoLink}
                </a>
              </td>
              <td className="py-3">
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300">{p.difficulty || p.track}</span>
              </td>
              <td className="py-3 text-gray-300 text-sm">{p.mentor?.username || p.mentor?.github_username || 'Unassigned'}</td>
              <td className="py-3 text-white font-medium">{p.prCount || p.stats?.totalPRs || 0}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${p.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// PRs Section Component
const PRsSection = ({ prs, onRefresh }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold">Pull Requests</h3>
      <button onClick={onRefresh} className="text-red-400 hover:text-red-300 transition-colors">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
    {prs.length === 0 ? (
      <p className="text-gray-400 text-center py-8">No pull requests yet</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 text-gray-400 text-sm font-medium">PR</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Contributor</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Project</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {prs.map((pr) => (
              <tr key={pr._id} className="border-b border-white/5">
                <td className="py-3">
                  <a href={pr.prLink || pr.github_url} target="_blank" rel="noopener noreferrer" className="text-white text-sm font-medium hover:text-red-400">
                    #{pr.prNumber || pr.github_pr_number}
                  </a>
                  <p className="text-gray-400 text-xs truncate max-w-xs">{pr.title}</p>
                </td>
                <td className="py-3 text-gray-300 text-sm">@{pr.contributor?.username || pr.user?.github_username}</td>
                <td className="py-3 text-gray-300 text-sm">{pr.project?.name}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pr.status === 'merged' || pr.status === 'Merged' ? 'bg-green-500/20 text-green-300' :
                    pr.status === 'closed' || pr.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>{pr.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// Contacts Section Component
const ContactsSection = ({ contacts, onRefresh }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold">Contact Messages</h3>
      <button onClick={onRefresh} className="text-red-400 hover:text-red-300 transition-colors">
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
    {contacts.length === 0 ? (
      <p className="text-gray-400 text-center py-8">No contact messages yet</p>
    ) : (
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium">{contact.name}</p>
                <p className="text-red-400 text-sm">{contact.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                contact.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                contact.status === 'Read' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>{contact.status}</span>
            </div>
            <p className="text-gray-300 text-sm">{contact.message}</p>
            <p className="text-gray-500 text-xs mt-2">{new Date(contact.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Admin;
