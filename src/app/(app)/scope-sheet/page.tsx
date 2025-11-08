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
    const contentWidth = docWidth - margin * 2;
  
    // Colors
    const green = [226, 240, 217];
    const yellow = [255, 242, 204];
    const blue = [222, 235, 247];
    const pink = [248, 203, 173];
    const grey = [242, 242, 242];
  
    // Helper function for drawing text
    const text = (
      text: string,
      x: number,
      y: number,
      options?: { align?: 'left' | 'center' | 'right'; color?: number[]; size?: number; font?: 'helvetica' | 'times' | 'courier'; style?: 'normal' | 'bold' | 'italic' }
    ) => {
      const { align = 'left', color = [0,0,0], size = 8, font = 'helvetica', style = 'normal' } = options || {};
      
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFontSize(size);
      doc.setFont(font, style);
      
      doc.text(text, x, y, { align });
      
      // Reset to defaults
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    };

    // Helper for drawing a filled rectangle with a label
    const coloredBox = (x: number, y: number, w: number, h: number, color: number[], label: string) => {
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(x, y, w, h, 'F');
        text(label, x + 2, y + h / 2 + 3, { size: 8 });
    };

    // --- Header ---
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(47, 117, 181);
    text('ScopeSheet Pro.', margin, margin + 20);
    doc.setFontSize(10);
    doc.setTextColor(0,0,0);
    text('(866) 801-1258', margin, margin + 35);


    // --- Top Right Info ---
    let topRightX = docWidth - margin - 225;
    let topRightY = margin;
    let boxWidth = 35;
    let boxHeight = 15;

    // Damage Type Boxes
    coloredBox(topRightX + 115, topRightY, boxWidth, boxHeight, pink, 'Hail');
    coloredBox(topRightX + 115 + boxWidth + 2, topRightY, boxWidth, boxHeight, pink, 'Wind');
    coloredBox(topRightX + 115 + (boxWidth+2)*2, topRightY, boxWidth, boxHeight, pink, 'Tree');

    // Hail Table
    const hailLabels = ['F:', 'R:', 'B:', 'L:'];
    const hailValues = [values.hailF, values.hailR, values.hailB, values.hailL];
    hailLabels.forEach((label, i) => {
        let y = topRightY + boxHeight + 2 + i * (boxHeight + 2);
        doc.rect(topRightX + 115, y, boxWidth, boxHeight);
        text(label, topRightX + 117, y + boxHeight/2 + 3);
        text(hailValues[i] || '', topRightX + 115 + boxWidth - 2, y + boxHeight/2 + 3, { align: 'right' });
    });
    
    // Wind Date
    doc.rect(topRightX + 115 + boxWidth + 2, topRightY + boxHeight + 2, boxWidth*2 + 2, boxHeight);
    text(`Date: ${values.windDate || ''}`, topRightX + 115 + boxWidth + 4, topRightY + boxHeight + 2 + boxHeight/2 + 3);

    // Main Info Box
    const infoFields = [
      { label: 'Ladder Now', value: values.ladderNow ? 'Yes' : 'No' },
      { label: 'Inspector:', value: values.inspector },
      { label: 'Phone:', value: values.phone },
      { label: 'Email:', value: values.email },
    ];
    let infoBoxX = topRightX - 120;
    infoFields.forEach((field, i) => {
      let y = topRightY + boxHeight + 2 + i * (boxHeight + 2);
      doc.rect(infoBoxX, y, 113, boxHeight);
      text(`${field.label} ${field.value || ''}`, infoBoxX + 2, y + boxHeight/2 + 3);
    });
    doc.rect(infoBoxX, topRightY, 227, boxHeight);
    text(`Date: ${values.dateOfLoss}`, infoBoxX + 2, topRightY + boxHeight/2 + 3);
    

    // --- Left Column ---
    let yPos = margin + 60;
    let xPos = margin;
    let leftColWidth = 120;

    // Shingle Type
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Shingle Type');
    yPos += boxHeight;
    doc.rect(xPos, yPos, leftColWidth, boxHeight * 2);
    text(`Eave: LF ${values.eaveLF || ''}`, xPos + 2, yPos + 10);
    text(values.shingleType || '', xPos + 2, yPos + 25);
    yPos += boxHeight * 2;
    
    // Other Shingle
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Other:');
    doc.rect(xPos, yPos + boxHeight, leftColWidth, boxHeight);
    text(values.otherShingle || '', xPos + 2, yPos + boxHeight + 10);
    yPos += boxHeight * 2;
    
    // Ice/Water Shield
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Ice/Water Shield');
    yPos += boxHeight;
    doc.rect(xPos, yPos, leftColWidth, boxHeight);
    text(`Valey Eave Rake`, xPos + 2, yPos + 10); // this is a static label
    if (values.iceWaterShield) {
        text('X', xPos + leftColWidth - 10, yPos + 10, {style: 'bold'});
    }
    yPos += boxHeight;
    
    // Drip Edge
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Drip Edge');
    yPos += boxHeight;
    doc.rect(xPos, yPos, leftColWidth, boxHeight);
    text('Yes', xPos + 2, yPos + 10);
    text('No', xPos + 32, yPos + 10);
    text('Eave', xPos + 62, yPos + 10);
    text('Rake', xPos + 92, yPos + 10);
    if(values.dripEdge) text('X', xPos + 20, yPos + 10, {style: 'bold'});
    else text('X', xPos + 50, yPos + 10, {style: 'bold'});
    yPos += boxHeight;

    // Layers
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Layers:');
    doc.rect(xPos, yPos + boxHeight, leftColWidth, boxHeight);
    text(values.layers || '', xPos + 2, yPos + boxHeight + 10);
    yPos += boxHeight * 2;

    // Pitch
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Pitch:');
    doc.rect(xPos, yPos + boxHeight, leftColWidth, boxHeight);
    text(values.pitch || '', xPos + 2, yPos + boxHeight + 10);
    yPos += boxHeight * 2;
    
    // Valley Metal
    coloredBox(xPos, yPos, leftColWidth, boxHeight, green, 'Valley Metal');
    doc.rect(xPos, yPos + boxHeight, leftColWidth, boxHeight);
    text(`LF ${values.valleyMetalLF || ''}`, xPos + 2, yPos + boxHeight + 10);
    yPos += boxHeight * 2;

    // Shingle Make
    const shingleMakes = ['3 Tab 20 Y', '25 Y', '30 Y', '40 Y', '50 Y Laminate'];
    shingleMakes.forEach((make, i) => {
        doc.rect(xPos, yPos + i * boxHeight, leftColWidth, boxHeight);
        text(make, xPos + 2, yPos + i * boxHeight + 10);
        if (values.shingleMake === make) {
            text('X', xPos + leftColWidth - 10, yPos + i * boxHeight + 10, {style: 'bold'});
        }
    })
    yPos += boxHeight * 5;

    // --- Middle Column (Accessories) ---
    let middleX = xPos + leftColWidth + 5;
    let middleY = margin + 60;
    const accWidth = 140;
    const accHeaderHeight = boxHeight * 2;

    // Header
    doc.setFillColor(yellow[0], yellow[1], yellow[2]);
    doc.rect(middleX, middleY, accWidth, accHeaderHeight, 'F');
    text('Qty Lead', middleX + 50, middleY + 12);
    text('Qty Plastic', middleX + 95, middleY + 12);
    text('Metal Damaged', middleX + 50, middleY + 28);
    text('LF Plastic', middleX + 105, middleY + 28);
    middleY += accHeaderHeight;

    const accessories = [
        { name: 'Box Vents:', values: [values.boxVentsQtyLead, values.boxVentsQtyPlastic] },
        { name: 'Ridge Vent:', values: [values.ridgeVentMetalDamaged, values.ridgeVentLF] },
        { name: 'Turbine:', values: [values.turbineQtyLead, values.turbineQtyPlastic] },
        { name: 'HVAC Vent:', values: [values.hvacVentQtyLead, values.hvacVentQtyPlastic] },
        { name: 'Rain Diverter:', values: [values.rainDiverterQtyLead, values.rainDiverterQtyPlastic] },
        { name: 'Power Vent:', values: [values.powerVentQtyLead, values.powerVentQtyPlastic] },
        { name: 'Skylight:', values: [values.skylightQtyLead, values.skylightQtyPlastic] },
        { name: 'SAT:', values: [values.satQtyLead, values.satQtyPlastic] },
        { name: 'Pipes:', values: [values.pipesQtyLead, values.pipesQtyPlastic] },
    ];
    accessories.forEach((acc, i) => {
        let currentY = middleY + i * boxHeight;
        coloredBox(middleX, currentY, 45, boxHeight, yellow, acc.name);
        doc.rect(middleX + 45, currentY, 47, boxHeight);
        doc.rect(middleX + 92, currentY, 48, boxHeight);
        text(acc.values[0] || '', middleX + 90, currentY + 10, {align: 'right'});
        text(acc.values[1] || '', middleX + 138, currentY + 10, {align: 'right'});
    });
    middleY += accessories.length * boxHeight;

    // Gutters / Downspouts / Fascia
    const gutterItems = [
        {name: 'Gutters:', value: `LF ${values.guttersLF || ''}`, size: values.guttersSize, sizes: ['5"', '6"']},
        {name: 'Downspouts:', value: `LF ${values.downspoutsLF || ''}`, size: values.downspoutsSize, sizes: ['2x3', '3x4']},
    ]
    gutterItems.forEach(item => {
        coloredBox(middleX, middleY, accWidth, boxHeight, yellow, item.name);
        doc.rect(middleX, middleY + boxHeight, accWidth, boxHeight);
        text(item.value, middleX + 2, middleY + boxHeight + 10);
        
        let sizeX = middleX + accWidth - 50;
        text(item.sizes[0], sizeX, middleY + 10);
        if (item.size === item.sizes[0]) doc.rect(sizeX - 12, middleY + 2.5, 10,10, 'F');
        else doc.rect(sizeX - 12, middleY + 2.5, 10,10);
        
        sizeX += 25;
        text(item.sizes[1], sizeX, middleY + 10);
        if (item.size === item.sizes[1]) doc.rect(sizeX - 12, middleY + 2.5, 10,10, 'F');
        else doc.rect(sizeX - 12, middleY + 2.5, 10,10);

        middleY += boxHeight * 2;
    })
    
    coloredBox(middleX, middleY, accWidth, boxHeight, yellow, 'Fascia:');
    doc.rect(middleX, middleY + boxHeight, accWidth, boxHeight);
    text(`Wood/Metal`, middleX + 2, middleY + boxHeight + 10);
    text(`Size: ${values.fasciaMetal || ''}`, middleX + accWidth - 2, middleY + boxHeight + 10, {align: 'right'});
    middleY += boxHeight * 2;
    
    coloredBox(middleX, middleY, accWidth, boxHeight, yellow, 'Chimney Flashing:');
    doc.rect(middleX, middleY + boxHeight, accWidth, boxHeight);
    text(values.chimneyFlashing || '', middleX + 2, middleY + boxHeight + 10);
    middleY += boxHeight * 2;

    coloredBox(middleX, middleY, accWidth, boxHeight, yellow, 'Other:');
    doc.rect(middleX, middleY + boxHeight, accWidth, boxHeight);
    text(values.chimneyOther || '', middleX + 2, middleY + boxHeight + 10);
    middleY += boxHeight * 2;


    // --- Right Section ---
    let rightX = middleX + accWidth + 5;
    let rightY = margin + 60;
    
    // Calculations & Total Squares
    let calcWidth = 140;
    let calcHeight = 120;
    doc.rect(rightX, rightY, calcWidth, calcHeight);
    text('Calculations:', rightX + 5, rightY + 10, { style: 'bold' });
    const calcs = ['A', 'B', 'C', 'D', 'E'];
    const calcs2 = ['F', 'G', 'H', 'I', 'J'];
    const calcs3 = ['K', 'L', 'M'];
    const calcValues = {...values};
    calcs.forEach((c, i) => { text(`${c} ${calcValues[`calc${c}`] || ''}`, rightX + 5, rightY + 25 + i * 15); });
    calcs2.forEach((c, i) => { text(`${c} ${calcValues[`calc${c}`] || ''}`, rightX + 45, rightY + 25 + i * 15); });
    calcs3.forEach((c, i) => { text(`${c} ${calcValues[`calc${c}`] || ''}`, rightX + 85, rightY + 25 + i * 15); });

    doc.rect(rightX, rightY + calcHeight + 2, calcWidth, boxHeight*2);
    text('Total Squares:', rightX + 5, rightY + calcHeight + 2 + 12, {style: 'bold'});
    text(values.totalSquares || '', rightX + calcWidth - 5, rightY + calcHeight + 2 + 22, {align: 'right'});

    // Rake / Aerial
    doc.rect(rightX, rightY + calcHeight + 2 + boxHeight*2 + 2, calcWidth, boxHeight*3);
    text(`Rake: LF ${values.rakeLF || ''}`, rightX + 5, rightY + calcHeight + 2 + boxHeight*2 + 2 + 12);
    text(`Aerial Measurements:`, rightX + 5, rightY + calcHeight + 2 + boxHeight*2 + 2 + 27);
    text(`1 Story: ${values.aerialMeasurements1Story || ''}`, rightX + 15, rightY + calcHeight + 2 + boxHeight*2 + 2 + 42);
    text(`2 Story: ${values.aerialMeasurements2Story || ''}`, rightX + 75, rightY + calcHeight + 2 + boxHeight*2 + 2 + 42);

    let keyX = rightX + calcWidth + 5;
    // Key Box
    doc.setFillColor(blue[0], blue[1], blue[2]);
    doc.rect(keyX, rightY, 150, 100, 'F');
    text('Key:', keyX + 5, rightY+10, {style: 'bold'});
    const keyItems = [
      'TC = Thermal Cracking', 'TD = Tree Damage',
      'TS = Test Square', 'B = Blistering',
      'X = Wind Damage', 'M = Mechanical Damage',
      '☐ = Box Vent', 'PV = Power Vent',
      '⚫ = Pipe Boot', '☑ = HVAC',
      'E = Exhaust Vent', 'Solar Vent E',
      '= Chimney'
    ];
    keyItems.forEach((item, i) => {
      text(item, keyX + 5 + (Math.floor(i/7) * 75), rightY + 22 + (i % 7) * 11, {size: 7});
    });

    // Inch to Decimal
    const decimalTableX = keyX + 150 + 5;
    doc.setFillColor(grey[0], grey[1], grey[2]);
    doc.rect(decimalTableX, rightY, 100, 100, 'F');
    const inches = [1,2,3,4,5,6];
    const decimals = ['.08', '.17', '.25', '.33', '.42', '.50'];
    const inches2 = [7,8,9,10,11,12];
    const decimals2 = ['.58', '.67', '.75', '.83', '.92', '1.00'];
    text('Inch to Decimal', decimalTableX + 5, rightY + 10, {style: 'bold'});
    inches.forEach((inch, i) => {
      text(`${inch}" = ${decimals[i]}`, decimalTableX + 5, rightY + 22 + i * 11, {size: 8});
    });
     inches2.forEach((inch, i) => {
      text(`${inch}" = ${decimals2[i]}`, decimalTableX + 55, rightY + 22 + i * 11, {size: 8});
    });
    
    // Notes section
    let notesY = rightY + Math.max(100, calcHeight + 2 + boxHeight*2 + 2 + boxHeight*3) + 5;
    let notesX = rightX;
    let notesWidth = docWidth - margin - notesX;
    let notesHeight = 150;
    doc.rect(notesX, notesY, notesWidth, notesHeight);
    text('Notes:', notesX + 5, notesY + 12);
    doc.rect(notesX, notesY, notesWidth, boxHeight);
    const splitNotes = doc.splitTextToSize(values.notes || '', notesWidth - 10);
    text(splitNotes, notesX + 5, notesY + boxHeight + 10, {size: 9});

    // Storm Info
    let stormY = notesY + notesHeight + 5;
    doc.rect(notesX, stormY, notesWidth, 60);
    text(`Max Hail Diameter: ${values.maxHailDiameter || ''}`, notesX + 5, stormY + 12);
    text(`Storm Direction: ${values.stormDirection || ''}`, notesX + 5, stormY + 27);
    text(`Collateral Damage:`, notesX + 5, stormY + 42);
    text(`F: ${values.collateralDamageF || ''}`, notesX + 100, stormY + 42);
    text(`B: ${values.collateralDamageB || ''}`, notesX + 150, stormY + 42);
    text(`R: ${values.collateralDamageR || ''}`, notesX + 200, stormY + 42);
    text(`L: ${values.collateralDamageL || ''}`, notesX + 250, stormY + 42);

    // Main Grid Area
    const gridX = leftColWidth + margin + 5;
    const gridY = docHeight - margin - 220;
    const gridWidth = docWidth - gridX - margin - (notesWidth/2.5) ;
    const gridHeight = 220;
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    for (let i = 0; i <= (gridWidth / 10); i++) {
        doc.line(gridX + i * 10, gridY, gridX + i * 10, gridY + gridHeight);
    }
    for (let i = 0; i <= (gridHeight / 10); i++) {
        doc.line(gridX, gridY + i * 10, gridX + gridWidth, gridY + i * 10);
    }
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(gridX, gridY, gridWidth, gridHeight);
    
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
