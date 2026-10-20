// Wraps an async handler so a failed await reaches the error handler in server.js.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};