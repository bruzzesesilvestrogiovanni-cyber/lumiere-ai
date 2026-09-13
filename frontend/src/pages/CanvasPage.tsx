import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, Generation } from '../api'

export default function CanvasPage() {
  const location = useLocation()
  const tpl = (location.state as any)?.prompt as string | undefined
  const [kind, setKind] = useState<'image' | 'video'>('image')
  const [prompt, setPrompt] = useState(tpl || '')
  const [seconds, setSeconds] = useState(5)
  const [ratio, setRatio] = useState('16:9')
  const [gen, setGen] = useState<Generation | null>(null)
  const [busy, setBusy] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval>>()

  const poll = (id: number) => {
    timer.current = setInterval(async () => {
      const g: Generation = await api.get(id)
      setGen(g)
      if (g.status !== 'pending') { clearInterval(timer.current); setBusy(false) }
    }, 3000)
  }

  const generate = async () => {
    setBusy(true)
    try {
      const g: Generation = await api.create({ kind, prompt, seconds, ratio })
      setGen(g)
      if (g.status === 'pending') poll(g.id); else setBusy(false)
    } catch (e: any) { alert(e.message); setBusy(false) }
  }

  return (
    <>
      <div className="topbar">
        <h2>Canvas AI</h2>
        <span className="pill">{kind === 'image' ? 'Seedream' : 'Seedance 2.5'}</span>
      </div>
      <div className="canvas-grid-legacy">
        <div className="panel">
          <h3>TIPO DI CONTENUTO</h3>
          <select value={kind} onChange={e => setKind(e.target.value as any)} style={{ marginBottom: 14 }}>
            <option value="image">🖼 Immagine</option>
            <option value="video">🎬 Video</option>
          </select>
          <h3>PROMPT</h3>
          <textarea placeholder="Descrivi cio che vuoi creare..." value={prompt}
            onChange={e => setPrompt(e.target.value)} />
          {kind === 'video' && (
            <>
              <h3 style={{ marginTop: 12 }}>DURATA</h3>
              <select value={seconds} onChange={e => setSeconds(+e.target.value)}>
                {[3, 5, 10].map(s => <option key={s} value={s}>{s} secondi</option>)}
              </select>
            </>
          )}
          <h3 style={{ marginTop: 12 }}>RAPPORTO</h3>
          <select value={ratio} onChange={e => setRatio(e.target.value)}>
            <option>16:9</option><option>9:16</option><option>1:1</option>
          </select>
          <button className="btn-primary" disabled={busy || !prompt} onClick={generate}>
            {busy ? 'Generazione in corso...' : 'Genera ✦'}
          </button>
        </div>
        <div className="preview">
          {gen?.status === 'done' && gen.result_url ? (
            kind === 'image'
              ? <img src={gen.result_url} alt="risultato" />
              : <video src={gen.result_url} controls autoPlay loop />
          ) : (
            <span className="placeholder">
              {gen?.status === 'pending' ? '⏳ Rendering video...' : 'Il risultato apparira qui'}
            </span>
          )}
        </div>
      </div>
    </>
  )
}
