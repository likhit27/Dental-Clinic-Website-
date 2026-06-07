import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
};

type ApiHandler = (req: IncomingMessage, res: ApiResponse) => Promise<void>;

const integrationEnvKeys = [
  'NOTION_TOKEN',
  'NOTION_DATABASE_ID',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
] as const;

const apiSubmitModuleUrl = new URL('./api/submit.js', import.meta.url).href;

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-submit',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '');

      integrationEnvKeys.forEach((key) => {
        if (!process.env[key] && env[key]) {
          process.env[key] = env[key];
        }
      });

      const missingEnvKeys = integrationEnvKeys.filter((key) => !process.env[key]);

      if (missingEnvKeys.length > 0 && !process.env.VITEST) {
        server.config.logger.warn(
          `Local /api/submit is enabled, but these env vars are missing: ${missingEnvKeys.join(
            ', ',
          )}. Add them to .env and restart npm run dev to test real submissions locally.`,
        );
      }

      server.middlewares.use('/api/submit', async (req, res) => {
        const apiResponse = res as ApiResponse;

        apiResponse.status = (code: number) => {
          apiResponse.statusCode = code;
          return apiResponse;
        };

        apiResponse.json = (payload: unknown) => {
          if (!apiResponse.headersSent) {
            apiResponse.setHeader('Content-Type', 'application/json');
          }

          apiResponse.end(JSON.stringify(payload));
        };

        try {
          const { default: handler } = (await import(apiSubmitModuleUrl)) as {
            default: ApiHandler;
          };

          await handler(req, apiResponse);
        } catch (error) {
          server.config.logger.error(
            error instanceof Error ? (error.stack ?? error.message) : String(error),
          );

          if (!apiResponse.headersSent) {
            apiResponse.status(500).json({ error: 'Local API handler failed.' });
          } else {
            apiResponse.end();
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
