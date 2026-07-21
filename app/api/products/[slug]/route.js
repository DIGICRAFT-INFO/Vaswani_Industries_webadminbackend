import dbConnect from '@/lib/db';
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth';
import { saveUploadedFile, deleteFile } from '@/lib/upload';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const safeParse = (data) => {
  try { return typeof data === 'string' ? JSON.parse(data) : data; }
  catch (e) { return []; }
};

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { Product } = require('../../../../models/index');
    const { slug } = await params;
    const product = await Product.findOne({ slug });
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
    return Response.json({ success: true, product });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { Product } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { slug } = await params;

    // PUT uses ID not slug - check if param is a valid ObjectId
    let product;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug);
    }
    if (!product) {
      product = await Product.findOne({ slug });
    }
    if (!product) return Response.json({ success: false, message: 'Product not found' }, { status: 404 });

    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') data[key] = value;
    }

    data.specifications = safeParse(data.specifications);
    data.specHeaders = safeParse(data.specHeaders);
    data.reactions = safeParse(data.reactions);

    const imageFiles = formData.getAll('images');
    if (imageFiles && imageFiles.length > 0 && imageFiles[0].size > 0) {
      // Delete old images
      if (product.images) {
        product.images.forEach(imgUrl => {
          if (imgUrl.includes('/uploads/images/')) {
            const filename = imgUrl.split('/uploads/images/')[1];
            if (filename) deleteFile(`/uploads/images/${filename}`);
          }
        });
      }

      const imageUrls = [];
      for (const file of imageFiles) {
        if (file.size > 0) {
          const saved = await saveUploadedFile(file, 'images');
          imageUrls.push(saved.url);
        }
      }
      data.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(product._id, data, { new: true });
    return Response.json({ success: true, product: updatedProduct });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { Product } = require('../../../../models/index');
    const user = await getAuthUser(request);
    if (!user) return unauthorized();
    if (user.role !== 'admin' && user.role !== 'superadmin') return forbidden();

    const { slug } = await params;

    // DELETE uses ID not slug
    let product;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug);
    }
    if (!product) {
      product = await Product.findOne({ slug });
    }
    if (!product) return Response.json({ success: false, message: 'Not found' }, { status: 404 });

    if (product.images) {
      product.images.forEach(imgUrl => {
        if (imgUrl.includes('/uploads/images/')) {
          const filename = imgUrl.split('/uploads/images/')[1];
          if (filename) deleteFile(`/uploads/images/${filename}`);
        }
      });
    }

    await Product.findByIdAndDelete(product._id);
    return Response.json({ success: true, message: 'Product and associated images deleted' });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
