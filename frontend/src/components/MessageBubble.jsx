import React from 'react'
import { useState } from 'react';
import Markdown from 'react-markdown'
import { Check, Copy, ExternalLink, X } from 'lucide-react'
import remarkLinkifyRegex from 'remark-linkify-regex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import remarkGfm from 'remark-gfm'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';



function MessageBubble({ role, content, images }) {
    const isUser = role == "user"
    const [lightBox, setLightBox] = useState(null)
    const [copiedCode, setCopiedCode] = useState("")

    const copyCode = async (code) => {
        await navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => {
            setCopiedCode("")
        }, 2000)
    }

    const formattedContent = content?.replace(
        /`(https?:\/\/[^\s`]+)`/g,
        '[$1]($1)'
    );


    return (
        <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={` px-4 py-2.5 rounded-2xl overflow-hidden wrap-break-words leading-relaxed 
          ${isUser ? "bg-linear-to-br from-indigo-400 to-violet-500 text-white rounded-tr-sm"
                    : " text-slate-300 rounded-tl-sm"} `}>

                {images?.length > 0 && (
                    <div className='flex flex-wrap gap-3 mt-4 space-x-3'>
                        {
                            images.map((img, i) => (
                                <img key={i}
                                    src={img}
                                    onClick={() => setLightBox(img)}
                                    loading="lazy"
                                    onError={(e) => e.currentTarget.remove()}
                                    className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in
                                hover:opacity-90 transition"
                                />
                            ))
                        }

                    </div>
                )}
                <Markdown remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className='text-2xl font-bold mt-5 mb-4'>
                                {children}
                            </h1>),
                        h2: ({ children }) => (<h2 className='text-xl font-semibold mt-4 mb-3'>
                            {children}
                        </h2>),
                        h3: ({ children }) => (<h3 className='text-xl font-semibold mt-3 mb-2'>
                            {children}
                        </h3>),
                        p: ({ children }) => (
                            <p className='mb-3 whitespace-pre-wrap break-word'>{children}</p>
                        ),
                        ul: ({ children }) => (
                            <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
                        ),
                        table: ({ children }) => (
                            <div className='overflow-x-auto my-4'>
                                <table className='min-w-full border border-white/10'>{children}</table>
                            </div>
                        ),
                        th: ({ children }) => (

                            <th className='bg-white/5 px-3 py-2 text-left border border-white/10'>{children}</th>

                        ),
                        td: ({ children }) => (

                            <td className=' px-3 py-2 border border-white/10'>{children}</td>

                        ),
                        a: ({ href, children }) => (
                            <a href={href}
                                target="_blank"
                                rel="noreferrer"
                                className='text-indigo-300 underline inline-flex items-center gap-1'>
                                {children}
                                <ExternalLink size={15} />
                            </a>
                        ),
                        code: ({ className, children }) => {
                            const value = String(children).trim();
                            if (!className) {
                                return (
                                    <code className='px-1.5 py-0.5 rounded bg-white/15 text-indigo-300'>
                                        {value}
                                    </code>
                                )
                            }
                            const language = className?.replace("language-", "")
                            return (
                                <div className='my-4 overflow-hidden roudned-xl border border-white/10 bg-[#111333]'>
                                    <div className='flex items-center justify-between bg-[#353635] border-b borde-white/15 px-4 py-2'>
                                        <span className='uppercase text-xs text-slate-400'>
                                            {language}
                                        </span>
                                        <button className='flex items-center gap-1 test-xs' onClick={() => copyCode(value)}>
                                            {
                                                copiedCode == value ? <> <Check /> Copied</> : <> <Copy size={15} /> </>
                                            }
                                        </button>
                                    </div>
                                    <SyntaxHighlighter
                                        language={language}
                                        style={oneDark}

                                        wrapLongLines
                                        showLineNumbers
                                        customStyle={{
                                            margin: 0,
                                            padding: "16px",
                                            background: "#0d1117",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {value}
                                    </SyntaxHighlighter>


                                </div>
                            )
                        }


                    }}

                >
                    {formattedContent}
                </Markdown>
            </div>
            {
                lightBox && <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center '>
                    <button
                        className='absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 rounded-full p-2 '
                        onClick={() => setLightBox(null)}>
                        <X />
                    </button>
                    <img
                        src={lightBox}
                        className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
                    />


                </div>
            }

        </div >
    );
};

export default MessageBubble