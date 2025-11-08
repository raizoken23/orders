
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Basic',
    price: '$29',
    pricePeriod: '/ month',
    description: 'For individual inspectors getting started.',
    features: [
      'Digital Scope Sheets',
      'Import Claim Data from Image',
      'Basic Roof Diagram Tool',
      '15 AI Image Analyses / mo',
      'Email Support',
    ],
    buttonText: 'Get Started',
    variant: 'outline',
  },
  {
    name: 'Pro',
    price: '$79',
    pricePeriod: '/ month',
    description: 'For professionals who need advanced tools.',
    features: [
      'Everything in Basic, plus:',
      'Advanced Roof Diagram Tool',
      '100 AI Image Analyses / mo',
      'Sub Sheet Templates',
      'Priority Support',
    ],
    buttonText: 'Upgrade to Pro',
    variant: 'default',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    pricePeriod: '',
    description: 'For large teams with custom needs.',
    features: [
      'Everything in Pro, plus:',
      'Unlimited AI Image Analyses',
      'Team & Claim Management',
      'Custom Integrations & API Access',
      'Dedicated Account Manager',
    ],
    buttonText: 'Contact Sales',
    variant: 'outline',
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          Find the Perfect Plan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          ScopeSheet Pro offers flexible pricing to fit the needs of every
          inspector, from individuals to large enterprise teams.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${
              tier.popular ? 'border-primary shadow-lg' : ''
            }`}
          >
            <CardHeader className="text-center">
              {tier.popular && (
                <div className="text-sm font-semibold text-primary uppercase mb-2">
                  Most Popular
                </div>
              )}
              <CardTitle className="font-headline text-2xl">
                {tier.name}
              </CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.pricePeriod && (
                  <span className="text-muted-foreground">
                    {tier.pricePeriod}
                  </span>
                )}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="size-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={tier.variant as 'default' | 'outline'}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
