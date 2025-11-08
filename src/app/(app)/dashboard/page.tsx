import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileUp } from 'lucide-react'

const features = [
  {
    title: 'New Scope Sheet',
    description: 'Start an inspection by uploading a claim screenshot.',
    href: '/import-claim',
    icon: FileUp,
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Welcome back, John!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of what you can do with ScopeSheet Pro.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.href}
            className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <feature.icon className="size-6" />
                </div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.href}>
                  Go to {feature.title}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Activity</CardTitle>
          <CardDescription>
            A list of your recent claims and inspections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>No recent activity.</p>
            <Button asChild variant="link">
              <Link href="/import-claim">Start a new scope sheet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
