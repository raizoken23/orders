import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FilePlus2, PlusCircle } from 'lucide-react'

const subSheetTemplates = [
  {
    title: 'Hail Damage Report',
    description: 'Detailed template for assessing hail damage to roofing and siding.',
  },
  {
    title: 'Water Intrusion Sheet',
    description: 'For documenting sources and extent of water damage.',
  },
  {
    title: 'Fire Damage Assessment',
    description: 'Comprehensive sheet for residential fire damage evaluation.',
  },
  {
    title: 'Interior Inspection',
    description: 'Room-by-room template for interior property inspections.',
  },
]

export default function SubSheetsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Sub Sheets
          </h1>
          <p className="text-muted-foreground">
            Create and manage detailed report templates for specific needs.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Create New Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subSheetTemplates.map((template) => (
          <Card
            key={template.title}
            className="flex flex-col transition-all hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <FilePlus2 className="size-8 text-accent flex-shrink-0 mt-1" />
                <div className='flex-grow'>
                  <CardTitle className="font-headline text-xl">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button variant="outline" className="w-full">
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
