import ImageAnalysisClient from './image-analysis-client'

export default function ImageAnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI-Powered Image Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload a roof image to automatically detect potential issues like
          damage or wear.
        </p>
      </div>
      <ImageAnalysisClient />
    </div>
  )
}
