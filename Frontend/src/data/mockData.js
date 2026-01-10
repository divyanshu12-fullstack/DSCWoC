
// Current user data
export const currentUser = {
  id: "user-001", //
  name: "Alex Chen", //
  githubUsername: "alexcodes", //
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", //
  college: "MIT", //
  role: "contributor", //
  totalPRs: 24, //
  mergedPRs: 18, //
  totalPoints: 2450, //
};

// User's joined projects
export const userProjects = [
  {
    id: "proj-001",
    name: "quantum-ui",
    description: "A modern React component library with cosmic themes",
    owner: "winterofcode",
    language: "TypeScript",
    stars: 1234,
    openIssues: 45,
    tags: ["react", "ui", "components"],
  },
  {
    id: "proj-002",
    name: "stellar-api",
    description: "High-performance REST API framework for Node.js",
    owner: "winterofcode",
    language: "JavaScript",
    stars: 892,
    openIssues: 23,
    tags: ["api", "nodejs", "backend"],
  },
  {
    id: "proj-003",
    name: "nebula-ml",
    description: "Machine learning toolkit for space data analysis",
    owner: "winterofcode",
    language: "Python",
    stars: 2103,
    openIssues: 67,
    tags: ["ml", "python", "data-science"],
  },
];

// User's pull requests
export const userPullRequests = [
  {
    id: "pr-001",
    title: "feat: Add dark mode toggle component",
    repository: "quantum-ui",
    owner: "winterofcode",
    status: "merged",
    createdAt: "2024-01-15T10:30:00Z",
    points: 150,
  },
  {
    id: "pr-002",
    title: "fix: Resolve button hover state issue",
    repository: "quantum-ui",
    owner: "winterofcode",
    status: "merged",
    createdAt: "2024-01-18T14:20:00Z",
    points: 75,
  },
  {
    id: "pr-003",
    title: "docs: Update API documentation",
    repository: "stellar-api",
    owner: "winterofcode",
    status: "open",
    createdAt: "2024-01-20T09:15:00Z",
    points: 50,
  },
  {
    id: "pr-004",
    title: "feat: Implement rate limiting middleware",
    repository: "stellar-api",
    owner: "winterofcode",
    status: "merged",
    createdAt: "2024-01-22T16:45:00Z",
    points: 200,
  },
  {
    id: "pr-005",
    title: "refactor: Optimize model training pipeline",
    repository: "nebula-ml",
    owner: "winterofcode",
    status: "rejected",
    createdAt: "2024-01-25T11:00:00Z",
    points: 0,
  },
  {
    id: "pr-006",
    title: "feat: Add neural network visualization",
    repository: "nebula-ml",
    owner: "winterofcode",
    status: "open",
    createdAt: "2024-01-28T08:30:00Z",
    points: 175,
  },
];

// User's badges
export const userBadges = [
  {
    id: "badge-001",
    name: "First Commit",
    description: "Made your first contribution to Winter of Code",
    icon: "🚀",
    earnedAt: "2024-01-10T00:00:00Z",
    rarity: "common",
  },
  {
    id: "badge-002",
    name: "Bug Squasher",
    description: "Fixed 5 bugs across projects",
    icon: "🐛",
    earnedAt: "2024-01-15T00:00:00Z",
    rarity: "rare",
  },
  {
    id: "badge-003",
    name: "Code Ninja",
    description: "Merged 10 pull requests",
    icon: "🥷",
    earnedAt: "2024-01-20T00:00:00Z",
    rarity: "epic",
  },
  {
    id: "badge-004",
    name: "Stellar Contributor",
    description: "Earned 2000+ points",
    icon: "⭐",
    earnedAt: "2024-01-25T00:00:00Z",
    rarity: "legendary",
  },
];

// Leaderboard data
export const leaderboard = [
  { rank: 1, userId: "user-100", name: "Sarah Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", points: 4520, prCount: 42 },
  { rank: 2, userId: "user-101", name: "Mike Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", points: 3890, prCount: 38 },
  { rank: 3, userId: "user-102", name: "Emily Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", points: 3450, prCount: 35 },
  { rank: 4, userId: "user-103", name: "James Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", points: 2980, prCount: 29 },
  { rank: 5, userId: "user-001", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", points: 2450, prCount: 24 },
  { rank: 6, userId: "user-104", name: "Lisa Anderson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", points: 2120, prCount: 21 },
  { rank: 7, userId: "user-105", name: "David Martinez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", points: 1890, prCount: 18 },
  { rank: 8, userId: "user-106", name: "Jennifer Taylor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer", points: 1650, prCount: 16 },
  { rank: 9, userId: "user-107", name: "Chris Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris", points: 1420, prCount: 14 },
  { rank: 10, userId: "user-108", name: "Amanda Thomas", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda", points: 1200, prCount: 12 },
];

// Event dates
export const eventDates = {
  start: new Date("2026-01-12T00:00:00Z"),
  end: new Date("2026-02-12T23:59:59Z"),
};
  
// Helper to get user rank from leaderboard
export const getUserRank = (userId) => {
  const entry = leaderboard.find((e) => e.userId === userId);
  return entry?.rank ?? 0;
};
