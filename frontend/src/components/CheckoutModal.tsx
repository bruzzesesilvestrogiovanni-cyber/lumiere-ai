import { useState } from 'react'

interface Plan {
  id: string
  name: string
  price: string
  period: string
  totalCredits: number
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  userEmail: string
}

export default function CheckoutModal({ isOpen, onClose, plan, userEmail }: CheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen || !plan) return null

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simula elaborazione pagamento
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsSuccess(true)
  }

  const handleClose = () => {
    setCardNumber('')
    setExpiry('')
    setCvc('')
    setCardName('')
    setIsSuccess(false)
    onClose()
  }

  if (isSuccess) {
    return (
      <div className="checkout-modal-overlay" onClick={handleClose}>
        <div className="checkout-modal success" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3ECFB4" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Payment Successful!</h2>
          <p>Welcome to <strong>{plan.name}</strong> plan</p>
          <p className="success-credits">{plan.totalCredits.toLocaleString()} credits added to your account</p>
          <button className="checkout-btn-primary" onClick={handleClose}>
            Start Creating
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-modal-overlay" onClick={handleClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal-close" onClick={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="checkout-header">
          <h2>Complete your purchase</h2>
          <p>Subscribe to {plan.name} plan</p>
        </div>

        <div className="checkout-summary">
          <div className="summary-row">
            <span>{plan.name} Plan</span>
            <span>{plan.price} {plan.period}</span>
          </div>
          <div className="summary-row credits">
            <span>Credits included</span>
            <span>{plan.totalCredits.toLocaleString()}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>{plan.price}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-field">
            <label>Email</label>
            <input type="email" value={userEmail} disabled />
          </div>

          <div className="checkout-field">
            <label>Card number</label>
            <div className="card-input-wrapper">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <div className="card-icons">
                <svg width="24" height="16" viewBox="0 0 24 16">
                  <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                  <text x="12" y="11" fill="#fff" fontSize="8" textAnchor="middle">VISA</text>
                </svg>
                <svg width="24" height="16" viewBox="0 0 24 16">
                  <rect width="24" height="16" rx="2" fill="#EB001B"/>
                  <circle cx="9" cy="8" r="5" fill="#EB001B"/>
                  <circle cx="15" cy="8" r="5" fill="#F79E1B"/>
                  <path d="M12 4.5a5 5 0 0 0 0 7" fill="#FF5F00"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="checkout-row">
            <div className="checkout-field">
              <label>Expiry date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="checkout-field">
              <label>CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          <div className="checkout-field">
            <label>Name on card</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <button
            type="submit"
            className="checkout-btn-primary"
            disabled={isProcessing || !cardNumber || !expiry || !cvc || !cardName}
          >
            {isProcessing ? (
              <span className="processing">
                <span className="spinner" />
                Processing...
              </span>
            ) : (
              `Pay ${plan.price}`
            )}
          </button>
        </form>

        <p className="checkout-secure">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Secured by Stripe. Your payment information is encrypted.
        </p>
      </div>
    </div>
  )
}
