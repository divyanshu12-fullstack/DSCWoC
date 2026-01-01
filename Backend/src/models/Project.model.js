import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // GitHub repository information
    github_url: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+$/.test(v);
        },
        message: 'Invalid GitHub repository URL',
      },
    },
    github_owner: {
      type: String,
      required: true,
    },
    github_repo: {
      type: String,
      required: true,
    },

    // Project details
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    tech_stack: [
      {
        type: String,
        trim: true,
      },
    ],

    // Project maintainer/mentor
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Project statistics
    stats: {
      totalPRs: {
        type: Number,
        default: 0,
      },
      mergedPRs: {
        type: Number,
        default: 0,
      },
      contributors: {
        type: Number,
        default: 0,
      },
      stars: {
        type: Number,
        default: 0,
      },
      forks: {
        type: Number,
        default: 0,
      },
    },

    // Project status
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    // Sync information
    lastSyncAt: {
      type: Date,
      default: Date.now,
    },
    syncEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
projectSchema.index({ github_owner: 1, github_repo: 1 }, { unique: true });
projectSchema.index({ mentor: 1 });
projectSchema.index({ difficulty: 1 });
projectSchema.index({ isActive: 1, isApproved: 1 });
projectSchema.index({ tags: 1 });

// Virtual for pull requests
projectSchema.virtual('pullRequests', {
  ref: 'PullRequest',
  localField: '_id',
  foreignField: 'project',
});

// Virtual for full GitHub URL
projectSchema.virtual('fullGithubUrl').get(function () {
  return `https://github.com/${this.github_owner}/${this.github_repo}`;
});

// Instance method to update project statistics
projectSchema.methods.updateStats = async function () {
  const PullRequest = mongoose.model('PullRequest');

  const prs = await PullRequest.find({ project: this._id });
  const mergedPRs = prs.filter((pr) => pr.status === 'merged');
  const uniqueContributors = [...new Set(prs.map((pr) => pr.user.toString()))];

  this.stats.totalPRs = prs.length;
  this.stats.mergedPRs = mergedPRs.length;
  this.stats.contributors = uniqueContributors.length;

  await this.save();
  return this.stats;
};

// Static method to parse GitHub URL
projectSchema.statics.parseGithubUrl = function (url) {
  const match = url.match(/^https:\/\/github\.com\/([\w\-\.]+)\/([\w\-\.]+)$/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  return {
    owner: match[1],
    repo: match[2],
  };
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
