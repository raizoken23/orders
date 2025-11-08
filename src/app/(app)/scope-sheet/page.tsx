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
import { Download, FileText } from 'lucide-react'
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
  iceWaterShield: z.array(z.string()).optional(),
  dripEdge: z.array(z.string()).optional(),
  dripEdgeRadio: z.string().optional(),
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

type ScopeSheetData = z.infer<typeof scopeSheetSchema>;

const mockData: ScopeSheetData = {
    claimNumber: 'DEMO-12345',
    policyNumber: 'DEMO-67890',
    clientName: 'John Appleseed',
    clientEmail: 'j.appleseed@example.com',
    clientPhone: '(555) 867-5309',
    propertyAddress: '1234 Main St, Anytown, USA 12345',
    dateOfLoss: '2025-11-08',
    hailF: '10',
    hailR: '8',
    hailB: '12',
    hailL: '9',
    windDate: '2025-11-07',
    ladderNow: true,
    inspector: 'P Yarborough',
    phone: '310-357-1399',
    email: 'pyarborough@laddernow.com',
    eaveLF: '150',
    shingleType: 'Laminate',
    otherShingle: 'Metal Accent',
    iceWaterShield: ['Valley', 'Eave'],
    dripEdgeRadio: 'Yes',
    dripEdge: ['Eave', 'Rake'],
    layers: '1',
    pitch: '6/12',
    valleyMetalLF: '40',
    shingleMake: '30 Y',
    calcA: '100',
    calcB: '120',
    calcC: 'N/A',
    calcD: 'N/A',
    calcE: 'N/A',
    calcF: '150',
    calcG: '130',
    calcH: 'N/A',
    calcI: 'N/A',
    calcJ: 'N/A',
    calcK: 'N/A',
    calcL: 'N/A',
    calcM: 'N/A',
    rakeLF: '180',
    totalSquares: '28',
    aerialMeasurements1Story: '1500 sq ft',
    aerialMeasurements2Story: '1300 sq ft',
    boxVentsQtyPlastic: '4',
    ridgeVentLF: '50',
    turbineQtyLead: '2',
    hvacVentQtyPlastic: '1',
    pipesQtyPlastic: '3',
    guttersLF: '150',
    guttersSize: '5"',
    downspoutsLF: '80',
    downspoutsSize: '2x3',
    fasciaMetal: '230 LF',
    chimneyFlashing: 'Step',
    notes: 'Heavy hail damage observed on all slopes. Minor wind damage on the west-facing slope. Inspected property with homeowner present. All collateral damage was documented. Homeowner has a dog named "Sparky".',
    ridgeVentPlastic: '',
    boxVentsQtyLead: '',
    rainDiverterQtyLead: '',
    rainDiverterQtyPlastic: '',
    powerVentQtyLead: '',
    powerVentQtyPlastic: '',
    skylightQtyLead: '',
    skylightQtyPlastic: '',
    satQtyLead: '',
    satQtyPlastic: '',
    fasciaWood: '',
    chimneyOther: '',
    maxHailDiameter: '',
    stormDirection: '',
    collateralDamageF: '',
    collateralDamageB: '',
    collateralDamageR: '',
    collateralDamageL: '',
    yesNoEaveRake: '',
};

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
      iceWaterShield: [],
      dripEdge: [],
      dripEdgeRadio: 'No',
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
    const params = new URLSearchParams(searchParams);
    params.forEach((value, key) => {
      if (Object.keys(form.getValues()).includes(key)) {
          if (key === 'ladderNow') {
             form.setValue(key as any, value === 'true');
          } else if (key === 'iceWaterShield' || key === 'dripEdge') {
             form.setValue(key as any, value.split(','));
          } else {
             form.setValue(key as any, value);
          }
      }
    });
  }, [searchParams, form]);


  function onSubmit(values: z.infer<typeof scopeSheetSchema>) {
    const doc = new jsPDF({ orientation: 'p', unit: 'in', format: 'letter' });

    // Design Tokens
    const margin = 0.3;
    const ruleColor = '#000000';
    const ruleLightColor = '#d3d3d3';
    const accentPink = '#F8C9CF';
    const accentCyan = '#BFEAF1';
    const accentYellow = '#FFF2A6';
    const seeknowGreen = '#6DB33F';
    const textColor = '#000000';
    const mutedColor = '#444444';
    const gridStep = 0.125;
    const { width: pageWidth, height: pageHeight } = doc.internal.pageSize;

    doc.setFont('helvetica');

    // Helper to draw a checkbox
    const drawCheckbox = (x: number, y: number, checked = false, size = 0.15) => {
        doc.setLineWidth(0.01);
        doc.setDrawColor(ruleColor);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFontSize(size * 12);
            doc.text('✓', x + size / 6, y + size * 0.85);
        }
    };
    
    // === HEADER =======================================
    const headerY = pageHeight - margin;

    // --- SeekNow Logo & Info ---
    const logoX = margin;
    let currentY = headerY - 0.2;
    doc.setLineWidth(0.03);
    doc.setDrawColor(seeknowGreen);
    doc.rect(logoX + 0.25, currentY - 0.5, 0.25, 0.25);
    doc.setLineWidth(0.02);
    doc.line(logoX + 0.375, currentY - 0.5, logoX + 0.375, currentY - 0.25);
    doc.line(logoX + 0.25, currentY - 0.375, logoX + 0.5, currentY - 0.375);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(seeknowGreen);
    doc.text('SeekNow.', logoX + 0.55, currentY-0.3);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text('(866) 801-1258', logoX + 0.15, currentY);

    // --- Damage Table ---
    const damageTableX = pageWidth - margin - 3.2;
    const damageTableW = 3.2;
    const damageRowH = 0.25;
    let damageY = headerY - (damageRowH * 6) - 0.2;
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(damageTableX, damageY, damageTableW, damageRowH * 6);

    // Damage Header
    doc.setFillColor(accentPink);
    doc.rect(damageTableX + 0.4, damageY + damageRowH * 5, damageTableW - 0.4, damageRowH, 'F');
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const colW = (damageTableW - 0.4) / 3;
    doc.text('Hail', damageTableX + 0.4 + 0.5 * colW, damageY + damageRowH * 5.7, { align: 'center' });
    doc.text('Wind', damageTableX + 0.4 + 1.5 * colW, damageY + damageRowH * 5.7, { align: 'center' });
    doc.text('Tree', damageTableX + 0.4 + 2.5 * colW, damageY + damageRowH * 5.7, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    // Damage F,R,B,L
    let labelY = damageY + damageRowH * 4.7;
    ['F:', 'R:', 'B:', 'L:'].forEach((label, i) => {
        doc.text(label, damageTableX + 0.1, labelY);
        doc.line(damageTableX, damageY + (4 - i) * damageRowH, damageTableX + damageTableW, damageY + (4-i) * damageRowH);
        doc.line(damageTableX + 0.4, damageY, damageTableX + 0.4, damageY + damageRowH * 5);
        doc.line(damageTableX + 0.4 + colW, damageY, damageTableX + 0.4 + colW, damageY + damageRowH * 5);
        doc.line(damageTableX + 0.4 + 2 * colW, damageY, damageTableX + 0.4 + 2 * colW, damageY + damageRowH * 5);
        
        doc.text(values[`hail${label.charAt(0)}` as 'hailF'] || '', damageTableX + 0.4 + 0.1, labelY);
        labelY -= damageRowH;
    });

    doc.line(damageTableX + 0.4, damageY + damageRowH * 5, damageTableX + damageTableW, damageY + damageRowH * 5);
    
    // Date & Inspector
    const inspectorInfoY = damageY - 0.05;
    const inspectorFields = [
        {label: 'Date:', value: values.windDate},
        {label: 'Ladder Now', value: values.ladderNow},
        {label: 'Inspector:', value: values.inspector},
        {label: 'Phone:', value: values.phone},
        {label: 'Email:', value: values.email}
    ];

    let infoY = inspectorInfoY + (damageRowH * 6) + 0.2;
    doc.setFontSize(10);
    inspectorFields.forEach((field, i) => {
        doc.text(field.label, damageTableX - 1.2, infoY);
        doc.line(damageTableX - 0.5, infoY - 0.05, damageTableX + damageTableW, infoY - 0.05);

        if (typeof field.value === 'boolean') {
             drawCheckbox(damageTableX - 0.4, infoY - 0.1, field.value);
        } else {
             doc.text(field.value || '', damageTableX - 0.4, infoY);
        }
        infoY -= damageRowH;
    })


    // --- Mid Bar ---
    currentY = headerY - 1.8;
    const midBarX = margin;
    const midBarW = pageWidth - margin * 2;
    doc.setDrawColor(ruleColor);
    doc.rect(midBarX, currentY, midBarW, 1.45);
    doc.line(midBarX, currentY + 0.25, midBarX + midBarW, currentY + 0.25);
    doc.line(midBarX, currentY + 1.15, midBarX + midBarW, currentY + 1.15);

    doc.setFontSize(10);
    doc.text(`Eave: LF ${values.eaveLF || 'N/A'}`, midBarX + 0.1, currentY + 0.18);
    doc.text(`Rake: LF ${values.rakeLF || 'N/A'}`, midBarX + 2.0, currentY + 0.18);
    doc.text('Aerial Measurements:', midBarX + 4.0, currentY + 0.18);

    doc.text('Calculations:', midBarX + 0.1, currentY + 0.5);
    const calcFields = ['A', 'B', 'C', 'D', 'E'];
    calcFields.forEach((field, i) => {
        doc.text(`${field}`, midBarX + 0.1, currentY + 0.7 + i * 0.15);
        doc.text(values[`calc${field}` as 'calcA'] || 'N/A', midBarX + 0.4, currentY + 0.7 + i * 0.15);
        doc.line(midBarX, currentY + 0.75 + i*0.15, midBarX + 1.8, currentY + 0.75 + i*0.15);
    });
    const calcFields2 = ['F', 'G', 'H', 'I', 'J'];
    calcFields2.forEach((field, i) => {
        doc.text(`${field}`, midBarX + 1.0, currentY + 0.7 + i * 0.15);
        doc.text(values[`calc${field}` as 'calcF'] || 'N/A', midBarX + 1.3, currentY + 0.7 + i * 0.15);
         doc.line(midBarX + 0.9, currentY + 0.75 + i*0.15, midBarX + 2.7, currentY + 0.75 + i*0.15);
    });
    const calcFields3 = ['K', 'L', 'M'];
     calcFields3.forEach((field, i) => {
        doc.text(`${field}`, midBarX + 1.9, currentY + 0.7 + i * 0.15);
        doc.text(values[`calc${field}` as 'calcK'] || 'N/A', midBarX + 2.2, currentY + 0.7 + i * 0.15);
        doc.line(midBarX + 1.8, currentY + 0.75 + i*0.15, midBarX + 3.6, currentY + 0.75 + i*0.15);
    });

    doc.text('Total Squares:', midBarX + 0.1, currentY + 1.35);
    doc.text(values.totalSquares || '', midBarX + 1.0, currentY + 1.35);

    doc.text('1 Story:', midBarX + 1.9, currentY + 1.35);
    doc.text(values.aerialMeasurements1Story || '', midBarX + 2.4, currentY + 1.35);
    doc.text('2 Story:', midBarX + 3.0, currentY + 1.35);
    doc.text(values.aerialMeasurements2Story || '', midBarX + 3.5, currentY + 1.35);

    // --- Inch/Decimal table ---
    const inchTableX = midBarX + 5.5;
    const inchTableY = currentY + 0.3;
    const inchTableW = 2.2;
    const inchTableH = 0.8;
    doc.rect(inchTableX, inchTableY, inchTableW, inchTableH);
    doc.setFontSize(8);
    const inchData = [
        ['1" .08', '5" .42', '9" .75'],
        ['2" .17', '6" .50', '10" .83'],
        ['3" .25', '7" .58', '11" .92'],
        ['4" .33', '8" .67', '12" 1.00'],
    ];
    let inchY = inchTableY + inchTableH - 0.15;
    const inchColW = inchTableW / 3;
    inchData.forEach((row, i) => {
        row.forEach((cell, j) => {
            doc.text(cell, inchTableX + j * inchColW + 0.1, inchY);
        })
        inchY -= 0.2;
    });

     // --- Key Bar ---
    currentY -= 0.6;
    doc.setFillColor(accentCyan);
    doc.rect(midBarX, currentY, midBarW, 0.5, 'F');
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Key:', midBarX + 0.1, currentY + 0.2);
    doc.setFont('helvetica', 'normal');
    
    doc.setFontSize(8);
    const drawKeyItem = (x:number, y:number, symbol: 'text' | 'box' | 'circle' | 'x' | 'chimney', text:string) => {
      let textX = x;
      if (symbol === 'text') {
        doc.setFont('helvetica', 'bold');
        doc.text(text.substring(0, text.indexOf('=')), x, y);
        doc.setFont('helvetica', 'normal');
        textX = x + doc.getTextWidth(text.substring(0, text.indexOf('='))) + 0.05;
        doc.text(text.substring(text.indexOf('=')), textX, y);
        textX += doc.getTextWidth(text.substring(text.indexOf('=')));
      } else if (symbol === 'box') {
        doc.rect(x, y - 0.08, 0.1, 0.1);
        textX = x + 0.15;
        doc.text(text, textX, y);
        textX += doc.getTextWidth(text);
      } else if (symbol === 'circle') {
        doc.circle(x + 0.05, y - 0.03, 0.05);
        textX = x + 0.15;
        doc.text(text, textX, y);
        textX += doc.getTextWidth(text);
      } else if (symbol === 'x') {
        doc.text('X', x, y);
        textX = x + 0.1;
        doc.text(text, textX, y);
        textX += doc.getTextWidth(text);
      } else if (symbol === 'chimney') {
          doc.rect(x, y-0.08, 0.1, 0.1);
          doc.line(x, y-0.08, x+0.1, y+0.02);
          doc.line(x, y+0.02, x+0.1, y-0.08);
          textX = x + 0.15;
          doc.text(text, textX, y);
          textX += doc.getTextWidth(text);
      }
      return textX + 0.2;
    }

    let keyX = midBarX + 0.5;
    keyX = drawKeyItem(keyX, currentY + 0.15, 'text', 'TS = Test Square');
    keyX = drawKeyItem(keyX, currentY + 0.15, 'text', 'B = Blistering');
    keyX = drawKeyItem(keyX, currentY + 0.15, 'text', 'M = Mechanical Damage');
    
    keyX = midBarX + 0.5;
    keyX = drawKeyItem(keyX, currentY + 0.3, 'text', 'TC = Thermal Cracking');
    keyX = drawKeyItem(keyX, currentY + 0.3, 'text', 'PV = Power Vent');
    keyX = drawKeyItem(keyX, currentY + 0.3, 'text', 'TD = Tree Damage');
    
    keyX = midBarX + 0.5;
    keyX = drawKeyItem(keyX, currentY + 0.45, 'box', '= Box Vent');
    doc.setFillColor(textColor);
    keyX = drawKeyItem(keyX, currentY + 0.45, 'circle', '= HVAC');
    doc.setFillColor('white');
    keyX = drawKeyItem(keyX, currentY + 0.45, 'circle', '= Pipe Boot');
    doc.setFillColor(textColor);
    keyX = drawKeyItem(keyX, currentY + 0.45, 'chimney', '= Chimney');
    keyX = drawKeyItem(keyX, currentY + 0.45, 'text', 'E = Exhaust vent');
    keyX = drawKeyItem(keyX + 0.2, currentY + 0.45, 'x', '= Wind Damage');

    // === LEFT COLUMN =======================================
    const leftColX = margin;
    const leftColW = 2.25;
    currentY = headerY - 1.8; // Align with top of mid-bar

    // --- Shingle Type ---
    let boxY = currentY - 2.5;
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(leftColX, boxY, leftColW, 1.0); // Main box
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, boxY + 0.75, leftColW, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Shingle Type', leftColX + 0.1, boxY + 0.92);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);

    drawCheckbox(leftColX + 0.1, boxY + 0.5, values.shingleType === '3 Tab');
    doc.text('3 Tab', leftColX + 0.3, boxY + 0.6);
    drawCheckbox(leftColX + 0.1, boxY + 0.2, values.shingleType === 'Laminate');
    doc.text('Laminate', leftColX + 0.3, boxY + 0.3);

    drawCheckbox(leftColX + 1.2, boxY + 0.5, values.shingleMake === '20 Y');
    doc.text('20 Y', leftColX + 1.4, boxY + 0.6);
    drawCheckbox(leftColX + 1.2, boxY + 0.3, values.shingleMake === '25 Y');
    doc.text('25 Y', leftColX + 1.4, boxY + 0.4);
    drawCheckbox(leftColX + 1.2, boxY + 0.1, values.shingleMake === '30 Y');
    doc.text('30 Y', leftColX + 1.4, boxY + 0.2);
    
    drawCheckbox(leftColX + 1.7, boxY + 0.5, values.shingleMake === '40 Y');
    doc.text('40 Y', leftColX + 1.9, boxY + 0.6);
    drawCheckbox(leftColX + 1.7, boxY + 0.3, values.shingleMake === '50 Y');
    doc.text('50 Y', leftColX + 1.9, boxY + 0.4);
    
    // --- Other ---
    boxY -= 0.55;
    doc.rect(leftColX, boxY, leftColW, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, boxY+0.25, leftColW, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Other:', leftColX + 0.1, boxY + 0.42);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(values.otherShingle || '', leftColX + 0.1, boxY + 0.15);
    
    // --- Ice/Water Shield ---
    boxY -= 0.55;
    doc.rect(leftColX, boxY, leftColW, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, boxY + 0.25, leftColW, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Ice/Water Shield', leftColX + 0.1, boxY + 0.42);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    drawCheckbox(leftColX + 0.2, boxY + 0.05, values.iceWaterShield?.includes('Valley'));
    doc.text('Valley', leftColX + 0.4, boxY + 0.15);
    drawCheckbox(leftColX + 0.9, boxY + 0.05, values.iceWaterShield?.includes('Eave'));
    doc.text('Eave', leftColX + 1.1, boxY + 0.15);
    drawCheckbox(leftColX + 1.6, boxY + 0.05, values.iceWaterShield?.includes('Rake'));
    doc.text('Rake', leftColX + 1.8, boxY + 0.15);

    // --- Drip Edge ---
    boxY -= 0.55;
    doc.rect(leftColX, boxY, leftColW, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, boxY + 0.25, leftColW, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Drip Edge', leftColX + 0.1, boxY + 0.42);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    drawCheckbox(leftColX + 0.2, boxY + 0.05, values.dripEdgeRadio === 'Yes');
    doc.text('Yes', leftColX + 0.4, boxY + 0.15);
    drawCheckbox(leftColX + 0.7, boxY + 0.05, values.dripEdgeRadio === 'No');
    doc.text('No', leftColX + 0.9, boxY + 0.15);
    drawCheckbox(leftColX + 1.3, boxY + 0.05, values.dripEdge?.includes('Eave'));
    doc.text('Eave', leftColX + 1.5, boxY + 0.15);
    drawCheckbox(leftColX + 1.8, boxY + 0.05, values.dripEdge?.includes('Rake'));
    doc.text('Rake', leftColX + 2.0, boxY + 0.15);

    // --- Valley Metal ---
    boxY -= 0.55;
    doc.rect(leftColX, boxY, leftColW, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, boxY + 0.25, leftColW, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Valley Metal', leftColX + 0.1, boxY + 0.42);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Na', leftColX + 0.8, boxY + 0.15);
    doc.text(`${values.valleyMetalLF || ''} LF`, leftColX + 1.5, boxY + 0.15);
    
    // === SKETCH AREA ========================================
    const sketchX = leftColX + leftColW + gridStep;
    const sketchY = margin + 0.8;
    const sketchW = pageWidth - sketchX - margin;
    const sketchH = pageHeight - sketchY - margin - 1.8;
    doc.setDrawColor(ruleColor);
    doc.rect(sketchX, sketchY, sketchW, sketchH);

    // Grid lines
    doc.setDrawColor(ruleLightColor);
    doc.setLineWidth(0.005);
    for (let i = gridStep; i < sketchW; i += gridStep) {
        doc.line(sketchX + i, sketchY, sketchX + i, sketchY + sketchH);
    }
    for (let i = gridStep; i < sketchH; i += gridStep) {
        doc.line(sketchX, sketchY + i, sketchX + sketchW, sketchY + i);
    }
    
    // === FOOTER =============================================
    const footerY = margin + 0.2;
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(leftColX, footerY, pageWidth - margin*2, 0.6);
    doc.text('Notes:', leftColX + 0.1, footerY + 0.5);
    doc.setFontSize(8);
    const notesLines = doc.splitTextToSize(values.notes || '', 7.5);
    doc.text(notesLines, leftColX + 0.1, footerY + 0.4);
    
    doc.save(`ScopeSheet-${values.claimNumber || 'DEMO'}.pdf`);

    toast({
      title: 'Report Generated',
      description: 'Your PDF report has been downloaded.',
    })
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
                     <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 pt-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3 Tab" />
                        </FormControl>
                        <FormLabel className="font-normal">3 Tab</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Laminate" />
                        </FormControl>
                        <FormLabel className="font-normal">Laminate</FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
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
                      className="flex flex-wrap gap-x-4 gap-y-1 pt-2"
                    >
                      {['20 Y', '25 Y', '30 Y', '40 Y', '50 Y'].map(make => (
                         <FormItem key={make} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value={make} />
                            </FormControl>
                            <FormLabel className="font-normal">{make}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
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
                        {['Box Vents', 'Turbine', 'HVAC Vent', 'Rain Diverter', 'Power Vent', 'Skylight', 'SAT', 'Pipes'].map(item => {
                            const name = item.toLowerCase().replace(' ', '') as 'boxvents' | 'turbine' | 'hvacvent' | 'raindiverter' | 'powervent' | 'skylight' | 'sat' | 'pipes';
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
