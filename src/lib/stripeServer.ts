'use server';

import Stripe from 'stripe';
import { getSecret } from './secretStore';

type StripeSecrets = { secretKey: string; publishableKey?: string; webhookSecret?: string };

export async function getStripe() {
  const s = (await getSecret<StripeSecrets>('stripe')) || {};
  const key = s.secretKey || process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

export function parseFeatures(meta?: Stripe.Metadata | null): string[] {
  if (!meta?.features) return [];
  try { const v = JSON.parse(String(meta.features)); return Array.isArray(v) ? v.map(String) : []; } catch { return []; }
}
export function encodeFeatures(features: string[]) {
  return { features: JSON.stringify(features.filter(Boolean)) };
}

export async function listProductsWithPrices() {
  const stripe = await getStripe();
  const prods = await stripe.products.list({ limit: 100, expand: ['data.default_price'] });
  const prices = await stripe.prices.list({ limit: 100 });
  const priceByProduct: Record<string, Stripe.Price[]> = {};
  prices.data.forEach(p => {
    if (typeof p.product === 'string') {
      (priceByProduct[p.product] ||= []).push(p);
    } else {
      (priceByProduct[p.product.id] ||= []).push(p);
    }
  });
  return prods.data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    features: parseFeatures(p.metadata),
    default_price: typeof p.default_price === 'string' ? p.default_price : p.default_price?.id || null,
    prices: priceByProduct[p.id] || []
  }));
}

export async function upsertProduct(input: {
  id?: string; name: string; description?: string; features: string[];
}) {
  const stripe = await getStripe();
  if (input.id) {
    return stripe.products.update(input.id, {
      name: input.name,
      description: input.description,
      metadata: encodeFeatures(input.features)
    });
  }
  return stripe.products.create({
    name: input.name,
    description: input.description,
    metadata: encodeFeatures(input.features),
    active: true
  });
}

export async function createPrice(input: {
  productId: string;
  amountUsd: number;        // dollars, e.g. 99.00
  interval?: 'month'|'year' // omit => one-time
  currency?: string;        // default 'usd'
}) {
  const stripe = await getStripe();
  const currency = input.currency || 'usd';
  const unit_amount = Math.round(input.amountUsd * 100);
  return stripe.prices.create({
    product: input.productId,
    currency,
    unit_amount,
    ...(input.interval ? { recurring: { interval: input.interval } } : {})
  });
}

export async function setDefaultPrice(productId: string, priceId: string) {
  const stripe = await getStripe();
  return stripe.products.update(productId, { default_price: priceId });
}

export async function createPaymentLink(priceId: string) {
  const stripe = await getStripe();
  const link = await stripe.paymentLinks.create({ line_items: [{ price: priceId, quantity: 1 }] });
  return link.url;
}

export async function getStripeInstance() {
    return getStripe();
}

export async function getStripeWebhookSecret() {
  const s = (await getSecret<StripeSecrets>('stripe')) || {};
  return s.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '';
}
