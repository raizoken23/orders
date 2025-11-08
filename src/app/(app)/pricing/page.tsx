export const dynamic = 'force-dynamic';

async function getPricing() {
  const r = await fetch(`${process.env.APP_URL || ''}/api/public/pricing`, { cache: 'no-store' });
  return r.json();
}

export default async function Pricing() {
  const { products } = await getPricing();
  return (
    <div style={{maxWidth:980, margin:'40px auto', padding:20}}>
      <h1>Pricing</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16}}>
        {products.map((p:any)=>(
          <div key={p.id} style={{border:'1px solid #ddd', padding:16}}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <ul>{p.features.map((f:string,i:number)=><li key={i}>{f}</li>)}</ul>
            {p.prices.map((pr:any)=>(
              <div key={pr.id} style={{marginTop:8}}>
                <strong>
                  {(pr.unit_amount/100).toFixed(2)} {pr.currency.toUpperCase()}
                  {pr.interval ? ` / ${pr.interval}` : ''}
                </strong>
                {pr.isDefault ? <span> (default)</span> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
