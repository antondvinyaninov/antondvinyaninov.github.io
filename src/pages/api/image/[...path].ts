import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
  try {
    const imagePath = params.path || '';
    
    if (!imagePath) {
      return new Response('Image path required', { status: 400 });
    }

    // Скачиваем изображение из Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .download(imagePath);

    if (error || !data) {
      console.error('Failed to download image:', error);
      return new Response('Image not found', { status: 404 });
    }

    // Определяем content-type
    const contentType = imagePath.endsWith('.webp') ? 'image/webp' :
                       imagePath.endsWith('.png') ? 'image/png' :
                       imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? 'image/jpeg' :
                       imagePath.endsWith('.gif') ? 'image/gif' :
                       'image/webp';

    // Возвращаем изображение с правильными CORS заголовками
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

// Обработка OPTIONS для CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
