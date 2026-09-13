import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface PromptBarProps {
  credits?: number
}

export default function PromptBar({ credits = 84 }: PromptBarProps) {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/canvas', { state: { prompt } })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="prompt-bar">
      <span className="prompt-bar-plus">+</span>
      <input
        className="prompt-bar-input"
        type="text"
        placeholder="Describe the scene you want to generate"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="prompt-bar-credits" onClick={handleSubmit}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        {credits}
      </button>
    </div>
  )
}
