'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Download, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const scopeSheetSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required.'),
  policyNumber: z.string().min(1, 'Policy number is required.'),
  clientName: z.string().min(1, 'Client name is required.'),
  clientEmail: z.string().email('Invalid email address.'),
  clientPhone: z.string().min(1, 'Phone number is required.'),
  propertyAddress: z.string().min(1, 'Property address is required.'),
  dateOfLoss: z.string().min(1, 'Date of loss is required.'),
  hailF: z.string().optional(),
  hailR: z.string().optional(),
  hailB: z.string().optional(),
  hailL: z.string().optional(),
  windF: z.string().optional(),
  windR: z.string().optional(),
  windB: z.string().optional(),
  windL: z.string().optional(),
  treeF: z.string().optional(),
  treeR: z.string().optional(),
  treeB: z.string().optional(),
  treeL: z.string().optional(),
  windDate: z.string().optional(),
  ladderNow: z.boolean().optional(),
  inspector: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  eaveLF: z.string().optional(),
  eaveNA: z.boolean().optional(),
  shingleType: z.array(z.string()).optional(),
  otherShingle: z.string().optional(),
  iceWaterShield: z.array(z.string()).optional(),
  dripEdge: z.array(z.string()).optional(),
  dripEdgeRadio: z.string().optional(),
  layers: z.string().optional(),
  pitch: z.string().optional(),
  valleyMetalLF: z.string().optional(),
  valleyMetalNA: z.boolean().optional(),
  shingleMake: z.array(z.string()).optional(),
  calcA: z.string().optional(),
  calcB: z.string().optional(),
  calcC: z.string().optional(),
  calcD: z.string().optional(),
  calcE: z.string().optional(),
  calcF: z.string().optional(),
  calcG: z.string().optional(),
  calcH: z.string().optional(),
  calcK: z.string().optional(),
  calcL: z.string().optional(),
  calcM: z.string().optional(),
  calcI: z.string().optional(),
  calcJ: z.string().optional(),
  rakeLF: z.string().optional(),
  rakeNA: z.boolean().optional(),
  totalSquares: z.string().optional(),
  aerialMeasurements1Story: z.boolean().optional(),
  aerialMeasurements2Story: z.boolean().optional(),
  yesNoEaveRake: z.string().optional(),
  turbineQtyLead: z.string().optional(),
  turbineQtyPlastic: z.string().optional(),
  hvacventQtyLead: z.string().optional(),
  hvacventQtyPlastic: z.string().optional(),
  raindiverterQtyLead: z.string().optional(),
  raindiverterQtyPlastic: z.string().optional(),
  powerVentQtyLead: z.string().optional(),
  powerVentQtyPlastic: z.string().optional(),
  skylightQtyLead: z.string().optional(),
  skylightQtyPlastic: z.string().optional(),
  satQtyLead: z.string().optional(),
  satQtyPlastic: z-string().optional(),
  pipeQty: z.string().optional(),
  pipeLead: z.boolean().optional(),
  pipePlastic: z.boolean().optional(),
  guttersLF: z.string().optional(),
  guttersNA: z.boolean().optional(),
  guttersSize: z.string().optional(),
  downspoutsLF: z.string().optional(),
  downspoutsSize: z.string().optional(),
  fasciaSize: z.string().optional(),
  fasciaLF: z.string().optional(),
  fasciaNA: z.boolean().optional(),
  fasciaType: z.string().optional(),
  chimneyFlashing: z.string().optional(),
  chimneyOther: z.string().optional(),
  maxHailDiameter: z.string().optional(),
  stormDirection: z.string().optional(),
  collateralDamage: z.string().optional(),
  notes: z.string().optional(),
  boxVentsQtyLead: z.string().optional(),
  boxVentsQtyPlastic: z.string().optional(),
  boxVentsMetal: z.boolean().optional(),
  boxVentsPlastic: z.boolean().optional(),
  boxVentsMetalDamaged: z.boolean().optional(),
  ridgeVentMetalDamaged: z.boolean().optional(),
  ridgeVentLF: z.string().optional(),
  ridgeVentPlastic: z.boolean().optional(),
  otherSolar: z.boolean().optional(),
  otherVentE: z-boolean().optional(),
  otherExhaustVent: z.boolean().optional(),
  woodMetal: z.string().optional()
})

type ScopeSheetData = z.infer<typeof scopeSheetSchema>;

const mockData: ScopeSheetData = {
    claimNumber: 'DEMO-12345',
    policyNumber: 'DEMO-67890',
    clientName: 'John Appleseed',
    clientEmail: 'j.appleseed@example.com',
    clientPhone: '(555) 867-5309',
    propertyAddress: '1234 Main St, Anytown, USA 12345',
    dateOfLoss: '2025-11-08',
    hailF: '10', hailR: '8', hailB: '12', hailL: '9',
    windF: 'light', windR: '', windB: 'heavy', windL: '',
    treeF: '', treeR: 'branch', treeB: '', treeL: '',
    windDate: '2025-11-08',
    ladderNow: true,
    inspector: 'P Yarborough',
    phone: '310-357-1399',
    email: 'pyarborough@laddernow.com',
    shingleType: ['Laminate', '30 Y'],
    otherShingle: 'Metal Accent',
    iceWaterShield: ['Valley', 'Eave'],
    valleyMetalLF: '40',
    dripEdgeRadio: 'Yes',
    dripEdge: ['Eave', 'Rake'],
    layers: '1',
    pitch: '6/12',
    calcA: '100', calcB: '120', calcC: 'N/A', calcD: 'N/A', calcE: 'N/A', calcF: '150', calcG: '130', calcH: 'N/A', calcI: 'N/A', calcJ: 'N/A', calcK: 'N/A', calcL: 'N/A', calcM: 'N/A',
    eaveLF: '150',
    rakeLF: '180',
    aerialMeasurements1Story: true,
    aerialMeasurements2Story: false,
    totalSquares: '28',
    boxVentsMetal: true, boxVentsPlastic: true, boxVentsMetalDamaged: true,
    ridgeVentLF: '50', ridgeVentPlastic: true,
    turbineQtyLead: '2', turbineQtyPlastic: '',
    hvacventQtyLead: '', hvacventQtyPlastic: '1',
    raindiverterQtyLead: '', raindiverterQtyPlastic: '',
    powerVentQtyLead: '1', powerVentQtyPlastic: '',
    skylightQtyLead: '', skylightQtyPlastic: '',
    satQtyLead: '', satQtyPlastic: '',
    pipeQty: '3', pipeLead: false, pipePlastic: true,
    guttersLF: '150', guttersSize: '5"',
    downspoutsLF: '80', downspoutsSize: '2x3',
    fasciaSize: '1x6', woodMetal: 'Metal',
    chimneyFlashing: 'Step',
    otherSolar: true, otherVentE: true, otherExhaustVent: false,
    maxHailDiameter: '1.5"',
    stormDirection: 'SW',
    collateralDamage: 'Window Screens, AC Fins',
    notes: 'Heavy hail damage observed on all slopes. Minor wind damage on the west-facing slope. Inspected property with homeowner present. All collateral damage was documented. Homeowner has a dog named "Sparky".',
};

export default function ScopeSheetPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof scopeSheetSchema>>({
    resolver: zodResolver(scopeSheetSchema),
    defaultValues: {
      claimNumber: '', policyNumber: '', clientName: '', clientEmail: '', clientPhone: '', propertyAddress: '', dateOfLoss: '',
      hailF: '', hailR: '', hailB: '', hailL: '', windF: '', windR: '', windB: '', windL: '', treeF: '', treeR: '', treeB: '', treeL: '',
      windDate: '', ladderNow: false, inspector: '', phone: '', email: '',
      eaveLF: '', eaveNA: false, shingleType: [], otherShingle: '', iceWaterShield: [], dripEdge: [], dripEdgeRadio: 'No',
      layers: '', pitch: '', valleyMetalLF: '', valleyMetalNA: false, shingleMake: [],
      calcA: '', calcB: '', calcC: '', calcD: '', calcE: '', calcF: '', calcG: '', calcH: '', calcK: '', calcL: '', calcM: '', calcI: '', calcJ: '',
      rakeLF: '', rakeNA: false, totalSquares: '', aerialMeasurements1Story: false, aerialMeasurements2Story: false,
      turbineQtyLead: '', turbineQtyPlastic: '', hvacventQtyLead: '', hvacventQtyPlastic: '', raindiverterQtyLead: '', raindiverterQtyPlastic: '',
      powerVentQtyLead: '', powerVentQtyPlastic: '', skylightQtyLead: '', skylightQtyPlastic: '', satQtyLead: '', satQtyPlastic: '',
      pipeQty: '', pipeLead: false, pipePlastic: false,
      guttersLF: '', guttersNA: false, guttersSize: '', downspoutsLF: '', downspoutsSize: '',
      fasciaSize: '', fasciaLF: '', fasciaNA: false, fasciaType: '',
      chimneyFlashing: '', chimneyOther: '', maxHailDiameter: '', stormDirection: '', collateralDamage: '', notes: '',
      boxVentsQtyLead: '', boxVentsQtyPlastic: '', boxVentsMetal: false, boxVentsPlastic: false, boxVentsMetalDamaged: false,
      ridgeVentMetalDamaged: false, ridgeVentLF: '', ridgeVentPlastic: false,
      otherSolar: false, otherVentE: false, otherExhaustVent: false,
      woodMetal: '',
    },
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const formValues = form.getValues();
    
    for (const key of Object.keys(formValues)) {
        if (params.has(key)) {
            const value = params.get(key)!;
            const field = key as keyof ScopeSheetData;
             if (typeof formValues[field] === 'boolean') {
                form.setValue(field, value === 'true');
             } else if (Array.isArray(formValues[field])) {
                form.setValue(field as any, value.split(','));
             } else {
                form.setValue(field, value);
             }
        }
    }
  }, [searchParams, form]);


  async function onSubmit(values: z.infer<typeof scopeSheetSchema>) {
    try {
        const url = '/satellite_base.pdf';
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();
        
        const drawText = (text: string, x: number, y: number, size = 10) => {
            if (!text) return;
            page.drawText(text, { x, y: height - y, size, font: helveticaFont, color: rgb(0, 0, 0) });
        };
        
        const drawCheck = (x: number, y: number) => {
             page.drawText('✓', { x, y: height - y, size: 12, font: helveticaFont, color: rgb(0, 0, 0) });
        }
        
        // --- DATA MAPPING ---

        // Header
        drawText(values.windDate || '', 450, 60);
        drawText(values.inspector || '', 450, 97);
        drawText(values.phone || '', 450, 119);
        drawText(values.email || '', 450, 141);

        // Damage Matrix
        drawText(values.hailF || '', 450, 192); drawText(values.windF || '', 505, 192); drawText(values.treeF || '', 560, 192);
        drawText(values.hailR || '', 450, 217); drawText(values.windR || '', 505, 217); drawText(values.treeR || '', 560, 217);
        drawText(values.hailB || '', 450, 242); drawText(values.windB || '', 505, 242); drawText(values.treeB || '', 560, 242);
        drawText(values.hailL || '', 450, 267); drawText(values.windL || '', 505, 267); drawText(values.treeL || '', 560, 267);
        
        // Shingles
        if(values.shingleType?.includes('3 Tab')) drawCheck(50, 311);
        if(values.shingleType?.includes('Laminate')) drawCheck(120, 311);
        if(values.shingleType?.includes('20 Y')) drawCheck(185, 311);
        if(values.shingleType?.includes('25 Y')) drawCheck(185, 327);
        if(values.shingleType?.includes('30 Y')) drawCheck(185, 343);
        if(values.shingleType?.includes('40 Y')) drawCheck(250, 311);
        if(values.shingleType?.includes('50 Y')) drawCheck(250, 327);
        drawText(values.otherShingle || '', 95, 345);

        // Ice/Water
        if(values.iceWaterShield?.includes('Valley')) drawCheck(50, 373);
        if(values.iceWaterShield?.includes('Eave')) drawCheck(120, 373);
        if(values.iceWaterShield?.includes('Rake')) drawCheck(50, 389);
        drawText(values.valleyMetalLF || '', 240, 375);
        
        // Drip Edge
        if(values.dripEdgeRadio === 'Yes') drawCheck(50, 418);
        if(values.dripEdgeRadio === 'No') drawCheck(120, 418);
        if(values.dripEdge?.includes('Eave')) drawCheck(185, 418);
        if(values.dripEdge?.includes('Rake')) drawCheck(250, 418);

        // Left Rail
        drawText(values.layers || '', 160, 442);
        drawText(values.pitch || '', 160, 467);
        if(values.boxVentsMetal) drawCheck(148, 490);
        if(values.boxVentsPlastic) drawCheck(182, 490);
        if(values.boxVentsMetalDamaged) drawCheck(218, 490);
        drawText(values.ridgeVentLF || '', 160, 513);
        drawText(values.turbineQtyLead || '', 160, 538); // This is an estimation. The PDF has no labels
        drawText(values.hvacventQtyLead || '', 160, 560);
        drawText(values.raindiverterQtyLead || '', 160, 582);
        drawText(values.powerVentQtyLead || '', 160, 604);
        drawText(values.skylightQtyLead || '', 160, 626);
        drawText(values.satQtyLead || '', 160, 648);
        drawText(values.pipeQty || '', 155, 672);
        if(values.pipeLead) drawCheck(188, 670);
        if(values.pipePlastic) drawCheck(218, 670);
        drawText(values.guttersLF || '', 155, 695);
        if(values.guttersSize === '5"') drawCheck(188, 693);
        if(values.guttersSize === '6"') drawCheck(218, 693);
        if(values.downspoutsSize === '3x4') drawCheck(148, 715);
        if(values.downspoutsSize === '2x3') drawCheck(182, 715);
        drawText(values.fasciaSize || '', 160, 738);
        if(values.woodMetal === 'Wood') drawCheck(148, 760);
        if(values.woodMetal === 'Metal') drawCheck(182, 760);
        drawText(values.chimneyFlashing || '', 160, 783);

        // Calculations
        drawText(values.calcA || '', 315, 313); drawText(values.calcB || '', 385, 313); drawText(values.calcC || '', 455, 313);
        drawText(values.calcD || '', 525, 313); drawText(values.calcE || '', 315, 330); drawText(values.calcF || '', 385, 330);
        drawText(values.calcG || '', 455, 330); drawText(values.calcH || '', 525, 330); drawText(values.calcI || '', 315, 347);
        drawText(values.calcJ || '', 385, 347); drawText(values.calcK || '', 455, 347); drawText(values.calcL || '', 525, 347);
        drawText(values.calcM || '', 315, 364);

        drawText(values.eaveLF || '', 315, 390);
        drawText(values.rakeLF || '', 315, 415);
        if(values.aerialMeasurements1Story) drawCheck(300, 438);
        if(values.aerialMeasurements2Story) drawCheck(355, 438);
        drawText(values.totalSquares || '', 475, 438);

        // Footer
        drawText(values.maxHailDiameter || '', 100, 890);
        drawText(values.stormDirection || '', 250, 890);
        drawText(values.collateralDamage || '', 420, 890);
        
        const notes = values.notes || '';
        const notesLines = [];
        const maxLineChars = 85;
        for (let i = 0; i < notes.length; i += maxLineChars) {
            notesLines.push(notes.substring(i, i + maxLineChars));
        }
        notesLines.forEach((line, index) => {
            drawText(line, 40, 915 + (index * 12), 10);
        });

        // --- SAVE AND DOWNLOAD ---
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ScopeSheet-${values.claimNumber || 'DEMO'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Report Generated',
            description: 'Your PDF report has been downloaded.',
        });

    } catch (e) {
        console.error(e);
        toast({
            title: 'Error Generating Report',
            description: 'There was a problem creating the PDF. Please try again.',
            variant: 'destructive',
        });
    }
  }

  const handleTestReport = () => {
    form.reset(mockData);
    setTimeout(() => {
        form.handleSubmit(onSubmit)();
    }, 100);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              Digital Scope Sheet
            </h1>
            <p className="text-muted-foreground">
              Fill out the details for the new inspection.
            </p>
          </div>
          <div className='flex gap-2'>
             <Button type="button" onClick={handleTestReport} variant="outline">
                <FileText className="mr-2" />
                Test Report
            </Button>
            <Button type="submit">
                <Download className="mr-2" />
                Download Report
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Claim & Property</CardTitle>
            <CardDescription>
              Primary claim, client, and property information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="claimNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CLM-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., POL-67890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Loss</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., jane.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g., (555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem className="lg:col-span-3">
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 123 Main St, Anytown, USA 12345"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Roof & Shingle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              <FormField
                control={form.control}
                name="eaveLF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eave (LF)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="shingleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shingle Type</FormLabel>
                     <div className="flex flex-col space-y-1 pt-2">
                     {['3 Tab', 'Laminate'].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="shingleType"
                        render={({ field }) => {
                          return (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shingleMake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shingle Make</FormLabel>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
                      {['20 Y', '25 Y', '30 Y', '40 Y', '50 Y'].map(make => (
                         <FormField
                            key={make}
                            control={form.control}
                            name="shingleMake"
                            render={({ field }) => {
                            return (
                                <FormItem key={make} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(make)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...(field.value || []), make])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== make
                                            )
                                        )
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {make}
                                </FormLabel>
                                </FormItem>
                            )
                            }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherShingle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
             
              <FormField
                control={form.control}
                name="iceWaterShield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ice/Water Shield</FormLabel>
                    {['Valley', 'Eave', 'Rake'].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="iceWaterShield"
                        render={({ field }) => {
                          return (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
                <div>
                     <FormField
                        control={form.control}
                        name="dripEdgeRadio"
                        render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Drip Edge</FormLabel>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex items-center space-x-2"
                            >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="Yes" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="No" />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="dripEdge"
                        render={() => (
                        <FormItem className="mt-2">
                            {['Eave', 'Rake'].map((item) => (
                            <FormField
                                key={item}
                                control={form.control}
                                name="dripEdge"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item
                                                )
                                            )
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                            ))}
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="layers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layers</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pitch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pitch</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valleyMetalLF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valley Metal (LF)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Calculations</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].map(item => (
                        <FormField
                            key={item}
                            control={form.control}
                            name={`calc${item}` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{item}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Measurements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="rakeLF"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rake (LF)</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="totalSquares"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Squares</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div>
                        <FormLabel>Aerial Measurements</FormLabel>
                         <div className="grid grid-cols-2 gap-4 mt-2">
                             <FormField
                                control={form.control}
                                name="aerialMeasurements1Story"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox checked={!!field.value} onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel className="font-normal">1 Story</FormLabel>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="aerialMeasurements2Story"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox checked={!!field.value} onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <FormLabel className="font-normal">2 Story</FormLabel>
                                    </FormItem>
                                )}
                            />
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>


        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Accessories & Damage</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="grid grid-cols-3 gap-2 items-center mb-4">
                            <div/>
                            <FormLabel className="text-center">Qty Lead</FormLabel>
                            <FormLabel className="text-center">Qty Plastic</FormLabel>
                        </div>
                        {['boxVents', 'turbine', 'hvacvent', 'raindiverter', 'powerVent', 'skylight', 'sat'].map(item => {
                            const name = item.charAt(0).toUpperCase() + item.slice(1).replace('vent',' Vent').replace('vents',' Vents');
                            return (
                                <div key={item} className="grid grid-cols-3 gap-2 items-center mb-2">
                                     <FormLabel>{name}</FormLabel>
                                     <FormField
                                        control={form.control}
                                        name={`${item}QtyLead` as any}
                                        render={({ field }) => (
                                            <FormItem><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`${item}QtyPlastic` as any}
                                        render={({ field }) => (
                                            <FormItem><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                </div>
                            )
                        })}
                         <div className="grid grid-cols-3 gap-2 items-center mb-2">
                            <FormLabel>Pipes</FormLabel>
                            <FormField control={form.control} name="pipeQty" render={({ field }) => (
                                <FormItem><FormControl><Input {...field} /></FormControl></FormItem>
                            )}/>
                            <div className="flex items-center gap-2">
                                <FormField control={form.control} name="pipeLead" render={({ field }) => (
                                    <FormItem className="flex items-center space-x-1"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">L</FormLabel></FormItem>
                                )}/>
                                 <FormField control={form.control} name="pipePlastic" render={({ field }) => (
                                    <FormItem className="flex items-center space-x-1"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel className="font-normal">P</FormLabel></FormItem>
                                )}/>
                            </div>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 items-end">
                            <FormField control={form.control} name="ridgeVentLF" render={({ field }) => (
                                <FormItem><FormLabel>Ridge Vent LF</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="ridgeVentPlastic" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel>Plastic</FormLabel></FormItem>
                            )}/>
                        </div>
                         <FormField control={form.control} name="ridgeVentMetalDamaged" render={({ field }) => (
                            <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange}/></FormControl><FormLabel>Metal Damaged</FormLabel></FormItem>
                        )}/>

                        <Separator/>
                        
                        <FormField control={form.control} name="guttersLF" render={({ field }) => (
                            <FormItem><FormLabel>Gutters LF</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="guttersSize"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gutters Size</FormLabel>
                                <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value='5"' />
                                    </FormControl>
                                    <FormLabel className="font-normal">5"</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value='6"' />
                                    </FormControl>
                                    <FormLabel className="font-normal">6"</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="downspoutsLF" render={({ field }) => (
                            <FormItem><FormLabel>Downspouts LF</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField
                            control={form.control}
                            name="downspoutsSize"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Downspouts Size</FormLabel>
                                <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value='2x3' />
                                    </FormControl>
                                    <FormLabel className="font-normal">2x3</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value='3x4' />
                                    </FormControl>
                                    <FormLabel className="font-normal">3x4</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}/>
                     </div>
                     <div className="space-y-4">
                        <FormField control={form.control} name="fasciaLF" render={({ field }) => (
                            <FormItem><FormLabel>Fascia Wood / Metal</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="chimneyFlashing" render={({ field }) => (
                            <FormItem><FormLabel>Chimney Flashing</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="chimneyOther" render={({ field }) => (
                            <FormItem><FormLabel>Other</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                     </div>
                 </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Notes and Key</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                 <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea {...field} rows={12} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Key</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1 text-muted-foreground">
                            <p>TS = Test Square</p>
                            <p>B = Blistering</p>
                            <p>M = Mechanical Damage</p>
                            <p>TC = Thermal Cracking</p>
                            <p>PV = Power Vent</p>
                            <p>TD = Tree Damage</p>
                            <p>☐ = Box Vent</p>
                            <p>⚫ = HVAC</p>
                            <p>☑ = Chimney</p>
                            <p>X = Wind Damage</p>
                            <p>⚪ = Pipe Boot</p>
                            <p>E = Exhaust vent</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-lg">Inch to Decimal</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1 text-muted-foreground grid grid-cols-2">
                            <p>1” = .08</p><p>5” = .42</p><p>9” = .75</p>
                            <p>2” = .17</p><p>6” = .50</p><p>10” = .83</p>
                            <p>3” = .25</p><p>7” = .58</p><p>11” = .92</p>
                            <p>4” = .33</p><p>8” = .67</p><p>12” = 1.00</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>

      </form>
    </Form>
  )
}
