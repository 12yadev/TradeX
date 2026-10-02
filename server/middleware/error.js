export const notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

// Central error handler: never leaks stack traces or internals
export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'This record already exists.';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier.';
  }

  if (status >= 500) {
    console.error(err);
    message = 'Something went wrong on the server. Please try again.';
  }
  res.status(status).json({ message });
};
