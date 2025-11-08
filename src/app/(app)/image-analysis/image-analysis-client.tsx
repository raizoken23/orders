'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  analyzeRoofImage,
  type AnalyzeRoofImageOutput,
} from '@/ai/flows/analyze-roof-image-for-issues'
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
import { Upload, Wand2, Lightbulb, AlertTriangle } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'

type AnalysisState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'

export default function ImageAnalysisClient() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeRoofImageOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aiProvider, setAiProvider] = useState<'google' | 'openai'>('google');
  const [openAIKey, setOpenAIKey] = useState<string | null>(null);

  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') as 'google' | 'openai' || 'google';
    const savedKey = localStorage.getItem('openAIKey');
    setAiProvider(savedProvider);
    setOpenAIKey(savedKey);
  }, []);

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

  const handleAnalyzeClick = async (imageData: string) => {
    setAnalysisState('loading')
    setError(null)
    setSelectedImage(imageData)

    if (aiProvider === 'openai' && (!openAIKey || openAIKey.trim() === '')) {
      setError('OpenAI API Key is not set. Please add it in the Settings page.');
      setAnalysisState('error');
      return;
    }

    try {
      const result = await analyzeRoofImage({ 
        roofImageDataUri: imageData,
        provider: aiProvider,
        openAIKey: openAIKey || undefined,
      });
      setAnalysisResult(result)
      setAnalysisState('success')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during analysis. Please try again.');
      setAnalysisState('error')
    }
  }

  const AnalysisResult = () => {
    switch (analysisState) {
      case 'loading':
        return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )
      case 'success':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-headline flex items-center">
              <Lightbulb className="mr-2 text-accent" />
              Analysis Complete
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {analysisResult?.detectedIssues}
            </p>
          </div>
        )
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )
      default:
        return (
          <div className="text-center text-muted-foreground py-12">
            <Wand2 className="mx-auto h-12 w-12" />
            <p className="mt-4">
              Analysis results will be displayed here.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upload Image</CardTitle>
          <CardDescription>
            Choose a roof image from your device or select an example.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roof-image-upload">Upload from device</Label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="roof-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Or select an example</Label>
            <div className="grid grid-cols-3 gap-4">
              {PlaceHolderImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleAnalyzeClick(image.imageUrl)}
                  className="rounded-lg overflow-hidden border-2 border-transparent hover:border-accent focus:border-accent focus:outline-none transition-all"
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    data-ai-hint={image.imageHint}
                    width={200}
                    height={150}
                    className="aspect-video object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => selectedImage && handleAnalyzeClick(selectedImage)}
            disabled={!selectedImage || analysisState === 'loading'}
            className="w-full"
          >
            <Wand2 className="mr-2" />
            {analysisState === 'loading' ? 'Analyzing...' : 'Analyze Image'}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Analysis Report</CardTitle>
          <CardDescription>
            Potential issues detected by the AI model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] p-4 bg-muted/50 rounded-lg">
            <AnalysisResult />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
