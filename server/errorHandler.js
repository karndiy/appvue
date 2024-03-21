const errorMessages = require('./errorCodes');

function handleError(code, res) {
  const message = errorMessages[code] || "An unexpected error occurred";
  res.status(400).json({ error: true, code, message });
}

module.exports = handleError;