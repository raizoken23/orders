import { getCompanyInfo } from '@/lib/qbo';

// First run requires completing the browser OAuth; after that, only run:
(async () => {
  if (!process.env.QBO_CLIENT_ID) throw new Error('env missing');
  const ok = await getCompanyInfo().then(()=>true).catch(()=>false);
  console.log('company_info_ok', ok);
})();
