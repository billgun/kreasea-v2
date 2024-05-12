'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './menu-bar';
import { Control, useController } from 'react-hook-form';
import Link from '@tiptap/extension-link';

//TODO: Fix editor for use
// Code Function
interface EditorProps {
  name: string;
  control: Control<any>;
  content: string;
}

const Editor = ({ name, control, content }: EditorProps) => {
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid },
  } = useController({ name, control });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      Link,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose prose-p:m-0 prose-h1:my-2 prose-h2:my-2 prose-h3:my-2 prose-h4:my-2 prose-h5:my-2 prose-h6:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:m-0  prose-hr:m-4 min-h-[80px] max-w-full w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='w-full'>
      <div className='mb-2 flex flex-wrap'>
        <MenuBar editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;