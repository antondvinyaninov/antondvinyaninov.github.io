import type { APIRoute } from 'astro';
import { POSTS } from '../../data/posts';
import { AUTHORS } from '../../data/authors';

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();

    // Validate basic data
    if (!body.title || !body.content) {
        return new Response(JSON.stringify({
            message: 'Missing required fields'
        }), { status: 400 });
    }

    // Create a new post object
    const newPost = {
        id: (POSTS.length + 1).toString(),
        title: body.title,
        slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        excerpt: body.excerpt || body.content.substring(0, 150) + '...',
        content: body.content,
        tags: body.tags || [],
        coverImage: body.coverImage || 'https://images.unsplash.com/photo-1499750310159-5b9887039e54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Default image
        category: { id: 'uncategorized', name: 'Uncategorized', color: 'bg-slate-100 text-slate-800' },
        author: AUTHORS[0], // Assigned to current user (mock)
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: '3 min read', // Mock calculation
        views: 0,
        type: 'standard' as const,
    };

    // Logic to save data.
    // NOTE: In a real app, this would save to a database.
    // Since we can't easily persist to the file system in a deployed serverless function without an adapter,
    // we will just log it here for the "preview" capability.
    console.log('--- NEW SUBMISSION RECEIVED ---');
    console.log(newPost);
    console.log('------------------------------');

    return new Response(JSON.stringify({
        message: 'Success!',
        post: newPost
    }), { status: 200 });
};
