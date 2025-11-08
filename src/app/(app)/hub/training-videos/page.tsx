import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'

const videos = [
  {
    title: 'Mastering the Digital Scope Sheet',
    duration: '12:34',
    description:
      'A complete walkthrough of every field and feature in the scope sheet form.',
    thumbnail: 'https://picsum.photos/seed/v1/600/400',
    hint: 'document form',
  },
  {
    title: 'AI Image Analysis for Beginners',
    duration: '08:52',
    description:
      'Learn how to use the AI tool to quickly spot roof damage from photos.',
    thumbnail: 'https://picsum.photos/seed/v2/600/400',
    hint: 'roof damage',
  },
  {
    title: 'Generating Your First PDF Report',
    duration: '05:15',
    description:
      'From a filled-out form to a downloaded, print-perfect PDF in 5 minutes.',
    thumbnail: 'https://picsum.photos/seed/v3/600/400',
    hint: 'pdf document',
  },
  {
    title: 'Advanced Diagramming Techniques',
    duration: '15:20',
    description:
      'Tips and tricks for accurately diagramming complex roof geometries.',
    thumbnail: 'https://picsum.photos/seed/v4/600/400',
    hint: 'roof blueprint',
  },
  {
    title: 'Using Sub-Sheets for Specialized Reports',
    duration: '09:11',
    description: 'How to create and use templates for water, fire, or hail damage.',
    thumbnail: 'https://picsum.photos/seed/v5/600/400',
    hint: 'checklist form',
  },
  {
    title: 'Mobile Workflow: Inspecting On-Site',
    duration: '11:45',
    description:
      'Best practices for using ScopeSheet Pro on a tablet or phone in the field.',
    thumbnail: 'https://picsum.photos/seed/v6/600/400',
    hint: 'tablet field',
  },
]

export default function TrainingVideosPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Training Videos
        </h1>
        <p className="text-muted-foreground">
          Watch tutorials to master ScopeSheet Pro&apos;s features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card
            key={video.title}
            className="flex flex-col overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                data-ai-hint={video.hint}
                width={600}
                height={400}
                className="aspect-video object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md">
                {video.duration}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                {video.title}
              </CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button variant="outline" className="w-full">
                <PlayCircle className="mr-2" />
                Watch Video
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
