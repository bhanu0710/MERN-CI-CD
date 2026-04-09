const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health");
const todoRoutes = require("./routes/todos");

function createApp({ corsOrigin }) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(express.json({ limit: "1mb" }));
  app.use(cors({ origin: corsOrigin, credentials: false }));

  app.get("/", (req, res) => res.json({ service: "backend" }));
  app.use("/api", healthRoutes);
  app.use("/api", todoRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // Avoid leaking stack traces in prod responses
    const status = err.statusCode || 500;
    const message = status >= 500 ? "internal error" : err.message;
    res.status(status).json({ error: message });
  });

  return app;
}

module.exports = { createApp };

