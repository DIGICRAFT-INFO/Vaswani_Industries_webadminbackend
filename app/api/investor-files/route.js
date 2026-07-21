import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Map folder names to category keys
const CATEGORY_MAP = {
  'financials/Annual-Reports': 'financials_annual_reports',
  'financials/Quarterly-Results': 'financials_quarterly_results',
  'financials/Related-party-disclosure': 'financials_related_party',
  'disclosures/Annual-Return': 'disclosures_annual_return',
  'disclosures/Annual-Secretarial-Compliance-Report': 'disclosures_secretarial',
  'disclosures/Corporate-Governance-Report': 'disclosures_corporate_governance',
  'disclosures/General-meetings': 'disclosures_general_meetings',
  'disclosures/News-Paper-Publication': 'disclosures_newspaper',
  'disclosures/Other-Disclosures': 'disclosures_others',
  'disclosures/Reconciliation-of-share-capital-audit-report': 'disclosures_share_capital',
  'disclosures/Shareholding-Pattern': 'disclosures_shareholding',
  'listing-information': 'listing_information',
  'policies': 'policies',
  'others': 'others',
  'disclosure-under-46-of-sebi-lodr-regulation-2015': 'sebi_disclosure',
};

function extractYear(filename) {
  // Try to extract year from filename
  const yearMatch = filename.match(/(20\d{2})/);
  if (yearMatch) return yearMatch[1];
  const shortYear = filename.match(/_(\d{2})[\._\s]/);
  if (shortYear && parseInt(shortYear[1]) > 9) return '20' + shortYear[1];
  return '';
}

function cleanTitle(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s*\(\d+\)\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scanDirectory(dirPath, relativeTo) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanDirectory(fullPath, relativeTo));
    } else if (entry.name.toLowerCase().endsWith('.pdf')) {
      const relPath = path.relative(relativeTo, fullPath).replace(/\\/g, '/');
      results.push({
        filename: entry.name,
        path: `/investor/${relPath}`,
        size: fs.statSync(fullPath).size,
      });
    }
  }
  return results;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const investorDir = path.join(process.cwd(), 'public', 'investor');
    if (!fs.existsSync(investorDir)) {
      return Response.json({ success: true, documents: [] });
    }

    // Scan all PDFs
    const allFiles = scanDirectory(investorDir, path.join(process.cwd(), 'public', 'investor'));

    // Map to document format
    const documents = allFiles.map(file => {
      // Determine category from path
      let docCategory = 'others';
      for (const [folderPath, catKey] of Object.entries(CATEGORY_MAP)) {
        if (file.path.includes(folderPath)) {
          docCategory = catKey;
          break;
        }
      }

      const year = extractYear(file.filename);
      const title = cleanTitle(file.filename);

      return {
        _id: Buffer.from(file.path).toString('base64').substring(0, 24),
        title,
        fileName: file.filename,
        filePath: file.path,
        fileUrl: file.path,
        category: docCategory,
        year,
        fileSize: file.size,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
    });

    // Filter by category if provided
    const filtered = category ? documents.filter(d => d.category === category) : documents;

    return Response.json({ success: true, documents: filtered });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
