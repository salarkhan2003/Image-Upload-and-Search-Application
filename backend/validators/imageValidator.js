const Joi = require('joi');

// Validation schemas
const uploadSchema = Joi.object({
  keywords: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .max(10)
    .default([]),
  title: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().trim().max(500).optional(),
});

const searchSchema = Joi.object({
  q: Joi.string().trim().max(200).optional().allow('').default(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
});

// Validation middleware
const validateUpload = (req, res, next) => {
  // Parse keywords from form data
  if (req.body.keywords) {
    try {
      req.body.keywords = typeof req.body.keywords === 'string' 
        ? JSON.parse(req.body.keywords) 
        : req.body.keywords;
    } catch (error) {
      req.body.keywords = [];
    }
  }

  const { error, value } = uploadSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message,
    });
  }
  
  req.validatedData = value;
  next();
};

const validateSearch = (req, res, next) => {
  // Set defaults for missing parameters
  const queryData = {
    q: req.query.q || '',
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 12,
  };
  
  // Simple validation without Joi for search
  if (queryData.page < 1) queryData.page = 1;
  if (queryData.limit < 1 || queryData.limit > 50) queryData.limit = 12;
  if (typeof queryData.q !== 'string') queryData.q = '';
  
  req.validatedData = queryData;
  next();
};

const validatePagination = (req, res, next) => {
  // Set defaults for missing parameters
  const queryData = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 12,
  };
  
  // Simple validation
  if (queryData.page < 1) queryData.page = 1;
  if (queryData.limit < 1 || queryData.limit > 50) queryData.limit = 12;
  
  req.validatedData = queryData;
  next();
};

module.exports = {
  validateUpload,
  validateSearch,
  validatePagination,
};