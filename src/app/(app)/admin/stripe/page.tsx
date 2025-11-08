
import { getStripeInstance } from '@/lib/stripeServer';
import { StripeProductsClient } from './stripe-products-client';
import { CreditCard } from 'lucide-react';

async function getProducts() {
    try {
        const stripe = await getStripeInstance();
        const products = await stripe.products.list({ limit: 100, expand: ['data.default_price'] });
        return products.data;
    } catch (e: any) {
        console.error("Failed to fetch Stripe products:", e.message);
        // Don't throw, return empty array to allow page to render with an error message.
        return [];
    }
}


export default async function StripeManagementPage() {
    const products = await getProducts();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                    <CreditCard className="size-8"/>
                    Stripe Product Management
                </h1>
                <p className="text-muted-foreground">
                    Create, view, and manage your products and prices in Stripe.
                </p>
            </div>
            <StripeProductsClient initialProducts={products} />
        </div>
    );
}
