"use client"

import { useState, useEffect } from 'react'
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'

interface EditorProps {
    value: string
    onChange: (content: string) => void
}

export const Editor = ({ value, onChange }: EditorProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-64 bg-[#1C1C24] text-white p-2 rounded"
            />
        )
    }

    return (
        <TinyMCEEditor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'link image media | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                link_context_toolbar: true,
                default_link_target: '_blank',
            }}
            value={value}
            onEditorChange={onChange}
        />
    )
}