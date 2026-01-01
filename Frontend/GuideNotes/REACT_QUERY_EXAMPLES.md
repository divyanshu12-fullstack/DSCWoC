/**
 * USAGE EXAMPLE: How to use React Query hooks in your components
 * 
 * Replace old fetch patterns with these hooks for automatic caching,
 * background refetching, and loading states.
 */

// ❌ OLD WAY (without caching):
/*
import { useEffect, useState } from 'react';

function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users/leaderboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data.users.map(user => ...)}</div>;
}
*/

// ✅ NEW WAY (with React Query caching):
/*
import { useLeaderboard } from '../hooks/useApi';

function Leaderboard() {
  const { data, isLoading, error, isPending } = useLeaderboard(1, 10);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Data is automatically cached for 5 minutes
  // Automatically refetched if data becomes stale
  // Deduplicates requests if same component mounts multiple times
  return <div>{data.users.map(user => ...)}</div>;
}
*/

// BENEFITS OF REACT QUERY:
// 1. Automatic caching - data fetched once is reused (5-15 min based on endpoint)
// 2. Background refetching - keep data fresh without showing loading state
// 3. Request deduplication - same query requested simultaneously only fetches once
// 4. Automatic retry - failed requests retry automatically (1 time by default)
// 5. Invalidation - easily invalidate cache when data changes (POST/PUT/DELETE)
// 6. Pagination - built-in support for page-based queries
// 7. Infinite queries - support for "load more" patterns

// EXAMPLES FOR EACH ENDPOINT:

import { useLeaderboard, useProjects, useProject, useUser, usePullRequests, useBadges } from '../hooks/useApi';

// 1. Leaderboard with pagination
export function LeaderboardExample() {
  const { data, isLoading, error } = useLeaderboard(1, 20); // page 1, 20 items
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <div>
      {data?.users?.map(user => (
        <div key={user.id}>{user.name} - {user.points}</div>
      ))}
    </div>
  );
}

// 2. All projects (cached for 10 minutes)
export function ProjectsListExample() {
  const { data, isLoading, error } = useProjects();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <div>
      {data?.projects?.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}

// 3. Single project details
export function ProjectDetailExample({ projectId }) {
  const { data, isLoading, error } = useProject(projectId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return <div>{data?.project?.description}</div>;
}

// 4. User profile
export function UserProfileExample({ userId }) {
  const { data, isLoading, error } = useUser(userId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return <div>{data?.user?.email}</div>;
}

// 5. Pull requests with pagination
export function PullRequestsExample() {
  const { data, isLoading, error } = usePullRequests(1, 15);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <div>
      {data?.pullRequests?.map(pr => (
        <div key={pr.id}>{pr.title}</div>
      ))}
    </div>
  );
}

// 6. Badges (rarely changes, cached for 15 minutes)
export function BadgesExample() {
  const { data, isLoading, error } = useBadges();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return (
    <div>
      {data?.badges?.map(badge => (
        <div key={badge.id}>{badge.name}</div>
      ))}
    </div>
  );
}

/**
 * CACHE STRATEGY BY ENDPOINT:
 * 
 * Leaderboard: 5 min stale, 10 min cache (frequently changes with new PRs)
 * Projects: 10 min stale, 15 min cache (changes less frequently)
 * Project Detail: 5 min stale, 10 min cache
 * User: 3 min stale, 5 min cache (user data changes frequently)
 * PRs: 5 min stale, 10 min cache
 * Badges: 15 min stale, 20 min cache (rarely changes)
 * 
 * Adjust staleTime and gcTime based on how often your data changes!
 */
