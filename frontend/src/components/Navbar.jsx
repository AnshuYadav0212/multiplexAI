import { MessageSquare } from 'lucide-react'
import { useSelector } from 'react-redux'
import React from 'react'

function Navbar() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)
    return (
        <>
            {selectedConversation &&
                <div className='h-14 flex items-center  px-5 gap-2.5 border-buttom border-white/[0.06] bg-[#2d313b]'>
                    <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/100 ' >
                        <MessageSquare size={13} className='text-indigo-400' />
                    </div>
                    <div className=' test-[15px] font-semibold tracking-tight text-white text-slate-400'>
                        {selectedConversation?.title || "New Chat"}
                    </div>
                    <div className='test-[15px] font-semibold text-slate-500  bg-white/[0.04] border border-white/[0.06] px-3 py-0.5 rounded-full'>
                        {
                            messages?.length
                        } Messages
                    </div>

                </div>
            }
        </>
    )
}

export default Navbar