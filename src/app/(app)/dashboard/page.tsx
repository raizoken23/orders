
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
import {
  ArrowRight,
  FileUp,
  Image,
  AreaChart,
  Sparkles,
  FileText,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const features = [
  {
    title: 'New Scope Sheet',
    description: 'Start a new inspection using the demo or by uploading a claim.',
    href: '/import-claim',
    icon: FileUp,
  },
  {
    title: 'Image Analysis',
    description: 'Use AI to analyze a roof photo for potential damage and wear.',
    href: '/image-analysis',
    icon: Image,
  },
  {
    title: 'Roof Diagram',
    description: 'Create a precise diagram and calculate key measurements.',
    href: '/roof-diagram',
    icon: AreaChart,
  },
  {
    title: 'Investigator Hub',
    description: 'Access training videos, best practices, and other resources.',
    href: '/hub',
    icon: Sparkles,
  },
]

const recentActivity = [
  {
    claimNumber: 'CLM-12345',
    clientName: 'John Doe',
    status: 'Downloaded' as const,
    date: '2024-07-18',
  },
  {
    claimNumber: 'CLM-54321',
    clientName: 'Jane Smith',
    status: 'Draft' as const,
    date: '2024-07-17',
  },
  {
    claimNumber: 'CLM-98765',
    clientName: 'Mike Johnson',
    status: 'Submitted' as const,
    date: '2024-07-15',
  },
]

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline'} = {
    Draft: 'secondary',
    Submitted: 'outline',
    Downloaded: 'default',
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Welcome back, John!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of your workspace and recent activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <CardTitle className="font-headline text-lg">
                  {feature.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={feature.href}>
                  Get Started
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
            A list of your most recent claims and inspections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.claimNumber}>
                  <TableCell className="font-medium">
                    {activity.claimNumber}
                  </TableCell>
                  <TableCell>{activity.clientName}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[activity.status]}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="size-4" />
                      <span>{activity.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/scope-sheet">
                        <FileText className="mr-2" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
