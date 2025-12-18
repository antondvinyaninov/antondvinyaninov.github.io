import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

// Тестовый эндпоинт - загружает оригинал БЕЗ оптимизации
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

    // Читаем файл БЕЗ оптимизации
