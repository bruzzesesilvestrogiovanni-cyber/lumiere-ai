import { useState } from 'react'

export default function PromoBanner() {
  const [visible, setVisible] = useState(true)

  const handleGetBonus = () => {
    alert('Bonus claimed! 100 free credits added.')
  }

  if (!visible) return null

  return (
    <div className="promo-banner">
      <span className="promo-badge">Exclusive Bonus</span>
      <span className="promo-text">
        UP TO <strong>50% OFF MONTHLY PLANS</strong> - Get 7 minutes of Seedance 2.5 in 480p for free
      </span>
      <button className="promo-cta" onClick={handleGetBonus}>
        Get bonus <span>↗</span>
      </button>
      <button className="promo-close" onClick={() => setVisible(false)}>×</button>
    </div>
  )
}
