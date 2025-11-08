'use client'

import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Book,
  ShieldCheck,
  Video,
  FileText,
  Bot,
  CircleDollarSign,
  LayoutDashboard,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const resources = [
  {
    title: 'Dashboard',
    description: 'Return to the main application dashboard.',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Training Videos',
    description:
      'Watch tutorials on how to use ScopeSheet Pro features effectively.',
    href: '/hub/training-videos',
    icon: Video,
  },
  {
    title: 'Best Practices Guide',
    description:
      'Learn industry best practices for documenting and scoping claims.',
    href: '/hub/best-practices',
    icon: Book,
  },
  {
    title: 'Compliance Checklists',
    description:
      'Ensure your reports meet industry and regulatory standards.',
    href: '/hub/compliance-checklists',
    icon: ShieldCheck,
  },
  {
    title: 'AI Usage Tips',
    description:
      'Get the most out of the AI Image Analysis tool with these pro tips.',
    href: '/hub/ai-usage-tips',
    icon: Bot,
  },
  {
    title: 'Report Templates',
    description:
      'Download and use pre-made templates for various types of reports.',
    href: '/sub-sheets',
    icon: FileText,
  },
  {
    title: 'Pricing & Plans',
    description: 'View and compare the available subscription plans.',
    href: '/pricing',
    icon: CircleDollarSign,
  },
]

export default function HubPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Investigator Hub
        </h1>
        <p className="text-muted-foreground">
          Your one-stop shop for resources, training, and best practices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resources.map((resource) => (
          <Card
            key={resource.title}
            onClick={() => router.push(resource.href)}
            className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <resource.icon className="size-6" />
                </div>
                <CardTitle className="font-headline text-lg">
                  {resource.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{resource.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
