
import 'server-only';

import Stripe from 'stripe';
import { getSecret } from './secretStore';

type StripeSecrets = { secretKey: string; publishableKey?: string; webhookSecret?: string };

export async function getStripeInstance() {
  const fromStore = (await getSecret<StripeSecrets>('stripe')) || {};
  const secret = fromStore.secretKey || process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error('STRIPE_SECRET_KEY missing. Please configure it in the Admin Dashboard.');
  return new Stripe(secret, { apiVersion: '2024-06-20' });
}

export async function getStripeWebhookSecret() {
  const s = (await getSecret<StripeSecrets>('stripe')) || {};
  return s.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '';
}
