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
    const { width: pageWidth, height: pageHeight } = doc.internal.pageSize;

    // --- DESIGN TOKENS ---
    const m = 0.5; // margin
    const leftRail = 2.25;
    const gap = 0.125;
    const gridStep = 0.125;

    // Rules
    const ruleHeavy = 0.02; // 2px
    const rule = 0.01; // 1px
    const ruleLight = 0.005; // 0.5px

    // Palette
    const ink = '#000000';
    const gridColor = '#9a9a9a';
    const pink = '#f8c9cf';
    const cyan = '#bfeaf1';
    const yellow = '#fff2a6';
    const checkboxCyan = '#00a7c1';

    const contentW = pageWidth - m * 2;
    const contentH = pageHeight - m * 2;

    doc.setFont('helvetica');

    // --- HELPERS ---
    const drawText = (text: string, x: number, y: number, options?: any) => doc.text(text || '', x, y, options);
    const drawCheckbox = (x: number, y: number, checked = false, size = 0.16) => {
        doc.setLineWidth(rule);
        doc.setDrawColor(ink);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFontSize(size * 12);
            doc.text('✕', x + size / 4.5, y + size * 0.8);
        }
    };
    const drawIcon = (x: number, y: number, type: 'dot-fill' | 'dot-open' | 'dot-cyan' | 'box-x' | 'x', size = 0.14) => {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        doc.setLineWidth(rule);
        doc.setDrawColor(ink);

        if (type === 'dot-fill') {
            doc.setFillColor(ink);
            doc.circle(centerX, centerY, size / 2, 'F');
        }
        if (type === 'dot-open') {
            doc.setDrawColor(ink);
            doc.circle(centerX, centerY, size / 2, 'S');
        }
        if (type === 'dot-cyan') {
            doc.setFillColor(checkboxCyan);
            doc.circle(centerX, centerY, size / 2, 'F');
        }
        if (type === 'box-x') {
            doc.rect(x, y, size, size);
            doc.line(x, y, x + size, y + size);
            doc.line(x + size, y, x, y + size);
        }
        if (type === 'x') {
            doc.line(x, y, x + size, y + size);
            doc.line(x + size, y, x, y + size);
        }
    };

    // --- HEADER ---
    const headerY = pageHeight - m;
    const headerH = 1.05;

    // Brand Box
    const brandBoxW = contentW - 3.2 - gap;
    doc.setLineWidth(ruleHeavy);
    doc.rect(m, headerY - headerH, brandBoxW, headerH);
    doc.setFontSize(12).setFont('helvetica', 'bold');
    drawText('SEEKNOW', m + 0.14, headerY - 0.45);
    doc.setFontSize(11).setFont('helvetica', 'normal');
    drawText('(866) 801-1258', m + 0.14, headerY - 0.65);

    // Contact Box
    const contactBoxX = m + brandBoxW + gap;
    const contactBoxW = 3.2;
    doc.setLineWidth(ruleHeavy);
    doc.rect(contactBoxX, headerY - headerH, contactBoxW, headerH);

    const contactFields = [
        { label: 'Date', value: values.windDate || '' },
        { label: 'Company', value: 'Ladder Now' },
        { label: 'Inspector', value: values.inspector || '' },
        { label: 'Phone', value: values.phone || '' },
        { label: 'Email', value: values.email || '' },
    ];
    let currentContactY = headerY - 0.22;
    const contactLabelW = 0.9;
    const contactLineXStart = contactBoxX + contactLabelW + 0.05;
    const contactLineXEnd = contactBoxX + contactBoxW - 0.14;
    contactFields.forEach((field, i) => {
        doc.setFontSize(10);
        drawText(field.label, contactBoxX + 0.14, currentContactY);
        doc.setLineWidth(rule);
        doc.line(contactLineXStart, currentContactY + 0.02, contactLineXEnd, currentContactY + 0.02);
        drawText(field.value, contactLineXStart + 0.05, currentContactY);
        currentContactY -= 0.2;
    });

    // --- DAMAGE MATRIX (absolute position) ---
    const damageW = 3.1;
    const damageH = 1.4;
    const damageX = pageWidth - m - damageW;
    const damageY = pageHeight - m;
    doc.setLineWidth(ruleHeavy);
    doc.rect(damageX, damageY - damageH, damageW, damageH);

    const damageHeaderY = damageY - damageH;
    const damageRowH = 0.35;
    const damageHeaderCellW = (damageW - 0.9) / 3;
    doc.setFillColor(pink);
    doc.rect(damageX + 0.9, damageHeaderY, damageW - 0.9, damageRowH, 'F');
    doc.setLineWidth(rule);
    ['Hail', 'Wind', 'Tree'].forEach((label, i) => {
        const x = damageX + 0.9 + i * damageHeaderCellW;
        doc.line(x, damageHeaderY, x, damageHeaderY + damageRowH);
        doc.setTextColor(ink);
        doc.setFontSize(11).setFont('helvetica', 'normal');
        drawText(label, x + damageHeaderCellW / 2, damageHeaderY + 0.22, { align: 'center' });
    });
    doc.line(damageX + 0.9, damageHeaderY, damageX + 0.9, damageY);

    const damageRows = [
        { label: 'F:', hail: values.hailF, wind: values.windF, tree: values.treeF },
        { label: 'R:', hail: values.hailR, wind: values.windR, tree: values.treeR },
        { label: 'B:', hail: values.hailB, wind: values.windB, tree: values.treeB },
        { label: 'L:', hail: values.hailL, wind: values.windL, tree: values.treeL },
    ];
    damageRows.forEach((row, i) => {
        const y = damageY - damageRowH * (i + 1);
        doc.line(damageX, y, damageX + damageW, y);
        drawText(row.label, damageX + 0.1, y + 0.22);
        drawText(row.hail || '', damageX + 0.9 + damageHeaderCellW * 0.5, y + 0.22, { align: 'center' });
        drawText(row.wind || '', damageX + 0.9 + damageHeaderCellW * 1.5, y + 0.22, { align: 'center' });
        drawText(row.tree || '', damageX + 0.9 + damageHeaderCellW * 2.5, y + 0.22, { align: 'center' });
        doc.line(damageX + 0.9, y, damageX + 0.9, y + damageRowH);
        doc.line(damageX + 0.9 + damageHeaderCellW, y, damageX + 0.9 + damageHeaderCellW, y + damageRowH);
        doc.line(damageX + 0.9 + damageHeaderCellW * 2, y, damageX + 0.9 + damageHeaderCellW * 2, y + damageRowH);
    });

    // --- MAIN LAYOUT BANDS ---
    const bandY = headerY - headerH - gap;
    const shingleBandH = 1.95;

    // --- KEY BAND ---
    const keyBandY = bandY - shingleBandH - gap;
    const keyBandH = 0.8;
    doc.setLineWidth(ruleHeavy);
    doc.rect(m, keyBandY - keyBandH, contentW, keyBandH);
    doc.setFillColor(cyan);
    doc.rect(m, keyBandY - keyBandH, contentW, keyBandH, 'F');
    doc.setTextColor(ink);
    doc.setFontSize(10).setFont('helvetica', 'normal');

    let keyX = m + 0.15;
    let keyItemY = keyBandY - 0.2;
    const drawPill = (x: number, y: number, iconType: any, text: string, iconSize = 0.14) => {
        drawIcon(x, y - iconSize / 2, iconType, iconSize);
        drawText(text, x + iconSize + 0.05, y + 0.04);
        return text.length * 0.05 + 0.5; // Estimate width
    };
    keyX += drawPill(keyX, keyItemY, 'dot-fill', 'Box Vent');
    keyX += drawPill(keyX, keyItemY, 'dot-open', 'Pipe Boot');
    keyX += drawPill(keyX, keyItemY, 'dot-cyan', 'HVAC');
    keyX += drawPill(keyX, keyItemY, 'box-x', 'Chimney');
    keyX += drawPill(keyX, keyItemY - 0.02, 'x', 'Wind Damage (X)');

    keyX = m + 0.15;
    keyItemY -= 0.2;
    drawText('TS = Test Square', keyX, keyItemY);
    keyX += 1.5;
    drawText('TC = Thermal Cracking', keyX, keyItemY);

    keyX = m + 0.15;
    keyItemY -= 0.2;
    doc.setFillColor(cyan);
    doc.rect(keyX - 0.05, keyItemY - 0.1, 1, 0.15, 'F');
    doc.setTextColor(ink);
    drawText('B = Blistering', keyX, keyItemY);
    keyX += 1.2;
    doc.setFillColor(cyan);
    doc.rect(keyX - 0.05, keyItemY - 0.1, 1.4, 0.15, 'F');
    doc.setTextColor(ink);
    drawText('M = Mechanical Damage', keyX, keyItemY);
    keyX += 1.6;
    doc.setFillColor(cyan);
    doc.rect(keyX - 0.05, keyItemY - 0.1, 1.2, 0.15, 'F');
    doc.setTextColor(ink);
    drawText('PV = Power Vent', keyX, keyItemY);
    keyX += 1.4;
    drawText('E = Exhaust Vent', keyX, keyItemY);

    // Hail Diameter Scale
    const scaleW = 3.4;
    const scaleX = pageWidth - m - scaleW;
    const scaleH = keyBandH;
    doc.setFillColor('#ffffff');
    doc.rect(scaleX - 0.08, keyBandY - scaleH + 0.08, scaleW, scaleH - 0.16, 'F');
    doc.setDrawColor(ink);
    doc.setLineWidth(rule);
    doc.rect(scaleX - 0.08, keyBandY - scaleH + 0.08, scaleW, scaleH - 0.16);

    const diameters = ['1″', '2″', '3″', '4″', '5″', '6″', '7″', '8″', '9″', '10″', '11″', '12″'];
    const factors = ['.08', '.17', '.25', '.33', '.42', '.50', '.58', '.67', '.75', '.83', '.92', '1.00'];
    const scaleColW = scaleW / 12;
    doc.setFontSize(10);
    diameters.forEach((d, i) => {
        const x = scaleX - 0.08 + (i * scaleColW);
        doc.line(x, keyBandY - scaleH + 0.08, x, keyBandY);
        drawText(d, x + scaleColW / 2, keyBandY - scaleH + 0.25, { align: 'center' });
    });
    doc.setFontSize(8);
    factors.forEach((f, i) => {
        const x = scaleX - 0.08 + (i * scaleColW);
        drawText(f, x + scaleColW / 2, keyBandY - 0.25, { align: 'center' });
    });


    // --- LEFT RAIL & SKETCH AREA ---
    const leftRailY_end = keyBandY - keyBandH - gap;
    const sketchY = m;
    const sketchH = leftRailY_end - sketchY;
    const sketchX = m + leftRail + gap;
    const sketchW = contentW - leftRail - gap;

    // Left Rail Box
    doc.setLineWidth(ruleHeavy);
    doc.rect(m, sketchY, leftRail, sketchH);

    // Sketch Area Box
    doc.rect(sketchX, sketchY, sketchW, sketchH);

    // Sketch grid lines
    doc.setLineWidth(ruleLight);
    doc.setDrawColor(gridColor);
    for (let i = gridStep; i < sketchW; i += gridStep) { doc.line(sketchX + i, sketchY, sketchX + i, sketchY + sketchH); }
    for (let i = gridStep; i < sketchH; i += gridStep) { doc.line(sketchX, sketchY + i, sketchX + sketchW, sketchY + i); }

    // --- FOOTER ---
    const footerH = 0.65;
    const tripletH = 0.4;
    doc.setLineWidth(rule);
    const notesH = 0.55;
    const notesW = contentW - 1.2 - gap;
    const notesX = m;
    const notesY = m;
    const tripletY = notesY + notesH + 0.05;

    // Triplet Fields
    doc.setFontSize(9).setFont('helvetica', 'normal');
    const fieldW = notesW / 3;
    drawText('Max Hail Diameter', notesX, tripletY);
    doc.line(notesX, tripletY - 0.1, notesX + fieldW - gap, tripletY - 0.1);
    drawText(values.maxHailDiameter || '', notesX, tripletY - 0.15);

    drawText('Storm Direction', notesX + fieldW, tripletY);
    doc.line(notesX + fieldW, tripletY - 0.1, notesX + fieldW * 2 - gap, tripletY - 0.1);
    drawText(values.stormDirection || '', notesX + fieldW, tripletY - 0.15);

    drawText('Collateral Damage', notesX + fieldW * 2, tripletY);
    doc.line(notesX + fieldW * 2, tripletY - 0.1, notesX + notesW, tripletY - 0.1);
    drawText(values.collateralDamage || '', notesX + fieldW * 2, tripletY - 0.15);

    // Notes Box
    doc.rect(notesX, notesY, notesW, notesH);
    doc.setFont('helvetica', 'normal');
    drawText(values.notes || '', notesX + 0.05, notesY + notesH - 0.1, { maxWidth: notesW - 0.1, baseline: 'top' });

    // Compass Rose
    const compassSize = 1.2;
    const compassX = pageWidth - m - compassSize;
    const compassY = m;
    doc.setLineWidth(ruleHeavy);
    doc.rect(compassX, compassY, compassSize, compassSize);
    doc.setLineWidth(rule);
    const innerCompassSize = 0.7;
    doc.rect(compassX + (compassSize-innerCompassSize)/2, compassY + (compassSize-innerCompassSize)/2, innerCompassSize, innerCompassSize);
    doc.setFontSize(10).setFont('helvetica', 'bold');
    drawText('F', compassX + compassSize / 2, compassY + compassSize - 0.1, { align: 'center' });
    drawText('B', compassX + compassSize / 2, compassY + 0.15, { align: 'center' });
    drawText('R', compassX + compassSize - 0.1, compassY + compassSize / 2 + 0.05, { align: 'center' });
    drawText('L', compassX + 0.1, compassY + compassSize / 2 + 0.05, { align: 'center' });


    // --- DYNAMIC LEFT RAIL CONTENT ---
    let currentLeftY = leftRailY_end;
    const rowH = 0.35;
    const chipW = 1.3;
    const drawLeftRow = (label: string, content: () => void, height = rowH) => {
        doc.setLineWidth(rule);
        doc.line(m, currentLeftY - height, m + leftRail, currentLeftY - height);
        doc.setFillColor(yellow);
        doc.rect(m + 0.02, currentLeftY - height + 0.02, chipW, height - 0.04, 'F');
        doc.setTextColor(ink).setFontSize(10).setFont('helvetica', 'normal');
        drawText(label, m + 0.06, currentLeftY - height / 2 + 0.04);
        doc.setDrawColor(ink);
        content();
        currentLeftY -= height;
    };
    
    drawLeftRow('Other', () => {
       drawCheckbox(m + chipW + 0.1, currentLeftY - rowH / 2 - 0.08, values.otherSolar);
       drawText('Solar', m + chipW + 0.3, currentLeftY - rowH / 2 + 0.04);
       drawCheckbox(m + chipW + 0.8, currentLeftY - rowH / 2 - 0.08, values.otherVentE);
       drawText('Vent E', m + chipW + 1.0, currentLeftY - rowH / 2 + 0.04);
    });
    drawLeftRow('Chimney Flashing', () => { drawText(values.chimneyFlashing || '', m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04); });
    drawLeftRow('Wood / Metal', () => { drawText(values.woodMetal || '', m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04); });
    drawLeftRow('Fascia', () => { drawText(`Size: ${values.fasciaSize || ''}`, m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04); });
    drawLeftRow('Downspouts', () => {
        drawCheckbox(m + chipW + 0.1, currentLeftY - rowH/2 - 0.08, values.downspoutsSize === '2x3');
        drawText('2x3', m+chipW+0.3, currentLeftY - rowH/2 + 0.04);
        drawCheckbox(m + chipW + 0.7, currentLeftY - rowH/2 - 0.08, values.downspoutsSize === '3x4');
        drawText('3x4', m+chipW+0.9, currentLeftY - rowH/2 + 0.04);
    });
    drawLeftRow('Gutters', () => {
        drawText(`LF: ${values.guttersLF || ''}`, m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04);
        drawCheckbox(m + chipW + 0.7, currentLeftY - rowH / 2 - 0.08, values.guttersSize === '5"');
        drawText('5"', m + chipW + 0.9, currentLeftY - rowH / 2 + 0.04);
         drawCheckbox(m + chipW + 1.2, currentLeftY - rowH / 2 - 0.08, values.guttersSize === '6"');
        drawText('6"', m + chipW + 1.4, currentLeftY - rowH / 2 + 0.04);
    });
    drawLeftRow('Pipes', () => {
        drawText(`Qty: ${values.pipeQty || ''}`, m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04);
        drawCheckbox(m + chipW + 0.7, currentLeftY - rowH / 2 - 0.08, values.pipeLead);
        drawText('L', m + chipW + 0.9, currentLeftY - rowH / 2 + 0.04);
        drawCheckbox(m + chipW + 1.2, currentLeftY - rowH / 2 - 0.08, values.pipePlastic);
        drawText('P', m + chipW + 1.4, currentLeftY - rowH / 2 + 0.04);
    });
    drawLeftRow('SAT', () => { drawText(`Lead: ${values.satQtyLead || ''} Plas: ${values.satQtyPlastic || ''}`, m + chipW + 0.1, currentLeftY - rowH/2+0.04); });
    drawLeftRow('Skylight', () => { drawText(`Lead: ${values.skylightQtyLead || ''} Plas: ${values.skylightQtyPlastic || ''}`, m + chipW + 0.1, currentLeftY - rowH/2+0.04); });
    drawLeftRow('Power Vent', () => { drawText(`Lead: ${values.powerVentQtyLead || ''} Plas: ${values.powerVentQtyPlastic || ''}`, m + chipW + 0.1, currentLeftY - rowH/2+0.04); });
    drawLeftRow('Rain Diverter', () => { drawText(`Lead: ${values.raindiverterQtyLead || ''} Plas: ${values.raindiverterQtyPlastic || ''}`, m + chipW + 0.1, currentLeftY - rowH/2+0.04); });
    drawLeftRow('HVAC Vent', () => { drawText(`Lead: ${values.hvacventQtyLead || ''} Plas: ${values.hvacventQtyPlastic || ''}`, m + chipW + 0.1, currentLeftY - rowH/2+0.04); });
    drawLeftRow('Turbine', () => { drawText(`Lead: ${values.turbineQtyLead || ''} Plas: ${values.turbineQtyPlastic || ''}`, m + chipW + 0.1, currentLeftY - rowH/2+0.04); });
    drawLeftRow('Ridge Vent', () => {
        drawText(`LF: ${values.ridgeVentLF || ''}`, m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04);
        drawCheckbox(m + chipW + 0.7, currentLeftY - rowH / 2 - 0.08, values.ridgeVentPlastic);
        drawText('Plastic', m + chipW + 0.9, currentLeftY - rowH / 2 + 0.04);
    });
    drawLeftRow('Box Vents', () => {
        drawCheckbox(m + chipW + 0.1, currentLeftY - rowH / 2 - 0.08, values.boxVentsMetal);
        drawText('M', m + chipW + 0.3, currentLeftY - rowH / 2 + 0.04);
        drawCheckbox(m + chipW + 0.6, currentLeftY - rowH / 2 - 0.08, values.boxVentsPlastic);
        drawText('P', m + chipW + 0.8, currentLeftY - rowH / 2 + 0.04);
         drawCheckbox(m + chipW + 1.1, currentLeftY - rowH / 2 - 0.08, values.boxVentsMetalDamaged);
        drawText('D', m + chipW + 1.3, currentLeftY - rowH / 2 + 0.04);
    });

    drawLeftRow('Pitch', () => { drawText(values.pitch || '', m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04); });
    drawLeftRow('Layers', () => { drawText(values.layers || '', m + chipW + 0.1, currentLeftY - rowH / 2 + 0.04); });


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
