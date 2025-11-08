
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Download, File, Terminal, Wand2, TestTube } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { generateScopeSheetPdf } from '@/ai/flows/generate-scope-sheet'
import { scopeSheetSchema, type ScopeSheetData } from '@/lib/schema/scope-sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { diagnoseExecutionError } from '@/ai/flows/diagnose-error'
import { Skeleton } from '@/components/ui/skeleton'

const demoData: ScopeSheetData = {
      claimNumber: 'CLM-DEMO-98765',
      policyNumber: 'POL-DEMO-54321',
      clientName: 'Demo User',
      clientEmail: 'demo.user@example.com',
      clientPhone: '(555) 555-5555',
      propertyAddress: '123 Demo Lane, Testville, USA 54321',
      dateOfLoss: '2024-01-01',
      inspector: 'P Yarborough',
      phone: '310-357-1399',
      email: 'pyarborough@laddernow.com',
      shingleType: ['Laminate'],
      shingleMake: ['30 Y'],
      iceWaterShield: ['Valley','Eave'],
      dripEdgeRadio: 'Yes',
      dripEdge: ['Eave','Rake'],
      layers: '1',
      pitch: '7/12',
      totalSquares: '32',
      notes: 'This is a test PDF generated with sample data to demonstrate the automation capabilities. All fields have been filled to ensure proper mapping and alignment on the final document.',
      accessories: ['Solar Tube'],
      eaveLF: '150',
      otherShingle: 'Architectural',
      valleyMetalLF: '60',
      calcA: '10', calcB: '12', calcC: '10', calcD: '12',
      calcE: '8', calcF: '15', calcG: '8', calcH: '15',
      calcI: '20', calcJ: '25', calcK: '5', calcL: '5', calcM: '5',
      rakeLF: '180',
      aerialMeasurements2Story: true,
      boxVentsQtyLead: '2',
      boxVentsQtyPlastic: '2',
      turbineQtyLead: '1',
      turbineQtyPlastic: '1',
      hvacventQtyLead: '3',
      hvacventQtyPlastic: '0',
      raindiverterQtyLead: '4',
      raindiverterQtyPlastic: '0',
      powerVentQtyLead: '1',
      powerVentQtyPlastic: '0',
      skylightQtyLead: '2',
      skylightQtyPlastic: '0',
      satQtyLead: '1',
      satQtyPlastic: '0',
      pipeQty: '4',
      pipeLead: true,
      ridgeVentLF: '40',
      ridgeVentPlastic: true,
      guttersLF: '150',
      guttersSize: '6"',
      downspoutsLF: '80',
      downspoutsSize: '3x4',
      fasciaLF: '150',
      chimneyFlashing: 'Step',
      chimneyOther: 'Cricket',
};


function ScopeSheetContent() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiProvider, setAiProvider] = useState<'google' | 'openai'>('google');
  const [openAIKey, setOpenAIKey] = useState<string | null>(null);

  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') as 'google' | 'openai' || 'google';
    const savedKey = localStorage.getItem('openAIKey');
    setAiProvider(savedProvider);
    setOpenAIKey(savedKey);
  }, []);

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
      accessories: [],
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

  const preflightCheck = () => {
    if (aiProvider === 'openai' && (!openAIKey || openAIKey.trim() === '')) {
      toast({
        title: 'OpenAI API Key Missing',
        description: 'Please set your OpenAI API key in the Settings page before generating a report.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };


  const handlePdfGeneration = async (values: z.infer<typeof scopeSheetSchema>, setSubmitting: (isSubmitting: boolean) => void) => {
    if (!preflightCheck()) return;

    setSubmitting(true);
    setErrorDetails(null);
    setAiAnalysis(null);
    try {
        const result = await generateScopeSheetPdf(values);
        
        if (result && 'error' in result && result.error) {
            console.error('PDF Generation Failed:', result);
            setErrorDetails(result);
            toast({
                title: 'Error Generating Report',
                description: 'The backend script failed to generate the PDF.',
                variant: 'destructive',
            });
            
            setIsDiagnosing(true);
            try {
              const diagnosis = await diagnoseExecutionError({
                command: `python pdfsys/stamp_pdf.py ...`,
                stdout: result.stdout || '',
                stderr: result.stderr || 'No stderr output.',
                provider: aiProvider,
                openAIKey: openAIKey || undefined,
              });
              setAiAnalysis(diagnosis.analysis);
            } catch (diagError) {
                console.error("Diagnosis AI failed:", diagError);
                setAiAnalysis("The AI assistant could not analyze the error. This may be due to a network issue, an invalid API key, or a problem with the AI provider. Please check the Raw Error (stderr) below for the specific failure reason.");
            } finally {
                setIsDiagnosing(false);
            }

            return;
        }

        if (!result || !('pdfBase64' in result)) {
             throw new Error("Client Error: PDF base64 string is missing in the result.");
        }

        const { pdfBase64 } = result;
        const byteCharacters = atob(pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

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

    } catch (e: any) {
        console.error('PDF Generation Client Error:', e);
        setErrorDetails({ error: e.message, stderr: e.stack || 'Client-side exception caught.' });
        toast({
            title: 'Client Error',
            description: e.message || 'There was a problem preparing the PDF request.',
            variant: 'destructive',
        });
    } finally {
        setSubmitting(false);
    }
  }

  const onSubmit = (values: z.infer<typeof scopeSheetSchema>) => {
    handlePdfGeneration(values, setIsSubmitting);
  }
  
  const onGenerateDemo = () => {
      handlePdfGeneration(demoData, setIsDemoSubmitting);
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
            <Button type="button" variant="outline" asChild>
                <a href="/satellite_base.pdf" download="ScopeSheet-Template.pdf">
                    <File className="mr-2" />
                    Download Template
                </a>
            </Button>
            <Button type="button" variant="secondary" onClick={onGenerateDemo} disabled={isDemoSubmitting}>
                <TestTube className="mr-2" />
                {isDemoSubmitting ? 'Generating...' : 'Generate Demo PDF'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                <Download className="mr-2" />
                {isSubmitting ? 'Generating...' : 'Download Report'}
            </Button>
          </div>
        </div>

        {errorDetails && (
            <AlertDialog open={!!errorDetails} onOpenChange={() => setErrorDetails(null)}>
                <AlertDialogContent className="max-w-3xl">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Terminal className="text-red-500"/>
                        Backend Diagnostic Report
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        The PDF generation script failed. Here is the diagnostic information.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mt-2 bg-slate-950 text-white font-mono text-xs p-4 rounded-md overflow-x-auto max-h-[60vh] space-y-4">
                        <div>
                            <p className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><Wand2 /> AI Analysis & Fix</p>
                            {isDiagnosing ? (
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-1/3 bg-slate-700" />
                                <Skeleton className="h-4 w-full bg-slate-700" />
                                <Skeleton className="h-4 w-4/5 bg-slate-700" />
                              </div>
                            ) : (
                               <div className="whitespace-pre-wrap text-sky-300 bg-slate-900 p-3 rounded-md">{aiAnalysis || "No analysis available."}</div>
                            )}
                        </div>
                        <Separator className="bg-slate-700" />
                        <div>
                            <p className="font-bold text-gray-400 mb-1">Operational Trace (stdout):</p>
                            <pre className="whitespace-pre-wrap text-gray-500 bg-slate-900 p-3 rounded-md">{errorDetails.stdout || 'No stdout output.'}</pre>
                        </div>
                        <div>
                            <p className="font-bold text-red-400 mb-1">Raw Error (stderr):</p>
                            <pre className="whitespace-pre-wrap text-red-500 bg-slate-900 p-3 rounded-md">{errorDetails.stderr || 'No stderr output.'}</pre>
                        </div>

                    </div>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setErrorDetails(null)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}


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
                        <Separator/>
                        <FormField
                          control={form.control}
                          name="accessories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accessories</FormLabel>
                              <Select onValueChange={(value) => field.onChange(value ? [value] : [])} defaultValue={Array.isArray(field.value) ? field.value[0] : field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select accessories" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Solar Tube">Solar Tube</SelectItem>
                                  <SelectItem value="Power Vent">Power Vent</SelectItem>
                                  <SelectItem value="Skylight">Skylight</SelectItem>
                                  <SelectItem value="Satellite Dish">Satellite Dish</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select any additional roof accessories.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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

export default function ScopeSheetPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading scope sheet...</div>}>
      <ScopeSheetContent />
    </Suspense>
  );
}

    