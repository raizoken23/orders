import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Wand2, ImagePlus, Type, AlertTriangle } from 'lucide-react'

const tips = [
  {
    title: 'Garbage In, Garbage Out',
    icon: ImagePlus,
    content:
      'The AI is only as good as the images you provide. Use clear, high-resolution photos. Avoid blurry, dark, or obstructed images for the best analysis results. A good photo has the damaged area well-lit and in focus.',
  },
  {
    title: 'Use AI as a Co-pilot, Not an Autopilot',
    icon: Wand2,
    content:
      "The AI provides an excellent starting point and a second opinion, but it doesn't replace your expertise. Always review the AI's findings, and add your own observations and context in the notes section of the report.",
  },
  {
    title: 'Provide Context in Text Fields',
    icon: Type,
    content:
      "When using AI to extract information from a document, the AI can sometimes get confused. If a field is extracted incorrectly, correcting it and adding a note in the Scope Sheet can help build a stronger, more accurate final report.",
  },
  {
    title: 'Understand the Limitations',
    icon: AlertTriangle,
    content:
      'The AI is trained to spot common issues but may miss novel or very subtle types of damage. It cannot determine the age of damage or its cause (e.g., hail vs. manufacturing defect). Your professional judgment is crucial for the final assessment.',
  },
]

export default function AiUsageTipsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI Usage Tips
        </h1>
        <p className="text-muted-foreground">
          Get the most out of ScopeSheet Pro&apos;s generative AI features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tips.map((tip) => (
          <Card key={tip.title}>
            <CardHeader className="flex flex-row items-center gap-4">
              <tip.icon className="size-8 text-accent flex-shrink-0" />
              <CardTitle className="font-headline text-xl">
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{tip.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
