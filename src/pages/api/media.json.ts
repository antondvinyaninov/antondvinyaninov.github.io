import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    // Получаем изображения из Supabase Storage
    const { data: storageFiles, error } = await supabase.storage
      .from('blog-images')
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Supabase storage error:', error);
      // Fallback на локальные файлы
      return getLocalImages();
    }

    // Получаем URLs для всех изображений
    const images = storageFiles.map((file) => {
      // Формируем правильный public URL
      // Формат: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{filename}
      const supabaseUrl = process.env.SUPABASE_URL || 'https://baze-supabase.crv1ic.easypanel.host';
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog-images/${file.name}`;
      
      console.log('📸 Image:', file.name);
      console.log('🔗 URL:', publicUrl);

      return {
        name: file.name,
        url: publicUrl,
        size: file.metadata?.size || 0,
        modified: file.created_at
      };
    });

    return new Response(JSON.stringify(images), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Media API error:', error);
    return getLocalImages();
  }
};

// Fallback на локальные файлы
function getLocalImages() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const files = fs.readdirSync(imagesDir);
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map(file => ({
        name: file,
        url: `/images/${file}`,
        size: fs.statSync(path.join(imagesDir, file)).size,
        modified: fs.statSync(path.join(imagesDir, file)).mtime
      }));
    
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
