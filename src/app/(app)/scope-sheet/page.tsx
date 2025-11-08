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
  satQtyPlastic: z.string().optional(),
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
  otherVentE: z.boolean().optional(),
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


  function onSubmit(values: z.infer<typeof scopeSheetSchema>) {
    const doc = new jsPDF({ orientation: 'p', unit: 'in', format: 'letter' });

    // Design Tokens
    const m = 0.5;
    const ruleHeavy = 0.02; // 2px
    const rule = 0.01; // 1px
    const ruleLight = 0.005; // 0.5px
    const ink = '#000000';
    const gridColor = '#9a9a9a';
    const pink = '#f8c9cf';
    const cyan = '#bfeaf1';
    const yellow = '#fff2a6';
    const leftRail = 2.25;
    const gap = 0.125;
    const gridStep = 0.125;
    const { width: pageWidth, height: pageHeight } = doc.internal.pageSize;

    // Helper functions
    doc.setFont('helvetica');
    const drawText = (text: string, x: number, y: number, options?: any) => doc.text(text || '', x, y, options);
    const drawCheckbox = (x: number, y: number, checked = false, size = 0.16) => {
        doc.setLineWidth(rule);
        doc.setDrawColor(ink);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFontSize(size * 12);
            doc.text('✕', x + size / 4, y + size * 0.8);
        }
    };
    
    // === HEADER ========================================================
    const headerY = pageHeight - m;
    // --- Brand Box ---
    doc.setLineWidth(ruleHeavy);
    doc.setDrawColor(ink);
    const brandBoxW = pageWidth - m * 2 - 3.2 - gap;
    doc.rect(m, headerY - 0.6, brandBoxW, 0.6);
    doc.setFontSize(12).setFont('helvetica', 'bold');
    drawText('SeekNow', m + 0.14, headerY - 0.25);
    doc.setFontSize(11).setFont('helvetica', 'normal');
    drawText('(866) 801-1258', m + brandBoxW - 0.14, headerY - 0.25, { align: 'right' });
    
    // --- Contact Box ---
    const contactBoxX = m + brandBoxW + gap;
    const contactBoxW = 3.2;
    doc.rect(contactBoxX, headerY - 0.6, contactBoxW, 0.6);
    let contactY = headerY - 0.12;
    const contactRowH = 0.32;
    const contactLabelW = 0.9;
    const contactLineXStart = contactBoxX + contactLabelW + 0.1;
    const contactLineXEnd = contactBoxX + contactBoxW - 0.14;

    doc.setFontSize(10);
    const contactFields = [
        {label: 'Date', value: values.windDate},
        {label: 'Company', value: 'Ladder Now'},
        {label: 'Inspector', value: values.inspector},
        {label: 'Phone', value: values.phone},
        {label: 'Email', value: values.email},
    ];
    let currentContactY = headerY - 0.22;
    doc.setFontSize(10).setFont('helvetica', 'normal');
    drawText('Date', contactBoxX + 0.14, currentContactY);
    doc.line(contactBoxX + 0.9, currentContactY + 0.02, contactLineXEnd, currentContactY + 0.02);
    drawText(values.windDate || '', contactBoxX + 0.95, currentContactY);
    
    currentContactY -= 0.15;
    drawText('Company', contactBoxX + 0.14, currentContactY);
    doc.line(contactBoxX + 0.9, currentContactY + 0.02, contactLineXEnd, currentContactY + 0.02);
    drawText('Ladder Now', contactBoxX + 0.95, currentContactY);
    
    currentContactY -= 0.15;
    drawText('Inspector', contactBoxX + 0.14, currentContactY);
    doc.line(contactBoxX + 0.9, currentContactY + 0.02, contactLineXEnd, currentContactY + 0.02);
    drawText(values.inspector || '', contactBoxX + 0.95, currentContactY);

    doc.setFontSize(8);
    currentContactY -= 0.1;
    drawText('Phone', contactBoxX + 0.9 - 0.05, currentContactY, {align: 'right'});
    drawText(values.phone || '', contactBoxX + 0.95, currentContactY);
    doc.line(contactBoxX + 0.9, currentContactY + 0.02, contactLineXEnd, currentContactY + 0.02);
    
    currentContactY -= 0.1;
    drawText('Email', contactBoxX + 0.9- 0.05, currentContactY, {align: 'right'});
    drawText(values.email || '', contactBoxX + 0.95, currentContactY);
    doc.line(contactBoxX + 0.9, currentContactY + 0.02, contactLineXEnd, currentContactY + 0.02);

    // === DAMAGE MATRIX (absolute position) ============================
    const damageX = pageWidth - m - 3.1;
    const damageY = pageHeight - m;
    const damageW = 3.1;
    const damageH = 1.4;
    doc.setLineWidth(ruleHeavy);
    doc.rect(damageX, damageY-damageH, damageW, damageH);

    doc.setLineWidth(rule);
    const damageRowH = 0.35;
    const damageColW = (damageW-0.9)/2;

    doc.setFillColor(pink);
    doc.rect(damageX, damageY - damageRowH, damageW, damageRowH, 'F');
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.setTextColor(ink);
    drawText('Hail', damageX + 0.9 + damageColW/2, damageY - damageRowH/2 + 0.05, { align: 'center'});
    drawText('Wind', damageX + 0.9 + damageColW*1.5, damageY - damageRowH/2 + 0.05, { align: 'center'});
    drawText('Tree', damageX + 0.9 + damageColW*2.5, damageY - damageRowH/2 + 0.05, { align: 'center'});
    doc.vLine(damageX + 0.9 + damageColW, damageY - damageRowH, damageY);
    doc.vLine(damageX + 0.9 + damageColW*2, damageY - damageRowH, damageY);

    const damageLabels = ['F:', 'R:', 'B:', 'L:'];
    damageLabels.forEach((label, i) => {
        const y = damageY - damageRowH * (i + 1);
        doc.hLine(damageX, y, damageX + damageW);
        doc.vLine(damageX + 0.9, y, y + damageRowH);
        drawText(label, damageX + 0.1, y + damageRowH / 2 + 0.05);
        
        const damageValues = [values[`hail${label[0]}` as keyof ScopeSheetData], values[`wind${label[0]}` as keyof ScopeSheetData], values[`tree${label[0]}` as keyof ScopeSheetData]];
        damageValues.forEach((val, j) => {
            drawText(val as string || '', damageX + 0.9 + j * damageColW + 0.05, y + damageRowH/2 + 0.05);
        });
    });

    // === SHINGLE/CALC/AERIAL BAND =================================
    const bandY = headerY - 0.6 - gap;
    const bandH = 1.95;
    // Left Box
    doc.setLineWidth(rule);
    doc.rect(m, bandY - bandH, leftRail, bandH);
    doc.setFontSize(10).setFont('helvetica', 'bold');
    drawText('SHINGLE TYPE', m + 0.1, bandY - 0.1);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    let chkX = m + 0.2; let chkY = bandY - 0.35;
    drawCheckbox(chkX, chkY, values.shingleType?.includes('3 Tab')); drawText('3 Tab', chkX + 0.2, chkY + 0.1);
    drawCheckbox(chkX, chkY-0.2, values.shingleType?.includes('Laminate')); drawText('Laminate', chkX + 0.2, chkY - 0.1);
    chkX += 1;
    ['20 Y', '25 Y', '30 Y', '40 Y', '50 Y'].forEach((item, i) => {
        if(i > 2) {
             drawCheckbox(chkX + 0.7, chkY - 0.2 * (i-3), values.shingleType?.includes(item)); drawText(item, chkX + 0.9, chkY - 0.2 * (i-3) + 0.1);
        } else {
             drawCheckbox(chkX, chkY - 0.2 * i, values.shingleType?.includes(item)); drawText(item, chkX + 0.2, chkY - 0.2 * i + 0.1);
        }
    });
    drawText('Other:', m + 0.1, bandY - 1.0);
    doc.line(m + 0.6, bandY-0.98, m+leftRail-0.1, bandY-0.98);
    drawText(values.otherShingle || '', m+0.65, bandY-1.0);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    drawText('ICE / WATER SHIELD', m + 0.1, bandY - 1.15);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    chkX = m + 0.2; chkY = bandY - 1.35;
    drawCheckbox(chkX, chkY, values.iceWaterShield?.includes('Valley')); drawText('Valley', chkX + 0.2, chkY + 0.1);
    drawCheckbox(chkX + 0.8, chkY, values.iceWaterShield?.includes('Eave')); drawText('Eave', chkX + 1.0, chkY + 0.1);
    drawText('Valley Metal', chkX + 1.6, chkY + 0.1);
    doc.line(chkX+2.4, chkY+0.12, chkX+3.1, chkY+0.12);
    drawText(values.valleyMetalLF || '', chkX + 2.45, chkY+0.1);
    drawText('LF', chkX+3.15, chkY+0.1);

    doc.setFontSize(10).setFont('helvetica', 'bold');
    drawText('DRIP EDGE', m + 0.1, bandY - 1.55);
    doc.setFontSize(10).setFont('helvetica', 'normal');
    chkX = m + 0.2; chkY = bandY - 1.75;
    drawCheckbox(chkX, chkY, values.dripEdgeRadio === 'Yes'); drawText('Yes', chkX + 0.2, chkY + 0.1);
    drawCheckbox(chkX+0.6, chkY, values.dripEdgeRadio === 'No'); drawText('No', chkX + 0.8, chkY + 0.1);
    drawCheckbox(chkX+1.3, chkY, values.dripEdge?.includes('Eave')); drawText('Eave', chkX + 1.5, chkY + 0.1);
    drawCheckbox(chkX+2.0, chkY, values.dripEdge?.includes('Rake')); drawText('Rake', chkX + 2.2, chkY + 0.1);

    // Right Box
    const bandRightX = m + leftRail + gap;
    doc.rect(bandRightX, bandY - bandH, pageWidth - bandRightX - m, bandH);

    // === KEY BAND =======================================================
    const keyY = bandY - bandH - gap;
    const keyH = 0.8;
    doc.setLineWidth(ruleHeavy);
    doc.rect(m, keyY - keyH, pageWidth - m * 2, keyH);
    doc.setFillColor(cyan);
    doc.rect(m, keyY - keyH, pageWidth - m * 2, keyH, 'F');
    doc.setTextColor(ink);
    
    // Key legend items
    doc.setFontSize(10).setFont('helvetica', 'normal');
    const drawIcon = (x:number, y:number, type: 'dot-fill'|'dot-open'|'dot-cyan'|'box-x'|'x') => {
        const size = 0.14;
        doc.setLineWidth(rule);
        if (type === 'dot-fill') { doc.setFillColor(ink); doc.circle(x+size/2, y+size/2, size/2, 'F'); }
        if (type === 'dot-open') { doc.setDrawColor(ink); doc.circle(x+size/2, y+size/2, size/2); }
        if (type === 'dot-cyan') { doc.setFillColor('#00a7c1'); doc.circle(x+size/2, y+size/2, size/2, 'F'); }
        if (type === 'box-x') {
            doc.rect(x, y, size, size);
            doc.line(x,y, x+size, y+size); doc.line(x,y+size, x+size, y);
        }
        if (type === 'x') { doc.line(x,y, x+size, y+size); doc.line(x,y+size, x+size, y); }
    }
    let keyX = m + 0.15; let keyItemY = keyY - 0.2;
    drawIcon(keyX, keyItemY-0.07, 'dot-fill'); drawText('Box Vent', keyX + 0.2, keyItemY);
    keyX += 1.2;
    drawIcon(keyX, keyItemY-0.07, 'dot-open'); drawText('Pipe Boot', keyX + 0.2, keyItemY);
    keyX += 1.2;
    drawIcon(keyX, keyItemY-0.07, 'dot-cyan'); drawText('HVAC', keyX + 0.2, keyItemY);
    keyX += 1.0;
    drawIcon(keyX, keyItemY-0.07, 'box-x'); drawText('Chimney', keyX + 0.2, keyItemY);
    
    keyX = m + 0.15; keyItemY = keyY - 0.4;
    drawIcon(keyX, keyItemY-0.07, 'x'); drawText('Wind Damage (X)', keyX + 0.2, keyItemY);
    keyX += 1.8;
    drawText('TS = Test Square', keyX, keyItemY);
    keyX += 1.5;
    drawText('TC = Thermal Cracking', keyX, keyItemY);

    keyX = m + 0.15; keyItemY = keyY - 0.6;
    doc.setFillColor(cyan); doc.rect(keyX-0.05, keyItemY-0.1, 1.2, 0.15, 'F'); doc.setTextColor(ink);
    drawText('B = Blistering', keyX, keyItemY);
    keyX += 1.5;
    doc.setFillColor(cyan); doc.rect(keyX-0.05, keyItemY-0.1, 1.6, 0.15, 'F'); doc.setTextColor(ink);
    drawText('M = Mechanical Damage', keyX, keyItemY);
     keyX += 2.0;
    doc.setFillColor(cyan); doc.rect(keyX-0.05, keyItemY-0.1, 1.4, 0.15, 'F'); doc.setTextColor(ink);
    drawText('PV = Power Vent', keyX, keyItemY);
     keyX += 1.5;
    drawText('E = Exhaust Vent', keyX, keyItemY);

    // Hail Diameter Scale
    const scaleX = pageWidth - m - 3.4;
    const scaleY = keyY - keyH;
    const scaleW = 3.4;
    const scaleH = keyH;
    doc.setFillColor('#ffffff');
    doc.rect(scaleX-0.08, scaleY+0.08, scaleW, scaleH - 0.16, 'F');
    doc.setDrawColor(ink);
    doc.rect(scaleX-0.08, scaleY+0.08, scaleW, scaleH - 0.16);

    const diameters = ['1″', '2″', '3″', '4″', '5″', '6″', '7″', '8″', '9″', '10″', '11″', '12″'];
    const factors = ['.08', '.17', '.25', '.33', '.42', '.50', '.58', '.67', '.75', '.83', '.92', '1.00'];
    const scaleColW = scaleW / 12;
    doc.setFontSize(10);
    diameters.forEach((d, i) => {
        const x = scaleX -0.08 + i * scaleColW;
        doc.hLine(x, scaleY + 0.08 + (scaleH-0.16)/2, x + scaleColW);
        doc.vLine(x, scaleY + 0.08, scaleY + scaleH-0.08);
        drawText(d, x + scaleColW/2, scaleY + 0.08 + (scaleH-0.16)*0.75, { align: 'center'});
    });
    doc.setFontSize(8);
    factors.forEach((f, i) => {
        const x = scaleX -0.08 + i * scaleColW;
        drawText(f, x + scaleColW/2, scaleY + 0.08 + (scaleH-0.16)*0.25, { align: 'center'});
    });


    // === LEFT RAIL ====================================================
    const leftRailY = keyY - keyH - gap;
    doc.setLineWidth(ruleHeavy);
    doc.rect(m, m, leftRail, leftRailY - m);
    doc.setLineWidth(rule);

    let currentLeftY = leftRailY;
    const leftRowH = 0.23;
    const drawLeftRow = (y: number, label: string, content: ()=>void) => {
        doc.hLine(m, y, m + leftRail);
        doc.setFillColor(yellow);
        doc.rect(m + 0.02, y - leftRowH + 0.02, 1.26, leftRowH - 0.04, 'F');
        doc.setTextColor(ink).setFontSize(10).setFont('helvetica', 'normal');
        drawText(label, m + 0.06, y - leftRowH/2 + 0.04);
        content();
        return y - leftRowH;
    }
    currentLeftY = drawLeftRow(currentLeftY, 'Layers', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); drawText(values.layers || '', m+1.45, currentLeftY-0.05); });
    currentLeftY = drawLeftRow(currentLeftY, 'Pitch', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); drawText(values.pitch || '', m+1.45, currentLeftY-0.05); });
    currentLeftY = drawLeftRow(currentLeftY, 'Box Vents', () => {
        doc.setFontSize(10);
        drawCheckbox(m+1.35, currentLeftY-0.18, values.boxVentsMetal); drawText('Metal', m+1.55, currentLeftY-0.1);
        drawCheckbox(m+2.0, currentLeftY-0.18, values.boxVentsPlastic); drawText('Plastic', m+2.2, currentLeftY-0.1);
        drawCheckbox(m+1.35, currentLeftY-0.03, values.boxVentsMetalDamaged); drawText('Damaged', m+1.55, currentLeftY+0.05);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Ridge Vent', () => {
        drawText('LF', m+1.3, currentLeftY-0.1);
        doc.line(m+1.5, currentLeftY-0.08, m+leftRail-0.1, currentLeftY-0.08);
        drawText(values.ridgeVentLF || '', m+1.55, currentLeftY-0.1);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Turbine', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); });
    currentLeftY = drawLeftRow(currentLeftY, 'HVAC Vent', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); });
    currentLeftY = drawLeftRow(currentLeftY, 'Rain Diverter', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); });
    currentLeftY = drawLeftRow(currentLeftY, 'Power Vent', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); });
    currentLeftY = drawLeftRow(currentLeftY, 'Skylight', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); });
    currentLeftY = drawLeftRow(currentLeftY, 'SAT', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); });
    currentLeftY = drawLeftRow(currentLeftY, 'Pipes', () => {
        drawText('Qty', m+1.3, currentLeftY-0.1);
        doc.line(m+1.5, currentLeftY-0.08, m+leftRail-0.1, currentLeftY-0.08);
        drawText(values.pipeQty || '', m+1.55, currentLeftY-0.1);
        drawCheckbox(m+1.35, currentLeftY-0.03, values.pipeLead); drawText('Lead', m+1.55, currentLeftY+0.05);
        drawCheckbox(m+2.0, currentLeftY-0.03, values.pipePlastic); drawText('Plastic', m+2.2, currentLeftY+0.05);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Gutters', () => {
        drawText('LF', m+1.3, currentLeftY-0.1);
        doc.line(m+1.5, currentLeftY-0.08, m+leftRail-0.1, currentLeftY-0.08);
        drawText(values.guttersLF || '', m+1.55, currentLeftY-0.1);
        drawCheckbox(m+1.35, currentLeftY-0.03, values.guttersSize === '5"'); drawText('5"', m+1.55, currentLeftY+0.05);
        drawCheckbox(m+2.0, currentLeftY-0.03, values.guttersSize === '6"'); drawText('6"', m+2.2, currentLeftY+0.05);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Downspouts', () => {
        drawCheckbox(m+1.35, currentLeftY-0.18, values.downspoutsSize === '3x4'); drawText('3x4', m+1.55, currentLeftY-0.1);
        drawCheckbox(m+2.0, currentLeftY-0.18, values.downspoutsSize === '2x3'); drawText('2x3', m+2.2, currentLeftY-0.1);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Fascia', () => {
        drawText('Size', m+1.3, currentLeftY-0.1);
        doc.line(m+1.55, currentLeftY-0.08, m+leftRail-0.1, currentLeftY-0.08);
        drawText(values.fasciaSize || '', m+1.6, currentLeftY-0.1);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Wood / Metal', () => {
        drawCheckbox(m+1.35, currentLeftY-0.18, values.woodMetal === 'Wood'); drawText('Wood', m+1.55, currentLeftY-0.1);
        drawCheckbox(m+2.0, currentLeftY-0.18, values.woodMetal === 'Metal'); drawText('Metal', m+2.2, currentLeftY-0.1);
    });
    currentLeftY = drawLeftRow(currentLeftY, 'Chimney Flashing', () => { doc.line(m+1.4, currentLeftY-0.02, m+leftRail-0.1, currentLeftY-0.02); drawText(values.chimneyFlashing || '', m+1.45, currentLeftY-0.05); });
    currentLeftY = drawLeftRow(currentLeftY, 'Other', () => {
        drawText('Solar • Vent E • Exhaust Vent', m+1.3, currentLeftY-0.1);
    });

    // === SKETCH AREA ================================================
    const sketchX = m + leftRail + gap;
    const sketchY = m + 0.65 + gap;
    const sketchW = pageWidth - sketchX - m;
    const sketchH = leftRailY - sketchY - gap - (m + 0.65);
    doc.setLineWidth(ruleHeavy);
    doc.rect(sketchX, sketchY, sketchW, sketchH);

    doc.setLineWidth(ruleLight);
    doc.setDrawColor(gridColor);
    for (let i = gridStep; i < sketchW; i += gridStep) {
        doc.line(sketchX + i, sketchY, sketchX + i, sketchY + sketchH);
    }
    for (let i = gridStep; i < sketchH; i += gridStep) {
        doc.line(sketchX, sketchY + i, sketchX + sketchW, sketchY + i);
    }
    
    // === FOOTER =======================================================
    const footerY = m + 0.65;
    const footerH = 0.65;
    const tripletW = (pageWidth - m * 2 - 1.2 - gap * 2);
    
    // --- Triplet Fields ---
    doc.setLineWidth(rule);
    doc.setDrawColor(ink);
    doc.setFontSize(10).setFont('helvetica', 'bold');
    drawText('Max Hail Diameter', m, footerY - 0.05);
    doc.line(m, footerY - 0.1, m + tripletW/3 - gap, footerY - 0.1);
    drawText(values.maxHailDiameter || '', m, footerY-0.2);

    drawText('Storm Direction', m + tripletW/3, footerY - 0.05);
    doc.line(m + tripletW/3, footerY - 0.1, m + tripletW*2/3 - gap, footerY-0.1);
    drawText(values.stormDirection || '', m + tripletW/3, footerY-0.2);
    
    drawText('Collateral Damage', m + tripletW*2/3, footerY - 0.05);
    doc.line(m + tripletW*2/3, footerY - 0.1, m + tripletW - gap, footerY-0.1);
    drawText(values.collateralDamage || '', m + tripletW*2/3, footerY-0.2);

    // --- Notes Box ---
    doc.setLineWidth(rule);
    doc.rect(m, m, pageWidth - m*2 - 1.2 - gap, footerY-m-0.1);
    drawText(values.notes || '', m + 0.05, footerY - 0.15, { maxWidth: pageWidth - m*2 - 1.2 - gap - 0.1 });

    // --- Compass Rose ---
    const compassX = pageWidth - m - 1.2;
    const compassY = m;
    const compassSize = 1.2;
    doc.setLineWidth(ruleHeavy);
    doc.rect(compassX, compassY, compassSize, compassSize);
    doc.setLineWidth(rule);
    const innerCompassSize = 0.7;
    doc.rect(compassX + (compassSize-innerCompassSize)/2, compassY + (compassSize-innerCompassSize)/2, innerCompassSize, innerCompassSize);
    doc.setFontSize(10).setFont('helvetica', 'bold');
    drawText('F', compassX + compassSize/2, compassY + compassSize - 0.1, { align: 'center'});
    drawText('B', compassX + compassSize/2, compassY + 0.15, { align: 'center'});
    drawText('R', compassX + compassSize - 0.1, compassY + compassSize/2 + 0.05, { align: 'center'});
    drawText('L', compassX + 0.1, compassY + compassSize/2 + 0.05, { align: 'center'});

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
