import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import PromoBanner from './components/PromoBanner'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import PromptBar from './components/PromptBar'
import Home from './pages/Home'
import ImagePage from './pages/ImagePage'
import VideoPage from './pages/VideoPage'
import CanvasPage from './pages/CanvasPage'
import Gallery from './pages/Gallery'
import PricingPage from './pages/PricingPage'
import InspirationPage from './pages/InspirationPage'
import AgentPage from './pages/AgentPage'
import AudioPage from './pages/AudioPage'
import ChatPage from './pages/ChatPage'
import AIAppsPage from './pages/AIAppsPage'
import ReferralPage from './pages/ReferralPage'

export default function App() {
  return (
    <UserProvider>
      <div className="app-container">
        <PromoBanner />
        <Header />
        <div className="app-body">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image" element={
              <main className="main-content">
                <ImagePage />
              </main>
            } />
            <Route path="/video" element={
              <main className="main-content">
                <VideoPage />
              </main>
            } />
            <Route path="/agent" element={
              <main className="main-content">
                <AgentPage />
              </main>
            } />
            <Route path="/audio" element={
              <main className="main-content">
                <AudioPage />
              </main>
            } />
            <Route path="/chat" element={
              <main className="main-content">
                <ChatPage />
              </main>
            } />
            <Route path="/ai-apps" element={
              <main className="main-content">
                <AIAppsPage />
              </main>
            } />
            <Route path="/canvas" element={
              <main className="main-content">
                <CanvasPage />
              </main>
            } />
            <Route path="/gallery" element={
              <main className="main-content">
                <Gallery />
              </main>
            } />
            <Route path="/inspiration" element={
              <main className="main-content">
                <InspirationPage />
              </main>
            } />
            <Route path="/pricing" element={
              <main className="main-content">
                <PricingPage />
              </main>
            } />
            <Route path="/referral" element={
              <main className="main-content">
                <ReferralPage />
              </main>
            } />
          </Routes>
        </div>
        <PromptBar credits={84} />
      </div>
    </UserProvider>
  )
}
