import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/upload';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Scan static investor PDFs from public/investor/ folder
function getStaticInvestorDocs(category) {
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

  const folderName = FOLDER_MAP[category];
  if (!folderName) return [];

  const dirPath = path.join(process.cwd(), 'public', 'investor', folderName);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));
  return files.map(filename => {
    const yearMatch = filename.match(/(20\d{2})/);
    const year = yearMatch ? yearMatch[1] : '';
    const title = filename.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s*\(\d+\)\s*/g, '').trim();
    const fileUrl = `/investor/${folderName}/${filename}`;

    return {
      _id: Buffer.from(fileUrl).toString('base64').substring(0, 24),
      title,
      fileName: filename,
      filePath: fileUrl,
      fileUrl,
      category,
      year,
      fileSize: fs.statSync(path.join(dirPath, filename)).size,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }).sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
}

export async function GET(request) {
  try {
    await dbConnect();
    const Document = require('../../../models/Document');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    let docs = await Document.find(filter).sort({ year: -1, quarter: -1, createdAt: -1 }).lean();

    // If no MongoDB docs found for this category, serve from static files
    if (docs.length === 0 && category && !search) {
      docs = getStaticInvestorDocs(category);
    }

    // Normalize fileUrl for all docs
    docs = docs.map(doc => ({
      ...doc,
      fileUrl: doc.fileUrl && doc.fileUrl.includes('/uploads/')
        ? doc.fileUrl.substring(doc.fileUrl.indexOf('/uploads/'))
        : doc.fileUrl && doc.fileUrl.includes('/investor/')
          ? doc.fileUrl.substring(doc.fileUrl.indexOf('/investor/'))
          : doc.fileUrl,
    }));

    return Response.json({ success: true, documents: docs });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const Document = require('../../../models/Document');
    const Notification = require('../../../models/Notification');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const formData = await request.formData();
    const file = formData.get('pdf');
    if (!file) return Response.json({ success: false, message: 'No file uploaded.' }, { status: 400 });

    const title = formData.get('title');
    const category = formData.get('category') || 'others';
    const year = formData.get('year') || '';
    const quarter = formData.get('quarter') || '';
    const description = formData.get('description') || '';

    const saved = await saveUploadedFile(file, 'documents', category);

    const newDoc = await Document.create({
      title,
      category,
      year,
      quarter,
      description,
      uploadedBy: user._id,
      fileName: file.name,
      filePath: saved.relativePath,
      fileUrl: saved.url,
      fileSize: saved.size,
    });

    try {
      await Notification.create({
        type: 'new_document',
        icon: 'file',
        title: `Document uploaded: ${newDoc.title}`,
        message: `Category: ${newDoc.category}`,
        link: `/admin/documents`,
        meta: { documentId: newDoc._id },
      });
    } catch (e) {}

    return Response.json({ success: true, message: 'Document uploaded successfully', document: newDoc }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
