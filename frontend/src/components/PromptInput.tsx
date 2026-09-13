import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showNegative?: boolean
  negativeValue?: string
  onNegativeChange?: (value: string) => void
}

const SUGGESTIONS = [
  'cinematic lighting',
  'ultra realistic',
  '8k resolution',
  'detailed textures',
  'professional photography',
  'dramatic shadows',
  'vibrant colors',
  'soft focus background',
]

export default function PromptInput({
  value,
  onChange,
  placeholder,
  showNegative = false,
  negativeValue = '',
  onNegativeChange,
}: PromptInputProps) {
  const { t } = useTranslation()
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addSuggestion = (suggestion: string) => {
    const separator = value.trim() ? ', ' : ''
    onChange(value + separator + suggestion)
  }

  return (
    <div className="prompt-input-container">
      <div className="prompt-input-wrapper">
        <label className="prompt-label">{t('prompt.label')}</label>
        <textarea
          className="prompt-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('prompt.placeholder')}
          rows={4}
        />
        <button
          className="prompt-suggestions-toggle"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          {showSuggestions ? t('prompt.hideSuggestions') : t('prompt.showSuggestions')}
        </button>
        {showSuggestions && (
          <div className="prompt-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="prompt-suggestion" onClick={() => addSuggestion(s)}>
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {showNegative && (
        <div className="prompt-input-wrapper">
          <label className="prompt-label">{t('prompt.negativeLabel')}</label>
          <textarea
            className="prompt-textarea negative"
            value={negativeValue}
            onChange={(e) => onNegativeChange?.(e.target.value)}
            placeholder={t('prompt.negativePlaceholder')}
            rows={2}
          />
        </div>
      )}
    </div>
  )
}
