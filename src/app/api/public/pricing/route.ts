export const runtime = 'nodejs';
import { listProductsWithPrices } from '@/lib/stripeServer';

export async function GET() {
  const rows = await listProductsWithPrices();
  const data = rows.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    features: r.features,
    prices: r.prices.map(p => ({
      id: p.id,
      unit_amount: p.unit_amount,
      currency: p.currency,
      interval: p.recurring?.interval || null,
      isDefault: p.id === r.default_price
    }))
  }));
  return Response.json({ products: data });
}
