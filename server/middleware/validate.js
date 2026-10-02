import { validationResult } from 'express-validator';

// Returns the first validation error as a friendly 400 response
export default function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ message: result.array()[0].msg });
  }
  next();
}
