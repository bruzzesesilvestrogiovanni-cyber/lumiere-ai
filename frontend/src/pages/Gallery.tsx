import { useEffect, useState } from 'react'
import { api, Generation } from '../api'

export default function Gallery() {
  const [items, setItems] = useState<Generation[]>([])
  useEffect(() => { api.list().then(setItems).catch(console.error) }, [])
  return (
    <>
      <div className="topbar"><h2>Galleria</h2><span className="pill">{items.length} creazioni</span></div>
      <div className="masonry">
        {items.map(g => (
          <div className="card" key={g.id}>
            {g.status === 'done' && g.result_url && (
              g.kind === 'image' ? <img src={g.result_url} /> : <video src={g.result_url} controls muted loop />
            )}
            <div className="meta">
              <span className={'badge ' + g.kind}>{g.kind}</span>{g.prompt}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
