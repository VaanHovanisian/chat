import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} src/prisma/seed.ts',
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
