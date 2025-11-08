'use server';
export const runtime = 'nodejs';

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE = path.join(DATA_DIR, 'secrets.json');

function ensure() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR); if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '{}'); }
function key(): Buffer {
  const b64 = process.env.SECRETBOX_KEY_BASE64;
  if (!b64) throw new Error('SECRETBOX_KEY_BASE64 missing');
  const k = Buffer.from(b64, 'base64');
  if (k.length !== 32) throw new Error('SECRETBOX_KEY must be 32 bytes');
  return k;
}

function seal(obj: unknown): any {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const ct = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString('base64'), ct: ct.toString('base64'), tag: tag.toString('base64') };
}
function open(payload: any): any {
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ct = Buffer.from(payload.ct, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return JSON.parse(pt.toString('utf8'));
}

export async function putSecret(ns: string, data: unknown) {
  ensure();
  const db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  db[ns] = seal(data);
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export async function getSecret<T = any>(ns: string): Promise<T | null> {
  if (!fs.existsSync(FILE)) return null;
  try {
    const db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (!db[ns]) return null;
    return open(db[ns]) as T;
  } catch { return null; }
}

export function mask(s?: string) {
  if (!s) return '';
  const tail = s.slice(-4);
  return '•'.repeat(Math.max(0, s.length - 4)) + tail;
}
