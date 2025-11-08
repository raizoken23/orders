
import { getStripeInstance } from '@/lib/stripeServer';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// GET /api/admin/stripe/products - List products
export async function GET() {
    try {
        const stripe = await getStripeInstance();
        const products = await stripe.products.list({
            limit: 100,
            expand: ['data.default_price']
        });
        return Response.json(products.data);
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/admin/stripe/products - Create a new product
export async function POST(req: NextRequest) {
    try {
        const stripe = await getStripeInstance();
        const { name, description, price } = await req.json();

        if (!name || !price) {
            return Response.json({ error: 'Product name and price are required.' }, { status: 400 });
        }

        const product = await stripe.products.create({
            name,
            description: description || undefined,
            default_price_data: {
                currency: 'usd',
                unit_amount: price,
            }
        });
        
        // Expand the default_price for the response
        const fullProduct = await stripe.products.retrieve(product.id, {
            expand: ['default_price']
        });

        return Response.json(fullProduct);
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
