import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  email: string
  name: string
  credits: number
  plan: string
  trial_used: boolean  // true se l'utente ha già usato il Trial (one-time only)
}

interface UserContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoginOpen: boolean
  openLogin: () => void
  closeLogin: () => void
  isPricingOpen: boolean
  openPricing: () => void
  closePricing: () => void
  updateCredits: (newCredits: number) => void
  hasWatermark: boolean // true for free/trial users
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)

  const login = (newUser: User) => {
    // Set default credits for new users (84 = 1 video 4s 480p OR 21 images Lite)
    setUser({
      ...newUser,
      credits: newUser.credits ?? 84,
      plan: newUser.plan ?? 'free',
      trial_used: newUser.trial_used ?? false
    })
    setIsLoginOpen(false)
  }

  const logout = () => {
    setUser(null)
  }

  const openLogin = () => setIsLoginOpen(true)
  const closeLogin = () => setIsLoginOpen(false)

  const openPricing = () => setIsPricingOpen(true)
  const closePricing = () => setIsPricingOpen(false)

  const updateCredits = (newCredits: number) => {
    if (user) {
      setUser({ ...user, credits: newCredits })
    }
  }

  // Watermark only for free users (not paid)
  const hasWatermark = user ? user.plan === 'free' : true

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      isLoginOpen,
      openLogin,
      closeLogin,
      isPricingOpen,
      openPricing,
      closePricing,
      updateCredits,
      hasWatermark
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
