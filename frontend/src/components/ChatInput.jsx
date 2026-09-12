import { Code2, FileText, Globe, Icon, ImageIcon, MessageSquare, Mic, Paperclip, Presentation, Send, Zap } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConversationTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'

function ChatInput() {
    const [value, setValue] = useState("")
    const { selectedConversation } = useSelector(state => state.conversation)
    const [selectedAgent, setSelectedAgent] = useState("Auto")
    const { messages } = useSelector(state => state.message)
    const dispatch = useDispatch()
    const handleSendMessage = async () => {
        console.log("Selected conversation:", selectedConversation);
        let convers = selectedConversation
        if (!convers) {
            const conversation = await createConversation()
            dispatch(setSelectedConversation(conversation))
            dispatch(addConversation(conversation))
            convers = conversation
        }
        if (convers.title == "New Chat") {
            await updateConversation({ conversationId: convers?._id, title: value.trim() })
            dispatch(setConversationTitle({ conversationId: convers?._id, title: value.trim() }))

        }
        const payload = {
            prompt: value.trim(), conversationId: convers?._id
        }

        dispatch(addMessage({ role: "user", content: value.trim() }))
        setValue("")
        const data = await sendMessage(payload)
        dispatch(addMessage({ role: "assistant", content: data }))
        console.log(data)
    }
    const agents = [
        { id: "auto", icon: Zap, label: "Auto" },
        { id: "chat", icon: MessageSquare, label: "chat" },
        { id: "code", icon: Code2, label: "code" },
        { id: "pdf", icon: FileText, label: "PDF" },
        { id: "ppt", icon: Presentation, label: "PPT" },
        { id: "visual", icon: ImageIcon, label: "Visual" },
        { id: "search", icon: Globe, label: "Search" },
    ]

    return (
        <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0e0e0e]'>
            <div className='flex flex-col gap-2 bg-white/3 border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
                <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
                    {agents.map((agent) => {
                        const isActive = selectedAgent == agent.label
                        const Icon = agent.icon
                        return (
                            <div className={`
                                
                                shrink-0
                                inline-flex
                                items-center
                                gap-2 cursor-pointer mb-0.5 
                                px-3
                                py-2.5 
                                rounded-full
                                text-xs
                                font-medium
                                border 
                                transition-all
                                
                                    ${isActive ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white border-indigo-500/18 shadow-[0_1px_8px_rgba(99,100,200,0.5)"
                                    : "text-slate-400 bg-white/3 border-white/6 hover:bg-white/7"}`}
                            >

                                <Icon size={15}
                                    className={
                                        isActive ? "text-white" : "text-slate-400"
                                    }

                                />

                                {agent.label}

                            </div>
                        );
                    })}
                </div>

                <textarea placeholder='Ask Here...'
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    className='w-full  text-slate-200 outline-none resize-none text-[15px] placeholder:text-slate-600 
              leading-relaxed [scrollbar-none] [&::-webkit-scrollbar]:hidden disabled:opacity-50' row={4} />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='flex items-center justify-center gap-5 w-6 h-6 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer'>
                            <Paperclip size={17} />
                        </button>
                        <button className='flex items-center justify-center w-6 h-6 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer'>
                            <Mic size={17} />
                        </button>
                    </div>
                    <button disabled={!value}
                        onClick={handleSendMessage}
                        className={`flex items-center justify-center w-8 h-8 border-none transition-all duration-150 cursor-pointer rounded-lg ${value.trim() ? " text-slate-200 hover:text-slate-400 from-indigo-500 hover:bg-white/5 border border-transparent hover:opacity-90 bg-linear-to-br" : "  text-slate-500   cursor-not-allowed bg-white/5 "}`}>
                        <Send size={17} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput