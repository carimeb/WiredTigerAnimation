import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VISUALS, SCENE_ACTS } from './scenes.jsx'
import { TR, LANGS, renderSegs } from './i18n.jsx'

const VALID_LANGS = ['pt', 'en', 'es']
function initialLang() {
  try {
    const q = new URL(window.location.href).searchParams.get('lang')
    if (VALID_LANGS.includes(q)) return q
  } catch (e) { /* ignore */ }
  return 'pt'
}

export default function App() {
  const [lang, setLang] = useState(initialLang)
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(false)

  // Allow the host page (iframe parent) to drive the language.
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data
      if (d && d.type === 'wt-setlang' && VALID_LANGS.includes(d.lang)) setLang(d.lang)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const t = TR[lang]
  const scene = t.scenes[i]
  const Visual = VISUALS[i]
  const act = SCENE_ACTS[i]
  const last = VISUALS.length - 1

  const go = useCallback((n) => setI(() => Math.min(last, Math.max(0, n))), [last])

  useEffect(() => {
    if (!auto) return
    if (i === last) { setAuto(false); return }
    const timer = setTimeout(() => setI((p) => p + 1), 7000)
    return () => clearTimeout(timer)
  }, [auto, i, last])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
      if (e.key === ' ') { e.preventDefault(); setAuto((a) => !a) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [i, go])

  const firstOfAct = (n) => SCENE_ACTS.findIndex((a) => a === n)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          {t.ui.brandTitle}
          <small>{t.ui.brandSub}</small>
        </div>

        <div className="top-right">
          <div className="acts">
            {[1, 2, 3].map((n) => (
              <button key={n} className={`act-pill ${act === n ? 'active' : ''}`} onClick={() => go(firstOfAct(n))}>
                {t.ui.actWord} {n} · {t.ui.acts[n - 1]}
              </button>
            ))}
          </div>
          <div className="lang-toggle">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`lang-btn ${lang === l.code ? 'active' : ''}`}
                onClick={() => setLang(l.code)}
                title={l.name}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${lang}-${i}`}
            className="scene"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="scene-head">
              <div className="scene-kicker">{scene.kicker}</div>
              <h1 className="scene-title">{scene.title}</h1>
              <p className="scene-sub">{scene.sub}</p>
            </div>

            <div className="canvas">
              <Visual v={t.v} />
            </div>

            <div className={`takeaway ${scene.tone === 'warn' ? 'warn' : ''}`}>
              <span style={{ fontSize: 18 }}>{scene.tone === 'warn' ? '⚠️' : '💡'}</span>
              <div>{renderSegs(scene.segs)}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="controls">
        <button className="btn" onClick={() => go(i - 1)} disabled={i === 0}>{t.ui.prev}</button>
        <div className="progress">
          {VISUALS.map((_, idx) => (
            <div key={idx} className={`seg ${idx <= i ? 'on' : ''}`} onClick={() => go(idx)} style={{ cursor: 'pointer' }} />
          ))}
        </div>
        <span className="step-count">{i + 1} / {VISUALS.length}</span>
        <button className="btn" onClick={() => setAuto((a) => !a)}>{auto ? t.ui.pause : t.ui.auto}</button>
        <button className="btn primary" onClick={() => go(i + 1)} disabled={i === last}>{t.ui.next}</button>
      </footer>
    </div>
  )
}
