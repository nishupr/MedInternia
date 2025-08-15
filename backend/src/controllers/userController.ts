import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import UserBadge from '../models/UserBadge';
import Case from '../models/Case';
import { checkAndAwardAutoBadges } from './badgeController';

// Define CaseSummary type for recentCases
interface CaseSummary {
  _id: string;
  title: string;
  createdAt: Date;
  difficulty: string;
  specialization: string;
}

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('mentorDoctor', 'firstName lastName specialization');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's badges
    const badges = await UserBadge.find({ user: userId, isVisible: true })
      .populate('badge')
      .sort({ earnedAt: -1 })
      .limit(10);

    // Get user's recent cases (for doctors and patients)
    let recentCases: CaseSummary[] = [];
    if (user.userType === 'doctor' || user.userType === 'patient') {
      const cases = await Case.find({ doctor: userId })
        .select('title createdAt difficulty specialization')
        .sort({ createdAt: -1 })
        .limit(5);

      recentCases = cases.map((c: any) => ({
        _id: c._id.toString(),
        title: c.title,
        createdAt: c.createdAt,
        difficulty: c.difficulty,
        specialization: c.specialization
      }));
    }

    // Calculate profile completeness score
    const profileFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 
      'bio', 'profilePicture'
    ];
    
    const userTypeFields = {
      doctor: ['specialization', 'licenseNumber', 'experience', 'qualifications'],
      intern: ['medicalSchool', 'yearOfStudy', 'interests'],
      patient: ['medicalHistory', 'emergencyContact']
    };

    const allFields = [...profileFields, ...(userTypeFields[user.userType] || [])];
    const completedFields = allFields.filter(field => {
      const value = (user as any)[field];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });

    const profileScore = Math.round((completedFields.length / allFields.length) * 100);

    // Update profile score if changed
    if (user.profileScore !== profileScore) {
      await User.findByIdAndUpdate(userId, { profileScore });
    }

    res.json({
      success: true,
      data: {
        user: { ...user.toObject(), profileScore },
        badges,
        recentCases,
        stats: {
          casesAnalyzed: user.casesAnalyzed,
          upvotesReceived: user.upvotesReceived,
          averageRating: user.averageRating,
          points: user.points,
          streak: user.streak,
          certificatesEarned: user.certificatesEarned
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req.user!._id as any).toString();

    // Users can only update their own profile
    if (userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.email;
    delete updateData.userType;
    delete updateData.points;
    delete updateData.averageRating;
    delete updateData.isVerified;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get intern scorecard
export const getInternScorecard = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId, userType: 'intern' })
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found'
      });
    }

    // Get badges
    const badges = await UserBadge.find({ user: userId, isVisible: true })
      .populate('badge')
      .sort({ earnedAt: -1 });

    // Get case participation
    const casesParticipated = await Case.find({
      'comments.author': userId
    }).select('title createdAt difficulty specialization');

    // Calculate performance metrics
    const performanceMetrics = {
      totalPoints: user.points,
      casesAnalyzed: user.casesAnalyzed,
      upvotesReceived: user.upvotesReceived,
      peerReviewsGiven: user.peerReviewsGiven,
      peerReviewsReceived: user.peerReviewsReceived,
      averageRating: user.averageRating,
      currentStreak: user.streak,
      longestStreak: user.longestStreak,
      certificatesEarned: user.certificatesEarned,
      profileCompleteness: user.profileScore
    };

    // Calculate rank among all interns
    const totalInterns = await User.countDocuments({ userType: 'intern' });
    const higherRankedInterns = await User.countDocuments({
      userType: 'intern',
      points: { $gt: user.points }
    });
    const rank = higherRankedInterns + 1;

    res.json({
      success: true,
      data: {
        user,
        badges,
        casesParticipated,
        performanceMetrics,
        ranking: {
          current: rank,
          total: totalInterns,
          percentile: Math.round(((totalInterns - rank) / totalInterns) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Get intern scorecard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update streak
export const updateUserStreak = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user has activity today (comments, case posts, etc.)
    const todayActivity = await Case.findOne({
      $or: [
        { doctor: userId, createdAt: { $gte: today.setHours(0, 0, 0, 0) } },
        { 'comments.author': userId, 'comments.createdAt': { $gte: today.setHours(0, 0, 0, 0) } }
      ]
    });

    if (todayActivity) {
      user.streak += 1;
      if (user.streak > user.longestStreak) {
        user.longestStreak = user.streak;
      }
    } else {
      user.streak = 0;
    }

    await user.save();

    // Check for auto-badges
    await checkAndAwardAutoBadges(userId);
  } catch (error) {
    console.error('Update user streak error:', error);
  }
};

// Get user leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { userType = 'intern', metric = 'points', limit = 50 } = req.query;

    const validMetrics = ['points', 'casesAnalyzed', 'upvotesReceived', 'averageRating', 'streak'];
    const sortMetric = validMetrics.includes(metric as string) ? metric as string : 'points';

    const filter: any = { userType, isActive: true };
    const sort: any = {};
    sort[sortMetric] = -1;

    const leaderboard = await User.find(filter)
      .select('firstName lastName profilePicture points casesAnalyzed upvotesReceived averageRating streak medicalSchool specialization')
      .sort(sort)
      .limit(Number(limit));

    // Add rank to each user
    const leaderboardWithRanks = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard: leaderboardWithRanks,
        metric: sortMetric,
        total: leaderboardWithRanks.length
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify doctor (KYC process)
export const verifyDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { isVerified, verificationDocuments } = req.body;

    // Only admins or verified doctors can verify other doctors
    if (req.user!.userType !== 'doctor' || !req.user!.isVerifiedDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Only verified doctors can verify other doctors'
      });
    }

    const doctor = await User.findOneAndUpdate(
      { _id: userId, userType: 'doctor' },
      { 
        isVerifiedDoctor: isVerified,
        verificationDocuments: verificationDocuments || []
      },
      { new: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: `Doctor ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: { doctor }
    });
  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUsers = (req: Request, res: Response) => {
  // Sample data - replace with database queries
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  
  res.json({
    success: true,
    data: users
  });
};

export const createUser = (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  // Validate input
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }
  
  // Sample response - replace with database creation
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  
  res.status(201).json({
    success: true,
    data: newUser
  });
};
