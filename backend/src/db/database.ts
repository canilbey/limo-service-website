import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

let dbInstance: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE NOT NULL,
  trip_type TEXT NOT NULL,
  pickup TEXT NOT NULL,
  destination TEXT,
  service_date TEXT NOT NULL,
  service_time TEXT NOT NULL,
  hours INTEGER,
  vehicle_id TEXT NOT NULL,
  vehicle_name TEXT NOT NULL,
  vehicle_price REAL NOT NULL,
  booking_for TEXT,
  pickup_sign TEXT,
  flight_number TEXT,
  meeting_time TEXT,
  driver_notes TEXT,
  extras_json TEXT NOT NULL,
  additional_stops_json TEXT,
  title TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  estimated_distance_miles REAL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_service_date ON bookings(service_date);
`;

export function initSchema(database: Database.Database): void {
  database.exec(SCHEMA);
}

function resolveDbPath(): string {
  if (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test' || process.env.BACKEND_TEST_DB === 'memory') {
    return ':memory:';
  }
  const raw = process.env.DB_PATH?.trim();
  if (raw) {
    return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  }
  return path.resolve(process.cwd(), 'data', 'limo.db');
}

/**
 * Returns a singleton SQLite connection and ensures schema exists.
 */
export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = resolveDbPath();
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');
  initSchema(dbInstance);
  return dbInstance;
}

/**
 * Closes DB singleton. Intended for tests.
 */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * Test helper: reopen in-memory DB after close.
 */
export function resetDbSingleton(): void {
  closeDb();
  getDb();
}
