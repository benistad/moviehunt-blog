const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

const urlValidation = [
  body('url')
    .isURL()
    .withMessage('URL invalide')
    .notEmpty()
    .withMessage('URL requise'),
  validate,
];

const articleIdValidation = [
  param('id')
    .isUUID()
    .withMessage('ID d\'article invalide'),
  validate,
];

const articleUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Le contenu doit contenir au moins 50 caractères'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Statut invalide'),
  validate,
];

module.exports = {
  validate,
  urlValidation,
  articleIdValidation,
  articleUpdateValidation,
};
