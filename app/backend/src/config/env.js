const dotenv = require("dotenv");

dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "production",
  port: Number(process.env.PORT || 8080),
  mongodbUri: process.env.MONGODB_URI || required("MONGODB_URI"),
  corsOrigin: (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

module.exports = { env };

