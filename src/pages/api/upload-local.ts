import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No file provided' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'File must be an image' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Проверка размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'File too large. Maximum 10MB.' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Читаем файл
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const originalName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${originalName}-${timestamp}.${extension}`;

    // Путь для сохранения
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    const filePath = path.join(uploadDir, fileName);

    // Создаем директорию если не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Сохраняем файл
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${fileName}`;

    console.log('✅ Image saved locally:', fileName);
    console.log('✅ Public URL:', publicUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      url: publicUrl,
      fileName: fileName,
      size: buffer.length,
      originalSize: buffer.length,
      savings: 0
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: String(error) 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
