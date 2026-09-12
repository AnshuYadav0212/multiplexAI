import React from 'react'
import Markdown from 'react-markdown'

function MessageBubble({ role, content }) {
    const isUser = role == "user"


    return (
        <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed 
          ${isUser ? "bg-linear-to-br from-indigo-400 to-violet-500 text-white rounded-tr-sm"
                    : "bg-white/4 border border-white/7 text-slate-300 rounded-tl-sm"} `}>
                <Markdown>
                    {content}
                </Markdown>
            </div>
        </div>
    );
};

export default MessageBubble