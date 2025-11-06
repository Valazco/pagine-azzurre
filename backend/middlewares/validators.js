import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errori di validazione',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Lo username deve essere tra 3 e 30 caratteri')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Lo username può contenere solo lettere, numeri, underscore e trattini'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('La password deve essere di almeno 8 caratteri')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La password deve contenere almeno una lettera maiuscola, una minuscola e un numero'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Inserisci un numero di telefono valido'),

  body('cf')
    .optional()
    .trim()
    .isLength({ min: 16, max: 16 })
    .withMessage('Il Codice Fiscale deve essere di 16 caratteri')
    .matches(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i)
    .withMessage('Inserisci un Codice Fiscale valido'),

  body('sellername')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Il nome del venditore non può superare 100 caratteri'),

  handleValidationErrors
];

// User login validation
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La password è obbligatoria'),

  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Il nome deve essere tra 1 e 50 caratteri'),

  body('surname')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Il cognome deve essere tra 1 e 50 caratteri'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La password deve essere di almeno 8 caratteri')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La password deve contenere almeno una lettera maiuscola, una minuscola e un numero'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Inserisci un numero di telefono valido'),

  body('cf')
    .optional()
    .trim()
    .isLength({ min: 16, max: 16 })
    .withMessage('Il Codice Fiscale deve essere di 16 caratteri')
    .matches(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i)
    .withMessage('Inserisci un Codice Fiscale valido'),

  body('zipCode')
    .optional()
    .trim()
    .matches(/^[0-9]{5}$/)
    .withMessage('Il CAP deve essere di 5 cifre'),

  body('partitaIva')
    .optional()
    .trim()
    .matches(/^[0-9]{11}$/)
    .withMessage('La Partita IVA deve essere di 11 cifre'),

  handleValidationErrors
];

// Product creation/update validation
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Il nome del prodotto deve essere tra 3 e 200 caratteri'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Il prezzo deve essere un numero positivo'),

  body('priceVal')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Il prezzo in Val deve essere un numero positivo'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoria è obbligatoria')
    .isLength({ max: 100 })
    .withMessage('La categoria non può superare 100 caratteri'),

  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Il brand non può superare 100 caratteri'),

  body('countInStock')
    .isInt({ min: 0 })
    .withMessage('La quantità in stock deve essere un numero intero positivo'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descrizione deve essere tra 10 e 2000 caratteri'),

  handleValidationErrors
];

// Email validation (for newsletter, contact, etc.)
export const validateEmail = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Inserisci un indirizzo email valido')
    .normalizeEmail(),

  handleValidationErrors
];

// Order validation
export const validateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('L\'ordine deve contenere almeno un prodotto'),

  body('shippingAddress')
    .notEmpty()
    .withMessage('L\'indirizzo di spedizione è obbligatorio'),

  body('shippingAddress.fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Il nome completo deve essere tra 2 e 100 caratteri'),

  body('shippingAddress.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('L\'indirizzo deve essere tra 5 e 200 caratteri'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('La città è obbligatoria'),

  body('shippingAddress.postalCode')
    .trim()
    .matches(/^[0-9]{5}$/)
    .withMessage('Il CAP deve essere di 5 cifre'),

  body('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage('Il metodo di pagamento è obbligatorio'),

  handleValidationErrors
];
