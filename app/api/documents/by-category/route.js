import dbConnect from '@/lib/db';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FOLDER_MAP = {
  'financials_annual_reports': 'financials/Annual-Reports',
  'financials_quarterly_results': 'financials/Quarterly-Results',
  'financials_related_party': 'financials/Related-party-disclosure',
  'disclosures_annual_return': 'disclosures/Annual-Return',
  'disclosures_secretarial': 'disclosures/Annual-Secretarial-Compliance-Report',
  'disclosures_corporate_governance': 'disclosures/Corporate-Governance-Report',
  'disclosures_general_meetings': 'disclosures/General meetings-Postal Ballots',
  'disclosures_newspaper': 'disclosures/News-Paper-Publication',
  'disclosures_others': 'disclosures/Other-Disclosures',
  'disclosures_share_capital': 'disclosures/Reconciliation-of-share-capital-audit-report',
  'disclosures_shareholding': 'disclosures/Shareholding-Pattern',
  'listing_information': 'listing-information',
  'policies': 'policies',
  'others': 'others',
  'sebi_disclosure': 'disclosure-under-46-of-sebi-lodr-regulation-2015',
};

function getStaticDocs(category, folderName) {
  const dirPath = path.join(process.cwd(), 'public', 'investor', folderName);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));
  return files.map(filename => {
    const yearMatch = filename.match(/(20\d{2})/);
    const year = yearMatch ? yearMatch[1] : '';
    const title = filename.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s*\(\d+\)\s*/g, '').trim();
    const fileUrl = `/investor/${folderName}/${encodeURIComponent(filename)}`;

    return {
      _id: Buffer.from(fileUrl).toString('base64').substring(0, 24),
      title,
      fileName: filename,
      filePath: fileUrl,
      fileUrl,
      category,
      year,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }).sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
}

export async function GET() {
  try {
    await dbConnect();
    const Document = require('../../../../models/Document');
    const docs = await Document.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    const data = {};
    docs.forEach(doc => {
      const d = { ...doc };
      // Normalize URL
      if (d.fileUrl && d.fileUrl.includes('/uploads/')) d.fileUrl = d.fileUrl.substring(d.fileUrl.indexOf('/uploads/'));
      if (d.fileUrl && d.fileUrl.includes('/investor/')) d.fileUrl = d.fileUrl.substring(d.fileUrl.indexOf('/investor/'));
      if (!data[d.category]) data[d.category] = [];
      data[d.category].push(d);
    });

    // Fill in from static files for categories with no MongoDB docs
    for (const [category, folderName] of Object.entries(FOLDER_MAP)) {
      if (!data[category] || data[category].length === 0) {
        const staticDocs = getStaticDocs(category, folderName);
        if (staticDocs.length > 0) data[category] = staticDocs;
      }
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
