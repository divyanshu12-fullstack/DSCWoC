import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // GitHub OAuth data
    github_id: {
      type: String,
      required: true,
      unique: true,
    },
    github_username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar_url: {
      type: String,
      default: '',
    },
    
    // Profile information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    yearOfStudy: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    // Role-based access control
    role: {
      type: String,
      enum: ['Contributor', 'Mentor', 'Admin'],
      default: 'Contributor',
    },
    
    // Statistics
    stats: {
      totalPRs: {
        type: Number,
        default: 0,
      },
      mergedPRs: {
        type: Number,
        default: 0,
      },
      points: {
        type: Number,
        default: 0,
      },
      rank: {
        type: Number,
        default: 0,
      },
    },
    
    // Badges earned
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge',
    }],
    
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance (only for non-unique fields)
userSchema.index({ 'stats.points': -1 });
userSchema.index({ role: 1 });

// Virtual for pull requests
userSchema.virtual('pullRequests', {
  ref: 'PullRequest',
  localField: '_id',
  foreignField: 'user',
});

// Instance method to update user statistics
userSchema.methods.updateStats = async function() {
  const PullRequest = mongoose.model('PullRequest');
  
  const prs = await PullRequest.find({ user: this._id });
  const mergedPRs = prs.filter(pr => pr.status === 'merged');
  
  this.stats.totalPRs = prs.length;
  this.stats.mergedPRs = mergedPRs.length;
  
  // Points calculation: 10 points per merged PR, 5 points per open PR
  this.stats.points = (mergedPRs.length * 10) + (prs.length * 5);
  
  await this.save();
  return this.stats;
};

// Static method to update leaderboard ranks
userSchema.statics.updateRanks = async function() {
  const users = await this.find({ isActive: true })
    .sort({ 'stats.points': -1 })
    .select('_id stats.points');
  
  const bulkOps = users.map((user, index) => ({
    updateOne: {
      filter: { _id: user._id },
      update: { 'stats.rank': index + 1 }
    }
  }));
  
  if (bulkOps.length > 0) {
    await this.bulkWrite(bulkOps);
  }
};

const User = mongoose.model('User', userSchema);

export default User;