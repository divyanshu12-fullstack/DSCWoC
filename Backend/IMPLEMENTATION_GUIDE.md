# Quick Implementation Guide

## 🚦 Getting Started - Step by Step

### Phase 1: Setup & Database Connection (15 minutes)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other credentials
   ```

3. **Test Server**
   ```bash
   npm run dev
   # Server should start on http://localhost:5000
   # Visit http://localhost:5000/health to verify
   ```

### Phase 2: Implement Authentication (1-2 hours)

**File: `src/middleware/auth.js`**

Priority functions to implement:
1. `authenticate` - Verify Supabase JWT and fetch user
2. `authorize` - Check user roles
3. `optionalAuth` - Optional authentication for public endpoints

**Testing:**
- Use Postman/Thunder Client to test protected endpoints
- Include `Authorization: Bearer <token>` header

### Phase 3: Implement Controllers (4-6 hours)

Start with these endpoints in order:

#### 3.1 User Controller (Start here)
**File: `src/controllers/user.controller.js`**

1. `getUsers` - List users with pagination
   ```javascript
   // Get query params: page, limit, role, search
   // Use User.find() with filters
   // Return paginated response
   ```

2. `getUser` - Get single user
   ```javascript
   // Find by req.params.id
   // Populate badges
   // Return user data
   ```

3. `getMe` - Current user profile
   ```javascript
   // req.user is already attached by auth middleware
   // Just return req.user with populated data
   ```

#### 3.2 Project Controller
**File: `src/controllers/project.controller.js`**

1. `getProjects` - List projects
2. `getProject` - Single project details
3. `createProject` - Create new project (requires GitHub API)

#### 3.3 Badge Controller (Simpler, good for practice)
**File: `src/controllers/badge.controller.js`**

1. `getBadges` - List all badges
2. `initializeBadges` - Create default badges

#### 3.4 Pull Request Controller (Complex, do last)
**File: `src/controllers/pullRequest.controller.js`**

1. `getPullRequests` - List PRs
2. `syncPullRequests` - Sync from GitHub (requires GitHub service)

### Phase 4: Implement GitHub Service (2-3 hours)

**File: `src/services/github.service.js`**

Essential methods:
1. `getRepository(owner, repo)` - GET /repos/:owner/:repo
2. `getPullRequests(owner, repo)` - GET /repos/:owner/:repo/pulls
3. `parseRepoUrl(url)` - Extract owner/repo from GitHub URL

**Example:**
```javascript
async getRepository(owner, repo) {
  try {
    const response = await this.client.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching repo: ${error.message}`);
    throw error;
  }
}
```

### Phase 5: Add Model Methods (1-2 hours)

#### User Model
**File: `src/models/User.model.js`**

Add after schema definition:
```javascript
// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.points': -1 });

// Virtual for pull requests
userSchema.virtual('pullRequests', {
  ref: 'PullRequest',
  localField: '_id',
  foreignField: 'user',
});

// Instance method to update stats
userSchema.methods.updateStats = async function() {
  const PullRequest = mongoose.model('PullRequest');
  const prs = await PullRequest.find({ user: this._id });
  
  this.stats.totalPRs = prs.length;
  this.stats.mergedPRs = prs.filter(pr => pr.status === 'merged').length;
  this.stats.points = this.stats.mergedPRs * 10 + this.stats.totalPRs * 5;
  
  await this.save();
};
```

#### Badge Model
Add qualification check method:
```javascript
badgeSchema.methods.checkUserQualification = async function(userId) {
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  
  // Check based on badge type
  // Return true/false
};
```

### Phase 6: Complete Validations (30 minutes)

**File: `src/validations/user.validation.js`**
```javascript
export const updateUserValidation = [
  body('fullName').optional().trim().notEmpty(),
  body('bio').optional().isLength({ max: 500 }),
  body('college').optional().trim(),
  body('yearOfStudy').optional().isInt({ min: 1, max: 5 }),
];
```

Then import and use in routes:
```javascript
router.put('/:id', authenticate, validate(updateUserValidation), userController.updateUser);
```

## 🎯 Recommended Implementation Order

1. ✅ **Setup** (Done - just configure .env)
2. 🔐 **Authentication Middleware** (Critical - blocks all protected routes)
3. 👤 **User Controller** (Start simple, test authentication)
4. 🎖️ **Badge Controller** (Simple CRUD, good practice)
5. 📦 **Project Controller** (Moderate complexity)
6. 🔄 **GitHub Service** (Needed for PR sync)
7. 📝 **Pull Request Controller** (Complex, uses GitHub service)
8. ✨ **Model Methods** (Enhance functionality)
9. ✅ **Validations** (Improve data quality)
10. 🧪 **Testing** (Verify everything works)

## 🐛 Testing Tips

### Test each endpoint as you build:

**GET endpoints (No auth needed):**
```bash
curl http://localhost:5000/api/v1/users
curl http://localhost:5000/api/v1/projects
curl http://localhost:5000/api/v1/badges
```

**Protected endpoints:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/v1/users/me
```

**POST/PUT endpoints:**
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Test Project"}' \
     http://localhost:5000/api/v1/projects
```

## 📚 Helpful Code Snippets

### Pagination Helper
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const items = await Model.find(query).skip(skip).limit(limit);
const total = await Model.countDocuments(query);

return paginatedResponse(res, items, page, limit, total, 'Success');
```

### Search/Filter Pattern
```javascript
const query = {};

if (req.query.role) {
  query.role = req.query.role;
}

if (req.query.search) {
  query.$or = [
    { name: { $regex: req.query.search, $options: 'i' } },
    { description: { $regex: req.query.search, $options: 'i' } },
  ];
}
```

### Error Handling
```javascript
const item = await Model.findById(req.params.id);

if (!item) {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    status: 'error',
    message: ERROR_MESSAGES.NOT_FOUND,
  });
}
```

## 🎓 Learning Resources

- **Mongoose Queries**: https://mongoosejs.com/docs/queries.html
- **Express Middleware**: https://expressjs.com/en/guide/using-middleware.html
- **GitHub API**: https://docs.github.com/en/rest
- **Supabase Auth**: https://supabase.com/docs/guides/auth

## 💡 Pro Tips

1. **Start Small**: Implement one function at a time and test it
2. **Use Postman**: Save your requests for quick testing
3. **Check Logs**: Use the logger to debug issues
4. **Read Errors**: Error messages tell you exactly what's wrong
5. **Git Commits**: Commit after each working feature

## 🆘 Common Issues

**Issue: MongoDB connection fails**
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Check network connectivity

**Issue: Authentication always fails**
- Verify Supabase credentials in .env
- Check token format (must be "Bearer <token>")
- Ensure user exists in database

**Issue: GitHub API rate limit**
- Add GitHub token to .env
- Token needs repo:read permissions
- Check rate limit: https://api.github.com/rate_limit

## ✅ Checklist

- [ ] Environment configured (.env file)
- [ ] Server starts without errors
- [ ] MongoDB connected successfully
- [ ] Health endpoint responds
- [ ] Authentication middleware implemented
- [ ] At least 3 GET endpoints working
- [ ] At least 1 POST endpoint working
- [ ] GitHub service can fetch repositories
- [ ] User stats update correctly
- [ ] Badge system working

Good luck with your implementation! 🚀
