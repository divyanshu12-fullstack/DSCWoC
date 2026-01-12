import mongoose from 'mongoose';

const pullRequestSchema = new mongoose.Schema(
  {
    // GitHub PR information
    github_pr_id: {
      type: Number,
      required: true,
    },
    github_pr_number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    github_url: {
      type: String,
      required: true,
    },
    
    // Relationships
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    
    // PR Status
    status: {
      type: String,
      enum: ['open', 'closed', 'merged', 'draft'],
      required: true,
    },
    
    // Validation by mentors
    validation: {
      isValidated: {
        type: Boolean,
        default: false,
      },
      validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      validatedAt: {
        type: Date,
      },
      validationStatus: {
        type: String,
        enum: ['approved', 'rejected', 'needs_changes'],
      },
      validationNotes: {
        type: String,
        maxlength: 500,
      },
    },
    
    // Points and scoring
    points: {
      type: Number,
      default: 0,
    },
    // Optional manual override for points (e.g., mentor/admin adjustments)
    pointsOverride: {
      type: Number,
    },
    pointsCalculatedAt: {
      type: Date,
    },
    
    // GitHub metadata
    github_data: {
      created_at: {
        type: Date,
        required: true,
      },
      updated_at: {
        type: Date,
        required: true,
      },
      merged_at: {
        type: Date,
      },
      closed_at: {
        type: Date,
      },
      additions: {
        type: Number,
        default: 0,
      },
      deletions: {
        type: Number,
        default: 0,
      },
      changed_files: {
        type: Number,
        default: 0,
      },
      commits: {
        type: Number,
        default: 0,
      },
    },
    
    // Submission tracking
    submissionType: {
      type: String,
      enum: ['auto_sync', 'manual_submit'],
      default: 'auto_sync',
    },
    
    // Sync information
    lastSyncAt: {
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

// Compound indexes for uniqueness and performance
pullRequestSchema.index({ 
  github_pr_id: 1, 
  project: 1 
}, { unique: true });

pullRequestSchema.index({ user: 1, status: 1 });
pullRequestSchema.index({ project: 1, status: 1 });
pullRequestSchema.index({ 'validation.isValidated': 1 });
pullRequestSchema.index({ status: 1, 'github_data.merged_at': -1 });

// Instance method to calculate points based on PR complexity
pullRequestSchema.methods.calculatePoints = function() {
  if (typeof this.pointsOverride === 'number' && Number.isFinite(this.pointsOverride) && this.pointsOverride >= 0) {
    this.points = this.pointsOverride;
    this.pointsCalculatedAt = new Date();
    return this.points;
  }

  // Event logic: award points only after a PR is merged AND approved by validation.
  // This prevents inflating scores from open/closed/unvalidated PRs.
  const validation = this.validation || {};
  const isApproved = validation.isValidated && validation.validationStatus === 'approved';

  if (this.status !== 'merged' || !isApproved) {
    this.points = 0;
    this.pointsCalculatedAt = new Date();
    return this.points;
  }

  let points = 10; // base points for merged + approved

  // Bonus points for code complexity
  const githubData = this.github_data || {};
  const additions = githubData.additions || 0;
  const deletions = githubData.deletions || 0;
  const changedFiles = githubData.changed_files || 0;
  const totalChanges = additions + deletions;

  if (totalChanges > 100) points += 3;
  if (totalChanges > 500) points += 5;
  if (changedFiles > 5) points += 2;

  // Validation bonus (approved already)
  points += 5;
  
  this.points = points;
  this.pointsCalculatedAt = new Date();
  
  return points;
};

// Static method to sync PR from GitHub API data
pullRequestSchema.statics.syncFromGitHub = async function(githubPR, userId, projectId) {
  const existingPR = await this.findOne({
    github_pr_id: githubPR.id,
    project: projectId
  });
  
  const prData = {
    github_pr_id: githubPR.id,
    github_pr_number: githubPR.number,
    title: githubPR.title,
    description: githubPR.body || '',
    github_url: githubPR.html_url,
    user: userId,
    project: projectId,
    status: githubPR.merged_at ? 'merged' : githubPR.state,
    github_data: {
      created_at: new Date(githubPR.created_at),
      updated_at: new Date(githubPR.updated_at),
      merged_at: githubPR.merged_at ? new Date(githubPR.merged_at) : null,
      closed_at: githubPR.closed_at ? new Date(githubPR.closed_at) : null,
      additions: githubPR.additions || 0,
      deletions: githubPR.deletions || 0,
      changed_files: githubPR.changed_files || 0,
      commits: githubPR.commits || 0,
    },
    lastSyncAt: new Date(),
  };
  
  if (existingPR) {
    Object.assign(existingPR, prData);
    existingPR.calculatePoints();
    await existingPR.save();
    return existingPR;
  } else {
    const newPR = new this(prData);
    newPR.calculatePoints();
    await newPR.save();
    return newPR;
  }
};

const PullRequest = mongoose.model('PullRequest', pullRequestSchema);

export default PullRequest;