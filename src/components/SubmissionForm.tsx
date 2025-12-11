import { useState } from 'react';
import { Image as ImageIcon, Check, Loader2, ArrowLeft, Settings, Globe, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface FormData {
    title: string;
    excerpt: string;
    tags: string[];
    coverImage: string | null;
    content: string;
    // SEO
    slug: string;
    metaTitle: string;
    metaDescription: string;
    // Settings
    status: 'draft' | 'published';
    category: string;
    publishDate: string;
    featured: boolean;
}

const AVAILABLE_TAGS = ['Design', 'Technology', 'Travel', 'Lifestyle', 'Food', 'Business'];
const CATEGORIES = ['Uncategorized', 'Technology', 'Design', 'Lifestyle', 'Travel'];

export default function SubmissionForm() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        excerpt: '',
        tags: [],
        coverImage: null,
        content: '<p>Start writing your amazing story...</p>',
        slug: '',
        metaTitle: '',
        metaDescription: '',
        status: 'draft',
        category: 'Uncategorized',
        publishDate: new Date().toISOString().split('T')[0],
        featured: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Accordion states
    const [sections, setSections] = useState({
        publishing: true,
        seo: true,
        organization: true,
    });

    const toggleSection = (key: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTagToggle = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag].slice(0, 5)
        }));
    };

    // Auto-generate slug from title if empty
    const handleTitleBlur = () => {
        if (!formData.slug && formData.title) {
            setFormData(prev => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        try {
            const response = await fetch('/api/submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Submission failed');

            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Статья отправлена!</h2>
                <p className="text-slate-500 mb-8">
                    Ваша статья была успешно отправлена на модерацию.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                >
                    Отправить еще одну
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
                <a href="/" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> На главную
                </a>
                <div className="flex items-center gap-4">
                    <button type="button" className="text-slate-500 hover:text-slate-900 text-sm font-medium px-4">
                        Сохранить черновик
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Заголовок статьи"
                            required
                            className="w-full text-4xl md:text-5xl font-bold placeholder:text-slate-300 border-none focus:ring-0 p-0 text-slate-900 bg-transparent"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            onBlur={handleTitleBlur}
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Краткое описание..."
                            rows={2}
                            className="w-full text-xl text-slate-500 placeholder:text-slate-300 border-none focus:ring-0 p-0 bg-transparent font-light resize-none"
                            value={formData.excerpt}
                            onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        />
                    </div>

                    <div className="pt-4">
                        <RichTextEditor
                            content={formData.content}
                            onChange={content => setFormData(prev => ({ ...prev, content }))}
                        />
                    </div>
                </div>

                {/* Right Column: Sidebar Settings */}
                <div className="space-y-6">

                    {/* Publishing Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                            onClick={() => toggleSection('publishing')}
                        >
                            <span className="font-semibold text-slate-900 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-slate-500" /> Публикация
                            </span>
                            {sections.publishing ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {sections.publishing && (
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Статус</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 text-sm focus:ring-slate-900 focus:border-slate-900"
                                        value={formData.status}
                                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                    >
                                        <option value="draft">Черновик</option>
                                        <option value="published">Опубликовано</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Дата публикации</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-slate-200 text-sm focus:ring-slate-900 focus:border-slate-900 pl-10"
                                            value={formData.publishDate}
                                            onChange={e => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                                        />
                                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                        checked={formData.featured}
                                        onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                    />
                                    <label htmlFor="featured" className="text-sm text-slate-600">Отметить как избранное</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                            onClick={() => toggleSection('seo')}
                        >
                            <span className="font-semibold text-slate-900 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-500" /> SEO настройки
                            </span>
                            {sections.seo ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {sections.seo && (
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">URL адрес (slug)</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 text-sm focus:ring-slate-900 focus:border-slate-900"
                                        placeholder="my-awesome-post"
                                        value={formData.slug}
                                        onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta заголовок</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 text-sm focus:ring-slate-900 focus:border-slate-900"
                                        placeholder="Заголовок для поисковиков"
                                        value={formData.metaTitle}
                                        onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                    />
                                    <p className="text-xs text-slate-400 mt-1">{formData.metaTitle.length || 0} / 60 characters</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta описание</label>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-lg border-slate-200 text-sm focus:ring-slate-900 focus:border-slate-900 resize-none"
                                        placeholder="Описание для поисковой выдачи..."
                                        value={formData.metaDescription}
                                        onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                    />
                                    <p className="text-xs text-slate-400 mt-1">{formData.metaDescription.length || 0} / 160 characters</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organization & Media */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <button
                            type="button"
                            className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                            onClick={() => toggleSection('organization')}
                        >
                            <span className="font-semibold text-slate-900 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-slate-500" /> Организация и Медиа
                            </span>
                            {sections.organization ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {sections.organization && (
                            <div className="p-4 space-y-4">
                                {/* Cover Image Tiny */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Обложка</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-slate-300 bg-slate-50 transition-all cursor-pointer">
                                        <div className="text-xs text-slate-500">
                                            {formData.coverImage ? 'Изменить обложку' : 'Загрузить обложку'}
                                        </div>
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 text-sm focus:ring-slate-900 focus:border-slate-900"
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Теги</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => handleTagToggle(tag)}
                                                className={`px-2 py-1 rounded text-xs font-medium transition-colors border ${formData.tags.includes(tag)
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </form>
    );
}
