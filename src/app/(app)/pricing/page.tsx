
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, CircleDollarSign, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const tiers = [
  {
    name: 'Inspector',
    price: '$49',
    price_desc: '/month',
    description: 'For individual inspectors getting the job done.',
    features: [
      'Unlimited Scope Sheets',
      'AI Damage Analysis (25/mo)',
      'PDF Report Generation',
      'Email & Chat Support',
    ],
    is_most_popular: false,
  },
  {
    name: 'Team',
    price: '$129',
    price_desc: '/month',
    description: 'For teams that need to collaborate and manage projects.',
    features: [
      'Everything in Inspector',
      'Up to 5 Users',
      'Team & Project Management',
      'Shared Templates',
      'Priority Support',
    ],
    is_most_popular: true,
  },
  {
    name: 'Business',
    price: 'Contact Us',
    price_desc: '',
    description: 'For large organizations requiring advanced features.',
    features: [
      'Everything in Team',
      'Unlimited Users',
      'Custom Integrations (QuickBooks, CRM)',
      'Admin Dashboard & Analytics',
      'Dedicated Account Manager',
    ],
    is_most_popular: false,
  },
];


export default async function PricingPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center justify-center gap-2">
                    <CircleDollarSign className="size-8"/>
                    Pricing Plans
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Choose the plan that's right for your business. All plans start with a 14-day free trial. No credit card required.
                </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
                {tiers.map((tier) => (
                    <Card key={tier.name} className={cn("flex flex-col h-full", tier.is_most_popular ? 'border-primary shadow-lg' : '')}>
                        {tier.is_most_popular && (
                            <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider text-center py-1.5 rounded-t-lg flex items-center justify-center gap-2">
                                <Star className="size-4" />
                                Most Popular
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.price_desc && <span className="text-muted-foreground">{tier.price_desc}</span>}
                            </div>
                            <ul className="space-y-3">
                                {tier.features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="size-5 text-green-500 flex-shrink-0 mt-1" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant={tier.is_most_popular ? 'default' : 'outline'}>
                                {tier.name === 'Business' ? 'Contact Sales' : 'Get Started'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
