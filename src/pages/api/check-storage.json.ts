import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  try {
    // Проверяем bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return new Response(JSON.stringify({ 
        error: 'Failed to list buckets',
        details: bucketsError 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ищем наш bucket
    const blogImagesBucket = buckets.find(b => b.name === 'blog-images');

    // Пробуем получить список файлов
    const { data: files, error: filesError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 5 });

    // Если есть файлы, пробуем получить их URLs разными способами
    let urlTests = [];
    if (files && files.length > 0) {
      const testFile = files[0];
      
      // Тест 1: Public URL через SDK
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(testFile.name);

      // Тест 2: Signed URL
      const { data: signedData, error: signedError } = await supabase.storage
        .from('blog-images')
        .createSignedUrl(testFile.name, 60);

      // Тест 3: Прямой URL
      const supabaseUrl = process.env.SUPABASE_URL;
      const directUrl = `${supabaseUrl}/storage/v1/object/public/blog-images/${testFile.name}`;

      urlTests = [
        { method: 'SDK publicUrl', url: publicUrl },
        { method: 'Signed URL', url: signedData?.signedUrl || 'Error: ' + signedError?.message },
        { method: 'Direct URL', url: directUrl }
      ];
    }

    return new Response(JSON.stringify({
      supabaseUrl: process.env.SUPABASE_URL,
      buckets: buckets.map(b => ({ name: b.name, public: b.public, id: b.id })),
      blogImagesBucket: blogImagesBucket || 'Not found',
      filesCount: files?.length || 0,
      filesError: filesError?.message || null,
      urlTests
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Unexpected error',
      details: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
