import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const safeParse = (data) => {
  try { return typeof data === 'string' ? JSON.parse(data) : data; }
  catch (e) { return []; }
};

export async function GET(request) {
  try {
    await dbConnect();
    const { Product } = require('../../../models/index');
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    const query = admin === 'true' ? {} : { isActive: true };
    const products = await Product.find(query).sort('order');
    return Response.json({ success: true, products });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { Product } = require('../../../models/index');
    const Notification = require('../../../models/Notification');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') data[key] = value;
    }

    data.specifications = safeParse(data.specifications);
    data.specHeaders = safeParse(data.specHeaders);
    data.reactions = safeParse(data.reactions);

    // Handle multiple images
    const imageFiles = formData.getAll('images');
    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      const imageUrls = [];
      for (const file of imageFiles) {
        if (file.size > 0) {
          const saved = await saveUploadedFile(file, 'images');
          imageUrls.push(saved.url);
        }
      }
      data.images = imageUrls;
    }

    const newProduct = await Product.create(data);

    try {
      await Notification.create({
        type: 'new_document',
        icon: 'package',
        title: `Product added: ${newProduct.name}`,
        message: `Category: ${newProduct.category}`,
        link: `/admin/products`,
        meta: { productId: newProduct._id },
      });
    } catch (e) {}

    return Response.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
