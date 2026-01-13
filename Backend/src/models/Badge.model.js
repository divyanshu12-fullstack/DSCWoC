import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      required: true,
      default: '🏆',
    },
    color: {
      type: String,
      required: true,
      default: '#FFD700',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid hex color code'
      }
    },
    
    // Badge criteria
    criteria: {
      type: {
        type: String,
        enum: ['pr_count', 'merged_prs', 'points', 'streak', 'special'],
        required: true,
      },
      threshold: {
        type: Number,
        required: function() {
          return this.criteria.type !== 'special';
        },
      },
      description: {
        type: String,
        required: true,
      },
    },
    
    // Badge properties
    rarity: {
      type: String,
      enum: ['Common', 'Rare', 'Epic', 'Legendary'],
      default: 'Common',
    },
    points_reward: {
      type: Number,
      default: 0,
    },
    
    // Badge status
    isActive: {
      type: Boolean,
      default: true,
    },
    isAutoAwarded: {
      type: Boolean,
      default: true,
    },
    
    // Statistics
    stats: {
      totalAwarded: {
        type: Number,
        default: 0,
      },
      lastAwarded: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
badgeSchema.index({ 'criteria.type': 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1, isAutoAwarded: 1 });

// Instance method to check if user qualifies for this badge
badgeSchema.methods.checkUserQualification = async function(userId) {
  const User = mongoose.model('User');
  const PullRequest = mongoose.model('PullRequest');
  
  const user = await User.findById(userId);
  if (!user) return false;
  
  // Check if user already has this badge
  if (user.badges.includes(this._id)) return false;
  
  switch (this.criteria.type) {
    case 'pr_count':
      return user.stats.totalPRs >= this.criteria.threshold;
      
    case 'merged_prs':
      return user.stats.mergedPRs >= this.criteria.threshold;
      
    case 'points':
      return user.stats.points >= this.criteria.threshold;
      
    case 'streak':
      // Check for consecutive days with PRs (simplified)
      const recentPRs = await PullRequest.find({
        user: userId,
        'github_data.created_at': {
          $gte: new Date(Date.now() - (this.criteria.threshold * 24 * 60 * 60 * 1000))
        }
      }).sort({ 'github_data.created_at': -1 });
      
      return recentPRs.length >= this.criteria.threshold;
      
    case 'special':
      // Special badges are manually awarded
      return false;
      
    default:
      return false;
  }
};

// Instance method to award badge to user
badgeSchema.methods.awardToUser = async function(userId) {
  const User = mongoose.model('User');
  
  const user = await User.findById(userId);
  if (!user || user.badges.includes(this._id)) {
    return false;
  }
  
  // Add badge to user
  user.badges.push(this._id);
  
  // Add points reward
  if (this.points_reward > 0) {
    user.stats.bonusPoints = Math.max(0, (user.stats?.bonusPoints || 0) + this.points_reward);
    user.stats.points = Math.max(0, (user.stats?.prPoints || 0) + user.stats.bonusPoints);
  }
  
  await user.save();
  
  // Update badge statistics
  this.stats.totalAwarded += 1;
  this.stats.lastAwarded = new Date();
  await this.save();
  
  return true;
};

// Static method to check and award badges for a user
badgeSchema.statics.checkAndAwardBadges = async function(userId) {
  const badges = await this.find({ 
    isActive: true, 
    isAutoAwarded: true 
  });
  
  const awardedBadges = [];
  
  for (const badge of badges) {
    const qualifies = await badge.checkUserQualification(userId);
    if (qualifies) {
      const awarded = await badge.awardToUser(userId);
      if (awarded) {
        awardedBadges.push(badge);
      }
    }
  }
  
  return awardedBadges;
};

// Static method to initialize default badges
badgeSchema.statics.initializeDefaultBadges = async function() {
  const defaultBadges = [
    {
      name: 'First Steps',
      description: 'Created your first pull request',
      icon: '🚀',
      color: '#4CAF50',
      criteria: {
        type: 'pr_count',
        threshold: 1,
        description: 'Submit 1 pull request'
      },
      rarity: 'Common',
      points_reward: 5,
    },
    {
      name: 'Getting Started',
      description: 'Submitted 5 pull requests',
      icon: '⭐',
      color: '#2196F3',
      criteria: {
        type: 'pr_count',
        threshold: 5,
        description: 'Submit 5 pull requests'
      },
      rarity: 'Common',
      points_reward: 10,
    },
    {
      name: 'Contributor',
      description: 'Had your first pull request merged',
      icon: '✅',
      color: '#FF9800',
      criteria: {
        type: 'merged_prs',
        threshold: 1,
        description: 'Get 1 pull request merged'
      },
      rarity: 'Rare',
      points_reward: 15,
    },
    {
      name: 'Active Contributor',
      description: 'Had 5 pull requests merged',
      icon: '🔥',
      color: '#F44336',
      criteria: {
        type: 'merged_prs',
        threshold: 5,
        description: 'Get 5 pull requests merged'
      },
      rarity: 'Epic',
      points_reward: 25,
    },
    {
      name: 'Point Master',
      description: 'Earned 100 points',
      icon: '💎',
      color: '#9C27B0',
      criteria: {
        type: 'points',
        threshold: 100,
        description: 'Earn 100 points'
      },
      rarity: 'Epic',
      points_reward: 20,
    },
    {
      name: 'Legend',
      description: 'Earned 500 points',
      icon: '👑',
      color: '#FFD700',
      criteria: {
        type: 'points',
        threshold: 500,
        description: 'Earn 500 points'
      },
      rarity: 'Legendary',
      points_reward: 50,
    },
  ];
  
  for (const badgeData of defaultBadges) {
    await this.findOneAndUpdate(
      { name: badgeData.name },
      badgeData,
      { upsert: true, new: true }
    );
  }
  
  console.log('Default badges initialized successfully');
};

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;