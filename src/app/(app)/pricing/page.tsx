
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { listProductsWithPrices } from '@/lib/stripeServer';
import { Check, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
    let products: any[] = [];
    try {
        products = await listProductsWithPrices();
    } catch (error) {
        console.error("Pricing page failed to fetch products:", (error as Error).message);
    }
    
    const hasProducts = products && products.length > 0;

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
                    <CircleDollarSign className="size-8"/>
                    Pricing
                </h1>
                <p className="text-muted-foreground">
                    Choose the plan that's right for your business.
                </p>
            </div>
            
            {!hasProducts && (
                <Card className="max-w-2xl mx-auto text-center">
                    <CardHeader>
                        <CardTitle>Pricing Information Not Available</CardTitle>
                        <CardDescription>
                            The pricing information could not be loaded at this time. This usually happens when the Stripe integration has not been configured by an administrator.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">If you are an administrator, please go to the Admin Dashboard to set up your Stripe API keys.</p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild className="mx-auto">
                            <Link href="/admin">Go to Admin Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {hasProducts && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                        const price = product.default_price;
                        return (
                            <Card key={product.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">{product.name}</CardTitle>
                                    <CardDescription>{product.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-6">
                                    {price && (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold">${(price.unit_amount / 100).toFixed(2)}</span>
                                            <span className="text-muted-foreground">
                                                {price.type === 'recurring' ? `/${price.recurring.interval}` : ''}
                                            </span>
                                        </div>
                                    )}
                                    <ul className="space-y-3">
                                        {product.features?.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="size-5 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Get Started</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
