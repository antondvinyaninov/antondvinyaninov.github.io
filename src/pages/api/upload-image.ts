import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import sharp from 'sharp';

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

    // Проверка размера (макс 10MB до оптимизации)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'File too large. Maximum 10MB before optimization.' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Читаем файл
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Оптимизируем изображение с правильными настройками
    let optimizedBuffer;
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      console.log('📊 Original image:', {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        space: metadata.space,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha
      });

      optimizedBuffer = await sharp(buffer)
        .resize(1920, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ 
          quality: 85,
          effort: 4,
          // Не используем smartSubsample - может вызывать проблемы
        })
        .toBuffer();

      console.log('✅ Optimized size:', optimizedBuffer.length);
    } catch (sharpError) {
      console.error('Sharp optimization error:', sharpError);
      // Если оптимизация не удалась, используем оригинал
      optimizedBuffer = buffer;
    }

    // Проверка размера после оптимизации (макс 5MB для Supabase)
    if (optimizedBuffer.length > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Изображение слишком большое даже после оптимизации. Попробуйте меньшее изображение.' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // убираем расширение
    const fileName = `${originalName}-${timestamp}.webp`;

    // Проверяем подключение к Supabase
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.SUPABASE_ANON_KEY);

    // Загружаем в Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 год
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Upload failed: ${error.message}` 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Upload response:', data);

    // Используем наш прокси URL вместо прямого Supabase URL
    const proxyUrl = `/api/image/${fileName}`;

    console.log('✅ Image uploaded:', fileName);
    console.log('✅ Proxy URL:', proxyUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      url: proxyUrl,
      fileName: fileName,
      size: optimizedBuffer.length,
      originalSize: buffer.length,
      savings: Math.round((1 - optimizedBuffer.length / buffer.length) * 100)
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
