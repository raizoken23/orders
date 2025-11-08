'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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
  windDate: z.string().optional(),
  ladderNow: z.boolean().optional(),
  inspector: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  eaveLF: z.string().optional(),
  shingleType: z.string().optional(),
  otherShingle: z.string().optional(),
  iceWaterShield: z.boolean().optional(),
  dripEdge: z.boolean().optional(),
  layers: z.string().optional(),
  pitch: z.string().optional(),
  valleyMetalLF: z.string().optional(),
  shingleMake: z.string().optional(),
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
  totalSquares: z.string().optional(),
  aerialMeasurements1Story: z.string().optional(),
  aerialMeasurements2Story: z.string().optional(),
  yesNoEaveRake: z.string().optional(),
  turbineQtyLead: z.string().optional(),
  turbineQtyPlastic: z.string().optional(),
  hvacVentQtyLead: z.string().optional(),
  hvacVentQtyPlastic: z.string().optional(),
  rainDiverterQtyLead: z.string().optional(),
  rainDiverterQtyPlastic: z.string().optional(),
  powerVentQtyLead: z.string().optional(),
  powerVentQtyPlastic: z.string().optional(),
  skylightQtyLead: z.string().optional(),
  skylightQtyPlastic: z.string().optional(),
  satQtyLead: z.string().optional(),
  satQtyPlastic: z.string().optional(),
  pipesQtyLead: z.string().optional(),
  pipesQtyPlastic: z.string().optional(),
  guttersLF: z.string().optional(),
  guttersSize: z.string().optional(),
  downspoutsLF: z.string().optional(),
  downspoutsSize: z.string().optional(),
  fasciaWood: z.string().optional(),
  fasciaMetal: z.string().optional(),
  chimneyFlashing: z.string().optional(),
  chimneyOther: z.string().optional(),
  maxHailDiameter: z.string().optional(),
  stormDirection: z.string().optional(),
  collateralDamageF: z.string().optional(),
  collateralDamageB: z.string().optional(),
  collateralDamageR: z.string().optional(),
  collateralDamageL: z.string().optional(),
  notes: z.string().optional(),
  boxVentsQtyLead: z.string().optional(),
  boxVentsQtyPlastic: z.string().optional(),
  ridgeVentMetalDamaged: z.string().optional(),
  ridgeVentLF: z.string().optional(),
  ridgeVentPlastic: z.string().optional(),
})

export default function ScopeSheetPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof scopeSheetSchema>>({
    resolver: zodResolver(scopeSheetSchema),
    defaultValues: {
      claimNumber: '',
      policyNumber: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      propertyAddress: '',
      dateOfLoss: '',
      hailF: '',
      hailR: '',
      hailB: '',
      hailL: '',
      windDate: '',
      ladderNow: false,
      inspector: '',
      phone: '',
      email: '',
      eaveLF: '',
      shingleType: '',
      otherShingle: '',
      iceWaterShield: false,
      dripEdge: false,
      layers: '',
      pitch: '',
      valleyMetalLF: '',
      shingleMake: '',
      calcA: '',
      calcB: '',
      calcC: '',
      calcD: '',
      calcE: '',
      calcF: '',
      calcG: '',
      calcH: '',
      calcK: '',
      calcL: '',
      calcM: '',
      calcI: '',
      calcJ: '',
      rakeLF: '',
      totalSquares: '',
      aerialMeasurements1Story: '',
      aerialMeasurements2Story: '',
      yesNoEaveRake: '',
      turbineQtyLead: '',
      turbineQtyPlastic: '',
      hvacVentQtyLead: '',
      hvacVentQtyPlastic: '',
      rainDiverterQtyLead: '',
      rainDiverterQtyPlastic: '',
      powerVentQtyLead: '',
      powerVentQtyPlastic: '',
      skylightQtyLead: '',
      skylightQtyPlastic: '',
      satQtyLead: '',
      satQtyPlastic: '',
      pipesQtyLead: '',
      pipesQtyPlastic: '',
      guttersLF: '',
      guttersSize: '',
      downspoutsLF: '',
      downspoutsSize: '',
      fasciaWood: '',
      fasciaMetal: '',
      chimneyFlashing: '',
      chimneyOther: '',
      maxHailDiameter: '',
      stormDirection: '',
      collateralDamageF: '',
      collateralDamageB: '',
      collateralDamageR: '',
      collateralDamageL: '',
      notes: '',
      boxVentsQtyLead: '',
      boxVentsQtyPlastic: '',
      ridgeVentMetalDamaged: '',
      ridgeVentLF: '',
      ridgeVentPlastic: '',
    },
  })

  useEffect(() => {
    searchParams.forEach((value, key) => {
      if (key === 'ladderNow' || key === 'iceWaterShield' || key === 'dripEdge') {
        form.setValue(key, value === 'true');
      } else if (Object.keys(form.getValues()).includes(key)) {
        form.setValue(key as any, value);
      }
    });
  }, [searchParams, form])

  function onSubmit(values: z.infer<typeof scopeSheetSchema>) {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'letter',
    });

    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Helper function for drawing text
    const text = (
      text: string,
      x: number,
      y: number,
      options?: { align?: 'left' | 'center' | 'right'; color?: number[]; size?: number; font?: 'helvetica' | 'times' | 'courier'; style?: 'normal' | 'bold' | 'italic' }
    ) => {
      if (options?.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
      if (options?.size) doc.setFontSize(options.size);
      if (options?.font && options?.style) doc.setFont(options.font, options.style);
      else if (options?.font) doc.setFont(options.font);
      else if (options?.style) doc.setFont('helvetica', options.style);
      
      doc.text(text, x, y, { align: options?.align || 'left' });
      
      // Reset to defaults
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    };

    // Draw main frame
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(margin, margin, docWidth - margin * 2, docHeight - margin * 2);

    // Header
    const headerY = margin + 15;
    text('ScopeSheet Pro', margin + 10, headerY, { size: 16, style: 'bold'});
    text(`Claim: ${values.claimNumber}`, docWidth / 2, headerY, { size: 12, align: 'center'});
    text(`Date: ${new Date().toLocaleDateString()}`, docWidth - margin - 10, headerY, { size: 10, align: 'right'});
    
    // --- Top section ---
    let yPos = margin + 30;
    doc.line(margin, yPos, docWidth - margin, yPos);

    // Shingle Type
    let xPos = margin;
    let shingleBoxWidth = 100;
    doc.rect(xPos, yPos, shingleBoxWidth, 70);
    text('Shingle Type', xPos + 5, yPos + 10, { style: 'bold' });
    const shingleTypes = ['3 Tab', 'Laminate', 'Other:'];
    shingleTypes.forEach((type, i) => {
      doc.rect(xPos + 5, yPos + 18 + i * 15, 8, 8);
      text(type, xPos + 15, yPos + 25 + i * 15);
    });

    const shingleMakes = ['20 Y', '25 Y', '30 Y', '40 Y', '50 Y'];
    shingleMakes.forEach((make, i) => {
       doc.rect(xPos + 50, yPos + 18 + (i % 3) * 15, 8, 8);
       text(make, xPos + 60, yPos + 25 + (i % 3) * 15);
       if (i == 2) {
         xPos += 40; // shift for 40y and 50y
       }
    });
    if (values.shingleType) text(values.shingleType, xPos + 15 + 30, yPos + 25 + 2 * 15);


    // Ice/Water Shield, Drip Edge
    yPos += 70;
    doc.rect(margin, yPos, shingleBoxWidth, 40);
    text('Ice/Water Shield', margin + 5, yPos + 10, {style: 'bold'});
    doc.rect(margin + 5, yPos + 15, 8, 8);
    text('Valley', margin + 15, yPos + 22);
    doc.rect(margin + 40, yPos + 15, 8, 8);
    text('Eave', margin + 50, yPos + 22);
    doc.rect(margin + 70, yPos + 15, 8, 8);
    text('Rake', margin + 80, yPos + 22);

    yPos += 40;
    doc.rect(margin, yPos, shingleBoxWidth, 25);
    text('Drip Edge', margin + 5, yPos + 10, {style: 'bold'});
    doc.rect(margin + 5, yPos + 14, 8, 8);
    text('Yes', margin + 15, yPos + 21);
    doc.rect(margin + 35, yPos + 14, 8, 8);
    text('No', margin + 45, yPos + 21);
    doc.rect(margin + 65, yPos + 14, 8, 8);
    text('Eave', margin + 75, yPos + 21);
    
    // Valley Metal
    yPos += 25;
    doc.rect(margin, yPos, shingleBoxWidth, 25);
    text('Valley Metal', margin + 5, yPos + 10, {style: 'bold'});
    text('LF', margin + 75, yPos + 20);
    if(values.valleyMetalLF) text(values.valleyMetalLF, margin + 55, yPos + 20);

    // Layers, Pitch
    yPos += 25;
    doc.rect(margin, yPos, shingleBoxWidth, 25);
    text('Layers:', margin + 5, yPos + 15, { style: 'bold' });
    if(values.layers) text(values.layers, margin + 45, yPos + 15);

    yPos += 25;
    doc.rect(margin, yPos, shingleBoxWidth, 25);
    text('Pitch:', margin + 5, yPos + 15, { style: 'bold' });
    if(values.pitch) text(values.pitch, margin + 45, yPos + 15);

    
    // Middle Top Section
    let middleX = margin + shingleBoxWidth + 5;
    let middleY = margin + 30;
    let middleWidth = docWidth - (margin * 2) - shingleBoxWidth - 5;
    
    // Eave / Rake
    doc.rect(middleX, middleY, middleWidth, 25);
    text(`Eave: LF ${values.eaveLF || 'N/A'}`, middleX + 5, middleY + 15);
    text(`Rake: LF ${values.rakeLF || 'N/A'}`, middleX + 150, middleY + 15);
    text(`Email: ${values.clientEmail || ''}`, middleX + 300, middleY + 15);

    // Calculations & Aerial Measurements
    middleY += 25;
    doc.rect(middleX, middleY, middleWidth, 80);
    text('Calculations:', middleX + 5, middleY + 10, {style: 'bold'});
    text('Aerial Measurements:', middleX + 300, middleY + 10, {style: 'bold'});
    
    const calcs = ['A', 'B', 'C', 'D', 'E'];
    calcs.forEach((c, i) => {
        text(`${c} ${values[`calc${c}`] || 'N/A'}`, middleX + 5, middleY + 25 + i * 12);
    });
    const calcs2 = ['F', 'G', 'H', 'I', 'J'];
    calcs2.forEach((c, i) => {
        text(`${c} ${values[`calc${c}`] || 'N/A'}`, middleX + 90, middleY + 25 + i * 12);
    });
     const calcs3 = ['K', 'L', 'M'];
    calcs3.forEach((c, i) => {
        text(`${c} ${values[`calc${c}`] || 'N/A'}`, middleX + 180, middleY + 25 + i * 12);
    });

    text(`1 Story: ${values.aerialMeasurements1Story || ''}`, middleX + 300, middleY + 25);
    text(`2 Story: ${values.aerialMeasurements2Story || ''}`, middleX + 300, middleY + 40);

    // Total Squares
    middleY += 80;
    doc.rect(middleX, middleY, middleWidth, 25);
    text('Total Squares:', middleX + 150, middleY + 15, {style: 'bold'});
    if(values.totalSquares) text(values.totalSquares, middleX + 220, middleY + 15);
    
    // Key
    middleY += 25;
    doc.rect(middleX, middleY, middleWidth, 50);
    text('Key:', middleX + 5, middleY + 10, {style: 'bold'});
    const keyItems = [
      'TS = Test Square', 'B = Blistering', 'M = Mechanical Damage',
      'TC = Thermal Cracking', 'PV = Power Vent', 'TD = Tree Damage',
      '☐ = Box Vent', '⚫ = HVAC', '☑ = Chimney',
      'X = Wind Damage', '○ = Pipe Boot', 'E = Exhaust vent'
    ];
    keyItems.forEach((item, i) => {
      text(item, middleX + 5 + (Math.floor(i/4) * 120), middleY + 22 + (i % 4) * 10);
    });

    // Inch to Decimal
    const decimalTableX = middleX + middleWidth - 120;
    doc.rect(decimalTableX, middleY - 25, 120, 75);
    const inches = [1,2,3,4,5,6];
    const decimals = ['.08', '.17', '.25', '.33', '.42', '.50'];
    const inches2 = [7,8,9,10,11,12];
    const decimals2 = ['.58', '.67', '.75', '.83', '.92', '1.00'];

    inches.forEach((inch, i) => {
      text(`${inch}"`, decimalTableX + 5, middleY - 15 + i * 12);
      text(decimals[i], decimalTableX + 25, middleY - 15 + i * 12);
    });
     inches2.forEach((inch, i) => {
      text(`${inch}"`, decimalTableX + 65, middleY - 15 + i * 12);
      text(decimals2[i], decimalTableX + 85, middleY - 15 + i * 12);
    });

    // Main Grid Area
    const gridY = middleY + 50;
    const gridX = middleX;
    const gridWidth = middleWidth;
    const gridHeight = docHeight - gridY - margin - 50;
    doc.rect(gridX, gridY, gridWidth, gridHeight);
    doc.setDrawColor(200);
    for (let i = 1; i < (gridWidth / 10); i++) {
        doc.line(gridX + i * 10, gridY, gridX + i * 10, gridY + gridHeight);
    }
    for (let i = 1; i < (gridHeight / 10); i++) {
        doc.line(gridX, gridY + i * 10, gridX + gridWidth, gridY + i * 10);
    }
    doc.setDrawColor(0);


    // Left side panel continued
    let leftPanelY = margin + 265;
    const leftPanelX = margin;
    const leftPanelWidth = shingleBoxWidth;

    const accessories = [
      { name: 'Box Vents', fields: ['Metal', 'Plastic', 'Damaged'] },
      { name: 'Ridge Vent', fields: ['LF', 'Plastic'] },
      { name: 'Turbine', fields: [] },
      { name: 'HVAC Vent', fields: [] },
      { name: 'Rain Diverter', fields: [] },
      { name: 'Power Vent', fields: [] },
      { name: 'Skylight', fields: [] },
      { name: 'SAT', fields: [] },
    ];
    accessories.forEach(acc => {
      doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 20);
      text(acc.name, leftPanelX + 2, leftPanelY + 12, {size: 7, style: 'bold'});
      leftPanelY+=20;
    })

    // Pipes
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 20);
    text('Pipes:', leftPanelX + 2, leftPanelY + 12, {size: 7, style: 'bold'});
    text('Qty', leftPanelX + 35, leftPanelY + 8, {size: 6});
    text('Lead', leftPanelX + 60, leftPanelY + 8, {size: 6});
    text('Qty', leftPanelX + 35, leftPanelY + 18, {size: 6});
    text('Plastic', leftPanelX + 60, leftPanelY + 18, {size: 6});
    leftPanelY+=20;

    // Gutters
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 20);
    text('Gutters:', leftPanelX + 2, leftPanelY + 12, {size: 7, style: 'bold'});
    doc.rect(leftPanelX + 50, leftPanelY + 8, 8, 8); text('5"', leftPanelX + 60, leftPanelY+15, {size: 7})
    doc.rect(leftPanelX + 75, leftPanelY + 8, 8, 8); text('6"', leftPanelX + 85, leftPanelY+15, {size: 7})
    leftPanelY+=20;

    // Downspouts
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 20);
    text('Downspouts:', leftPanelX + 2, leftPanelY + 12, {size: 7, style: 'bold'});
    doc.rect(leftPanelX + 50, leftPanelY + 8, 8, 8); text('2x3', leftPanelX + 60, leftPanelY+15, {size: 7})
    doc.rect(leftPanelX + 75, leftPanelY + 8, 8, 8); text('3x4', leftPanelX + 85, leftPanelY+15, {size: 7})
    leftPanelY+=20;

    // Fascia
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 20);
    text('Fascia:', leftPanelX + 2, leftPanelY + 12, {size: 7, style: 'bold'});
    text('Size', leftPanelX + 35, leftPanelY + 8, {size: 6});
    text('LF', leftPanelX + 60, leftPanelY + 8, {size: 6});
    text('N/A', leftPanelX + 80, leftPanelY + 8, {size: 6});
    leftPanelY+=20;

    // Wood / Metal
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 15);
    text('Wood / Metal', leftPanelX + 2, leftPanelY + 10, {size: 7, style: 'bold'});
    leftPanelY+=15;

    // Chimney Flashing
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 15);
    text('Chimney Flashing:', leftPanelX + 2, leftPanelY + 10, {size: 7, style: 'bold'});
    leftPanelY+=15;
    
    // Other
    doc.rect(leftPanelX, leftPanelY, leftPanelWidth, 40);
    text('Other:', leftPanelX + 2, leftPanelY + 10, {size: 7, style: 'bold'});
    text('Solar', leftPanelX+5, leftPanelY+20, {size: 7});
    text('Vent E', leftPanelX+5, leftPanelY+30, {size: 7});
    text('Exhaust Vent', leftPanelX+35, leftPanelY+30, {size: 7});
    leftPanelY+=40;


    // --- Bottom section ---
    const bottomY = docHeight - margin - 45;
    doc.line(margin, bottomY, docWidth - margin, bottomY);

    // Max Hail, Storm Direction, Collateral
    text('Max Hail Diameter:', margin + 5, bottomY + 10, {size: 7, style: 'bold'});
    text(values.maxHailDiameter || '', margin + 75, bottomY + 10, {size: 7});
    text('Storm Direction:', margin + 5, bottomY + 22, {size: 7, style: 'bold'});
    text(values.stormDirection || '', margin + 75, bottomY + 22, {size: 7});
    text('Collateral Damage:', margin + 5, bottomY + 34, {size: 7, style: 'bold'});
    text(values.collateralDamageF || '', margin + 75, bottomY + 34, {size: 7});


    // Notes
    text('Notes:', gridX + 5, bottomY + 10, { style: 'bold' });
    const notesLines = doc.splitTextToSize(values.notes || '', gridWidth - 100);
    text(notesLines.join('\n'), gridX + 5, bottomY + 22);

    // Compass
    const compassX = docWidth - margin - 25;
    const compassY = bottomY + 22;
    doc.circle(compassX, compassY, 15);
    text('N', compassX, compassY - 10, {align: 'center'});
    text('S', compassX, compassY + 14, {align: 'center'});
    text('W', compassX - 12, compassY + 2, {align: 'center'});
    text('E', compassX + 12, compassY + 2, {align: 'center'});

    // Footer
    const footerY = docHeight - margin + 10;
    text('ScopeSheet Pro', margin, footerY, {size: 8});
    text('(866)801-1258', docWidth - margin, footerY, {size: 8, align: 'right'});
    
    doc.save(`ScopeSheet-${values.claimNumber}.pdf`);

    toast({
      title: 'Report Generated',
      description: 'Your PDF report has been downloaded.',
    })
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
          <Button type="submit">
            <Download className="mr-2" />
            Download Report
          </Button>
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
            <CardTitle className="font-headline">Inspection Details</CardTitle>
            <CardDescription>
              Hail, wind, and inspector information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <FormLabel>Hail</FormLabel>
                <FormField
                  control={form.control}
                  name="hailF"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-4">F:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hailR"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-4">R:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hailB"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-4">B:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hailL"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-4">L:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="windDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inspector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspector</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ladderNow"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Ladder Now</FormLabel>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
              <div className="flex items-center gap-8 pt-6">
                <FormField
                  control={form.control}
                  name="iceWaterShield"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Ice/Water Shield</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dripEdge"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Drip Edge</FormLabel>
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
              <FormField
                control={form.control}
                name="shingleMake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shingle Make</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3 Tab 20 Y" />
                        </FormControl>
                        <FormLabel className="font-normal">3 Tab 20 Y</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="25 Y" />
                        </FormControl>
                        <FormLabel className="font-normal">25 Y</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="30 Y" />
                        </FormControl>
                        <FormLabel className="font-normal">30 Y</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="40 Y" />
                        </FormControl>
                        <FormLabel className="font-normal">40 Y</FormLabel>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="50 Y Laminate" />
                        </FormControl>
                        <FormLabel className="font-normal">50 Y Laminate</FormLabel>
                      </FormItem>
                    </RadioGroup>
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
                                    <FormItem>
                                        <FormLabel className="font-normal">1 Story</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="aerialMeasurements2Story"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal">2 Story</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                         </div>
                    </div>
                     <FormField
                        control={form.control}
                        name="yesNoEaveRake"
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel>Eave Rake</FormLabel>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex items-center space-x-4"
                                >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormItem>
                        )}
                    />
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
                        {['Turbine', 'HVAC Vent', 'Rain Diverter', 'Power Vent', 'Skylight', 'SAT', 'Pipes'].map(item => {
                            const name = item.toLowerCase().replace(' ', '') as 'turbine' | 'hvacvent' | 'raindiverter' | 'powervent' | 'skylight' | 'sat' | 'pipes';
                            return (
                                <div key={item} className="grid grid-cols-3 gap-2 items-center mb-2">
                                     <FormLabel>{item}</FormLabel>
                                     <FormField
                                        control={form.control}
                                        name={`${name}QtyLead` as any}
                                        render={({ field }) => (
                                            <FormItem><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`${name}QtyPlastic` as any}
                                        render={({ field }) => (
                                            <FormItem><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}
                                    />
                                </div>
                            )
                        })}
                    </div>
                     <div className="space-y-4">
                        <FormField control={form.control} name="guttersLF" render={({ field }) => (
                            <FormItem><FormLabel>Gutters LF</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="guttersSize" render={({ field }) => (
                            <FormItem><FormLabel>Gutters Size</FormLabel><FormControl><Input placeholder='5" or 6"' {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="downspoutsLF" render={({ field }) => (
                            <FormItem><FormLabel>Downspouts LF</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="downspoutsSize" render={({ field }) => (
                            <FormItem><FormLabel>Downspouts Size</FormLabel><FormControl><Input placeholder='2x3 or 3x4' {...field} /></FormControl></FormItem>
                        )}/>
                     </div>
                     <div className="space-y-4">
                        <FormField control={form.control} name="fasciaWood" render={({ field }) => (
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
                 <Separator className="my-6" />
                 <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="maxHailDiameter" render={({ field }) => (
                        <FormItem><FormLabel>Max Hail Diameter</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )}/>
                    <FormField control={form.control} name="stormDirection" render={({ field }) => (
                        <FormItem><FormLabel>Storm Direction</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )}/>
                    <div className="space-y-2">
                        <FormLabel>Collateral Damage</FormLabel>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <FormField control={form.control} name="collateralDamageF" render={({ field }) => (
                                <FormItem className="flex items-center gap-2"><FormLabel className="w-4">F:</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="collateralDamageB" render={({ field }) => (
                                <FormItem className="flex items-center gap-2"><FormLabel className="w-4">B:</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="collateralDamageR" render={({ field }) => (
                                <FormItem className="flex items-center gap-2"><FormLabel className="w-4">R:</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="collateralDamageL" render={({ field }) => (
                                <FormItem className="flex items-center gap-2"><FormLabel className="w-4">L:</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )}/>
                        </div>
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
                            <p>TC = Thermal Cracking</p>
                            <p>TD = Tree Damage</p>
                            <p>TS = Test Square</p>
                            <p>B = Blistering</p>
                            <p>X = Wind Damage</p>
                            <p>M = Mechanical Damage</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-lg">Inch to Decimal</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1 text-muted-foreground grid grid-cols-2">
                            <p>1” = .08</p><p>7” = .58</p>
                            <p>2” = .17</p><p>8” = .67</p>
                            <p>3” = .25</p><p>9” = .75</p>
                            <p>4” = .33</p><p>10” = .83</p>
                            <p>5” = .42</p><p>11” = .92</p>
                            <p>6” = .50</p><p>12” = 1.00</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>

      </form>
    </Form>
  )
}
