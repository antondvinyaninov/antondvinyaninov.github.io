export const SITE_TITLE = 'Ncmaz Astro';
export const SITE_DESCRIPTION = 'A personal brand and blog website inspired by Ncmaz.';

export type Author = {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    postCount: number;
};

export type PostType = 'standard' | 'video' | 'gallery' | 'audio';

export type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    coverImage: string;
    category: { id: string; name: string; color: string };
    author: Author;
    date: string;
    readTime: string;
    views: number;
    type: PostType;
    tags?: string[];
    featured?: boolean;
    likes?: number;
    comments?: number;
};
