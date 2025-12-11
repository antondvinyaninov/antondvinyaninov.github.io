import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    Heading1, Heading2, List, ListOrdered, Quote,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link as LinkIcon, Image as ImageIcon,
    Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
    RotateCcw, RotateCw, RemoveFormatting
} from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const buttons = [
        {
            icon: <RotateCcw className="w-4 h-4" />,
            action: () => editor.chain().focus().undo().run(),
            title: 'Undo',
            group: 'history'
        },
        {
            icon: <RotateCw className="w-4 h-4" />,
            action: () => editor.chain().focus().redo().run(),
            title: 'Redo',
            group: 'history'
        },
        {
            icon: <Heading1 className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
            title: 'H2',
            group: 'block'
        },
        {
            icon: <Heading2 className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 }),
            title: 'H3',
            group: 'block'
        },
        {
            icon: <List className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            title: 'Bullet List',
            group: 'block'
        },
        {
            icon: <ListOrdered className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
            title: 'Ordered List',
            group: 'block'
        },
        {
            icon: <Quote className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive('blockquote'),
            title: 'Quote',
            group: 'block'
        },
        {
            icon: <Bold className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            title: 'Bold',
            group: 'mark'
        },
        {
            icon: <Italic className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            title: 'Italic',
            group: 'mark'
        },
        {
            icon: <UnderlineIcon className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: editor.isActive('underline'),
            title: 'Underline',
            group: 'mark'
        },
        {
            icon: <Strikethrough className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
            title: 'Strike',
            group: 'mark'
        },
        {
            icon: <Code className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: editor.isActive('code'),
            title: 'Code',
            group: 'mark'
        },
        {
            icon: <RemoveFormatting className="w-4 h-4" />,
            action: () => editor.chain().focus().unsetAllMarks().run(),
            title: 'Clear Formatting',
            group: 'mark'
        },
        {
            icon: <LinkIcon className="w-4 h-4" />,
            action: setLink,
            isActive: editor.isActive('link'),
            title: 'Link',
            group: 'insert'
        },
        {
            icon: <ImageIcon className="w-4 h-4" />,
            action: addImage,
            isActive: editor.isActive('image'),
            title: 'Image',
            group: 'insert'
        },
        {
            icon: <SubscriptIcon className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleSubscript().run(),
            isActive: editor.isActive('subscript'),
            title: 'Subscript',
            group: 'format'
        },
        {
            icon: <SuperscriptIcon className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleSuperscript().run(),
            isActive: editor.isActive('superscript'),
            title: 'Superscript',
            group: 'format'
        },
        {
            icon: <AlignLeft className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: editor.isActive({ textAlign: 'left' }),
            title: 'Align Left',
            group: 'align'
        },
        {
            icon: <AlignCenter className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: editor.isActive({ textAlign: 'center' }),
            title: 'Align Center',
            group: 'align'
        },
        {
            icon: <AlignRight className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: editor.isActive({ textAlign: 'right' }),
            title: 'Align Right',
            group: 'align'
        },
        {
            icon: <AlignJustify className="w-4 h-4" />,
            action: () => editor.chain().focus().setTextAlign('justify').run(),
            isActive: editor.isActive({ textAlign: 'justify' }),
            title: 'Justify',
            group: 'align'
        },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl sticky top-0 z-10">
            {buttons.map((btn, index) => (
                <>
                    {index > 0 && buttons[index - 1].group !== btn.group && (
                        <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                    )}
                    <button
                        key={index}
                        onClick={btn.action}
                        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${btn.isActive
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                        title={btn.title}
                        type="button"
                    >
                        {btn.icon}
                    </button>
                </>
            ))}
        </div>
    );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Subscript,
            Superscript,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    return (
        <div className="border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all bg-white shadow-sm overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
