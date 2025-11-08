
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
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          Find the Perfect Plan for Your Business
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          ScopeSheet Pro offers flexible pricing to fit the needs of every
          inspector, from individuals to large enterprise teams.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
              tier.popular ? 'border-2 border-primary shadow-xl' : ''
            }`}
          >
            <CardHeader className="text-center relative">
              {tier.popular && (
                <div className="absolute top-0 -translate-y-1/2 w-full">
                  <div className="inline-block px-4 py-1 text-sm font-semibold text-primary-foreground bg-primary rounded-full uppercase shadow-md">
                    Most Popular
                  </div>
                </div>
              )}
              <CardTitle className="font-headline text-3xl pt-8">
                {tier.name}
              </CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold tracking-tighter">{tier.price}</span>
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
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="size-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
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
