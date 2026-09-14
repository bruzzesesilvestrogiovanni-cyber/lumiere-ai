import { useState } from 'react'
import { api } from '../api'
import { useUser } from '../context/UserContext'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { user, openLogin } = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI creative assistant powered by NVIDIA. I can help you brainstorm ideas, refine prompts, or answer questions about AI generation. What would you like to create today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return

    // Check if user is logged in
    if (!user) {
      openLogin()
      return
    }

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError('')

    try {
      // Prepare messages for API (exclude system message, include conversation history)
      const apiMessages = messages
        .filter(m => m.id !== 1) // Exclude initial greeting
        .concat(userMessage)
        .map(m => ({ role: m.role, content: m.content }))

      const response = await api.chat(apiMessages)

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      setError(err.message || 'Failed to get response')
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h1 className="section-title">AI Chat</h1>
          <p>Your creative assistant powered by NVIDIA</p>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder={user ? "Ask me anything about AI generation..." : "Sign in to chat..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={!user}
          />
          <button
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || !user}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        {!user && (
          <p className="chat-login-hint">
            <button onClick={openLogin} className="link-btn">Sign in</button> to start chatting
          </p>
        )}
      </div>
    </div>
  )
}
