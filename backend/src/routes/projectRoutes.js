import express from 'express';
import multer from 'multer';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { body, param, query } from 'express-validator';
import projectController from '../controllers/projectController.js';
import { uploadConfig } from '../utils/upload.js';

const router = express.Router();

// Configure multer for project image uploads
const projectImageUpload = multer(uploadConfig);

// ======================================
// Project CRUD Routes
// ======================================

// Get all projects with filters
router.get('/',
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
query('category').optional().isIn(['residential', 'commercial', 'renovation', 'maintenance', 'other']).withMessage('Valid category'),
query('status').optional().isIn(['active', 'completed', 'cancelled', 'expired']).withMessage('Valid status'),
query('location').optional().isString().withMessage('Valid location filter'),
query('minBudget').optional().isFloat({ min: 0 }).withMessage('Min budget must be positive'),
query('maxBudget').optional().isFloat({ min: 0 }).withMessage('Max budget must be positive'),
query('sortBy').optional().isIn(['created_at', 'end_date', 'budget_min', 'bids_count']).withMessage('Valid sort field'),
query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Valid sort order'),
query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters'),
validateRequest,
projectController.getProjects
);

// Get single project
router.get('/:id',
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.getProject
);

// Create new project (homeowners only)
router.post('/',
authenticateToken,
requireRole('homeowner'),
body('title').isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
body('description').isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
body('category').isIn(['residential', 'commercial', 'renovation', 'maintenance', 'other']).withMessage('Valid category is required'),
body('location').isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
body('budgetMin').optional().isFloat({ min: 0 }).withMessage('Min budget must be positive'),
body('budgetMax').optional().isFloat({ min: 0 }).withMessage('Max budget must be positive'),
body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
body('biddingDeadline').isISO8601().withMessage('Valid bidding deadline is required'),
body('requirements').optional().isArray().withMessage('Requirements must be an array'),
validateRequest,
projectController.createProject
);

// Update project (owner or admin)
router.put('/:id',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
body('title').optional().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
body('description').optional().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
body('category').optional().isIn(['residential', 'commercial', 'renovation', 'maintenance', 'other']).withMessage('Valid category'),
body('location').optional().isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
body('budgetMin').optional().isFloat({ min: 0 }).withMessage('Min budget must be positive'),
body('budgetMax').optional().isFloat({ min: 0 }).withMessage('Max budget must be positive'),
body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
body('biddingDeadline').optional().isISO8601().withMessage('Valid bidding deadline is required'),
body('requirements').optional().isArray().withMessage('Requirements must be an array'),
validateRequest,
projectController.updateProject
);

// Delete project (owner or admin)
router.delete('/:id',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.deleteProject
);

// ======================================
// Project Image Management
// ======================================

// Upload project images
router.post('/:id/images',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
projectImageUpload.array('images', 5), // Max 5 images
validateRequest,
projectController.uploadProjectImages
);

// Delete project image
router.delete('/:id/images/:imageId',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
param('imageId').isInt().withMessage('Valid image ID is required'),
validateRequest,
projectController.deleteProjectImage
);

// Set project cover image
router.put('/:id/cover-image/:imageId',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
param('imageId').isInt().withMessage('Valid image ID is required'),
validateRequest,
projectController.setCoverImage
);

// ======================================
// Project Status Management
// ======================================

// Update project status
router.patch('/:id/status',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
body('status').isIn(['active', 'completed', 'cancelled', 'expired']).withMessage('Valid status is required'),
body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters'),
validateRequest,
projectController.updateProjectStatus
);

// Activate project for bidding
router.patch('/:id/activate',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.activateProject
);

// Cancel project
router.patch('/:id/cancel',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
body('reason').notEmpty().withMessage('Cancellation reason is required'),
validateRequest,
projectController.cancelProject
);

// Extend project deadline
router.patch('/:id/extend-deadline',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
body('newDeadline').isISO8601().withMessage('Valid new deadline is required'),
validateRequest,
projectController.extendDeadline
);

// ======================================
// Project Bidding Routes
// ======================================

// Get project bids (with access control)
router.get('/:id/bids',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
query('sortBy').optional().isIn(['amount', 'timeline', 'created_at', 'rating']).withMessage('Valid sort field'),
query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Valid sort order'),
validateRequest,
projectController.getProjectBids
);

// Get project bidding statistics
router.get('/:id/bidding-stats',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.getBiddingStats
);

// Get contract for project
router.get('/:id/contract',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.getContract
);

// Sign contract (homeowner and selected contractor)
router.post('/:id/contract/sign',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
body('digitalSignature').notEmpty().withMessage('Digital signature is required'),
body('signatureData').optional().isObject().withMessage('Signature data must be an object'),
validateRequest,
projectController.signContract
);

// ======================================
// Project Files and Documents
// ======================================

// Upload project documents
router.post('/:id/documents',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
multer(uploadConfig).array('documents', 10), // Max 10 documents
validateRequest,
projectController.uploadProjectDocuments
);

// Delete project document
router.delete('/:id/documents/:documentId',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
param('documentId').isInt().withMessage('Valid document ID is required'),
validateRequest,
projectController.deleteProjectDocument
);

// Get project documents
router.get('/:id/documents',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.getProjectDocuments
);

// ======================================
// Project Progress and Updates
// ======================================

// Add project progress update
router.post('/:id/progress',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
body('milestone').notEmpty().withMessage('Milestone is required'),
body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
body('percentage').isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),
body('status').optional().isIn(['on_track', 'delayed', 'completed']).withMessage('Valid status'),
validateRequest,
projectController.addProgressUpdate
);

// Get project progress timeline
router.get('/:id/progress',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
validateRequest,
projectController.getProjectProgress
);

// Update project progress
router.patch('/:id/progress/:progressId',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
param('progressId').isInt().withMessage('Valid progress ID is required'),
body('milestone').optional().notEmpty().withMessage('Milestone cannot be empty'),
body('description').optional().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
body('percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),
body('status').optional().isIn(['on_track', 'delayed', 'completed']).withMessage('Valid status'),
validateRequest,
projectController.updateProgress
);

// Delete project progress
router.delete('/:id/progress/:progressId',
authenticateToken,
param('id').isInt().withMessage('Valid project ID is required'),
param('progressId').isInt().withMessage('Valid progress ID is required'),
validateRequest,
projectController.deleteProgress
);

// ======================================
// Project User Routes (Role-based)
// ======================================

// Get user's projects
router.get('/me/projects',
authenticateToken,
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
query('status').optional().isIn(['active', 'completed', 'cancelled', 'expired']).withMessage('Valid status'),
query('category').optional().isIn(['residential', 'commercial', 'renovation', 'maintenance', 'other']).withMessage('Valid category'),
validateRequest,
projectController.getUserProjects
);

// Get contractor's active projects
router.get('/me/assigned-projects',
authenticateToken,
requireRole('contractor'),
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
query('status').optional().isIn(['active', 'completed', 'cancelled']).withMessage('Valid status'),
validateRequest,
projectController.getAssignedProjects
);

// Get contractor's project invitations
router.get('/me/invitations',
authenticateToken,
requireRole('contractor'),
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
query('status').optional().isIn(['pending', 'accepted', 'declined']).withMessage('Valid status'),
validateRequest,
projectController.getProjectInvitations
);

// Accept/decline project invitation
router.post('/me/invitations/:invitationId/respond',
authenticateToken,
requireRole('contractor'),
param('invitationId').isInt().withMessage('Valid invitation ID is required'),
body('response').isIn(['accept', 'decline']).withMessage('Valid response is required'),
body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
validateRequest,
projectController.respondToInvitation
);

// ======================================
// Project Search and Discovery
// ======================================

// Search available projects (for contractors)
router.get('/search/available',
authenticateToken,
requireRole('contractor'),
query('q').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters'),
query('category').optional().isIn(['residential', 'commercial', 'renovation', 'maintenance', 'other']).withMessage('Valid category'),
query('location').optional().isString().withMessage('Valid location filter'),
query('minBudget').optional().isFloat({ min: 0 }).withMessage('Min budget must be positive'),
query('maxBudget').optional().isFloat({ min: 0 }).withMessage('Max budget must be positive'),
query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
query('sortBy').optional().isIn(['created_at', 'end_date', 'budget_min', 'bids_count']).withMessage('Valid sort field'),
query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Valid sort order'),
validateRequest,
projectController.searchAvailableProjects
);

// Get featured projects
router.get('/featured',
query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),
validateRequest,
projectController.getFeaturedProjects
);

// Get popular project categories
router.get('/categories/popular',
query('limit').optional().isInt({ min: 1, max: 10 }).withMessage('Limit must be between 1 and 10'),
validateRequest,
projectController.getPopularCategories
);

// ======================================
// Project Analytics (Admin)
// ======================================

// Get project analytics
router.get('/admin/analytics',
authenticateToken,
requireRole('admin'),
query('dateFrom').optional().isISO8601().withMessage('Valid from date is required'),
query('dateTo').optional().isISO8601().withMessage('Valid to date is required'),
query('groupBy').optional().isIn(['day', 'week', 'month']).withMessage('Valid groupBy parameter'),
validateRequest,
projectController.getProjectAnalytics
);

// Get project performance metrics
router.get('/admin/performance',
authenticateToken,
requireRole('admin'),
query('projectId').optional().isInt().withMessage('Valid project ID is required'),
query('contractorId').optional().isInt().withMessage('Valid contractor ID is required'),
validateRequest,
projectController.getProjectPerformance
);

export default router;