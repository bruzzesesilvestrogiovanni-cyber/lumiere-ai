import { useNavigate } from 'react-router-dom'

const TEMPLATES = [
  { id: 1, name: 'Ritratto cinematico', prompt: 'Ritratto ultra realistico, luce cinematografica, 85mm' },
  { id: 2, name: 'Prodotto adv', prompt: 'Foto prodotto su sfondo studio, lighting professionale' },
  { id: 3, name: 'Drone landscape', prompt: 'Vista aerea dronica di montagne all alba, 4k' },
  { id: 4, name: 'Animazione logo', prompt: 'Animazione fluida di particelle che formano uno sfondo' },
]

export default function Templates() {
  const nav = useNavigate()
  return (
    <>
      <div className="topbar"><h2>Template</h2></div>
      <div className="templates">
        {TEMPLATES.map(t => (
          <div className="template" key={t.id} onClick={() => nav('/canvas', { state: t })}>
            <div className="thumb" />
            <strong>{t.name}</strong>
          </div>
        ))}
      </div>
    </>
  )
}
