import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DownloadCloud, FileCheck2 } from 'lucide-react'

const checklists = [
  {
    title: 'Standard Wind & Hail Damage Checklist',
    description:
      'Covers all IICRC and HAAG standards for residential roof inspection after a wind or hail event.',
    version: 'v2.3',
    fileType: 'PDF',
  },
  {
    title: 'Water Intrusion Source Report',
    description:
      'A step-by-step guide to identifying and documenting the source of water leaks.',
    version: 'v1.8',
    fileType: 'DOCX',
  },
  {
    title: 'Commercial Flat Roof (TPO/EPDM) Checklist',
    description:
      'Specialized checklist for low-slope commercial roofing systems.',
    version: 'v3.1',
    fileType: 'PDF',
  },
  {
    title: 'Fire Damage Assessment Form',
    description:
      'Comprehensive checklist for structure and contents evaluation post-fire.',
    version: 'v1.5',
    fileType: 'PDF',
  },
  {
    title: 'Safety & Site Hazard Analysis',
    description:
      'Pre-inspection safety checklist to ensure a safe working environment for all personnel.',
    version: 'v4.0',
    fileType: 'DOCX',
  },
]

export default function ComplianceChecklistsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Compliance Checklists
        </h1>
        <p className="text-muted-foreground">
          Ensure your reports meet all industry and regulatory standards.
        </p>
      </div>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {checklists.map((checklist) => (
            <div
              key={checklist.title}
              className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 md:p-6"
            >
              <div className="flex items-start gap-4">
                <FileCheck2 className="size-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold font-headline">
                    {checklist.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {checklist.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>Version: {checklist.version}</span>
                    <span>File Type: {checklist.fileType}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <DownloadCloud className="mr-2" />
                Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
