import { useState } from 'react'
import { User } from '../context/UserContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin?: (user: User) => void
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [view, setView] = useState<'main' | 'iam'>('main')
  const [email, setEmail] = useState('')
  const [mainAccount, setMainAccount] = useState('')
  const [subAccount, setSubAccount] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setView('main')
    setEmail('')
    setMainAccount('')
    setSubAccount('')
    setPassword('')
    onClose()
  }

  const handleSuccessLogin = (userEmail: string, userName: string) => {
    if (onLogin) {
      onLogin({ email: userEmail, name: userName, credits: 0, plan: 'free' })
    }
    handleClose()
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // Mock login
    handleSuccessLogin(email, email.split('@')[0])
  }

  const handleGoogleLogin = () => {
    // Mock Google login - in produzione integra con Google OAuth
    const mockGoogleUser = {
      email: 'user@gmail.com',
      name: 'Google User'
    }
    handleSuccessLogin(mockGoogleUser.email, mockGoogleUser.name)
  }

  const handleIAMLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mainAccount.trim() || !subAccount.trim() || !password.trim()) return
    handleSuccessLogin(`${subAccount}@${mainAccount}`, subAccount)
  }

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {view === 'main' ? (
          <>
            <h2 className="login-modal-title">Sign in or sign up</h2>

            <form onSubmit={handleContinue}>
              <div className="login-field">
                <label>Username/Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  autoFocus
                />
              </div>

              <button type="submit" className="login-btn-primary">
                Continue
              </button>
            </form>

            <button
              className="login-iam-link"
              onClick={() => setView('iam')}
            >
              Login with IAM sub-account
            </button>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button className="login-btn-google" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="login-terms">
              By continuing, you agree to LUMIERE AI{' '}
              <a href="#">Customer Agreement</a>,{' '}
              <a href="#">Terms of Service</a> and acknowledge that you have read our{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </>
        ) : (
          <>
            <h2 className="login-modal-title">IAM user sign in</h2>

            <form onSubmit={handleIAMLogin}>
              <div className="login-field">
                <label>Main account username</label>
                <input
                  type="text"
                  value={mainAccount}
                  onChange={(e) => setMainAccount(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label>Sub account username</label>
                <input
                  type="text"
                  value={subAccount}
                  onChange={(e) => setSubAccount(e.target.value)}
                />
              </div>

              <div className="login-field">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button type="submit" className="login-btn-primary">
                Sign in
              </button>
            </form>

            <button
              className="login-back-link"
              onClick={() => setView('main')}
            >
              Back to root user sign in
            </button>

            <a href="#" className="login-forgot-link">
              Forgot your password?
            </a>
          </>
        )}
      </div>
    </div>
  )
}
