import React from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'

function MessageList() {

    const { selectedConversation } = useSelector(state => state.conversation)

    const { messages } = useSelector(state => state.message)
    return (
        <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-none] [&::-webkit-scrollbar]:hidden'>
            {
                messages.length == 0 || !selectedConversation ? (
                    <div className='h-full flex flex-col items-center justify-center gap-4 text-center'>
                        <div className='flex flex-col gap-1.5'>
                            <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'> MultiplexAI</h1>
                            <p className='text-[15px] font-semibold text-slate-400 tracking-tight'> Hi, How can I help you? </p>
                            <p className='text-[12px] max-w-65 text-slate-600 leading-relaxed'> Ask me anything...</p>
                        </div>
                        <div className='flex flex-wrap justify-center gap-4 mt-1'>
                            {["Write a Netflix clone and HLD and LLD", "Explain Redis", "Build a dashboard"].map((s) => (
                                <button key={s} className='text-[12px] text-slate-400 bg-white/4 border border-white/7 py-1.5 px-3 rounded-lg hover:bg-white/8 hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : <div>
                    {
                        messages.map((msg, i) => (
                            <div key={msg?._id || i}>
                                <MessageBubble role={msg?.role} content={msg?.content} />
                            </div>
                        ))
                    }
                </div>
            }

        </div>
    )
}

export default MessageList