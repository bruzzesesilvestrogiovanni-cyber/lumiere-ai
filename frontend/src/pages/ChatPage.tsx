import { useState } from 'react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI creative assistant. I can help you brainstorm ideas, refine prompts, or answer questions about AI generation. What would you like to create today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Mock AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const responses = [
      "That's a great idea! Here's how I'd approach it: Start with a clear subject, add atmospheric details, then specify the style you want.",
      "I love that concept! For best results, try adding details about lighting, camera angle, and mood.",
      "Interesting! You might want to experiment with different styles like 'cinematic', 'photorealistic', or 'anime' to see what works best.",
      "Great prompt! Consider adding negative prompts to avoid unwanted elements in your generation.",
    ]

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
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
          <p>Your creative assistant</p>
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

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="Ask me anything about AI generation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
