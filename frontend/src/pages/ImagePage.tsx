import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'
import ModelSelector, { IMAGE_MODELS } from '../components/ModelSelector'
import PromptInput from '../components/PromptInput'
import ImageUploader from '../components/ImageUploader'
import GenerationOptions from '../components/GenerationOptions'

// Placeholder gradients for mock results
const RESULT_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
]

export default function ImagePage() {
  const { t } = useTranslation()
  const { user, openLogin, openPricing, updateCredits, hasWatermark } = useUser()

  const [model, setModel] = useState('seedream_5_pro')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [style, setStyle] = useState('auto')
  const [quality, setQuality] = useState('hd')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const selectedModel = IMAGE_MODELS.find((m) => m.id === model)
  const creditsCost = selectedModel?.credits ?? 9
  const userCredits = user?.credits ?? 84
  const canAfford = userCredits >= creditsCost

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Check if user is logged in
    if (!user) {
      openLogin()
      return
    }

    // Check if user has enough credits
    if (!canAfford) {
      openPricing()
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      // Call backend API
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          aspect_ratio: aspectRatio,
          negative_prompt: negativePrompt || null,
        }),
      })

      if (response.status === 402) {
        openPricing()
        setIsGenerating(false)
        return
      }

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const data = await response.json()
      updateCredits(userCredits - creditsCost)
      setResult(data.image_base64 ? `data:image/png;base64,${data.image_base64}` : RESULT_GRADIENTS[0])
    } catch (error) {
      console.error('Error:', error)
      // Mock result for demo
      updateCredits(userCredits - creditsCost)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setResult(RESULT_GRADIENTS[Math.floor(Math.random() * RESULT_GRADIENTS.length)])
    }

    setIsGenerating(false)
  }

  return (
    <div className="generation-page">
      <div className="generation-header">
        <h1 className="section-title">{t('image.title')}</h1>
        <div className="generation-info-badges">
          <span className="generation-model-badge">
            {selectedModel?.icon} {selectedModel?.name}
          </span>
          {hasWatermark && (
            <span className="info-badge watermark" onClick={openPricing} style={{ cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {t('common.watermark')}
            </span>
          )}
          <span className={`info-badge credits ${!canAfford ? 'insufficient' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v12"/>
              <path d="M6 12h12"/>
            </svg>
            {creditsCost} {t('common.credits')} {!canAfford && `(${t('common.youHave')} ${userCredits})`}
          </span>
        </div>
      </div>

      <div className="generation-layout">
        <div className="generation-controls">
          <div className="generation-section">
            <h3 className="generation-section-title">{t('image.selectModel')}</h3>
            <ModelSelector models={IMAGE_MODELS} selected={model} onSelect={setModel} />
          </div>

          <div className="generation-section">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              placeholder={t('image.promptPlaceholder')}
              showNegative
              negativeValue={negativePrompt}
              onNegativeChange={setNegativePrompt}
            />
          </div>

          <div className="generation-section">
            <h3 className="generation-section-title">{t('image.referenceImage')}</h3>
            <ImageUploader
              preview={referenceImage || undefined}
              onUpload={(_, preview) => setReferenceImage(preview)}
              onClear={() => setReferenceImage(null)}
            />
          </div>

          <div className="generation-section">
            <h3 className="generation-section-title">{t('image.options')}</h3>
            <GenerationOptions
              type="image"
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              style={style}
              onStyleChange={setStyle}
              quality={quality}
              onQualityChange={setQuality}
            />
          </div>

          <button
            className={`generate-btn ${!canAfford ? 'upgrade-required' : ''}`}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="generate-spinner" />
                {t('image.generating')}
              </>
            ) : !canAfford ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                {t('image.upgradeToGenerate')}
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                {t('image.generateWithCredits', { credits: creditsCost })}
              </>
            )}
          </button>

          {!canAfford && !isGenerating && (
            <div className="credits-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {t('image.insufficientCredits', { have: userCredits, need: creditsCost })}
            </div>
          )}
        </div>

        <div className="generation-preview">
          <div className="preview-container">
            {result ? (
              <div className="preview-result" style={{ background: result }}>
                <div className="preview-actions">
                  <button
                    className="preview-action-btn"
                    onClick={() => {
                      alert(t('image.downloadStarted'))
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    {t('common.download')}
                  </button>
                  <button
                    className="preview-action-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(prompt).then(() => {
                        alert(t('image.promptCopied'))
                      }).catch((err) => {
                        console.error('Error copying:', err)
                        alert(t('image.copyError'))
                      })
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    {t('common.copy')}
                  </button>
                  <button className="preview-action-btn" onClick={() => setResult(null)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    {t('image.regenerate')}
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="preview-loading">
                <div className="loading-spinner" />
                <span>{t('image.creating')}</span>
              </div>
            ) : (
              <div className="preview-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>{t('image.previewPlaceholder')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
