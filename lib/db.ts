import Database from 'better-sqlite3';
import path from 'path';
import { Submission, User } from './types';
// Initialize the database
const dbName = 'aura.db';
let dbPath = path.join(process.cwd(), dbName);

// We use a temporary database for the assignment deployment to work
if (process.env.NODE_ENV === 'production') {
  dbPath = path.join('/tmp', dbName);
}

const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    role TEXT
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    image_ref TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const insertUser = db.prepare('INSERT OR IGNORE INTO users (username, role) VALUES (?, ?)');
insertUser.run('writer', 'writer');
insertUser.run('manager', 'manager');

export function getUser(username: string): User | string {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | "Write 'writer' and 'manager' in the username field";
}

export function createSubmission(title: string, content: string, image_ref?: string): Submission {
  const stmt = db.prepare('INSERT INTO submissions (title, content, image_ref) VALUES (?, ?, ?)');
  const info = stmt.run(title, content, image_ref || null);

  return {
    id: Number(info.lastInsertRowid),
    title,
    content,
    image_ref,
    status: 'pending',
    created_at: new Date().toISOString() // Approximate for return, real DB has it
  };
}

export function getAllSubmissions(): Submission[] {
  return db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all() as Submission[];
}

export function updateSubmissionStatus(id: number, status: 'approved' | 'rejected'): boolean {
  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid status transition');
  }
  const stmt = db.prepare('UPDATE submissions SET status = ? WHERE id = ?');
  const info = stmt.run(status, id);
  return info.changes > 0;
}

export default db;
