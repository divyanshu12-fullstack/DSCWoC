import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Starfield from '../components/Starfield';
import { 
  Users, 
  FolderGit2, 
  GitPullRequest, 
  TrendingUp, 
  Award,
  AlertCircle,
  Download,
  RefreshCw,
  Mail
} from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL?.replace(/\/?$/, '') + '/api/v1' ||
  'http://localhost:5000/api/v1';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'sameers0324@gmail.com';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS; // set in Frontend .env

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [prs, setPrs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [gateError, setGateError] = useState('');

  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (creds.email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setGateError('Invalid email');
      return;
    }
    if (!ADMIN_PASS) {
      setGateError('Admin password is not configured');
      return;
    }
    if (creds.password !== ADMIN_PASS) {
      setGateError('Invalid password');
      return;
    }
    setGateError('');
    setIsAuthorized(true);
  };

  // Get auth token
  const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return localStorage.getItem('supabase.auth.token') || user.access_token;
  };

  // Fetch overview data
  const fetchOverview = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
          navigate('/dashboard');
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data.users);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/projects?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.data.projects);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch PRs
  const fetchPRs = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/prs?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch PRs');
      const data = await response.json();
      setPrs(data.data.prs);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/contacts?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data.data.contacts);
    } catch (err) {
      setError(err.message);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchOverview();
      setLoading(false);
    };
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized]);

  // Load data based on active tab
  useEffect(() => {
    if (!isAuthorized) return;
    if (activeTab === 'users' && users.length === 0) fetchUsers();
    if (activeTab === 'projects' && projects.length === 0) fetchProjects();
    if (activeTab === 'prs' && prs.length === 0) fetchPRs();
    if (activeTab === 'contacts' && contacts.length === 0) fetchContacts();
  }, [activeTab, isAuthorized]);

  // Gate screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f162c] to-slate-950 flex items-center justify-center px-4">
        <Starfield />
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-cosmic-purple" />
            <div>
              <p className="text-sm text-gray-400">Restricted Access</p>
              <h1 className="text-xl font-semibold text-white">Admin Authentication</h1>
            </div>
          </div>
          <form onSubmit={handleGateSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cosmic-purple"
                placeholder="admin email"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Password</label>
              <input
                type="password"
                value={creds.password}
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cosmic-purple"
                placeholder="admin password"
                required
              />
            </div>
            {gateError && (
              <div className="text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {gateError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white font-medium py-2.5 rounded-lg hover:from-cosmic-purple/90 hover:to-nebula-pink/90 transition"
            >
              Enter Mission Control
            </button>
          </form>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f162c] to-slate-950">
      <Starfield />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🛰️ Admin Mission Control</h1>
            <p className="text-gray-400 text-sm">Super Admin Dashboard · Full Authority</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
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
                    ? 'bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          {activeTab === 'overview' && overview && (
            <OverviewSection data={overview} />
          )}

          {activeTab === 'users' && (
            <UsersSection users={users} onRefresh={fetchUsers} />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection projects={projects} onRefresh={fetchProjects} />
          )}

          {activeTab === 'prs' && (
            <PRsSection prs={prs} onRefresh={fetchPRs} />
          )}

          {activeTab === 'contacts' && (
            <ContactsSection contacts={contacts} onRefresh={fetchContacts} />
          )}
        </main>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection = ({ data }) => {
  const stats = [
    { label: 'Total Users', value: data.stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Contributors', value: data.stats.activeContributors, icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Projects', value: data.stats.totalProjects, icon: FolderGit2, color: 'from-purple-500 to-pink-500' },
    { label: 'Total PRs', value: data.stats.totalPRs, icon: GitPullRequest, color: 'from-orange-500 to-red-500' },
    { label: 'Merged PRs', value: data.stats.mergedPRs, icon: GitPullRequest, color: 'from-teal-500 to-cyan-500' },
    { label: 'Points Distributed', value: data.stats.totalPointsDistributed, icon: Award, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
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

      {/* Alerts */}
      {(data.alerts.pendingPRs > 0 || data.alerts.inactiveProjects > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Alerts
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            {data.alerts.pendingPRs > 0 && (
              <p>• {data.alerts.pendingPRs} pending PR(s) need review</p>
            )}
            {data.alerts.inactiveProjects > 0 && (
              <p>• {data.alerts.inactiveProjects} project(s) with no activity in 7 days</p>
            )}
          </div>
        </div>
      )}

      {/* Top Contributors */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Top 5 Contributors</h3>
        <div className="space-y-3">
          {data.topContributors.map((user, idx) => (
            <div key={user._id} className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-500 w-8">{idx + 1}</span>
              <img 
                src={user.avatar_url} 
                alt={user.username} 
                className="w-10 h-10 rounded-full border-2 border-cosmic-purple"
              />
              <div className="flex-1">
                <p className="text-white font-medium">{user.fullName}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
              <span className="text-cosmic-purple font-bold">{user.totalPoints} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Users Section Component
const UsersSection = ({ users, onRefresh }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">User Management</h3>
        <button 
          onClick={onRefresh}
          className="text-cosmic-purple hover:text-nebula-pink transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 text-gray-400 text-sm font-medium">User</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Role</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Track</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Points</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/5">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white text-sm font-medium">{user.fullName}</p>
                      <p className="text-gray-400 text-xs">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-red-500/20 text-red-300' :
                    user.role === 'Mentor' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 text-gray-300 text-sm">{user.track || 'N/A'}</td>
                <td className="py-3 text-white font-medium">{user.totalPoints}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Projects Section Component
const ProjectsSection = ({ projects, onRefresh }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Projects Management</h3>
        <button 
          onClick={onRefresh}
          className="text-cosmic-purple hover:text-nebula-pink transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 text-gray-400 text-sm font-medium">Project</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Track</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Mentor</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">PRs</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b border-white/5">
                <td className="py-3">
                  <p className="text-white text-sm font-medium">{project.name}</p>
                  <a 
                    href={project.repoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cosmic-purple text-xs hover:underline"
                  >
                    {project.repoLink}
                  </a>
                </td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300">
                    {project.track}
                  </span>
                </td>
                <td className="py-3 text-gray-300 text-sm">
                  {project.mentor?.username || 'Unassigned'}
                </td>
                <td className="py-3 text-white font-medium">{project.prCount || 0}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PRs Section Component
const PRsSection = ({ prs, onRefresh }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Pull Requests</h3>
        <button 
          onClick={onRefresh}
          className="text-cosmic-purple hover:text-nebula-pink transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 text-gray-400 text-sm font-medium">PR</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Contributor</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Project</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Points</th>
              <th className="pb-3 text-gray-400 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {prs.map((pr) => (
              <tr key={pr._id} className="border-b border-white/5">
                <td className="py-3">
                  <a 
                    href={pr.prLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-sm font-medium hover:text-cosmic-purple"
                  >
                    #{pr.prNumber}
                  </a>
                  <p className="text-gray-400 text-xs truncate max-w-xs">{pr.title}</p>
                </td>
                <td className="py-3 text-gray-300 text-sm">
                  @{pr.contributor?.username}
                </td>
                <td className="py-3 text-gray-300 text-sm">
                  {pr.project?.name}
                </td>
                <td className="py-3 text-white font-medium">{pr.pointsAwarded || 0}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pr.status === 'Merged' ? 'bg-green-500/20 text-green-300' :
                    pr.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {pr.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Contacts Section Component
const ContactsSection = ({ contacts, onRefresh }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Contact Messages</h3>
        <button 
          onClick={onRefresh}
          className="text-cosmic-purple hover:text-nebula-pink transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No contact messages yet</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{contact.name}</p>
                  <p className="text-cosmic-purple text-sm">{contact.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  contact.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                  contact.status === 'Read' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {contact.status}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{contact.message}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(contact.createdAt).toLocaleDateString()} {new Date(contact.createdAt).toLocaleTimeString()}</span>
                {contact.respondedBy && (
                  <span>Responded by @{contact.respondedBy.username}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
