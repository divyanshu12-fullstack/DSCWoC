import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch leaderboard data with caching and filter support
 * @param {number} page - Page number for pagination (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {string} filter - Filter type: 'overall' or 'weekly' (default: 'overall')
 * @returns {Object} React Query result with leaderboard data
 * Cache: 5 minutes (300000ms)
 */
export const useLeaderboard = (page = 1, limit = 10, filter = 'overall') => {
  return useQuery({
    queryKey: ['leaderboard', page, limit, filter],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/users/leaderboard?page=${page}&limit=${limit}&filter=${filter}`
      );
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch all projects with caching and filters
 * Cache: 10 minutes
 */
export const useProjects = (filters = {}) => {
  const { page = 1, limit = 12, difficulty, tags, tech, search, sortBy, order } = filters;
  
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (difficulty) params.append('difficulty', difficulty);
      if (tags) params.append('tags', tags);
      if (tech) params.append('tech', tech);
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);

      const response = await fetch(`${API_BASE_URL}/projects?${params}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Fetch featured projects
 */
export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/projects/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured projects');
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * Fetch project filters (tags, tech stacks)
 */
export const useProjectFilters = () => {
  return useQuery({
    queryKey: ['projects', 'filters'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/projects/filters`);
      if (!response.ok) throw new Error('Failed to fetch filters');
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 min - filters don't change often
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Fetch single project details
 */
export const useProject = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      return response.json();
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch current user's projects (for mentors)
 */
export const useMyProjects = () => {
  return useQuery({
    queryKey: ['projects', 'my-projects'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/projects/my-projects`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch your projects');
      return response.json();
    },
    enabled: !!localStorage.getItem('access_token'), // Only fetch if logged in
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create a new project
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData) => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(projectData),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to create project');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

/**
 * Update a project
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, data }) => {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update project');
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};

/**
 * Sync project with GitHub
 */
export const useSyncProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId) => {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to sync project');
      return result;
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
};

/**
 * Fetch user data
 */
export const useUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch pull requests
 */
export const usePullRequests = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['pullRequests', page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/pull-requests?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to fetch pull requests');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Fetch badges
 */
export const useBadges = () => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/badges`);
      if (!response.ok) throw new Error('Failed to fetch badges');
      return response.json();
    },
    staleTime: 15 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
};

/**
 * Submit contact form
 */
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to send message');
      }
      return result;
    },
  });
};
