const http = require("http");

const { env } = require("./config/env");
const { connectMongo } = require("./config/db");
const { createApp } = require("./app");

async function main() {
  await connectMongo(env.mongodbUri);

  const app = createApp({ corsOrigin: env.corsOrigin });
  const server = http.createServer(app);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`backend listening on :${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async () => {
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

