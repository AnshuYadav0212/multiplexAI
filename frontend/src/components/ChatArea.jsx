import React from 'react'
import Navbar from './Navbar'
import MessageList from './MessageList'
import getMessages from "../features/getMessages.js";
import ChatInput from './ChatInput'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages, setArtifacts } from '../redux/messageSlice'

function ChatArea() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  useEffect(() => {
    const getMess = async () => {

      if (selectedConversation) {
        if (selectedConversation.title == "New Chat") return;
        const data = await getMessages(selectedConversation?._id)
        console.log(data);
        dispatch(setMessages(data || []))
        const latestArtifactMessage = [...data].reverse().find(msg => msg.artifacts.length > 0)
        dispatch(setArtifacts(latestArtifactMessage.artifacts || []))
      }
    }
    getMess()
  }, [selectedConversation?._id, dispatch])
  return (
    <div className='flex-1 min-w-0 flex flex-col'>
      <Navbar />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea