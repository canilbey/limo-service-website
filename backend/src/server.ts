import 'dotenv/config';
import { createApp, ensureDbInitialized } from './app.js';

const port = Number(process.env.PORT) || 3001;

ensureDbInitialized();
const app = createApp();

app.listen(port, () => {
  console.log(`Limo service API listening on http://localhost:${port}`);
});
