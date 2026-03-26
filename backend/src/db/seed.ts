import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { closeDb, getDb } from './database.js';

const SALT_ROUNDS = 12;

function seed(): void {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment or .env');
    process.exit(1);
  }

  const db = getDb();

  const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username) as
    | { id: number }
    | undefined;

  const hash = bcrypt.hashSync(password, SALT_ROUNDS);

  if (existing) {
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hash, username);
    console.log(`Updated password for admin user "${username}".`);
  } else {
    db.prepare(
      'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
    ).run(username, hash);
    console.log(`Created admin user "${username}".`);
  }

  closeDb();
}

try {
  seed();
} catch (err) {
  console.error(err);
  process.exit(1);
}
