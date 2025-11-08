import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Ruler, AreaChart, TrendingUp } from 'lucide-react'

const stats = [
  {
    name: 'Total Surface Area',
    value: '2,450 sq ft',
    icon: AreaChart,
  },
  {
    name: 'Primary Slope',
    value: '6/12',
    icon: TrendingUp,
  },
  {
    name: 'Total Ridges & Hips',
    value: '180 ft',
    icon: Ruler,
  },
]

export default function RoofDiagramPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Roof Diagram Tool
        </h1>
        <p className="text-muted-foreground">
          Create a precise diagram of the roof and view key measurements.
        </p>
      </div>

      <div className="grid flex-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Diagram</CardTitle>
            <CardDescription>
              This is a placeholder for the interactive roof drawing canvas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[500px] bg-muted/50 rounded-lg border-2 border-dashed">
            <svg
              className="w-full h-full text-muted-foreground/50"
              viewBox="0 0 400 300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <polygon points="200,50 50,150 350,150" strokeDasharray="4" />
              <polygon points="50,150 50,250 200,300 200,200" strokeDasharray="4" />
              <polygon points="350,150 350,250 200,300 200,200" strokeDasharray="4" />
              <line x1="50" y1="150" x2="200" y2="200" strokeDasharray="2" />
              <line x1="350" y1="150" x2="200" y2="200" strokeDasharray="2" />
              <line x1="200" y1="50" x2="200" y2="200" strokeDasharray="2" />
              <text
                x="200"
                y="175"
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                className="font-sans"
              >
                Interactive Drawing Area
              </text>
            </svg>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Statistics</CardTitle>
            <CardDescription>
              Calculated measurements from the diagram.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-6">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                  <stat.icon className="size-5 text-accent" />
                  <h3 className="font-medium">{stat.name}</h3>
                </div>
                <p className="text-2xl font-bold ml-8">{stat.value}</p>
                {index < stats.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
