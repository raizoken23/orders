
import { Suspense } from 'react';
import { StripeProductsClient } from './stripe-products-client';
import { listProductsWithPrices } from '@/lib/stripeServer';
import { CreditCard } from 'lucide-react';

export default async function StripeProductsPage() {
    const initialProducts = await listProductsWithPrices().catch(err => {
        console.error("Failed to fetch Stripe products:", err.message);
        return [];
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                        <CreditCard className="size-8"/>
                        Stripe Product Management
                    </h1>
                    <p className="text-muted-foreground">
                        Create, edit, and manage products and prices in your Stripe sandbox.
                    </p>
                </div>
            </div>
            <Suspense fallback={<p>Loading products...</p>}>
                <StripeProductsClient initialProducts={initialProducts} />
            </Suspense>
        </div>
    );
}
