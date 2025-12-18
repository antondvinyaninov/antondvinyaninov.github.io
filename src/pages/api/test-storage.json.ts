import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const tests = [];

  try {
    // Тест 1: Проверка подключения
    tests.push({
      test: 'Connection',
      supabaseUrl: process.env.SUPABASE_URL,
      hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY
    });

    // Тест 2: Список buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    tests.push({
      test: 'List Buckets',
      success: !bucketsError,
      buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
      error: bucketsError?.message
    });

    // Тест 3: Список файлов в blog-images
    const { data: files, error: filesError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 10 });
    
    tests.push({
      test: 'List Files',
      success: !filesError,
      filesCount: files?.length || 0,
      files: files?.map(f => ({ 
        name: f.name, 
        size: f.metadata?.size,
        created: f.created_at 
      })),
      error: filesError?.message
    });

    // Тест 4: Попытка скачать первый файл
    if (files && files.length > 0) {
      const testFile = files[0];
      const { data: downloadData, error: downloadError } = await supabase.storage
        .from('blog-images')
        .download(testFile.name);

      tests.push({
        test: 'Download File',
        fileName: testFile.name,
        success: !downloadError,
        downloadedSize: downloadData?.size,
        downloadedType: downloadData?.type,
        error: downloadError?.message
      });

      // Тест 5: Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(testFile.name);

      tests.push({
        test: 'Public URL',
        url: publicUrl
      });

      // Тест 6: Signed URL
      const { data: signedData, error: signedError } = await supabase.storage
        .from('blog-images')
        .createSignedUrl(testFile.name, 60);

      tests.push({
        test: 'Signed URL',
        success: !signedError,
        url: signedData?.signedUrl,
        error: signedError?.message
      });
    }

    return new Response(JSON.stringify(tests, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Test failed',
      message: String(error),
      tests 
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
