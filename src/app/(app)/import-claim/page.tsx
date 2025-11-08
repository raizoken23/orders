import ImportClaimClient from './import-claim-client'

export default function ImportClaimPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Import Claim from Image
        </h1>
        <p className="text-muted-foreground">
          Upload a screenshot of your claim document to automatically extract
          the information.
        </p>
      </div>
      <ImportClaimClient />
    </div>
  )
}
