'use server';
export const runtime = 'nodejs';

import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { request } from 'undici';
import { getSecret } from './secretStore';

type Token = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch seconds
  realmId: string;
};

const isSandbox = (process.env.QBO_ENV || 'sandbox') === 'sandbox';
const OAUTH_BASE = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
const AUTH_BASE  = 'https://appcenter.intuit.com/connect/oauth2';
const API_BASE   = isSandbox
  ? 'https://sandbox-quickbooks.api.intuit.com'
  : 'https://quickbooks.api.intuit.com';

const MINOR = '70'; // adjust if QuickBooks responds 400 with minorversion issue

const tokenFile = process.env.QBO_TOKEN_FILE
  ? path.resolve(process.cwd(), process.env.QBO_TOKEN_FILE)
  : null;

async function cfg() {
  const s = (await getSecret<{ clientId:string; clientSecret:string; redirectUrl?:string }>('qbo')) || {};
  return {
    clientId: s.clientId || process.env.QBO_CLIENT_ID!,
    clientSecret: s.clientSecret || process.env.QBO_CLIENT_SECRET!,
    redirectUrl: s.redirectUrl || process.env.QBO_REDIRECT_URL!,
  };
}

async function basicAuthHeaderAsync() {
  const c = await cfg();
  return 'Basic ' + Buffer.from(`${c.clientId}:${c.clientSecret}`).toString('base64');
}

function readToken(): Token | null {
  if (!tokenFile || !fs.existsSync(tokenFile)) return null;
  try { return JSON.parse(fs.readFileSync(tokenFile, 'utf8')); } catch { return null; }
}
function writeToken(tok: Token) {
  if (!tokenFile) return;
  fs.writeFileSync(tokenFile, JSON.stringify(tok, null, 2));
}

export async function authUrl(state = 'qbo') {
  const u = new URL(AUTH_BASE);
  const c = await cfg();
  u.searchParams.set('client_id', c.clientId);
  u.searchParams.set('redirect_uri', c.redirectUrl);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', process.env.QBO_SCOPES || 'com.intuit.quickbooks.accounting');
  u.searchParams.set('state', state);
  return u.toString();
}

export async function exchangeCodeForToken(code: string, realmId: string): Promise<Token> {
  const c = await cfg();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: c.redirectUrl,
  });

  const r = await request(OAUTH_BASE, {
    method: 'POST',
    headers: {
      Authorization: await basicAuthHeaderAsync(),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });
  const j: any = await r.body.json();
  if (!j.access_token) throw new Error('QBO_TOKEN_EXCHANGE_FAILED ' + JSON.stringify(j));

  const tok: Token = {
    access_token: j.access_token,
    refresh_token: j.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (j.expires_in ?? 3500),
    realmId,
  };
  writeToken(tok);
  return tok;
}

async function refreshToken(tok: Token): Promise<Token> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tok.refresh_token,
  });

  const r = await request(OAUTH_BASE, {
    method: 'POST',
    headers: {
      Authorization: await basicAuthHeaderAsync(),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });
  const j: any = await r.body.json();
  if (!j.access_token) throw new Error('QBO_REFRESH_FAILED ' + JSON.stringify(j));

  const next: Token = {
    access_token: j.access_token,
    refresh_token: j.refresh_token ?? tok.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (j.expires_in ?? 3500),
    realmId: tok.realmId,
  };
  writeToken(next);
  return next;
}

async function withToken<T>(fn: (t: Token) => Promise<T>): Promise<T> {
  let tok = readToken();
  if (!tok) throw new Error('QBO_NO_TOKEN: connect first');
  const now = Math.floor(Date.now() / 1000);
  if (tok.expires_at - now < 90) tok = await refreshToken(tok);
  try {
    return await fn(tok);
  } catch (e: any) {
    // retry once on 401 with refresh
    if (String(e).includes('401')) {
      tok = await refreshToken(tok);
      return await fn(tok);
    }
    throw e;
  }
}

async function qboGet(pathname: string, tok: Token) {
  const url = new URL(API_BASE + pathname);
  url.searchParams.set('minorversion', MINOR);
  const r = await request(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + tok.access_token,
      Accept: 'application/json',
    },
  });
  if (r.statusCode === 429) { await delay(500); return qboGet(pathname, tok); }
  if (r.statusCode >= 400) throw new Error('QBO_GET_' + r.statusCode);
  return r.body.json();
}

async function qboPost(pathname: string, tok: Token, json: unknown) {
  const url = new URL(API_BASE + pathname);
  url.searchParams.set('minorversion', MINOR);
  const r = await request(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + tok.access_token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
  if (r.statusCode === 429) { await delay(500); return qboPost(pathname, tok, json); }
  if (r.statusCode >= 400) {
    const err = await r.body.text();
    throw new Error('QBO_POST_' + r.statusCode + ' ' + err);
  }
  return r.body.json();
}

/* ---------- Public helpers ---------- */

export function ensureConnected() {
  const t = readToken();
  return Boolean(t?.access_token && t?.realmId);
}

export async function getCompanyInfo() {
  return withToken(async (t) =>
    qboGet(`/v3/company/${t.realmId}/companyinfo/${t.realmId}`, t)
  );
}

export async function createTestCustomer(name = 'ScopeSheet Demo Customer') {
  return withToken(async (t) =>
    qboPost(`/v3/company/${t.realmId}/customer`, t, {
      DisplayName: name,
      PrimaryPhone: { FreeFormNumber: '555-0100' },
      PrimaryEmailAddr: { Address: 'demo@example.com' }
    })
  );
}

export async function createTestInvoice(customerRef: { value: string }) {
  return withToken(async (t) =>
    qboPost(`/v3/company/${t.realmId}/invoice`, t, {
      Line: [{
        Amount: 100.0,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: { ItemRef: { value: '1', name: 'Service' } }
      }],
      CustomerRef: customerRef
    })
  );
}
