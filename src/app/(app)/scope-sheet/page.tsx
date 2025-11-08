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
  eaveNA: z.boolean().optional(),
  shingleType: z.string().optional(),
  otherShingle: z.string().optional(),
  iceWaterShield: z.array(z.string()).optional(),
  dripEdge: z.array(z.string()).optional(),
  dripEdgeRadio: z.string().optional(),
  layers: z.string().optional(),
  pitch: z.string().optional(),
  valleyMetalLF: z.string().optional(),
  valleyMetalNA: z.boolean().optional(),
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
  rakeNA: z.boolean().optional(),
  totalSquares: z.string().optional(),
  aerialMeasurements1Story: z.string().optional(),
  aerialMeasurements2Story: z.string().optional(),
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
  satQtyPlastic: z.string().optional(),
  pipeQtyLead: z.string().optional(),
  pipeQtyPlastic: z.string().optional(),
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
  collateralDamageF: z.string().optional(),
  collateralDamageB: z.string().optional(),
  collateralDamageR: z.string().optional(),
  collateralDamageL: z.string().optional(),
  notes: z.string().optional(),
  boxVentsQtyLead: z.string().optional(),
  boxVentsQtyPlastic: z.string().optional(),
  boxVentsMetalDamaged: z.boolean().optional(),
  ridgeVentMetalDamaged: z.boolean().optional(),
  ridgeVentLF: z.string().optional(),
  ridgeVentPlastic: z.boolean().optional(),
  otherSolar: z.boolean().optional(),
  otherVentE: z.boolean().optional(),
  otherExhaustVent: z.boolean().optional()
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
    shingleMake: '30 Y',
    otherShingle: 'Metal Accent',
    iceWaterShield: ['Valley', 'Eave'],
    dripEdgeRadio: 'Yes',
    dripEdge: ['Eave', 'Rake'],
    layers: '1',
    pitch: '6/12',
    valleyMetalLF: '40',
    valleyMetalNA: false,
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
    boxVentsQtyLead: '0',
    boxVentsMetalDamaged: true,
    ridgeVentLF: '50',
    ridgeVentPlastic: true,
    turbineQtyLead: '2',
    hvacventQtyPlastic: '1',
    pipeQtyPlastic: '3',
    guttersLF: '150',
    guttersSize: '5"',
    downspoutsLF: '80',
    downspoutsSize: '2x3',
    fasciaSize: '1x6',
    fasciaLF: '230',
    fasciaType: 'Metal',
    chimneyFlashing: 'Step',
    notes: 'Heavy hail damage observed on all slopes. Minor wind damage on the west-facing slope. Inspected property with homeowner present. All collateral damage was documented. Homeowner has a dog named "Sparky".',
    ridgeVentMetalDamaged: false,
    raindiverterQtyLead: '',
    raindiverterQtyPlastic: '',
    powerVentQtyLead: '1',
    powerVentQtyPlastic: '',
    skylightQtyLead: '',
    skylightQtyPlastic: '',
    satQtyLead: '',
    satQtyPlastic: '',
    pipeQtyLead: '0',
    fasciaNA: false,
    chimneyOther: '',
    maxHailDiameter: '1.5"',
    stormDirection: 'SW',
    collateralDamageF: 'Window Screens',
    collateralDamageB: '',
    collateralDamageR: 'AC Fins',
    collateralDamageL: '',
    yesNoEaveRake: '',
    turbineQtyPlastic: '',
    hvacventQtyLead: '',
    eaveNA: false,
    rakeNA: false,
    guttersNA: false,
    otherSolar: true,
    otherExhaustVent: true,
    otherVentE: true,
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
      eaveNA: false,
      shingleType: '',
      otherShingle: '',
      iceWaterShield: [],
      dripEdge: [],
      dripEdgeRadio: 'No',
      layers: '',
      pitch: '',
      valleyMetalLF: '',
      valleyMetalNA: false,
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
      rakeNA: false,
      totalSquares: '',
      aerialMeasurements1Story: '',
      aerialMeasurements2Story: '',
      yesNoEaveRake: '',
      turbineQtyLead: '',
      turbineQtyPlastic: '',
      hvacventQtyLead: '',
      hvacventQtyPlastic: '',
      raindiverterQtyLead: '',
      raindiverterQtyPlastic: '',
      powerVentQtyLead: '',
      powerVentQtyPlastic: '',
      skylightQtyLead: '',
      skylightQtyPlastic: '',
      satQtyLead: '',
      satQtyPlastic: '',
      pipeQtyLead: '',
      pipeQtyPlastic: '',
      guttersLF: '',
      guttersNA: false,
      guttersSize: '',
      downspoutsLF: '',
      downspoutsSize: '',
      fasciaSize: '',
      fasciaLF: '',
      fasciaNA: false,
      fasciaType: '',
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
      boxVentsMetalDamaged: false,
      ridgeVentMetalDamaged: false,
      ridgeVentLF: '',
      ridgeVentPlastic: false,
      otherSolar: false,
      otherVentE: false,
      otherExhaustVent: false,
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


  function onSubmit(values: z.infer<typeof scopeSheetSchema>) {
    const doc = new jsPDF({ orientation: 'p', unit: 'in', format: 'letter' });

    // Design Tokens
    const margin = 0.3;
    const { width: pageWidth, height: pageHeight } = doc.internal.pageSize;
    const ruleColor = '#000000';
    const ruleLightColor = '#d3d3d3';
    const accentPink = '#F8C9CF';
    const accentCyan = '#BFEAF1';
    const accentYellow = '#FFF2A6';
    const seeknowGreen = '#6DB33F';
    const textColor = '#000000';
    const mutedColor = '#444444';
    const gridStep = 0.125;
    const thickLineWidth = 0.03;
    const thinLineWidth = 0.01;

    // Helper functions
    doc.setFont('helvetica');
    const drawCheckbox = (x: number, y: number, checked = false, size = 0.12) => {
        doc.setLineWidth(thinLineWidth);
        doc.setDrawColor(ruleColor);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFontSize(size * 10);
            doc.text('✓', x + size / 6, y + size * 0.85);
        }
    };
    const drawText = (text: string, x: number, y: number, options?: any) => {
        doc.text(text || '', x, y, options);
    };

    // === HEADER =========================================================
    // --- SeekNow Logo & Info ---
    const logoX = margin + 0.1;
    let currentY = pageHeight - margin - 0.2;
    doc.setLineWidth(0.04);
    doc.setDrawColor(seeknowGreen);
    doc.rect(logoX + 0.25, currentY - 0.5, 0.25, 0.25); // Outer square
    doc.setLineWidth(0.02);
    doc.line(logoX + 0.375, currentY - 0.5, logoX + 0.375, currentY - 0.25); // Vertical line
    doc.line(logoX + 0.25, currentY - 0.375, logoX + 0.5, currentY - 0.375); // Horizontal line
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(seeknowGreen);
    doc.text('SeekNow.', logoX + 0.55, currentY-0.3);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text('(866) 801-1258', logoX + 0.2, currentY);

    // --- Inspector Info Block (Right Side) ---
    const rightBlockX = 4.2;
    const rightBlockW = pageWidth - rightBlockX - margin;
    doc.setLineWidth(thickLineWidth);
    doc.setDrawColor(ruleColor);
    doc.rect(rightBlockX, pageHeight - margin - 1.5, rightBlockW, 1.5);
    
    // --- Damage Table ---
    const damageTableX = rightBlockX;
    const damageTableW = 2.0;
    const damageRowH = 0.25;
    let damageY = pageHeight - margin - (damageRowH * 4) - 0.25;
    doc.setLineWidth(thinLineWidth);

    doc.setFillColor(accentPink);
    doc.rect(damageTableX, pageHeight - margin - 0.5, damageTableW, 0.25, 'F');
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const colW = damageTableW / 3;
    doc.text('Hail', damageTableX + 0.5 * colW, pageHeight - margin - 0.32, { align: 'center' });
    doc.text('Wind', damageTableX + 1.5 * colW, pageHeight - margin - 0.32, { align: 'center' });
    doc.text('Tree', damageTableX + 2.5 * colW, pageHeight - margin - 0.32, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    doc.line(damageTableX + colW, pageHeight - margin - 1.5, damageTableX + colW, pageHeight - margin - 0.25);
    doc.line(damageTableX + 2 * colW, pageHeight - margin - 1.5, damageTableX + 2 * colW, pageHeight - margin - 0.25);

    let labelY = pageHeight - margin - 0.5 - damageRowH / 2 + 0.05;
    ['F', 'R', 'B', 'L'].forEach((label, i) => {
        doc.line(damageTableX, pageHeight - margin - 0.5 - (i * damageRowH), damageTableX + damageTableW, pageHeight - margin - 0.5 - (i*damageRowH) );
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, damageTableX + 0.1, labelY);
        doc.setFont('helvetica', 'normal');
        doc.text(values[`hail${label}` as 'hailF'] || '', damageTableX + 0.1, labelY); // This will be overriden, just for example
        labelY -= damageRowH;
    });

    // --- Inspector Info ---
    const inspectorInfoX = rightBlockX + damageTableW + 0.1;
    const inspectorFields = [
        {label: 'Date:', value: values.windDate},
        {label: 'Ladder Now', value: values.ladderNow},
        {label: 'Inspector:', value: values.inspector},
        {label: 'Phone:', value: values.phone},
        {label: 'Email:', value: values.email}
    ];

    let infoY = pageHeight - margin - 0.35;
    doc.setFontSize(10);
    inspectorFields.forEach((field, i) => {
        doc.text(field.label, inspectorInfoX, infoY);
        doc.setDrawColor(ruleLightColor);
        doc.line(inspectorInfoX + (field.label === 'Email:' ? 0.4 : 0.7), infoY + 0.02, rightBlockX + rightBlockW - 0.1, infoY + 0.02);

        if (typeof field.value === 'boolean') {
             drawCheckbox(inspectorInfoX + 0.8, infoY - 0.1, field.value);
        } else {
             doc.text(field.value || '', inspectorInfoX + (field.label === 'Email:' ? 0.45: 0.75), infoY);
        }
        infoY -= (i > 0 ? 0.25 : 0.3);
    })

    // === EAVE, RAKE, AERIAL, CALCS, KEY (MIDDLE BAND) =======================
    const middleBandY = pageHeight - margin - 1.5 - 0.1 - 1.8;
    const middleBandHeight = 1.8;
    doc.setLineWidth(thickLineWidth);
    doc.setDrawColor(ruleColor);
    doc.rect(margin, middleBandY, pageWidth - (margin*2), middleBandHeight);
    
    // --- Eave, Rake, Aerial ---
    doc.setLineWidth(thinLineWidth);
    let middleColX = margin + 0.1;
    let middleColY = middleBandY + middleBandHeight - 0.2;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    drawText('Eave: LF', middleColX, middleColY);
    drawCheckbox(middleColX + 0.6, middleColY - 0.08, values.eaveNA); drawText('N/A', middleColX + 0.75, middleColY);
    drawText(values.eaveLF || '', middleColX + 1.2, middleColY);
    doc.line(middleColX + 1.1, middleColY + 0.02, middleColX + 2.0, middleColY + 0.02);

    middleColX += 2.5;
    drawText('Rake: LF', middleColX, middleColY);
    drawCheckbox(middleColX + 0.6, middleColY - 0.08, values.rakeNA); drawText('N/A', middleColX + 0.75, middleColY);
    drawText(values.rakeLF || '', middleColX + 1.2, middleColY);
    doc.line(middleColX + 1.1, middleColY + 0.02, middleColX + 2.0, middleColY + 0.02);
    
    middleColX += 2.5;
    drawText('Aerial Measurements:', middleColX, middleColY);
    doc.setFont('helvetica', 'normal');
    
    // --- Calculations & Total Squares ---
    const calcY = middleBandY + middleBandHeight - 0.5;
    const calcCol1X = margin + 2.8;
    const calcCol2X = calcCol1X + 1.2;
    const calcCol3X = calcCol2X + 1.2;
    const calcCol4X = calcCol3X + 1.2;
    const calcRowHeight = 0.18;
    doc.setFont('helvetica', 'bold');
    drawText('Calculations:', margin + 0.1, calcY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const calcFields = [
        'A','B','C','D','E', 'F','G','H','I','J', 'K','L','M'
    ];
    let calcCurrentY = calcY;
    ['A', 'B', 'C', 'D', 'E'].forEach((label, i) => {
        drawText(label, margin + 0.1, calcCurrentY - (i * calcRowHeight));
        drawText(values[`calc${label}` as keyof ScopeSheetData] as string || 'N/A', margin + 0.3, calcCurrentY - (i * calcRowHeight));
        doc.line(margin + 0.25, calcCurrentY - (i * calcRowHeight) + 0.02, margin + 1.0, calcCurrentY - (i * calcRowHeight) + 0.02);
    });
     ['F', 'G', 'H', 'I', 'J'].forEach((label, i) => {
        drawText(label, margin + 1.2, calcCurrentY - (i * calcRowHeight));
        drawText(values[`calc${label}` as keyof ScopeSheetData] as string || 'N/A', margin + 1.4, calcCurrentY - (i * calcRowHeight));
        doc.line(margin + 1.35, calcCurrentY - (i * calcRowHeight) + 0.02, margin + 2.1, calcCurrentY - (i * calcRowHeight) + 0.02);
    });
    ['K', 'L', 'M'].forEach((label, i) => {
        drawText(label, margin + 2.3, calcCurrentY - (i * calcRowHeight));
        drawText(values[`calc${label}` as keyof ScopeSheetData] as string || 'N/A', margin + 2.5, calcCurrentY - (i * calcRowHeight));
        doc.line(margin + 2.45, calcCurrentY - (i * calcRowHeight) + 0.02, margin + 3.2, calcCurrentY - (i * calcRowHeight) + 0.02);
    });

    drawText('1 Story:', margin + 3.4, calcY - (2 * calcRowHeight) );
    drawText('2 Story:', margin + 3.4, calcY - (3 * calcRowHeight) );

    doc.setFont('helvetica', 'bold');
    drawText('Total Squares:', margin + 1.2, middleBandY + 0.2);
    doc.setFont('helvetica', 'normal');
    drawText(values.totalSquares || '', margin+2.2, middleBandY + 0.2);
    doc.line(margin + 2.1, middleBandY + 0.22, margin + 3.0, middleBandY + 0.22);
    
    // --- Key and Inch Conversion ---
    const keyX = margin + 4.5;
    const keyY = middleBandY + 0.1;
    const keyW = pageWidth - keyX - margin;
    const keyH = middleBandHeight - 0.2;
    
    const drawKeyItem = (x:number, y:number, text: string, symbol?: ()=>void, highlight?: boolean) => {
        if (highlight) {
            doc.setFillColor(accentCyan);
            const textWidth = doc.getTextWidth(text);
            doc.rect(x - (symbol ? 0.15 : 0.05) , y - 0.1, textWidth + (symbol ? 0.2 : 0.1), 0.12, 'F');
        }
        if (symbol) symbol();
        doc.setFontSize(8);
        doc.setTextColor(textColor);
        drawText(text, x, y);
    };
    
    doc.setFont('helvetica', 'bold'); drawText('Key:', keyX, keyY + keyH - 0.1); doc.setFont('helvetica', 'normal');
    drawKeyItem(keyX + 0.4, keyY + keyH - 0.1, 'TS = Test Square');
    drawKeyItem(keyX + 0.4, keyY + keyH - 0.25, 'TC = Thermal Cracking');
    drawKeyItem(keyX + 0.4, keyY + keyH - 0.4, 'X = Wind Damage');
    
    drawKeyItem(keyX + 1.8, keyY + keyH - 0.1, 'B = Blistering', undefined, true);
    drawKeyItem(keyX + 1.8, keyY + keyH - 0.25, 'M = Mechanical Damage', undefined, true);
    drawKeyItem(keyX + 1.8, keyY + keyH - 0.4, 'TD = Tree Damage', undefined, true);

    const drawBoxVentSymbol = () => { doc.rect(keyX + 2.9, keyY + keyH - 0.2, 0.1, 0.1); doc.line(keyX+2.9, keyY+keyH-0.2, keyX+3.0, keyY+keyH-0.1); doc.line(keyX+2.9, keyY+keyH-0.1, keyX+3.0, keyY+keyH-0.2); };
    drawKeyItem(keyX + 3.05, keyY + keyH - 0.1, '= Box Vent');
    
    const drawPVentSymbol = () => { doc.setFillColor(textColor); doc.circle(keyX+2.95, keyY + keyH - 0.24, 0.05, 'F'); };
    drawKeyItem(keyX + 3.05, keyY + keyH - 0.25, '= Power Vent', drawPVentSymbol, true);
    
    const drawHVACSymbol = () => { doc.setFillColor(textColor); doc.rect(keyX+2.9, keyY+keyH-0.39, 0.1, 0.1, 'F'); };
    drawKeyItem(keyX + 3.05, keyY + keyH - 0.4, '= HVAC', drawHVACSymbol, true);

    const drawChimneySymbol = () => { doc.rect(keyX + 2.9, keyY + keyH - 0.55, 0.1, 0.1); doc.line(keyX+2.9, keyY+keyH-0.55, keyX+3.0, keyY+keyH-0.45); doc.line(keyX+2.9, keyY+keyH-0.45, keyX+3.0, keyY+keyH-0.55); doc.setFillColor(ruleLightColor); doc.rect(keyX+2.9, keyY+keyH-0.55, 0.1, 0.1,'F'); };
    drawKeyItem(keyX + 3.05, keyY + keyH - 0.55, '= Chimney', drawChimneySymbol, true);

    const drawPipeSymbol = () => { doc.circle(keyX+2.95, keyY + keyH - 0.69, 0.05); };
    drawKeyItem(keyX + 3.05, keyY + keyH - 0.7, '= Pipe Boot', drawPipeSymbol, true);
    
    drawKeyItem(keyX + 3.05, keyY + keyH - 0.85, 'E = Exhaust vent', undefined, true);

    const inchTableX = keyX + 1.8;
    const inchTableY = keyY + keyH - 0.6;
    const inchColW = 0.5;
    const inchRowH = 0.15;
    const inchData = [
        '1"', '.08', '5"', '.42', '9"', '.75',
        '2"', '.17', '6"', '.50', '10"', '.83',
        '3"', '.25', '7"', '.58', '11"', '.92',
        '4"', '.33', '8"', '.67', '12"', '1.00',
    ];
    inchData.forEach((val, i) => {
        const row = Math.floor(i/6);
        const col = i % 6;
        drawText(val, inchTableX + (col*inchColW), inchTableY - (row * inchRowH) );
    });
    
    // === LEFT COLUMN ======================================================
    const leftColX = margin;
    const leftColY = margin;
    const leftColW = 2.4;
    const leftColH = middleBandY - leftColY - 0.1;
    doc.setLineWidth(thickLineWidth);
    doc.setDrawColor(ruleColor);
    doc.rect(leftColX, leftColY, leftColW, leftColH);
    doc.setLineWidth(thinLineWidth);

    let currentLeftY = middleBandY - 0.1;
    
    const drawLeftBox = (y: number, h: number, title:string, content: ()=>void) => {
        doc.setFillColor(seeknowGreen);
        doc.rect(leftColX, y-h, leftColW, 0.2, 'F');
        doc.setTextColor('#FFFFFF'); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(title, leftColX + 0.1, y - h + 0.15);
        doc.setTextColor(textColor); doc.setFont('helvetica', 'normal');
        content();
        return y - h - 0.05;
    };
    
    currentLeftY = drawLeftBox(currentLeftY, 0.8, 'Shingle Type', () => {
        let shingleY = currentLeftY - 0.3;
        doc.setFontSize(9);
        drawCheckbox(leftColX + 0.1, shingleY, values.shingleType === '3 Tab'); drawText('3 Tab', leftColX + 0.25, shingleY+0.08);
        shingleY -= 0.18;
        drawCheckbox(leftColX + 0.1, shingleY, values.shingleType === 'Laminate'); drawText('Laminate', leftColX + 0.25, shingleY+0.08);

        shingleY = currentLeftY - 0.3;
        const makes = ['20 Y', '25 Y', '30 Y'];
        makes.forEach((make, i) => {
            drawCheckbox(leftColX + 1.1, shingleY - (i * 0.18), values.shingleMake === make); drawText(make, leftColX + 1.25, shingleY - (i * 0.18) + 0.08);
        });
        const makes2 = ['40 Y', '50 Y'];
        makes2.forEach((make, i) => {
            drawCheckbox(leftColX + 1.7, shingleY - (i * 0.18), values.shingleMake === make); drawText(make, leftColX + 1.85, shingleY - (i * 0.18) + 0.08);
        });
    });

    currentLeftY = drawLeftBox(currentLeftY, 0.3, 'Other:', () => {
        drawText(values.otherShingle || '', leftColX + 0.1, currentLeftY - 0.1);
    });

    currentLeftY = drawLeftBox(currentLeftY, 0.4, 'Ice/Water Shield', () => {
        doc.setFontSize(9);
        drawCheckbox(leftColX + 0.2, currentLeftY - 0.1, values.iceWaterShield?.includes('Valley')); drawText('Valley', leftColX + 0.35, currentLeftY - 0.02);
        drawCheckbox(leftColX + 0.9, currentLeftY - 0.1, values.iceWaterShield?.includes('Eave')); drawText('Eave', leftColX + 1.05, currentLeftY - 0.02);
        drawCheckbox(leftColX + 1.6, currentLeftY - 0.1, values.iceWaterShield?.includes('Rake')); drawText('Rake', leftColX + 1.75, currentLeftY - 0.02);
    });
    
    currentLeftY = drawLeftBox(currentLeftY, 0.4, 'Drip Edge', () => {
        doc.setFontSize(9);
        drawCheckbox(leftColX + 0.2, currentLeftY - 0.1, values.dripEdgeRadio === 'Yes'); drawText('Yes', leftColX + 0.35, currentLeftY - 0.02);
        drawCheckbox(leftColX + 0.7, currentLeftY - 0.1, values.dripEdgeRadio === 'No'); drawText('No', leftColX + 0.85, currentLeftY - 0.02);
        
        drawCheckbox(leftColX + 1.3, currentLeftY - 0.1, values.dripEdge?.includes('Eave')); drawText('Eave', leftColX + 1.45, currentLeftY - 0.02);
        drawCheckbox(leftColX + 1.3, currentLeftY - 0.28, values.dripEdge?.includes('Rake')); drawText('Rake', leftColX + 1.45, currentLeftY - 0.2);
    });
    
    currentLeftY = drawLeftBox(currentLeftY, 0.4, 'Valley Metal', () => {
        doc.setFontSize(9);
        drawCheckbox(leftColX + 0.2, currentLeftY - 0.1, values.valleyMetalNA); drawText('Na', leftColX + 0.35, currentLeftY - 0.02);
        doc.text(`${values.valleyMetalLF || ''} LF`, leftColX + 1.5, currentLeftY - 0.02);
        doc.line(leftColX + 1.4, currentLeftY - 0.0, leftColX + leftColW - 0.1, currentLeftY-0.0);
    });
    
    currentLeftY = drawLeftBox(currentLeftY, 0.25, 'Layers:', () => {
        doc.setFontSize(10);
        doc.text(values.layers || '', leftColX + 0.8, currentLeftY + 0.05);
        doc.line(leftColX + 0.7, currentLeftY + 0.08, leftColX + leftColW - 0.1, currentLeftY+0.08);
    });

    const accessoriesYStart = currentLeftY;
    const accessoriesHeight = 4.8;
    
    const drawAccessoryRow = (y: number, label: string, content?: ()=>void) => {
        doc.setFillColor(accentYellow);
        doc.rect(leftColX + 0.05, y - 0.22, 0.9, 0.2, 'F');
        doc.setTextColor(textColor); doc.setFontSize(9);
        doc.text(label, leftColX + 0.1, y - 0.1);
        doc.setDrawColor(ruleLightColor); doc.setLineWidth(thinLineWidth);
        doc.line(leftColX, y - 0.25, leftColX + leftColW, y - 0.25);
        if (content) content();
        return y - 0.25;
    }

    let accessoryY = accessoriesYStart;
    doc.setFontSize(8);
    accessoryY = drawAccessoryRow(accessoryY, 'Pitch:', () => { doc.text(values.pitch || '', leftColX + 1.2, accessoryY - 0.1); });
    accessoryY = drawAccessoryRow(accessoryY, 'Box Vents:', () => {
        drawText('Metal', leftColX + 1.0, accessoryY - 0.05);
        drawText('Damaged', leftColX + 1.35, accessoryY - 0.05);
        drawText('Plastic', leftColX + 1.8, accessoryY - 0.05);
        drawCheckbox(leftColX + 1.6, accessoryY - 0.2, values.boxVentsMetalDamaged);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Ridge Vent:', () => {
        drawText('LF', leftColX + 1.0, accessoryY - 0.05);
        drawText(values.ridgeVentLF || '', leftColX+1.0, accessoryY - 0.18);
        drawText('Plastic', leftColX + 1.35, accessoryY - 0.05);
        drawCheckbox(leftColX + 1.6, accessoryY - 0.2, values.ridgeVentPlastic);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Turbine:');
    accessoryY = drawAccessoryRow(accessoryY, 'HVAC Vent:');
    accessoryY = drawAccessoryRow(accessoryY, 'Rain Diverter:');
    accessoryY = drawAccessoryRow(accessoryY, 'Power Vent:');
    accessoryY = drawAccessoryRow(accessoryY, 'Skylight:');
    accessoryY = drawAccessoryRow(accessoryY, 'SAT:');
    accessoryY = drawAccessoryRow(accessoryY, 'Pipes:', () => {
        drawText('Qty', leftColX + 1.0, accessoryY - 0.05);
        drawText('Lead', leftColX + 1.35, accessoryY - 0.05);
        drawText('Qty', leftColX + 1.0, accessoryY - 0.2);
        drawText('Plastic', leftColX + 1.35, accessoryY - 0.2);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Gutters:', () => {
        drawText('LF', leftColX + 1.4, accessoryY - 0.05);
        drawCheckbox(leftColX + 1.7, accessoryY - 0.08, values.guttersSize === '5"'); drawText('5"', leftColX + 1.85, accessoryY - 0.02);
        drawCheckbox(leftColX + 2.0, accessoryY - 0.08, values.guttersSize === '6"'); drawText('6"', leftColX + 2.15, accessoryY - 0.02);
        drawText('NA', leftColX + 1.0, accessoryY - 0.05);
        drawCheckbox(leftColX + 1.2, accessoryY - 0.08, values.guttersNA);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Downspouts:', () => {
        drawText('LF', leftColX + 1.0, accessoryY - 0.05);
        drawCheckbox(leftColX + 1.5, accessoryY - 0.08, values.downspoutsSize === '2x3'); drawText('2x3', leftColX + 1.65, accessoryY - 0.02);
        drawCheckbox(leftColX + 1.9, accessoryY - 0.08, values.downspoutsSize === '3x4'); drawText('3x4', leftColX + 2.05, accessoryY - 0.02);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Fascia:', () => {
        drawText('Size', leftColX + 1.0, accessoryY - 0.05);
        drawText('LF', leftColX + 1.4, accessoryY - 0.05);
        drawText('NA', leftColX + 2.0, accessoryY - 0.05);
        drawCheckbox(leftColX + 2.2, accessoryY - 0.08, values.fasciaNA);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Wood / Metal');
    accessoryY = drawAccessoryRow(accessoryY, 'Chimney Flashing:');
    accessoryY = drawAccessoryRow(accessoryY, 'Other:', () => {
        drawCheckbox(leftColX+1.0, accessoryY - 0.08, values.otherSolar); drawText('Solar', leftColX + 1.15, accessoryY-0.02);
        drawCheckbox(leftColX+1.5, accessoryY - 0.08, values.otherVentE); drawText('Vent E', leftColX + 1.65, accessoryY-0.02);
        drawCheckbox(leftColX+2.0, accessoryY - 0.08, values.otherExhaustVent); drawText('Exhaust Vent', leftColX + 1.65, accessoryY-0.18);
    });

    // === SKETCH AREA ========================================
    const sketchX = leftColX + leftColW + 0.1;
    const sketchY = margin + 1.2;
    const sketchW = pageWidth - sketchX - margin;
    const sketchH = leftColH + middleBandHeight - sketchY + margin + 0.1;
    doc.setLineWidth(thickLineWidth);
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
    const footerY = margin;
    const footerH = 1.0;
    const notesX = margin;
    const notesW = pageWidth - notesX - margin - 1.5;
    
    doc.setLineWidth(thickLineWidth);
    doc.setDrawColor(ruleColor);
    doc.rect(notesX, footerY, pageWidth - margin*2, footerH);
    
    doc.setLineWidth(thinLineWidth);
    doc.line(notesX + notesW, footerY, notesX + notesW, footerY + footerH);
    
    let collateralY = footerY + footerH - 0.2;
    doc.setFont('helvetica', 'bold');
    doc.text('Max Hail Diameter:', notesX + 0.1, collateralY);
    doc.setFont('helvetica', 'normal');
    doc.line(notesX + 1.2, collateralY + 0.02, notesX + 2.5, collateralY + 0.02);
    doc.text(values.maxHailDiameter || '', notesX + 1.25, collateralY);
    
    collateralY -= 0.2;
    doc.setFont('helvetica', 'bold');
    doc.text('Storm Direction:', notesX + 0.1, collateralY);
    doc.setFont('helvetica', 'normal');
    doc.line(notesX + 1.2, collateralY + 0.02, notesX + 2.5, collateralY + 0.02);
    doc.text(values.stormDirection || '', notesX + 1.25, collateralY);

    collateralY -= 0.2;
    doc.setFont('helvetica', 'bold');
    doc.text('Collateral Damage:', notesX + 0.1, collateralY);
    doc.setFont('helvetica', 'normal');
    
    const collateralFields = ['F', 'B', 'R', 'L'];
    collateralFields.forEach((label, i) => {
        const fieldX = notesX + 0.1 + (i*1.5);
        doc.text(label + ':', fieldX, collateralY - 0.2);
        doc.line(fieldX + 0.2, collateralY - 0.18, fieldX + 1.4, collateralY - 0.18);
        drawText(values[`collateralDamage${label}` as keyof ScopeSheetData] as string, fieldX + 0.25, collateralY-0.2);
    });

    // --- Notes Box ---
    const notesBoxX = notesX + notesW + 0.1;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', notesBoxX, footerY + footerH - 0.1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const notesLines = doc.splitTextToSize(values.notes || '', notesW - 0.2);
    doc.text(notesLines, notesBoxX, footerY + footerH - 0.25);
    
    // --- Compass Rose ---
    const compassX = pageWidth - margin - 1.2/2;
    const compassY = footerY + 1.2/2;
    const radius = 0.5;

    doc.setLineWidth(thinLineWidth);
    doc.setDrawColor(ruleColor);
    
    doc.circle(compassX, compassY, radius);
    doc.circle(compassX, compassY, radius * 0.6);

    const drawAngledLine = (angle: number, r1: number, r2: number) => {
        const rad = angle * (Math.PI / 180);
        const x1 = compassX + r1 * Math.sin(rad);
        const y1 = compassY - r1 * Math.cos(rad);
        const x2 = compassX + r2 * Math.sin(rad);
        const y2 = compassY - r2 * Math.cos(rad);
        doc.line(x1,y1, x2, y2);
    }
    
    for (let i=0; i<360; i+=22.5) {
        if(i % 90 === 0) {
            drawAngledLine(i, radius*0.6, radius);
        } else if(i % 45 === 0) {
            drawAngledLine(i, radius*0.6, radius * 0.9);
        } else {
            drawAngledLine(i, radius*0.6, radius * 0.75);
        }
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('F', compassX - 0.05, compassY - radius - 0.05);
    doc.text('B', compassX - 0.05, compassY + radius + 0.15);
    doc.text('R', compassX + radius + 0.05, compassY + 0.05);
    doc.text('L', compassX - radius - 0.15, compassY + 0.05);
    doc.setFont('helvetica', 'normal');
    
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
                        {['boxVents', 'turbine', 'hvacvent', 'raindiverter', 'powerVent', 'skylight', 'sat', 'pipe'].map(item => {
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

    