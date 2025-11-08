import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FileText, Camera, Shield, Lightbulb } from 'lucide-react'

const practices = [
  {
    title: 'Thorough Documentation',
    icon: FileText,
    items: [
      'Fill out every relevant field in the scope sheet, even if it seems minor. The more data, the better.',
      'Use the "Notes" section to add context that isn\'t captured elsewhere, like homeowner conversations or unusual site conditions.',
      'Double-check claim and policy numbers to avoid administrative errors downstream.',
    ],
  },
  {
    title: 'Effective Photo-Documentation',
    icon: Camera,
    items: [
      'Take overview shots of all four sides of the property and the roof from a distance.',
      'Capture close-up photos of any damage, using a reference object (like a coin or ruler) for scale.',
      'Label your images clearly or use the AI Image Analysis tool to automatically generate descriptions.',
      'Photograph collateral damage (e.g., damaged gutters, window screens, AC units) to support your claim.',
    ],
  },
  {
    title: 'Safety & Compliance',
    icon: Shield,
    items: [
      'Always follow proper ladder safety procedures when accessing a roof.',
      'Be aware of your surroundings, including power lines, unstable surfaces, and weather conditions.',
      'Use the Compliance Checklists to ensure your final report meets local and industry standards.',
    ],
  },
  {
    title: 'Leveraging AI Tools',
    icon: Lightbulb,
    items: [
      'Use the "Import Claim" feature with a screenshot to reduce manual data entry and errors.',
      'Run all primary damage photos through the AI Image Analysis tool for a second opinion and consistent descriptions.',
      'Review the AI-generated report and supplement it with your own expert observations in the notes.',
    ],
  },
]

export default function BestPracticesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Best Practices Guide
        </h1>
        <p className="text-muted-foreground">
          Follow these guidelines to produce consistent, high-quality inspection
          reports.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {practices.map((practice, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold font-headline">
                  <div className="flex items-center gap-3">
                    <practice.icon className="size-6 text-primary" />
                    {practice.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-9 pt-2 list-disc list-outside marker:text-muted-foreground">
                    {practice.items.map((item, i) => (
                      <li key={i} className="text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
