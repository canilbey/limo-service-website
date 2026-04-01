import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createApp, ensureDbInitialized } from './app.js';

// Load .env from the backend root (not process.cwd()), so PM2 cwd does not matter.
// override: true ensures .env wins over stale variables injected by PM2 (e.g. old EMAIL_PASS).
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env'), override: true });

const port = Number(process.env.PORT) || 3001;

ensureDbInitialized();
const app = createApp();

app.listen(port, () => {
  console.log(`Limo service API listening on http://localhost:${port}`);
});
