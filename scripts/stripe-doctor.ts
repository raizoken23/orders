
// Run with: tsx scripts/stripe-doctor.ts
import { getSecret } from '@/lib/secretStore';
import { getStripeInstance } from '@/lib/stripeServer';

type Report = {
    steps: {
        step: string;
        ok: boolean;
        details?: any;
        error?: string;
    }[];
};

async function main() {
    const report: Report = { steps: [] };

    console.log("🩺 Running Stripe Doctor...");

    // 1. Check for secret in store
    let secretKey: string | undefined;
    try {
        const stripeSecrets = await getSecret<{ secretKey: string }>('stripe');
        secretKey = stripeSecrets?.secretKey;
        const hasKey = !!secretKey;
        report.steps.push({
            step: "check_secret_store",
            ok: hasKey,
            details: `Stripe secret key ${hasKey ? 'found' : 'not found'} in secret store.`,
        });
        console.log(`[1/3] Checking for Stripe key in secret store... ${hasKey ? 'found' : 'not found'} in secret store. ✅`);
        if (!hasKey) {
            throw new Error("No Stripe secret key found. Please save it on the Admin page.");
        }
    } catch (e: any) {
        report.steps.push({
            step: "check_secret_store",
            ok: false,
            error: e.message,
        });
        console.error(`  ❌ ${e.message}`);
        finish(report);
        return;
    }

    // 2. Attempt to initialize Stripe instance
    let stripe;
    try {
        stripe = await getStripeInstance();
        report.steps.push({ step: "initialize_stripe", ok: true, details: "Stripe client initialized successfully." });
        console.log(`[2/3] Initializing Stripe client... ✅`);
    } catch (e: any) {
        report.steps.push({ step: "initialize_stripe", ok: false, error: e.message });
        console.error(`  ❌ Failed to initialize Stripe client: ${e.message}`);
        finish(report);
        return;
    }

    // 3. Make a test API call
    try {
        const balance = await stripe.balance.retrieve();
        const apiOk = balance.object === 'balance';
        report.steps.push({ step: "test_api_call", ok: apiOk, details: "Successfully retrieved account balance from Stripe." });
        console.log(`[3/3] Testing API connection to Stripe... ${apiOk ? '✅' : '❌'}`);
    } catch (e: any) {
        report.steps.push({ step: "test_api_call", ok: false, error: e.message });
        const errorMessage = e.message.includes('invalid API key') 
            ? 'The provided API key is invalid.'
            : e.message;
        console.error(`  ❌ API call failed: ${errorMessage}`);
    }

    finish(report);
}

function finish(report: Report) {
    console.log("\n📋 Full Report:");
    console.log(JSON.stringify(report, null, 2));

    const allOk = report.steps.every((s: any) => s.ok);
    console.log(`\n${allOk ? '✅ All Stripe checks passed!' : '❌ Some Stripe checks failed.'}`);
    
    process.exit(allOk ? 0 : 1);
}

main();
