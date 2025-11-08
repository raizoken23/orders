'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  extractClaimInformation,
  type ExtractClaimInformationOutput,
} from '@/ai/flows/extract-claim-information'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Upload, Wand2, Lightbulb, AlertTriangle, FileText } from 'lucide-react'

type AnalysisState = 'idle' | 'loading' | 'success' | 'error'

export default function ImportClaimClient() {
  const router = useRouter()
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] =
    useState<ExtractClaimInformationOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setAnalysisState('idle')
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyzeClick = async () => {
    if (!selectedImage) return
    setAnalysisState('loading')
    setError(null)

    try {
      const result = await extractClaimInformation({
        claimScreenshotUri: selectedImage,
      })
      setAnalysisResult(result)
      setAnalysisState('success')
    } catch (err) {
      console.error(err)
      setError('An error occurred during extraction. Please try again.')
      setAnalysisState('error')
    }
  }

  const handleCreateScopeSheet = () => {
    if (!analysisResult) return
    const query = new URLSearchParams(analysisResult as Record<string, string>).toString()
    router.push(`/scope-sheet?${query}`)
  }

  const AnalysisResult = () => {
    switch (analysisState) {
      case 'loading':
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )
      case 'success':
        return (
          analysisResult && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-headline flex items-center">
                <Lightbulb className="mr-2 text-accent" />
                Extraction Complete
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Client Name</p>
                  <p>{analysisResult.clientName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Claim Number</p>
                  <p>{analysisResult.claimNumber}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Policy Number</p>
                  <p>{analysisResult.policyNumber}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Date of Loss</p>
                  <p>{analysisResult.dateOfLoss}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-medium text-muted-foreground">
                    Property Address
                  </p>
                  <p>{analysisResult.propertyAddress}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Client Email</p>
                  <p>{analysisResult.clientEmail}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Client Phone</p>
                  <p>{analysisResult.clientPhone}</p>
                </div>
              </div>
            </div>
          )
        )
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Extraction Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )
      default:
        return (
          <div className="text-center text-muted-foreground py-12">
            <Wand2 className="mx-auto h-12 w-12" />
            <p className="mt-4">
              Extracted claim information will be displayed here.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upload Claim Screenshot</CardTitle>
          <CardDescription>
            Choose an image of your claim document from your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="claim-image-upload">Upload from device</Label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="claim-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pl-10"
              />
            </div>
          </div>
          {selectedImage && (
            <div className="border rounded-lg p-2 bg-muted/50">
              <Image
                src={selectedImage}
                alt="Selected claim document"
                width={800}
                height={600}
                className="rounded-md object-contain max-h-[400px]"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyzeClick}
            disabled={!selectedImage || analysisState === 'loading'}
            className="w-full"
          >
            <Wand2 className="mr-2" />
            {analysisState === 'loading'
              ? 'Extracting...'
              : 'Extract Information'}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Extracted Information</CardTitle>
          <CardDescription>
            Verify the extracted information before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] p-4 bg-muted/50 rounded-lg">
            <AnalysisResult />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateScopeSheet}
            disabled={analysisState !== 'success'}
            className="w-full"
          >
            <FileText className="mr-2" />
            Create Scope Sheet with this Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
