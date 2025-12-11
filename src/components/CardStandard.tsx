import { Clock, Eye, Play } from 'lucide-react';
import type { Post } from '../consts';

interface CardStandardProps {
    post: Post;
    className?: string;
}

export default function CardStandard({ post, className = '' }: CardStandardProps) {
    return (
        <article className={`group flex flex-col gap-4 ${className}`}>
            <a href={`/blog/${post.slug}`} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {post.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 text-slate-900 fill-current ml-1" />
                        </div>
                    </div>
                )}

                <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur shadow-sm text-slate-900`}>
                        {post.category.name}
                    </span>
                </div>
            </a>

            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    <a href={`/blog/${post.slug}`}>
                        {post.title}
                    </a>
                </h3>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="font-medium text-slate-900">{post.author.name}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{post.date}</span>
                </div>
            </div>
        </article>
    );
}
