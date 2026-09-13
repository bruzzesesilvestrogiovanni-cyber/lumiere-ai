import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'

export default function ReferralPage() {
  const { t } = useTranslation()
  const { user } = useUser()
  const [copied, setCopied] = useState(false)

  // Generate unique referral code based on user
  const referralCode = user ? btoa(user.email).slice(0, 8).toUpperCase() : 'GUEST123'
  const referralLink = `https://lumiere-ai.com/signup?ref=${referralCode}`

  // Mock stats - in production these would come from API
  const stats = {
    linkClicks: 47,
    registered: 12,
    subscribed: 5,
    creditsEarned: 850,
    pendingCredits: 150
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = (platform: string) => {
    const text = t('referral.shareText', { link: referralLink })
    const encodedText = encodeURIComponent(text)
    const encodedLink = encodeURIComponent(referralLink)

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
      email: `mailto:?subject=${encodeURIComponent(t('referral.emailSubject'))}&body=${encodedText}`
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="referral-page">
      <div className="referral-header">
        <div className="referral-header-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h1>{t('referral.title')}</h1>
        <p className="referral-subtitle">{t('referral.subtitle')}</p>
      </div>

      {/* Referral Link Generator */}
      <div className="referral-card referral-generator">
        <h2>{t('referral.yourLink')}</h2>
        <div className="referral-link-box">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="referral-link-input"
          />
          <button
            className={`referral-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t('referral.copied')}
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {t('referral.copy')}
              </>
            )}
          </button>
        </div>

        <div className="referral-code-display">
          <span className="referral-code-label">{t('referral.yourCode')}</span>
          <span className="referral-code">{referralCode}</span>
        </div>

        <div className="referral-share-section">
          <p>{t('referral.shareVia')}</p>
          <div className="referral-share-buttons">
            <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')} title="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button className="share-btn twitter" onClick={() => handleShare('twitter')} title="Twitter/X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button className="share-btn facebook" onClick={() => handleShare('facebook')} title="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="share-btn linkedin" onClick={() => handleShare('linkedin')} title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button className="share-btn email" onClick={() => handleShare('email')} title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="referral-card referral-stats">
        <h2>{t('referral.yourStats')}</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon clicks">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
              </svg>
            </div>
            <div className="stat-value">{stats.linkClicks}</div>
            <div className="stat-label">{t('referral.clicks')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon registered">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div className="stat-value">{stats.registered}</div>
            <div className="stat-label">{t('referral.registered')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon subscribed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="stat-value">{stats.subscribed}</div>
            <div className="stat-label">{t('referral.subscribed')}</div>
          </div>
          <div className="stat-item highlight">
            <div className="stat-icon credits">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
              </svg>
            </div>
            <div className="stat-value">{stats.creditsEarned.toLocaleString()}</div>
            <div className="stat-label">{t('referral.creditsEarned')}</div>
          </div>
        </div>
        {stats.pendingCredits > 0 && (
          <div className="pending-credits">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {t('referral.pendingCredits', { amount: stats.pendingCredits })}
          </div>
        )}
      </div>

      {/* Rewards Table */}
      <div className="referral-card referral-rewards">
        <h2>{t('referral.rewards')}</h2>
        <div className="rewards-table">
          <div className="rewards-row header">
            <div className="rewards-cell">{t('referral.event')}</div>
            <div className="rewards-cell">{t('referral.youGet')}</div>
            <div className="rewards-cell">{t('referral.friendGets')}</div>
          </div>
          <div className="rewards-row">
            <div className="rewards-cell">
              <span className="event-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </span>
              {t('referral.friendRegisters')}
            </div>
            <div className="rewards-cell reward">+50 credits</div>
            <div className="rewards-cell reward">+50 credits</div>
          </div>
          <div className="rewards-row">
            <div className="rewards-cell">
              <span className="event-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </span>
              {t('referral.friendSubscribes')}
            </div>
            <div className="rewards-cell reward">+100 credits</div>
            <div className="rewards-cell reward">-</div>
          </div>
          <div className="rewards-row highlight">
            <div className="rewards-cell">
              <span className="event-icon recurring">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </span>
              {t('referral.friendRenews')}
            </div>
            <div className="rewards-cell reward recurring">10% {t('referral.inCredits')}</div>
            <div className="rewards-cell reward">-</div>
          </div>
        </div>
        <p className="rewards-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {t('referral.recurringNote')}
        </p>
      </div>

      {/* How It Works */}
      <div className="referral-card referral-how-it-works">
        <h2>{t('referral.howItWorks')}</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>{t('referral.step1Title')}</h3>
              <p>{t('referral.step1Desc')}</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>{t('referral.step2Title')}</h3>
              <p>{t('referral.step2Desc')}</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>{t('referral.step3Title')}</h3>
              <p>{t('referral.step3Desc')}</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>{t('referral.step4Title')}</h3>
              <p>{t('referral.step4Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="referral-terms">
        <p>{t('referral.terms')}</p>
      </div>
    </div>
  )
}
