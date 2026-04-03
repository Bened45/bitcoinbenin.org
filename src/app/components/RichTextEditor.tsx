'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'align',
  'blockquote',
  'code-block',
  'link',
  'image',
  'video',
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Rédigez votre article ici...',
  className = '',
}: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-brand-dark border border-white/10 rounded-lg text-white"
      />
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: rgba(30, 30, 40, 0.8) !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }

        .rich-text-editor .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 1rem !important;
          min-height: 300px !important;
        }

        .rich-text-editor .ql-editor {
          color: #ffffff !important;
          background: rgba(20, 20, 30, 0.6) !important;
          min-height: 300px !important;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.3) !important;
          font-style: normal !important;
        }

        .rich-text-editor .ql-stroke {
          stroke: #e5e7eb !important;
        }

        .rich-text-editor .ql-fill {
          fill: #e5e7eb !important;
        }

        .rich-text-editor .ql-picker-label {
          color: #e5e7eb !important;
        }

        .rich-text-editor .ql-picker-options {
          background: #1e1e28 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .rich-text-editor .ql-picker-options .ql-picker-label {
          color: #e5e7eb !important;
        }

        .rich-text-editor .ql-active .ql-stroke {
          stroke: #22c55e !important;
        }

        .rich-text-editor .ql-active .ql-fill {
          fill: #22c55e !important;
        }

        .rich-text-editor .ql-active .ql-picker-label {
          color: #22c55e !important;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar .ql-picker-label:hover .ql-stroke {
          stroke: #22c55e !important;
        }

        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar .ql-picker-label:hover .ql-fill {
          fill: #22c55e !important;
        }

        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar .ql-picker-label:hover {
          color: #22c55e !important;
        }

        .rich-text-editor .ql-snow .ql-tooltip {
          background: #1e1e28 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #e5e7eb !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
        }

        .rich-text-editor .ql-snow .ql-tooltip input[type='text'] {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: rgba(20, 20, 30, 0.8) !important;
          color: #ffffff !important;
        }

        .rich-text-editor .ql-snow .ql-tooltip a {
          color: #22c55e !important;
        }
      `}</style>
    </div>
  );
}
