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
  powerventQtyLead: z.string().optional(),
  powerventQtyPlastic: z.string().optional(),
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
  boxventsQtyLead: z.string().optional(),
  boxventsQtyPlastic: z.string().optional(),
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
    boxventsQtyPlastic: '4',
    boxventsQtyLead: '0',
    ridgeVentLF: '50',
    ridgeVentPlastic: 'true',
    turbineQtyLead: '2',
    hvacventQtyPlastic: '1',
    pipesQtyPlastic: '3',
    guttersLF: '150',
    guttersSize: '5"',
    downspoutsLF: '80',
    downspoutsSize: '2x3',
    fasciaMetal: '230 LF',
    chimneyFlashing: 'Step',
    notes: 'Heavy hail damage observed on all slopes. Minor wind damage on the west-facing slope. Inspected property with homeowner present. All collateral damage was documented. Homeowner has a dog named "Sparky".',
    ridgeVentMetalDamaged: '',
    raindiverterQtyLead: '',
    raindiverterQtyPlastic: '',
    powerventQtyLead: '',
    powerventQtyPlastic: '',
    skylightQtyLead: '',
    skylightQtyPlastic: '',
    satQtyLead: '',
    satQtyPlastic: '',
    fasciaWood: '',
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
      powerventQtyLead: '',
      powerventQtyPlastic: '',
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
      boxventsQtyLead: '',
      boxventsQtyPlastic: '',
      ridgeVentMetalDamaged: '',
      ridgeVentLF: '',
      ridgeVentPlastic: '',
    },
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.forEach((value, key) => {
      const formKey = key as keyof ScopeSheetData;
      if (Object.keys(form.getValues()).includes(formKey)) {
          if (formKey === 'ladderNow' || formKey === 'valleyMetalNA' || formKey === 'ridgeVentPlastic' || formKey === 'ridgeVentMetalDamaged') {
             form.setValue(formKey, value === 'true');
          } else if (formKey === 'iceWaterShield' || formKey === 'dripEdge') {
             form.setValue(formKey, value.split(','));
          } else {
             form.setValue(formKey, value);
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

    const drawCheckbox = (x: number, y: number, checked = false, size = 0.15) => {
        doc.setLineWidth(0.01);
        doc.setDrawColor(ruleColor);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFontSize(size * 12);
            doc.text('✓', x + size / 6, y + size * 0.85);
        }
    };
    
    // === HEADER (TOP RIGHT) =======================================
    const headerBlockY = pageHeight - margin - 2.5;

    // --- SeekNow Logo & Info ---
    const logoX = margin;
    let currentY = pageHeight - margin - 0.2;
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
    doc.text('(866) 801-1258', logoX + 0.2, currentY);


    // --- Damage Table ---
    const damageTableX = pageWidth - margin - 3.2;
    const damageTableW = 3.2;
    const damageRowH = 0.25;
    let damageY = pageHeight - margin - (damageRowH * 5) - 0.2;
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(damageTableX, damageY, damageTableW, damageRowH * 5);

    doc.setFillColor(accentPink);
    doc.rect(damageTableX, damageY + damageRowH * 4, damageTableW, damageRowH, 'F');
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const colW = damageTableW / 3;
    doc.text('Hail', damageTableX + 0.5 * colW, damageY + damageRowH * 4.7, { align: 'center' });
    doc.text('Wind', damageTableX + 1.5 * colW, damageY + damageRowH * 4.7, { align: 'center' });
    doc.text('Tree', damageTableX + 2.5 * colW, damageY + damageRowH * 4.7, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    // Lines for columns
    doc.line(damageTableX + colW, damageY, damageTableX + colW, damageY + damageRowH * 5);
    doc.line(damageTableX + 2 * colW, damageY, damageTableX + 2 * colW, damageY + damageRowH * 5);

    let labelY = damageY + damageRowH * 3.7;
    ['F', 'R', 'B', 'L'].forEach((label, i) => {
        doc.text(`${label}:`, damageTableX - 0.3, labelY);
        doc.line(damageTableX, damageY + (3 - i) * damageRowH, damageTableX + damageTableW, damageY + (3-i) * damageRowH);
        doc.text(values[`hail${label}` as 'hailF'] || '', damageTableX + 0.1, labelY);
        labelY -= damageRowH;
    });

    // --- Inspector Info ---
    const inspectorInfoX = damageTableX - 2.5;
    const inspectorFields = [
        {label: 'Date:', value: values.windDate},
        {label: 'Ladder Now', value: values.ladderNow},
        {label: 'Inspector:', value: values.inspector},
        {label: 'Phone:', value: values.phone},
        {label: 'Email:', value: values.email}
    ];

    let infoY = damageY + damageRowH * 4.7;
    doc.setFontSize(10);
    inspectorFields.forEach((field) => {
        doc.text(field.label, inspectorInfoX, infoY);
        doc.setDrawColor(ruleLightColor);
        doc.line(inspectorInfoX + 0.7, infoY - 0.05, damageTableX - 0.1, infoY - 0.05);

        if (typeof field.value === 'boolean') {
             drawCheckbox(inspectorInfoX + 0.8, infoY - 0.1, field.value);
        } else {
             doc.text(field.value || '', inspectorInfoX + 0.8, infoY);
        }
        infoY -= damageRowH;
    })
    
    // === LEFT COLUMN =======================================
    const leftColX = margin;
    const leftColW = 2.25;
    currentY = headerBlockY;

    // --- Shingle Type ---
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    doc.rect(leftColX, currentY, leftColW, 0.8);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY+0.6, leftColW, 0.2, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Shingle Type', leftColX + 0.1, currentY + 0.75);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);

    drawCheckbox(leftColX + 0.1, currentY + 0.35, values.shingleType === '3 Tab');
    doc.text('3 Tab', leftColX + 0.3, currentY + 0.45);
    drawCheckbox(leftColX + 0.1, currentY + 0.1, values.shingleType === 'Laminate');
    doc.text('Laminate', leftColX + 0.3, currentY + 0.2);

    drawCheckbox(leftColX + 1.2, currentY + 0.35, values.shingleMake === '20 Y');
    doc.text('20 Y', leftColX + 1.4, currentY + 0.45);
    drawCheckbox(leftColX + 1.2, currentY + 0.1, values.shingleMake === '25 Y');
    doc.text('25 Y', leftColX + 1.4, currentY + 0.2);
    drawCheckbox(leftColX + 1.2, currentY - 0.15, values.shingleMake === '30 Y');
    doc.text('30 Y', leftColX + 1.4, currentY - 0.05);
    
    drawCheckbox(leftColX + 1.7, currentY + 0.35, values.shingleMake === '40 Y');
    doc.text('40 Y', leftColX + 1.9, currentY + 0.45);
    drawCheckbox(leftColX + 1.7, currentY + 0.1, values.shingleMake === '50 Y');
    doc.text('50 Y', leftColX + 1.9, currentY + 0.2);
    
    // --- Other ---
    currentY -= 0.3;
    doc.rect(leftColX, currentY, leftColW, 0.3);
    doc.text('Other:', leftColX + 0.1, currentY + 0.2);
    doc.line(leftColX+0.6, currentY + 0.15, leftColX + leftColW - 0.1, currentY + 0.15);
    doc.text(values.otherShingle || '', leftColX + 0.65, currentY + 0.12);

    // --- Ice/Water Shield ---
    currentY -= 0.4;
    doc.rect(leftColX, currentY, leftColW, 0.4);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY+0.2, leftColW, 0.2, 'F');
    doc.setTextColor('#FFFFFF'); doc.setFont('helvetica', 'bold');
    doc.text('Ice/Water Shield', leftColX + 0.1, currentY + 0.35);
    doc.setTextColor(textColor); doc.setFont('helvetica', 'normal');
    
    drawCheckbox(leftColX + 0.2, currentY - 0.05, values.iceWaterShield?.includes('Valley'));
    doc.text('Valley', leftColX + 0.4, currentY + 0.05);
    drawCheckbox(leftColX + 0.9, currentY - 0.05, values.iceWaterShield?.includes('Eave'));
    doc.text('Eave', leftColX + 1.1, currentY + 0.05);
    drawCheckbox(leftColX + 1.6, currentY - 0.05, values.iceWaterShield?.includes('Rake'));
    doc.text('Rake', leftColX + 1.8, currentY + 0.05);

    // --- Drip Edge ---
    currentY -= 0.5;
    doc.rect(leftColX, currentY, leftColW, 0.5);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY + 0.3, leftColW, 0.2, 'F');
    doc.setTextColor('#FFFFFF'); doc.setFont('helvetica', 'bold');
    doc.text('Drip Edge', leftColX + 0.1, currentY + 0.45);
    doc.setTextColor(textColor); doc.setFont('helvetica', 'normal');
    
    drawCheckbox(leftColX + 0.2, currentY + 0.05, values.dripEdgeRadio === 'Yes');
    doc.text('Yes', leftColX + 0.4, currentY + 0.15);
    drawCheckbox(leftColX + 0.7, currentY + 0.05, values.dripEdgeRadio === 'No');
    doc.text('No', leftColX + 0.9, currentY + 0.15);

    drawCheckbox(leftColX + 1.3, currentY - 0.2, values.dripEdge?.includes('Rake'));
    doc.text('Rake', leftColX + 1.5, currentY - 0.1);
    drawCheckbox(leftColX + 1.3, currentY + 0.05, values.dripEdge?.includes('Eave'));
    doc.text('Eave', leftColX + 1.5, currentY + 0.15);
    
    // --- Valley Metal ---
    currentY -= 0.4;
    doc.rect(leftColX, currentY, leftColW, 0.4);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY + 0.2, leftColW, 0.2, 'F');
    doc.setTextColor('#FFFFFF'); doc.setFont('helvetica', 'bold');
    doc.text('Valley Metal', leftColX + 0.1, currentY + 0.35);
    doc.setTextColor(textColor); doc.setFont('helvetica', 'normal');
    drawCheckbox(leftColX + 0.2, currentY-0.05, values.valleyMetalNA);
    doc.text('Na', leftColX + 0.4, currentY + 0.05);
    doc.text(`${values.valleyMetalLF || ''} LF`, leftColX + 1.5, currentY + 0.05);
    doc.line(leftColX + 1.4, currentY+0.08, leftColX + leftColW - 0.1, currentY+0.08);

    // --- Layers ---
    currentY -= 0.3;
    doc.rect(leftColX, currentY, leftColW, 0.3);
    doc.setFillColor(seeknowGreen);
    doc.rect(leftColX, currentY+0.1, leftColW, 0.2, 'F');
    doc.setTextColor('#FFFFFF'); doc.setFont('helvetica', 'bold');
    doc.text('Layers:', leftColX + 0.1, currentY + 0.25);
    doc.setTextColor(textColor); doc.setFont('helvetica', 'normal');
    doc.text(values.layers || '', leftColX + 0.8, currentY + 0.25);
    doc.line(leftColX + 0.7, currentY+0.28, leftColX + leftColW - 0.1, currentY+0.28);
    
    // --- Accessories Box ---
    const accessoriesYStart = currentY - 0.1;
    const accessoriesHeight = 4.8;
    doc.rect(leftColX, accessoriesYStart - accessoriesHeight, leftColW, accessoriesHeight);
    
    const drawAccessoryRow = (y: number, label: string, content?: ()=>void) => {
        doc.setFillColor(accentYellow);
        doc.rect(leftColX + 0.05, y - 0.22, 0.9, 0.2, 'F');
        doc.setTextColor(textColor);
        doc.text(label, leftColX + 0.1, y - 0.1);
        doc.setDrawColor(ruleLightColor);
        doc.line(leftColX, y - 0.25, leftColX + leftColW, y - 0.25);
        if (content) content();
        return y - 0.3;
    }

    let accessoryY = accessoriesYStart;
    
    accessoryY = drawAccessoryRow(accessoryY, 'Pitch:', () => {
        doc.text(values.pitch || '', leftColX + 1.2, accessoryY - 0.1);
    });

    accessoryY = drawAccessoryRow(accessoryY, 'Box Vents:', () => {
        doc.setFontSize(8);
        doc.text('Metal', leftColX + 1.2, accessoryY);
        doc.text('Plastic', leftColX + 1.2, accessoryY - 0.15);
        doc.text('Damaged', leftColX + 1.8, accessoryY);
        doc.setFontSize(10);
    });

    accessoryY = drawAccessoryRow(accessoryY, 'Ridge Vent:', () => {
        doc.text('LF', leftColX + 1.2, accessoryY - 0.1);
    });
    accessoryY = drawAccessoryRow(accessoryY, 'Turbine:');
    accessoryY = drawAccessoryRow(accessoryY, 'HVAC Vent:');
    accessoryY = drawAccessoryRow(accessoryY, 'Rain Diverter:');
    accessoryY = drawAccessoryRow(accessoryY, 'Power Vent:');
    accessoryY = drawAccessoryRow(accessoryY, 'Skylight:');
    accessoryY = drawAccessoryRow(accessoryY, 'SAT:');
    
    accessoryY = drawAccessoryRow(accessoryY, 'Pipes:', () => {
        doc.setFontSize(8);
        doc.text('Qty', leftColX + 1.1, accessoryY);
        doc.text('Lead', leftColX + 1.5, accessoryY);
        doc.text('Qty', leftColX + 1.1, accessoryY - 0.15);
        doc.text('Plastic', leftColX + 1.5, accessoryY - 0.15);
        doc.setFontSize(10);
    });

    accessoryY = drawAccessoryRow(accessoryY, 'Gutters:', () => {
        drawCheckbox(leftColX + 1.5, accessoryY - 0.1, values.guttersSize === '5"');
        doc.text('5"', leftColX + 1.7, accessoryY - 0.02);
        drawCheckbox(leftColX + 1.5, accessoryY - 0.25, values.guttersSize === '6"');
        doc.text('6"', leftColX + 1.7, accessoryY - 0.17);
        doc.text('NA   LF', leftColX + 1.1, accessoryY - 0.1);
    });

    accessoryY = drawAccessoryRow(accessoryY, 'Downspouts:', () => {
        drawCheckbox(leftColX + 1.5, accessoryY - 0.1, values.downspoutsSize === '2x3');
        doc.text('2x3', leftColX + 1.7, accessoryY - 0.02);
        drawCheckbox(leftColX + 1.5, accessoryY - 0.25, values.downspoutsSize === '3x4');
        doc.text('3x4', leftColX + 1.7, accessoryY - 0.17);
    });

    accessoryY = drawAccessoryRow(accessoryY, 'Fascia:', () => {
        doc.text('Size', leftColX + 1.2, accessoryY - 0.1);
        doc.text('LF', leftColX + 1.6, accessoryY - 0.1);
        doc.text('NA', leftColX + 2.0, accessoryY - 0.1);
    });

    accessoryY = drawAccessoryRow(accessoryY, 'Wood / Metal');

    accessoryY = drawAccessoryRow(accessoryY, 'Chimney Flashing:');
    
    accessoryY = drawAccessoryRow(accessoryY, 'Other:', () => {
        doc.setFontSize(8);
        doc.text('Solar', leftColX + 1.2, accessoryY - 0.1);
        doc.text('Vent E', leftColX + 1.6, accessoryY - 0.1);
        doc.text('Exhaust Vent', leftColX + 1.9, accessoryY - 0.1);
        doc.setFontSize(10);
    });
    
    // === SKETCH AREA ========================================
    const sketchX = leftColX + leftColW + gridStep;
    const sketchY = margin + 1.2;
    const sketchW = pageWidth - sketchX - margin;
    const sketchH = pageHeight - sketchY - headerBlockY + 2.3 - (pageHeight-headerBlockY-sketchY) + 1.8;
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
    const notesX = leftColX + leftColW + gridStep;
    const notesW = pageWidth - notesX - margin - 1.0; // leave space for compass
    
    doc.setDrawColor(ruleColor);
    doc.setLineWidth(0.01);
    
    // --- Box with Hail, Storm, Collateral ---
    const collateralBoxX = leftColX;
    const collateralBoxW = leftColW + gridStep;
    doc.rect(collateralBoxX, footerY, collateralBoxW, footerH);
    
    let collateralY = footerY + footerH - 0.2;
    const collateralFields = [
        { label: 'Max Hail Diameter:', value: values.maxHailDiameter },
        { label: 'Storm Direction:', value: values.stormDirection },
        { label: 'Collateral Damage:', value: '' } // This seems to be a label for the F,B,R,L fields
    ];
    collateralFields.forEach((field, index) => {
        doc.text(field.label, collateralBoxX + 0.1, collateralY);
        doc.line(collateralBoxX + 1.4, collateralY - 0.05, collateralBoxX + collateralBoxW - 0.1, collateralY - 0.05);
        doc.text(field.value || '', collateralBoxX + 1.5, collateralY);
        collateralY -= 0.2;
    });

    // --- Notes Box ---
    doc.rect(notesX, footerY, notesW, footerH);
    doc.text('Notes:', notesX + 0.1, footerY + footerH - 0.2);
    doc.setFontSize(8);
    const notesLines = doc.splitTextToSize(values.notes || '', notesW - 0.2);
    doc.text(notesLines, notesX + 0.1, footerY + footerH - 0.35);
    doc.setFontSize(10);
    
    // --- Compass Rose ---
    const compassX = notesX + notesW;
    const compassW = pageWidth - compassX - margin;
    doc.rect(compassX, footerY, compassW, footerH);
    const centerX = compassX + compassW / 2;
    const centerY = footerY + footerH / 2;
    const radius = Math.min(compassW, footerH) / 2 * 0.7;

    doc.setLineWidth(0.01);
    doc.setDrawColor(ruleColor);
    
    // Cardinal points lines
    doc.line(centerX, centerY - radius, centerX, centerY + radius); // N-S
    doc.line(centerX - radius, centerY, centerX + radius, centerY); // E-W

    // Intercardinal points lines
    const interRadius = radius * 0.7;
    doc.line(centerX - interRadius / Math.sqrt(2), centerY - interRadius / Math.sqrt(2), centerX + interRadius / Math.sqrt(2), centerY + interRadius / Math.sqrt(2));
    doc.line(centerX + interRadius / Math.sqrt(2), centerY - interRadius / Math.sqrt(2), centerX - interRadius / Math.sqrt(2), centerY + interRadius / Math.sqrt(2));
    
    // Smaller intermediate lines
    const smallRadius = radius * 0.4;
    const angle = 22.5 * (Math.PI / 180);
    for (let i = 0; i < 16; i++) {
        if (i % 2 !== 0) {
            const startX = centerX + smallRadius * Math.cos(angle * i);
            const startY = centerY + smallRadius * Math.sin(angle * i);
            const endX = centerX + (smallRadius/2) * Math.cos(angle * i);
            const endY = centerY + (smallRadius/2) * Math.sin(angle * i);
            doc.line(startX, startY, endX, endY);
        }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('F', centerX, centerY + radius + 0.1);
    doc.text('B', centerX, centerY - radius - 0.05);
    doc.text('R', centerX + radius + 0.05, centerY + 0.05);
    doc.text('L', centerX - radius - 0.15, centerY + 0.05);
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
                        {['boxvents', 'turbine', 'hvacvent', 'raindiverter', 'powervent', 'skylight', 'sat', 'pipes'].map(item => {
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
