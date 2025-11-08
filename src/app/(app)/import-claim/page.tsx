import { redirect } from 'next/navigation'

export default function ImportClaimPage() {
  const query = new URLSearchParams({
    claimNumber: 'CLM-12345',
    policyNumber: 'POL-67890',
    clientName: 'John Doe',
    clientEmail: 'john.doe@example.com',
    clientPhone: '(555) 123-4567',
    propertyAddress: '123 Main St, Anytown, USA 12345',
    dateOfLoss: '2024-07-15',
    hailF: '10',
    hailR: '12',
    hailB: '8',
    hailL: '15',
    windDate: '2024-07-14',
    ladderNow: 'true',
    inspector: 'Jane Smith',
    phone: '(555) 765-4321',
    email: 'jane.smith@scopesheet.pro',
    eaveLF: '150',
    shingleType: 'Laminate',
    iceWaterShield: 'true',
    dripEdge: 'true',
    layers: '1',
    pitch: '6/12',
    shingleMake: '30 Y',
    totalSquares: '25',
    guttersLF: '150',
    guttersSize: '5"',
    downspoutsLF: '80',
    downspoutsSize: '2x3',
    notes: 'Heavy hail damage observed on all slopes. Minor wind damage on the west-facing slope. Inspected property with homeowner present. All collateral damage was documented.'
  }).toString();
  
  redirect(`/scope-sheet?${query}`);
}
