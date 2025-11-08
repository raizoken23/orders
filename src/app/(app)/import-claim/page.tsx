'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function ImportClaimPage() {
  const router = useRouter()

  const handleStartDemo = () => {
    const query = new URLSearchParams({
      claimNumber: 'CLM-12345',
      policyNumber: 'POL-67890',
      clientName: 'John Doe',
      clientEmail: 'john.doe@example.com',
      clientPhone: '(555) 123-4567',
      propertyAddress: '123 Main St, Anytown, USA 12345',
      dateOfLoss: '2024-07-15',
      inspector: 'P Yarborough',
      phone: '310-357-1399',
      email: 'pyarborough@laddernow.com',
      shingleType: 'Laminate',
      shingleMake: '30 Y',
      iceWaterShield: 'Valley,Eave',
      dripEdgeRadio: 'Yes',
      dripEdge: 'Eave,Rake',
      layers: '1',
      pitch: '6/12',
      totalSquares: '28'
    }).toString()
    router.push(`/scope-sheet?${query}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Start a New Inspection
        </h1>
        <p className="text-muted-foreground">
          Begin by generating a demonstration scope sheet.
        </p>
      </div>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Demonstration Mode</CardTitle>
          <CardDescription>
            Click the button below to generate a pre-filled scope sheet with
            sample data. This will create a downloadable PDF report to showcase
            the app&apos;s capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button size="lg" onClick={handleStartDemo}>
            <FileText className="mr-2" />
            Start Demo Inspection
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
