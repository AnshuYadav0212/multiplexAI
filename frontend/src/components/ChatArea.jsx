import React from 'react'
import Navbar from './Navbar'
import MessageList from './MessageList'
import getMessages from "../features/getMessages.js";
import ChatInput from './ChatInput'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../redux/messageSlice'

function ChatArea() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()
  useEffect(() => {
    const getMess = async () => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation?._id)
        dispatch(setMessages(data))
      }

    }
    getMess()
  }, [selectedConversation])
  return (
    <div className='flex-1 flex flex-col'>

      <Navbar />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea