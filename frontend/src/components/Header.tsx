import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUser } from '../context/UserContext'
import LoginModal from './LoginModal'

export default function Header() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { user, login, logout, isLoginOpen, openLogin, closeLogin } = useUser()
  const [giftOpen, setGiftOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(i18n.language || 'EN')
  const giftRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (giftRef.current && !giftRef.current.contains(e.target as Node)) {
        setGiftOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('lumiere-language', lang)
    setLangOpen(false)
  }

  return (
    <>
      <header className="header">
        <NavLink to="/" className="header-logo">
          <div className="header-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" fill="#3ECFB4" stroke="#3ECFB4"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </div>
          <span>LUMIERE AI</span>
        </NavLink>

        <div className="header-actions">
          {/* Help dropdown */}
          <div className="header-dropdown-wrapper" ref={helpRef}>
            <button className="header-btn" onClick={() => setHelpOpen(!helpOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {t('common.help')}
            </button>
            {helpOpen && (
              <div className="header-dropdown">
                <a href="https://docs.example.com" target="_blank" rel="noopener noreferrer" className="header-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  {t('common.documentation')}
                </a>
                <a href="mailto:support@lumiere-ai.com" className="header-dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {t('common.contactSupport')}
                </a>
                <button className="header-dropdown-item" onClick={() => { setHelpOpen(false); navigate('/chat'); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {t('common.aiAssistant')}
                </button>
              </div>
            )}
          </div>

          {/* Language dropdown */}
          <div className="header-dropdown-wrapper" ref={langRef}>
            <button className="header-btn-icon" onClick={() => setLangOpen(!langOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </button>
            {langOpen && (
              <div className="header-dropdown lang-dropdown">
                <button
                  className={`header-dropdown-item ${currentLang === 'EN' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('EN')}
                >
                  English
                </button>
                <button
                  className={`header-dropdown-item ${currentLang === 'IT' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('IT')}
                >
                  Italiano
                </button>
                <button
                  className={`header-dropdown-item ${currentLang === 'ES' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('ES')}
                >
                  Espanol
                </button>
                <button
                  className={`header-dropdown-item ${currentLang === 'DE' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('DE')}
                >
                  Deutsch
                </button>
              </div>
            )}
          </div>

          {/* Gift dropdown */}
          <div className="header-gift-wrapper" ref={giftRef}>
            <button
              className="header-btn-icon"
              onClick={() => setGiftOpen(!giftOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <line x1="12" y1="22" x2="12" y2="7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </button>

            {giftOpen && (
              <div className="gift-dropdown">
                <button className="gift-dropdown-item promo" onClick={() => { setGiftOpen(false); alert('Promo code: WELCOME50 - 50% off first month!'); }}>
                  {t('common.promoCode')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
                <button className="gift-dropdown-item invite" onClick={() => { setGiftOpen(false); navigate('/referral'); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {t('common.inviteFriends')}
                </button>
              </div>
            )}
          </div>

          <NavLink to="/pricing" className="header-btn header-pricing">
            <span className="header-pricing-badge">74% OFF</span>
            {t('common.pricing')}
          </NavLink>

          {user ? (
            <div className="header-user-wrapper" ref={userRef}>
              <button
                className="header-user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar large">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); alert('Profile settings coming soon!'); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {t('common.profile')}
                  </button>
                  <button className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); alert('Settings coming soon!'); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    {t('common.settings')}
                  </button>
                  <button className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); navigate('/gallery'); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                      <line x1="6" y1="6" x2="6.01" y2="6"/>
                      <line x1="6" y1="18" x2="6.01" y2="18"/>
                    </svg>
                    {t('common.myAssets')}
                  </button>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {t('common.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="header-login" onClick={openLogin}>
              {t('common.login')}
            </button>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onLogin={login}
      />
    </>
  )
}
