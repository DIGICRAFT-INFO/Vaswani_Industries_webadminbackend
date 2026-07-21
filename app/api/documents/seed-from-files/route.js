import dbConnect from '@/lib/db';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Exact folder paths mapped to MongoDB categories
const FOLDERS = [
  { path: 'financials/Annual-Reports', category: 'financials_annual_reports' },
  { path: 'financials/Quarterly-Results', category: 'financials_quarterly_results' },
  { path: 'financials/Related-party-disclosure', category: 'financials_related_party' },
  { path: 'disclosures/Annual-Return', category: 'disclosures_annual_return' },
  { path: 'disclosures/Annual-Secretarial-Compliance-Report', category: 'disclosures_secretarial' },
  { path: 'disclosures/Corporate-Governance-Report', category: 'disclosures_corporate_governance' },
  { path: 'disclosures/General meetings-Postal Ballots', category: 'disclosures_general_meetings' },
  { path: 'disclosures/News-Paper-Publication', category: 'disclosures_newspaper' },
  { path: 'disclosures/Other-Disclosures', category: 'disclosures_others' },
  { path: 'disclosures/Reconciliation-of-share-capital-audit-report', category: 'disclosures_share_capital' },
  { path: 'disclosures/Shareholding-Pattern', category: 'disclosures_shareholding' },
  { path: 'listing-information', category: 'listing_information' },
  { path: 'policies', category: 'policies' },
  { path: 'others', category: 'others' },
  { path: 'disclosure-under-46-of-sebi-lodr-regulation-2015', category: 'sebi_disclosure' },
];

function extractYear(filename) {
  const m4 = filename.match(/(20[1-2]\d)/);
  if (m4) return m4[1];
  return '';
}

function extractQuarter(filename) {
  const f = filename.toLowerCase();
  if (f.match(/q1|_06_|jun_|june/)) return 'Q1';
  if (f.match(/q2|_09_|sep_|sept/)) return 'Q2';
  if (f.match(/q3|_12_|dec_/)) return 'Q3';
  if (f.match(/q4|_03_|mar_|march/)) return 'Q4';
  return '';
}

function makeTitle(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/[_]+/g, ' ')
    .replace(/[-]+/g, ' ')
    .replace(/\s*\(\d+\)\s*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\d+\s+/, '') // remove leading numbers like "1 ", "20 "
    .trim();
}

export async function GET() {
  try {
    await dbConnect();
    const Document = require('../../../../models/Document');

    // Step 1: Delete ALL old documents
    const deleted = await Document.deleteMany({});

    // Step 2: Scan folders and build documents
    const investorBase = path.join(process.cwd(), 'public', 'investor');
    const allDocs = [];

    for (const folder of FOLDERS) {
      const dirPath = path.join(investorBase, folder.path);
      if (!fs.existsSync(dirPath)) continue;

      const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));

      // Sort: newest year first
      files.sort((a, b) => {
        const ya = extractYear(a) || '0';
        const yb = extractYear(b) || '0';
        return yb.localeCompare(ya);
      });

      for (const filename of files) {
        const stat = fs.statSync(path.join(dirPath, filename));
        const year = extractYear(filename);
        const quarter = extractQuarter(filename);
        const title = makeTitle(filename);
        // Use encodeURIComponent for filenames with spaces/special chars
        const fileUrl = `/investor/${folder.path}/${encodeURIComponent(filename)}`;

        allDocs.push({
          title,
          fileName: filename,
          filePath: fileUrl,
          fileUrl,
          category: folder.category,
          year,
          quarter,
          description: '',
          fileSize: stat.size,
          isActive: true,
          downloadCount: 0,
        });
      }
    }

    // Step 3: Insert into MongoDB
    let inserted = 0;
    if (allDocs.length > 0) {
      const result = await Document.insertMany(allDocs, { ordered: false });
      inserted = result.length;
    }

    // Summary per category
    const summary = {};
    for (const doc of allDocs) {
      if (!summary[doc.category]) summary[doc.category] = 0;
      summary[doc.category]++;
    }

    return Response.json({
      success: true,
      message: `Done! Deleted ${deleted.deletedCount} old records. Inserted ${inserted} new documents from ${FOLDERS.length} folders.`,
      total: inserted,
      perCategory: summary,
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
