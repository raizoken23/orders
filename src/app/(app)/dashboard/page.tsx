import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  FileText,
  PenSquare,
  Scan,
  FileUp,
  FilePlus2,
  BookUser,
} from 'lucide-react'

const features = [
  {
    title: 'New Scope Sheet',
    description: 'Start a new inspection by filling out a digital scope sheet.',
    href: '/scope-sheet',
    icon: FileText,
  },
  {
    title: 'Import Claim Data',
    description: 'Extract claim info from a document image using AI.',
    href: '/import-claim',
    icon: FileUp,
  },
  {
    title: 'Create Roof Diagram',
    description: 'Use the diagram tool to sketch roof layouts and dimensions.',
    href: '/roof-diagram',
    icon: PenSquare,
  },
  {
    title: 'Analyze an Image',
    description:
      'Upload a roof image and let our AI detect potential issues.',
    href: '/image-analysis',
    icon: Scan,
  },
  {
    title: 'Sub Sheets',
    description: 'Create and manage detailed report templates for specific needs.',
    href: '/sub-sheets',
    icon: FilePlus2,
  },
  {
    title: 'Investigator Hub',
    description: 'Your one-stop shop for resources, training, and best practices.',
    href: '/hub',
    icon: BookUser,
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
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.href}>
                  Go to {feature.title}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
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
              <Link href="/scope-sheet">Start a new scope sheet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
