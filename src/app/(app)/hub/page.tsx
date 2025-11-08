import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Book, ShieldCheck, Video, FileText, Bot } from 'lucide-react'

const resources = [
  {
    title: 'Training Videos',
    description:
      'Watch tutorials on how to use ScopeSheet Pro features effectively.',
    href: '#',
    icon: Video,
  },
  {
    title: 'Best Practices Guide',
    description:
      'Learn industry best practices for documenting and scoping claims.',
    href: '#',
    icon: Book,
  },
  {
    title: 'Compliance Checklists',
    description:
      'Ensure your reports meet industry and regulatory standards.',
    href: '#',
    icon: ShieldCheck,
  },
  {
    title: 'AI Usage Tips',
    description:
      'Get the most out of the AI Image Analysis tool with these pro tips.',
    href: '#',
    icon: Bot,
  },
  {
    title: 'Report Templates',
    description:
      'Download and use pre-made templates for various types of reports.',
    href: '/sub-sheets',
    icon: FileText,
  },
]

export default function HubPage() {
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Link key={resource.title} href={resource.href}>
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                    <resource.icon className="size-6" />
                  </div>
                  <CardTitle className="font-headline">
                    {resource.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{resource.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
