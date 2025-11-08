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
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'letter',
    });
  
    const docWidth = doc.internal.pageSize.getWidth();
    const docHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Colors
    const seeknowGreen = [105, 190, 70];
    const lightGreen = [216, 228, 188];
    const lightPink = [252, 213, 180];
    const lightBlue = [218, 238, 243];
    const darkGray = [89, 89, 89];
    const black = [0, 0, 0];

    // Helper to draw text
    const text = (
        txt: string, x: number, y: number, 
        options: { 
            align?: 'left' | 'center' | 'right', 
            color?: number[], 
            size?: number, 
            style?: 'normal' | 'bold' | 'italic' | 'bolditalic'
        } = {}
    ) => {
      const { align = 'left', color = black, size = 8, style = 'normal' } = options;
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(txt, x, y, { align });
      doc.setTextColor(0,0,0); // reset
      doc.setFont('helvetica', 'normal');
    };

    // Helper for rectangles
    const rect = (x: number, y: number, w: number, h: number, color?: number[], style: 'F' | 'S' | 'FD' = 'S') => {
        if (color) doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(x, y, w, h, style);
    };

    const drawCheckbox = (x: number, y: number, checked = false) => {
        rect(x, y, 8, 8);
        if(checked) {
            text('✓', x + 1, y + 6.5, { size: 10, style: 'bold'});
        }
    };
    
    // --- Header ---
    // SeekNow Logo
    doc.setLineWidth(2);
    doc.setDrawColor(seeknowGreen[0], seeknowGreen[1], seeknowGreen[2]);
    rect(margin + 5, margin + 5, 20, 20, undefined, 'S');
    doc.setLineWidth(1.5);
    doc.line(margin + 12, margin + 5, margin + 12, margin + 25);
    doc.line(margin + 5, margin + 15, margin + 25, margin + 15);
    doc.setLineWidth(1);
    doc.setDrawColor(0,0,0);

    text('SeekNow.', margin + 30, margin + 20, { size: 16, style: 'bold', color: seeknowGreen });
    text('(866) 801-1258', margin + 5, margin + 45, { size: 9, color: darkGray });


    // --- Right Header Info ---
    let rhx = docWidth - margin - 250;
    let rhy = margin;
    const rh_field_h = 16;
    
    // Damage Type
    rect(rhx, rhy, 40, rh_field_h, lightPink, 'F');
    text('Hail', rhx + 20, rhy + rh_field_h / 2 + 3, {align: 'center'});
    rect(rhx + 42, rhy, 40, rh_field_h, lightPink, 'F');
    text('Wind', rhx + 62, rhy + rh_field_h / 2 + 3, {align: 'center'});
    rect(rhx + 84, rhy, 40, rh_field_h, lightPink, 'F');
    text('Tree', rhx + 104, rhy + rh_field_h / 2 + 3, {align: 'center'});
    
    // Hail F,R,B,L
    let hailX = rhx;
    let hailY = rhy + rh_field_h + 2;
    ['F:', 'R:', 'B:', 'L:'].forEach((label, i) => {
        rect(hailX, hailY + i * (rh_field_h + 2), 124, rh_field_h);
        text(label, hailX + 5, hailY + i * (rh_field_h + 2) + 11);
        text(values[`hail${label.charAt(0)}` as 'hailF'] || '', hailX + 30, hailY + i * (rh_field_h + 2) + 11);
    });

    // Date & Inspector info
    let dateX = rhx + 128;
    let dateY = rhy;
    rect(dateX, dateY, 122, rh_field_h);
    text(`Date: ${values.windDate || ''}`, dateX + 5, dateY + 11);

    const inspectorInfo = [
        {label: 'Ladder Now', value: values.ladderNow ? 'Yes' : 'No'},
        {label: 'Inspector:', value: values.inspector},
        {label: 'Phone:', value: values.phone},
        {label: 'Email:', value: values.email}
    ];
    inspectorInfo.forEach((info, i) => {
        let y = dateY + (i + 1) * (rh_field_h + 2);
        rect(dateX, y, 122, rh_field_h);
        text(`${info.label} ${info.value || ''}`, dateX + 5, y + 11);
    });

    // --- Left Column ---
    let lcx = margin;
    let lcy = margin + 65;
    const lcw = 140;
    const lch = 18;

    // Shingle Type
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Shingle Type', lcx + 5, lcy + 12);
    rect(lcx, lcy + lch, lcw, 46);
    drawCheckbox(lcx + 5, lcy + lch + 5, values.shingleType === '3 Tab');
    text('3 Tab', lcx + 18, lcy + lch + 12);
    drawCheckbox(lcx + 5, lcy + lch + 20, values.shingleType === 'Laminate');
    text('Laminate', lcx + 18, lcy + lch + 27);

    const shingleMakes = ['20 Y', '25 Y', '30 Y', '40 Y', '50 Y'];
    shingleMakes.forEach((make, i) => {
        let yPos = lcy + lch + 5 + (Math.floor(i/3) * 15)
        let xPos = lcx + 70 + (i%3 * 22)
        if(i >= 3) {
            yPos = lcy + lch + 5 + (Math.floor(i/2) * 15)
            xPos = lcx + 70 + (i%2 * 35)
        }
        if(i === 1 || i === 4) xPos -= 5;
        
        drawCheckbox(xPos, yPos, values.shingleMake === make);
        text(make, xPos + 10, yPos + 7);
    });

    lcy += lch + 48;
    // Other
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Other:', lcx+5, lcy + 12);
    rect(lcx, lcy+lch, lcw, lch);
    text(values.otherShingle || '', lcx + 5, lcy + lch + 12);

    lcy += lch * 2 + 2;
    // Ice/Water Shield
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Ice/Water Shield', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    drawCheckbox(lcx + 5, lcy+lch+4, values.iceWaterShield?.includes('Valley'));
    text('Valley', lcx + 18, lcy+lch+11);
    drawCheckbox(lcx + 60, lcy+lch+4, values.iceWaterShield?.includes('Eave'));
    text('Eave', lcx + 73, lcy+lch+11);
    drawCheckbox(lcx + 105, lcy+lch+4, values.iceWaterShield?.includes('Rake'));
    text('Rake', lcx + 118, lcy+lch+11);
    
    lcy += lch * 2 + 2;
    // Drip Edge
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Drip Edge', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    drawCheckbox(lcx + 5, lcy+lch+4, values.dripEdgeRadio === 'Yes');
    text('Yes', lcx + 18, lcy+lch+11);
    drawCheckbox(lcx + 45, lcy+lch+4, values.dripEdgeRadio === 'No');
    text('No', lcx + 58, lcy+lch+11);
    drawCheckbox(lcx + 85, lcy+lch+4, values.dripEdge?.includes('Eave'));
    text('Eave', lcx + 98, lcy+lch+11);
    drawCheckbox(lcx + 105, lcy+lch+4, values.dripEdge?.includes('Rake'));
    // text('Rake', lcx + 118, lcy+lch+11);


    lcy += lch * 2 + 2;
    // Valley Metal
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Valley Metal', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    text(values.valleyMetalLF ? `${values.valleyMetalLF} LF` : 'Na LF', lcx + 5, lcy + lch + 12);

    lcy += lch * 2 + 2;
    // Layers & Pitch
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Layers:', lcx+5, lcy+12);
    text(values.layers || '', lcx + 45, lcy+12);
    rect(lcx, lcy, lcw/2, lch);
    text('Pitch:', lcx+lcw/2+5, lcy+12);
    text(values.pitch || '', lcx + lcw/2 + 35, lcy+12);

    // Accessories
    lcy += lch + 2;
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

    rect(lcx, lcy, lcw, 28);
    rect(lcx, lcy, 55, 28);
    rect(lcx+55, lcy, 42.5, 14);
    rect(lcx+55, lcy+14, 42.5, 14);
    text('Metal', lcx+76, lcy+11, {align: 'center'});
    text('Damaged', lcx+76, lcy+23, {align: 'center'});
    rect(lcx+97.5, lcy, 42.5, 14);
    rect(lcx+97.5, lcy+14, 42.5, 14);
    text('Plastic', lcx+118, lcy+11, {align: 'center'});
    text('LF', lcx+118, lcy+23, {align: 'center'});
    lcy += 28;

    accessories.forEach(item => {
        rect(lcx, lcy, lcw, lch, lightGreen, 'F');
        rect(lcx, lcy, 55, lch);
        text(item.label, lcx+5, lcy+12);
        rect(lcx+55, lcy, 42.5, lch);
        rect(lcx+97.5, lcy, 42.5, lch);
        text(item.lead || '', lcx+76, lcy+12, {align: 'center'});
        text(item.plastic || '', lcx+118, lcy+12, {align: 'center'});
        lcy += lch;
    });

    lcy += 2;
    // Pipes
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Pipes:', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    rect(lcx, lcy, 55, lch*2);
    rect(lcx+55, lcy, 85, lch);
    text('Qty', lcx+75, lcy+12);
    text('Lead', lcx+115, lcy+12);
    rect(lcx+55, lcy+lch, 42.5, lch);
    text(values.pipesQtyPlastic || '', lcx+76, lcy+lch+12, {align:'center'});
    rect(lcx+97.5, lcy+lch, 42.5, lch);
    text(values.pipesQtyLead || '', lcx+118, lcy+lch+12, {align:'center'});
    text('Qty', lcx+75, lcy+lch-6);
    text('Plastic', lcx+115, lcy+lch-6);

    lcy += lch*2 + 2;
    // Gutters
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Gutters:', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    text(values.guttersLF ? `${values.guttersLF} LF` : 'NA LF', lcx+5, lcy+lch+12);
    drawCheckbox(lcx+80, lcy+lch+4, values.guttersSize === '5"');
    text('5"', lcx+90, lcy+lch+11);
    drawCheckbox(lcx+110, lcy+lch+4, values.guttersSize === '6"');
    text('6"', lcx+120, lcy+lch+11);
    
    lcy += lch*2 + 2;
    // Downspouts
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Downspouts:', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    drawCheckbox(lcx+80, lcy+lch+4, values.downspoutsSize === '2x3');
    text('2x3', lcx+90, lcy+lch+11);
    drawCheckbox(lcx+110, lcy+lch+4, values.downspoutsSize === '3x4');
    text('3x4', lcx+120, lcy+lch+11);

    lcy += lch*2 + 2;
    // Fascia
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Fascia:', lcx+5, lcy+12);
    rect(lcx, lcy+lch, lcw, lch);
    text('Size', lcx+5, lcy+lch+12);
    text('LF', lcx + 50, lcy+lch+12);
    text('NA', lcx+90, lcy+lch+12);

    lcy += lch*2 + 2;
    // Wood/Metal
    rect(lcx, lcy, lcw, lch, lightGreen, 'F');
    text('Wood / Metal', lcx+5, lcy+12);
    lcy += lch;
    rect(lcx, lcy, lcw, lch);

    lcy += lch + 2;
    // Chimney Flashing & Other
    const bottomFields = ['Chimney Flashing:', 'Other:', 'Solar', 'Vent E', 'Exhaust Vent'];
    bottomFields.forEach(label => {
        rect(lcx, lcy, lcw, lch, lightGreen, 'F');
        text(label, lcx+5, lcy+12);
        lcy += lch;
        rect(lcx, lcy, lcw, lch);
        lcy += lch;
    });

    // --- Middle Section ---
    let mcx = lcx + lcw + 5;
    let mcy = margin + 95;
    const headerHeight = 15;
    
    // Eave, Rake, Aerial
    rect(mcx, mcy, 120, headerHeight);
    text(`Eave: ${values.eaveLF || 'N/A'} LF`, mcx + 5, mcy + 11);
    rect(mcx + 122, mcy, 120, headerHeight);
    text(`Rake: ${values.rakeLF || 'N/A'} LF`, mcx + 127, mcy + 11);
    rect(mcx + 244, mcy, 200, headerHeight);
    text('Aerial Measurements:', mcx + 249, mcy + 11);
    
    mcy += headerHeight;
    // Calculations
    rect(mcx, mcy, 120, 90);
    text('Calculations:', mcx + 5, mcy + 12);
    ['A', 'B', 'C', 'D', 'E'].forEach((l,i) => text(`${l} ${values[`calc${l}` as 'calcA'] || 'N/A'}`, mcx + 5, mcy + 28 + i*13));
    rect(mcx+122, mcy, 120, 90);
    ['F', 'G', 'H', 'I', 'J'].forEach((l,i) => text(`${l} ${values[`calc${l}` as 'calcF'] || 'N/A'}`, mcx + 127, mcy + 13 + i*15));
    
    // Aerial Measurements
    rect(mcx+244, mcy, 200, 90);
    ['K', 'L', 'M'].forEach((l,i) => text(`${l} ${values[`calc${l}` as 'calcK'] || 'N/A'}`, mcx + 249, mcy + 13 + i*15));
    text(`1 Story: ${values.aerialMeasurements1Story || ''}`, mcx+320, mcy+13);
    text(`2 Story: ${values.aerialMeasurements2Story || ''}`, mcx+320, mcy+28);

    mcy += 90;
    // Total Squares
    rect(mcx, mcy, 242, 20);
    text(`Total Squares: ${values.totalSquares || ''}`, mcx+5, mcy+14);

    mcy += 22;
    // Key
    rect(mcx, mcy, 310, 55, lightBlue, 'F');
    doc.setFont('helvetica', 'bold');
    text('Key:', mcx+5, mcy+12);
    doc.setFont('helvetica', 'normal');

    const keyItems = [
        {t: 'TS = Test Square', x: mcx+30, y: mcy+12},
        {t: 'B = Blistering', x: mcx+120, y: mcy+12},
        {t: 'M = Mechanical Damage', x: mcx+200, y: mcy+12},
        {t: 'TC = Thermal Cracking', x: mcx+30, y: mcy+26},
        {t: 'PV = Power Vent', x: mcx+120, y: mcy+26},
        {t: 'TD = Tree Damage', x: mcx+200, y: mcy+26},
    ];
    keyItems.forEach(item => text(item.t, item.x, item.y, {size: 7}));
    
    // Key Symbols
    drawCheckbox(mcx+30, mcy+35);
    text('= Box Vent', mcx+40, mcy+42, {size:7});
    doc.setFillColor(0,0,0);
    doc.circle(mcx+124, mcy+38.5, 4, 'F');
    text('= HVAC', mcx+132, mcy+42, {size:7});
    drawCheckbox(mcx+200, mcy+35); // Placeholder for chimney
    text('= Chimney', mcx+210, mcy+42, {size:7});
    text('X = Wind Damage', mcx+30, mcy+52, {size:7});
    doc.circle(mcx+124, mcy+50, 4, 'S');
    text('= Pipe Boot', mcx+132, mcy+52, {size:7});
    text('E = Exhaust vent', mcx+200, mcy+52, {size:7});


    // Inch to Decimal Table
    let tblX = mcx+315;
    let tblY = mcy;
    rect(tblX, tblY, 130, 55);
    const inchData = [
        ['1" .08', '5" .42', '9" .75'],
        ['2" .17', '6" .50', '10" .83'],
        ['3" .25', '7" .58', '11" .92'],
        ['4" .33', '8" .67', '12" 1.00'],
    ];
    inchData.forEach((row, i) => {
        row.forEach((cell, j) => {
            text(cell, tblX + 5 + j*45, tblY + 12 + i*11, {size: 7})
        })
    })

    // Grid Area
    let gridX = mcx;
    let gridY = mcy + 60;
    let gridW = docWidth - gridX - margin;
    let gridH = docHeight - gridY - margin - 25; // Adjusted for notes
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    for (let i = 0; i <= (gridW / 10); i++) {
        doc.line(gridX + i * 10, gridY, gridX + i * 10, gridY + gridH);
    }
    for (let i = 0; i <= (gridH / 10); i++) {
        doc.line(gridX, gridY + i * 10, gridX + gridW, gridY + i * 10);
    }
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    rect(gridX, gridY, gridW, gridH);

    // Notes Section
    let notesY = gridY + gridH + 5;
    rect(mcx, notesY, gridW, 20, lightGreen, 'F');
    text('Notes:', mcx + 5, notesY + 13);
    rect(mcx, notesY + 20, gridW, docHeight - notesY - 20 - margin);
    doc.setFontSize(8);
    doc.text(values.notes || '', mcx + 5, notesY + 33, { maxWidth: gridW - 10 });


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
