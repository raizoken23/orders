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
    const { width: pageWidth, height: pageHeight } = doc.internal.pageSize;

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

    doc.setFont('helvetica');

    // Helper to draw a checkbox
    const drawCheckbox = (x: number, y: number, size: number, checked = false) => {
        doc.setLineWidth(0.01);
        doc.setDrawColor(ruleColor);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFontSize(size * 12);
            doc.text('✓', x + size / 6, y + size * 0.85);
        }
    };
    
    // === LEFT COLUMN =======================================

    // SeekNow Logo & Info
    const logoX = margin;
    const logoY = margin;
    doc.setLineWidth(0.03);
    doc.setDrawColor(seeknowGreen);
    doc.rect(logoX, logoY, 0.25, 0.25);
    doc.setLineWidth(0.02);
    doc.line(logoX + 0.125, logoY, logoX + 0.125, logoY + 0.25);
    doc.line(logoX, logoY + 0.125, logoX + 0.25, logoY + 0.125);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(seeknowGreen);
    doc.text('SeekNow.', logoX + 0.3, logoY + 0.2);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text('(866) 801-1258', logoX, logoY + 0.45);


    let currentY = logoY + 0.8;
    const leftColX = margin;
    const leftColWidth = 2.25;

    // --- Shingle Type ---
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(leftColX, currentY, leftColWidth, 1.0); // Main box
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY, leftColWidth, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Shingle Type', leftColX + 0.1, currentY + 0.17);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);

    currentY += 0.35;
    drawCheckbox(leftColX + 0.1, currentY - 0.05, 0.15, values.shingleType === '3 Tab');
    doc.text('3 Tab', leftColX + 0.3, currentY);
    drawCheckbox(leftColX + 0.1, currentY + 0.2, 0.15, values.shingleType === 'Laminate');
    doc.text('Laminate', leftColX + 0.3, currentY + 0.25);

    drawCheckbox(leftColX + 1.2, currentY - 0.05, 0.15, values.shingleMake === '20 Y');
    doc.text('20 Y', leftColX + 1.4, currentY);
    drawCheckbox(leftColX + 1.2, currentY + 0.15, 0.15, values.shingleMake === '25 Y');
    doc.text('25 Y', leftColX + 1.4, currentY + 0.2);
    drawCheckbox(leftColX + 1.2, currentY + 0.35, 0.15, values.shingleMake === '30 Y');
    doc.text('30 Y', leftColX + 1.4, currentY + 0.4);
    
    drawCheckbox(leftColX + 1.7, currentY - 0.05, 0.15, values.shingleMake === '40 Y');
    doc.text('40 Y', leftColX + 1.9, currentY);
    drawCheckbox(leftColX + 1.7, currentY + 0.15, 0.15, values.shingleMake === '50 Y');
    doc.text('50 Y', leftColX + 1.9, currentY + 0.2);
    
    currentY += 0.65;
    // --- Other ---
    doc.rect(leftColX, currentY, leftColWidth, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY, leftColWidth, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Other:', leftColX + 0.1, currentY + 0.17);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(values.otherShingle || '', leftColX + 0.1, currentY + 0.4);
    
    currentY += 0.55;
    // --- Ice/Water Shield ---
    doc.rect(leftColX, currentY, leftColWidth, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY, leftColWidth, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Ice/Water Shield', leftColX + 0.1, currentY + 0.17);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    drawCheckbox(leftColX + 0.2, currentY + 0.3, 0.15, values.iceWaterShield?.includes('Valley'));
    doc.text('Valley', leftColX + 0.4, currentY + 0.4);
    drawCheckbox(leftColX + 0.9, currentY + 0.3, 0.15, values.iceWaterShield?.includes('Eave'));
    doc.text('Eave', leftColX + 1.1, currentY + 0.4);
    drawCheckbox(leftColX + 1.6, currentY + 0.3, 0.15, values.iceWaterShield?.includes('Rake'));
    doc.text('Rake', leftColX + 1.8, currentY + 0.4);

    currentY += 0.55;
    // --- Drip Edge ---
    doc.rect(leftColX, currentY, leftColWidth, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY, leftColWidth, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Drip Edge', leftColX + 0.1, currentY + 0.17);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    drawCheckbox(leftColX + 0.2, currentY + 0.3, 0.15, values.dripEdgeRadio === 'Yes');
    doc.text('Yes', leftColX + 0.4, currentY + 0.4);
    drawCheckbox(leftColX + 0.7, currentY + 0.3, 0.15, values.dripEdgeRadio === 'No');
    doc.text('No', leftColX + 0.9, currentY + 0.4);
    drawCheckbox(leftColX + 1.3, currentY + 0.3, 0.15, values.dripEdge?.includes('Eave'));
    doc.text('Eave', leftColX + 1.5, currentY + 0.4);
    drawCheckbox(leftColX + 1.8, currentY + 0.3, 0.15, values.dripEdge?.includes('Rake'));
    doc.text('Rake', leftColX + 2.0, currentY + 0.4);

    currentY += 0.55;
    // --- Valley Metal ---
    doc.rect(leftColX, currentY, leftColWidth, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY, leftColWidth, 0.25, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFont('helvetica', 'bold');
    doc.text('Valley Metal', leftColX + 0.1, currentY + 0.17);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Na', leftColX + 0.8, currentY + 0.4);
    doc.text(`${values.valleyMetalLF || ''} LF`, leftColX + 1.5, currentY + 0.4);
    
    currentY += 0.55;
    // --- Main Left Form ---
    const leftFormY = currentY;
    doc.rect(leftColX, leftFormY, leftColWidth, 5.7);
    
    const fields = [
        { label: "Layers:", value: values.layers },
        { label: "Pitch:", value: values.pitch },
    ];
    let fieldY = leftFormY + 0.2;
    fields.forEach(field => {
        doc.setFillColor(accentYellow);
        doc.rect(leftColX + 0.05, fieldY - 0.13, 1.0, 0.2, 'F');
        doc.setFontSize(10);
        doc.text(field.label, leftColX + 0.1, fieldY);
        doc.text(field.value || '', leftColX + 1.2, fieldY);
        fieldY += 0.25;
    });

    // Accessories
    const accessories = [
        {label: 'Box Vents:', plastic: values.boxVentsQtyPlastic, lead: values.boxVentsQtyLead},
        {label: 'Ridge Vent:', plastic: values.ridgeVentPlastic, lead: values.ridgeVentLF},
        {label: 'Turbine:', plastic: values.turbineQtyPlastic, lead: values.turbineQtyLead},
        {label: 'HVAC Vent:', plastic: values.hvacVentQtyPlastic, lead: values.hvacVentQtyLead},
        {label: 'Rain Diverter:', plastic: values.rainDiverterQtyPlastic, lead: values.rainDiverterQtyLead},
        {label: 'Power Vent:', plastic: values.powerVentQtyPlastic, lead: values.powerVentQtyLead},
        {label: 'Skylight:', plastic: values.skylightQtyPlastic, lead: values.skylightQtyLead},
        {label: 'SAT:', plastic: values.satQtyPlastic, lead: values.satQtyLead},
    ];

    fieldY += 0.1;
    doc.setFontSize(8);
    doc.text('Metal', leftColX + 1.25, fieldY);
    doc.text('Plastic', leftColX + 1.75, fieldY);
    fieldY += 0.05;
    doc.text('Damaged', leftColX + 1.25, fieldY+0.1);
    doc.text('LF', leftColX + 1.8, fieldY+0.1);
    fieldY += 0.05;

    accessories.forEach(item => {
        fieldY += 0.25;
        doc.setFillColor(accentYellow);
        doc.rect(leftColX + 0.05, fieldY - 0.13, 1.0, 0.2, 'F');
        doc.setFontSize(10);
        doc.text(item.label, leftColX + 0.1, fieldY);
        doc.text(item.lead || '', leftColX + 1.3, fieldY, {align: 'center'});
        doc.text(item.plastic || '', leftColX + 1.8, fieldY, {align: 'center'});
        doc.line(leftColX, fieldY + 0.15, leftColX + leftColWidth, fieldY + 0.15);
    });
    
    fieldY += 0.3;
    // Pipes
    doc.setFillColor(accentYellow);
    doc.rect(leftColX + 0.05, fieldY - 0.13, 1.0, 0.2, 'F');
    doc.setFontSize(10);
    doc.text('Pipes:', leftColX + 0.1, fieldY);
    doc.setFontSize(8);
    doc.text('Qty', leftColX + 1.3, fieldY - 0.05);
    doc.text('Lead', leftColX + 1.7, fieldY - 0.05);
    doc.text(values.pipesQtyLead || '', leftColX + 1.3, fieldY + 0.15, { align: 'center'});
    doc.line(leftColX, fieldY + 0.2, leftColX + leftColWidth, fieldY + 0.2);

    fieldY += 0.3;
    // Gutters
    doc.setFillColor(accentYellow);
    doc.rect(leftColX + 0.05, fieldY - 0.13, 1.0, 0.2, 'F');
    doc.setFontSize(10);
    doc.text('Gutters:', leftColX + 0.1, fieldY);
    doc.text('NA LF', leftColX + 1.2, fieldY);
    drawCheckbox(leftColX + 1.6, fieldY - 0.05, 0.1, values.guttersSize === '5"');
    doc.text('5"', leftColX + 1.75, fieldY);
    drawCheckbox(leftColX + 1.9, fieldY - 0.05, 0.1, values.guttersSize === '6"');
    doc.text('6"', leftColX + 2.05, fieldY);
    doc.line(leftColX, fieldY + 0.15, leftColX + leftColWidth, fieldY + 0.15);

    fieldY += 0.25;
    // Downspouts, Fascia, etc.
    const finalFields = [
        {label: 'Downspouts:', options: ['2x3', '3x4'], value: values.downspoutsSize},
        {label: 'Fascia:', options: ['Size', 'LF', 'NA'], value: ''},
        {label: 'Wood / Metal', options: [], value: ''},
        {label: 'Chimney Flashing:', options: [], value: values.chimneyFlashing},
        {label: 'Other:', options: ['Solar', 'Vent E', 'Exhaust Vent'], value: values.chimneyOther}
    ];

    finalFields.forEach(field => {
        doc.setFillColor(accentYellow);
        doc.rect(leftColX + 0.05, fieldY - 0.13, 1.2, 0.2, 'F');
        doc.setFontSize(10);
        doc.text(field.label, leftColX + 0.1, fieldY);

        if (field.value) {
            doc.text(field.value, leftColX + 1.4, fieldY);
        }
        
        let optX = leftColX + 1.4;
        field.options.forEach(opt => {
            if (field.label === 'Downspouts:') {
                drawCheckbox(optX - 0.1, fieldY - 0.05, 0.1, field.value === opt);
                doc.text(opt, optX + 0.05, fieldY);
                optX += 0.4;
            } else {
                 doc.setFontSize(8);
                 doc.text(opt, optX, fieldY);
                 optX += 0.4;
            }
        });
        
        fieldY += 0.25;
        doc.line(leftColX, fieldY - 0.1, leftColX + leftColWidth, fieldY-0.1);
    });

    // === RIGHT/TOP SECTION =======================================

    const rightColX = leftColX + leftColWidth + 0.1;
    const rightColWidth = pageWidth - rightColX - margin;
    let rightY = margin;

    // --- Damage Table ---
    const damageTableX = pageWidth - margin - 3.2;
    const damageTableY = rightY;
    const damageTableW = 3.2;
    const damageTableH = 2.1;
    doc.rect(damageTableX, damageTableY, damageTableW, damageTableH);

    // Damage Header
    const damageHeaderH = 0.25;
    const damageColW = (damageTableW - 1) / 3;
    doc.setFillColor(accentPink);
    doc.rect(damageTableX, damageTableY + damageTableH - damageHeaderH, damageTableW, damageHeaderH, 'F');
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Hail', damageTableX + 0.5 * damageColW, damageTableY + damageTableH - damageHeaderH + 0.17, { align: 'center' });
    doc.text('Wind', damageTableX + 1.5 * damageColW, damageTableY + damageTableH - damageHeaderH + 0.17, { align: 'center' });
    doc.text('Tree', damageTableX + 2.5 * damageColW, damageTableY + damageTableH - damageHeaderH + 0.17, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    // Damage F,R,B,L
    const damageRowH = 0.3;
    let damageRowY = damageTableY + damageTableH - damageHeaderH - damageRowH;
    ['F:', 'R:', 'B:', 'L:'].forEach((label, i) => {
        doc.text(label, damageTableX + 0.1, damageRowY + 0.2);
        doc.line(damageTableX, damageRowY, damageTableX + damageTableW, damageRowY);
        doc.text(values[`hail${label.charAt(0)}` as 'hailF'] || '', damageTableX + 0.4, damageRowY + 0.2);
        damageRowY -= damageRowH;
    });
    
    // Date & Inspector
    const inspectorInfoY = damageRowY;
    const inspectorFields = [
        `Date: ${values.windDate || ''}`,
        'Ladder Now',
        `Inspector: ${values.inspector || ''}`,
        `Phone: ${values.phone || ''}`,
        `Email: ${values.email || ''}`
    ];
    let infoY = inspectorInfoY + damageRowH;
    inspectorFields.forEach((text, i) => {
        doc.line(damageTableX, infoY, damageTableX + damageTableW, infoY);
        doc.text(text, damageTableX + 0.1, infoY + 0.2);
        if(text === 'Ladder Now') {
            drawCheckbox(damageTableX + 1.0, infoY + 0.1, 0.15, values.ladderNow);
        }
        infoY -= damageRowH;
    });

    // --- Mid Bar ---
    const midBarY = leftFormY - 0.7;
    doc.rect(rightColX, midBarY, rightColWidth, 1.4);
    
    // Eave, Rake, Aerial
    doc.text('Eave: LF N/A', rightColX + 0.1, midBarY + 0.2);
    doc.text('Rake: LF N/A', rightColX + 1.5, midBarY + 0.2);
    doc.text('Aerial Measurements:', rightColX + 3.0, midBarY + 0.2);
    doc.line(rightColX, midBarY + 0.3, rightColX + rightColWidth, midBarY + 0.3);

    // Calculations
    const calcX = rightColX + 0.1;
    let calcY = midBarY + 0.5;
    const calcFields = ['A', 'B', 'C', 'D', 'E'];
    calcFields.forEach((field, i) => {
        doc.text(`${field} ${values[`calc${field}` as 'calcA'] || 'N/A'}`, calcX, calcY + i * 0.15);
    });
    const calcFields2 = ['F', 'G', 'H', 'I', 'J'];
    calcFields2.forEach((field, i) => {
        doc.text(`${field} ${values[`calc${field}` as 'calcF'] || 'N/A'}`, calcX + 1.0, calcY + i * 0.15);
    });
    const calcFields3 = ['K', 'L', 'M'];
     calcFields3.forEach((field, i) => {
        doc.text(`${field} ${values[`calc${field}` as 'calcK'] || 'N/A'}`, calcX + 2.0, calcY + i * 0.15);
    });

    // Aerial measurements & total squares
    doc.text(`1 Story: ${values.aerialMeasurements1Story || ''}`, calcX + 3.0, calcY);
    doc.text(`2 Story: ${values.aerialMeasurements2Story || ''}`, calcX + 3.0, calcY + 0.2);
    doc.line(rightColX, midBarY + 1.15, rightColX + rightColWidth, midBarY + 1.15);
    doc.text(`Total Squares: ${values.totalSquares || ''}`, rightColX + 1.0, midBarY + 1.3);

    // --- Key Bar ---
    const keyBarY = midBarY - 0.3;
    doc.setFillColor(accentCyan);
    doc.rect(rightColX, keyBarY, rightColWidth, 0.25, 'F');
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Key:', rightColX + 0.1, keyBarY + 0.17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const keyItems = [
        'TS = Test Square', 'B = Blistering', 'M = Mechanical Damage',
        'TC = Thermal Cracking', 'PV = Power Vent', 'TD = Tree Damage',
        ' = Box Vent', ' = HVAC', ' = Chimney',
        'X = Wind Damage', ' = Pipe Boot', 'E = Exhaust vent'
    ];
    let keyX = rightColX + 0.5;
    let keyY = keyBarY + 0.1;
    keyItems.forEach((item, i) => {
        if(i > 0 && i % 3 === 0) { keyY += 0.12; keyX = rightColX + 0.5; }
        doc.text(item, keyX, keyY);
        keyX += 1.3;
    });

    // --- Inch/Decimal table ---
    const inchTableX = pageWidth - margin - 1.2;
    const inchTableY = keyBarY + 0.3;
    doc.rect(inchTableX, inchTableY, 1.2, 0.5);
    doc.setFontSize(7);
    const inchData = [
        ['1" .08', '5" .42', '9" .75'],
        ['2" .17', '6" .50', '10" .83'],
        ['3" .25', '7" .58', '11" .92'],
        ['4" .33', '8" .67', '12" 1.00'],
    ];
     let inchY = inchTableY + 0.1;
    inchData.forEach((row, i) => {
        let inchX = inchTableX + 0.1;
        row.forEach(cell => {
            doc.text(cell, inchX, inchY);
            inchX += 0.4;
        });
        inchY += 0.1;
    });

    // === SKETCH AREA ========================================
    const sketchX = rightColX;
    const sketchY = leftFormY;
    const sketchW = rightColWidth;
    const sketchH = pageHeight - sketchY - margin - 0.8;
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
    const footerY = pageHeight - margin - 0.7;
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(leftColX, footerY, pageWidth - margin*2, 0.6);
    doc.text('Notes:', leftColX + 0.1, footerY + 0.15);
    doc.setFontSize(8);
    doc.text(values.notes || '', leftColX + 0.1, footerY + 0.3, { maxWidth: 6.5 });
    
    doc.save(`ScopeSheet-${values.claimNumber || 'DEMO'}.pdf`);

    toast({
      title: 'Report Generated',
      description: 'Your PDF report has been downloaded.',
    })
  }

  const handleTestReport = () => {
    form.reset(mockData);
    // Use a timeout to ensure the form state has been updated before submitting
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
                            const name = item.toLowerCase().replace(/ /g, '') as 'boxvents' | 'turbine' | 'hvacvent' | 'raindiverter' | 'powervent' | 'skylight' | 'sat' | 'pipes';
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
