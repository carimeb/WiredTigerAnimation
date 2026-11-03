import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/* ---------- shared motion helpers ---------- */
const ease = [0.22, 1, 0.36, 1]
const loop = (d = 0) => ({ repeat: Infinity, repeatType: 'loop', duration: 2.6, ease, delay: d })

const Arrow = ({ color = 'var(--muted)', dir = '→' }) => (
  <span className="mono" style={{ color, fontSize: 22, opacity: 0.8 }}>{dir}</span>
)

/* ==========================================================
   ACT 1
   ========================================================== */

function SceneCheckpoint({ v }) {
  const muts = [0, 1, 2, 3, 4]
  return (
    <div className="row center" style={{ gap: 40, minHeight: 320 }}>
      <div className="col center" style={{ gap: 10 }}>
        <div className="mut">{v.s1_incoming}</div>
        <div style={{ position: 'relative', width: 120, height: 180 }}>
          {muts.map((i) => (
            <motion.div key={i} className="chip" style={{ position: 'absolute', left: 0, top: i * 34 }}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: [-60, 150], opacity: [0, 1, 1, 0] }}
              transition={{ ...loop(i * 0.25), duration: 2.2 }}>
              {v.s1_write}{i + 1}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div className="node compute" style={{ width: 170 }}
        animate={{ boxShadow: ['0 0 0 rgba(91,140,255,0)', '0 0 34px rgba(91,140,255,.35)', '0 0 0 rgba(91,140,255,0)'] }}
        transition={loop()}>
        <div className="label">{v.s1_pageLabel}</div>
        <div className="title">{v.s1_pageTitle}</div>
        <div className="mut" style={{ marginTop: 8 }}>{v.s1_pageSub}</div>
      </motion.div>

      <div className="col center" style={{ gap: 8 }}>
        <motion.div className="chip" style={{ borderColor: 'var(--storage)', color: 'var(--storage)' }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.05, 0.9] }} transition={loop(1.2)}>
          {v.s1_chip}
        </motion.div>
        <Arrow color="var(--storage)" />
        <motion.div className="disk" animate={{ borderColor: ['var(--line)', 'var(--storage)', 'var(--line)'] }} transition={loop(1.2)}>
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span key={i}
              animate={{ background: ['var(--line)', i < 10 ? 'var(--storage)' : 'var(--line)', 'var(--line)'] }}
              transition={loop(1.3 + i * 0.01)} />
          ))}
        </motion.div>
        <div className="mut">{v.s1_disk}</div>
      </div>
    </div>
  )
}

function SceneNonCanonical({ v }) {
  const Node = ({ label, pattern, color }) => (
    <div className="col center" style={{ gap: 10 }}>
      <div className="node compute" style={{ width: 150 }}>
        <div className="label">{label}</div>
        <div className="title">{v.s2_same}</div>
      </div>
      <Arrow />
      <div className="disk">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span key={i}
            animate={{ background: pattern[i] ? color : 'var(--line)' }}
            transition={{ duration: 0.6, delay: i * 0.03, ease }} />
        ))}
      </div>
      <div className="mut mono">{v.s2_bytes}</div>
    </div>
  )
  const a = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0]
  const b = [0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1]
  return (
    <div className="row center" style={{ gap: 60, minHeight: 320 }}>
      <Node label={v.s2_nodeA} pattern={a} color="var(--compute)" />
      <motion.div className="chip" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
        animate={{ opacity: [0.4, 1, 0.4] }} transition={loop()}>
        {v.s2_layout}
      </motion.div>
      <Node label={v.s2_nodeB} pattern={b} color="var(--violet)" />
    </div>
  )
}

function SceneGlued({ v }) {
  return (
    <div className="row center" style={{ gap: 0, minHeight: 320 }}>
      <motion.div className="node compute" style={{ width: 200, borderRadius: '12px 0 0 12px' }}
        animate={{ x: [0, 6, 0] }} transition={loop()}>
        <div className="label">{v.lbl_compute}</div>
        <div className="title">{v.s3_wt}</div>
        <div className="mut" style={{ marginTop: 6 }}>{v.s3_computeSub}</div>
      </motion.div>
      <motion.div style={{ fontSize: 30 }} animate={{ scale: [1, 1.25, 1], rotate: [0, 8, 0] }} transition={loop()}>🔗</motion.div>
      <motion.div className="node storage" style={{ width: 200, borderRadius: '0 12px 12px 0' }}
        animate={{ x: [0, -6, 0] }} transition={loop()}>
        <div className="label">{v.lbl_storage}</div>
        <div className="title">{v.s3_diskLocal}</div>
        <div className="mut" style={{ marginTop: 6 }}>{v.s3_matHere}</div>
      </motion.div>
    </div>
  )
}

/* ==========================================================
   ACT 2
   ========================================================== */

function SceneRedoLog({ v }) {
  const items = [0, 1, 2, 3, 4, 5, 6]
  return (
    <div className="col center" style={{ gap: 24, minHeight: 320 }}>
      <div className="row center" style={{ gap: 16 }}>
        <div className="node compute" style={{ width: 150 }}>
          <div className="label">{v.lbl_compute}</div>
          <div className="title">{v.s4_computeTitle}</div>
        </div>
        <div style={{ position: 'relative', width: 360, height: 60 }}>
          {items.map((i) => (
            <motion.div key={i} className="chip" style={{ position: 'absolute', top: 16, left: 0, borderColor: 'var(--danger)' }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [0, 320], opacity: [0, 1, 1, 0] }}
              transition={{ ...loop(i * 0.22), duration: 1.8 }}>
              {v.s4_chip}
            </motion.div>
          ))}
        </div>
        <div className="node storage" style={{ width: 150 }}>
          <div className="label">{v.lbl_storage}</div>
          <div className="title">{v.s4_storageTitle}</div>
        </div>
      </div>
      <motion.div className="chip" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
        animate={{ opacity: [0.5, 1, 0.5] }} transition={loop()}>
        {v.s4_warn}
      </motion.div>
    </div>
  )
}

function SceneLag({ v }) {
  const CP = 7.5      // checkpoint fires at 7.5s
  const CYCLE = 9     // full cycle, then restart
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((p) => (p + 0.1) % CYCLE), 100)
    return () => clearInterval(id)
  }, [])
  const fired = t >= CP
  const nWrites = fired ? 6 : Math.min(6, 1 + Math.floor(t / 1.2))
  const lag = fired ? 0 : t

  return (
    <div className="row center" style={{ gap: 46, minHeight: 320, alignItems: 'flex-start', paddingTop: 10 }}>
      {/* PRIMARY accumulating writes */}
      <div className="col center" style={{ gap: 12 }}>
        <div className="node compute" style={{ width: 175 }}>
          <div className="label">{v.lbl_primary}</div>
          <div className="title">{v.s5_primaryTitle}</div>
        </div>
        <div className="col" style={{ gap: 6, minHeight: 170 }}>
          {Array.from({ length: 6 }).map((_, k) => (
            <motion.div key={k} className="chip" style={{ borderColor: 'var(--compute)' }}
              animate={{
                opacity: k < nWrites ? (fired ? 0.25 : 1) : 0.12,
                x: fired && k < nWrites ? 150 : 0,
                scale: k < nWrites ? 1 : 0.9,
              }}
              transition={{ duration: 0.5, ease }}>
              {v.s5_write} #{k + 1}
            </motion.div>
          ))}
        </div>
      </div>

      {/* checkpoint countdown wall */}
      <div className="col center" style={{ gap: 12, width: 220, paddingTop: 46 }}>
        <div className="mut mono" style={{ fontSize: 12 }}>{v.s5_nextCp}</div>
        <div style={{ width: '100%', height: 8, borderRadius: 6, background: 'var(--line)', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: fired ? 'var(--storage)' : 'var(--amber)' }}
            animate={{ width: `${Math.min(1, t / CP) * 100}%` }}
            transition={{ duration: 0.1, ease: 'linear' }} />
        </div>
        {fired ? (
          <motion.div className="chip"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            style={{ borderColor: 'var(--storage)', color: 'var(--storage)', fontWeight: 700 }}>
            ⚡ {v.s5_cpFired}
          </motion.div>
        ) : (
          <div className="mono" style={{ fontSize: 24, color: 'var(--amber)' }}>{(CP - t).toFixed(1)}s</div>
        )}
      </div>

      {/* STANDBY frozen + lag counter */}
      <div className="col center" style={{ gap: 12, paddingTop: 10 }}>
        <motion.div className="node storage" style={{ width: 200 }}
          animate={{ opacity: fired ? 1 : 0.7, borderColor: fired ? 'var(--storage)' : 'var(--line)' }}
          transition={{ duration: 0.4 }}>
          <div className="label">{v.s5_standbyLabel}</div>
          <div className="title">{fired ? v.s5_upToDate : v.s5_frozen}</div>
        </motion.div>
        <motion.div className="chip mono"
          animate={{
            borderColor: fired ? 'var(--storage)' : 'var(--danger)',
            color: fired ? 'var(--storage)' : 'var(--danger)',
            scale: fired ? 1 : 1 + Math.min(0.15, t * 0.02),
          }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 17, padding: '9px 16px' }}>
          {v.s5_lag}: {lag.toFixed(1)}s
        </motion.div>
      </div>
    </div>
  )
}

function SceneSecurity({ v }) {
  const lane = {
    display: 'flex', alignItems: 'center', gap: 18,
    padding: '16px 20px', border: '1px solid var(--line)',
    borderRadius: 12, width: '100%', background: 'var(--surface)',
  }
  return (
    <div className="col center" style={{ gap: 18, minHeight: 320, maxWidth: 820, margin: '0 auto', justifyContent: 'center' }}>

      {/* lane 1 — classic disaggregation: storage decrypts */}
      <div style={{ ...lane, borderColor: 'rgba(255,107,107,.5)' }}>
        <div className="col" style={{ gap: 6, width: 190, flexShrink: 0 }}>
          <div className="label" style={{ color: 'var(--danger)' }}>{v.s6_laneOld}</div>
          <div className="chip mono" style={{ fontSize: 12 }}>{v.s6_cipher}</div>
        </div>
        <motion.div style={{ fontSize: 18, flexShrink: 0 }}
          animate={{ x: [0, 26], opacity: [0, 1, 0] }} transition={{ ...loop(), duration: 1.6 }}>🔒→</motion.div>
        <div className="grow" style={{ position: 'relative' }}>
          <div className="label">{v.s6_tier}</div>
          {/* the morph: ciphertext becomes readable plaintext inside the shared tier */}
          <div style={{ position: 'relative', height: 22, marginTop: 4 }}>
            <motion.span className="mono" style={{ position: 'absolute', fontSize: 13 }}
              animate={{ opacity: [1, 1, 0, 0, 1] }} transition={{ ...loop(), duration: 3.4 }}>
              {v.s6_cipher}
            </motion.span>
            <motion.span className="mono" style={{ position: 'absolute', fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}
              animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ ...loop(), duration: 3.4 }}>
              {v.s6_plain}
            </motion.span>
          </div>
          <motion.div className="mut" style={{ marginTop: 6, color: 'var(--danger)', fontSize: 12.5 }}
            animate={{ opacity: [0.35, 1, 0.35] }} transition={loop()}>
            {v.s6_sees}
          </motion.div>
        </div>
        <motion.div className="chip" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 700, flexShrink: 0 }}
          initial={{ rotate: -8, scale: 0 }}
          animate={{ rotate: -8, scale: [0, 1.25, 1] }}
          transition={{ duration: 0.7, delay: 0.8, ease }}>
          {v.s6_rejected}
        </motion.div>
      </div>

      {/* lane 2 — MongoDB's principle: data stays encrypted end to end */}
      <div style={{ ...lane, borderColor: 'rgba(0,200,140,.5)' }}>
        <div className="col" style={{ gap: 6, width: 190, flexShrink: 0 }}>
          <div className="label" style={{ color: 'var(--storage)' }}>{v.s6_laneNew}</div>
          <div className="chip mono" style={{ fontSize: 12 }}>{v.s6_cipher}</div>
        </div>
        <motion.div style={{ fontSize: 18, flexShrink: 0 }}
          animate={{ x: [0, 26], opacity: [0, 1, 0] }} transition={{ ...loop(0.5), duration: 1.6 }}>🔒→</motion.div>
        <div className="grow">
          <div className="label">{v.s6_tier}</div>
          <motion.div className="mono" style={{ fontSize: 13, marginTop: 4 }}
            animate={{ opacity: [0.75, 1, 0.75] }} transition={loop()}>
            {v.s6_cipher} 🔒
          </motion.div>
          <div className="mut" style={{ marginTop: 6, color: 'var(--storage)', fontSize: 12.5 }}>
            {v.s6_never}
          </div>
        </div>
        <motion.div className="chip" style={{ borderColor: 'var(--storage)', color: 'var(--storage)', fontWeight: 700, flexShrink: 0 }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.15, 1] }}
          transition={{ duration: 0.7, delay: 1.4, ease }}>
          {v.s6_chosen}
        </motion.div>
      </div>
    </div>
  )
}

/* ==========================================================
   ACT 3
   ========================================================== */

function SceneLogService({ v }) {
  return (
    <div className="row center" style={{ gap: 36, minHeight: 320 }}>
      <div className="node compute" style={{ width: 150 }}>
        <div className="label">{v.lbl_primary}</div>
        <div className="title">{v.s7_primaryTitle}</div>
      </div>
      <div className="col center" style={{ gap: 6 }}>
        <motion.div className="chip" style={{ borderColor: 'var(--storage)', color: 'var(--storage)' }}
          animate={{ x: [-20, 20], opacity: [0, 1, 0] }} transition={{ ...loop(), duration: 1.6 }}>{v.s7_entry}</motion.div>
        <Arrow color="var(--storage)" />
      </div>
      <div className="col" style={{ gap: 10 }}>
        <div className="label mono" style={{ color: 'var(--muted)' }}>{v.s7_title}</div>
        {v.s7_zones.map((z, i) => (
          <motion.div key={z} className="node storage" style={{ width: 150, padding: '8px 12px' }}
            animate={{ borderColor: ['var(--line)', 'var(--storage)', 'var(--line)'] }} transition={loop(i * 0.2)}>
            <div className="title" style={{ fontSize: 13 }}>{z}</div>
          </motion.div>
        ))}
        <motion.div className="chip" animate={{ opacity: [0.4, 1, 0.4] }} transition={loop(0.6)}>{v.s7_quorum}</motion.div>
      </div>
    </div>
  )
}

function SceneMaterializer({ v }) {
  return (
    <div className="col center" style={{ gap: 20, minHeight: 320 }}>
      <div className="row center" style={{ gap: 24 }}>
        <div className="node storage" style={{ width: 140 }}><div className="label">{v.s8_log}</div><div className="title">{v.s8_entries}</div></div>
        <motion.div animate={{ x: [-10, 10] }} transition={loop()}><Arrow color="var(--storage)" /></motion.div>
        <div className="node" style={{ width: 170, borderColor: 'var(--violet)' }}>
          <div className="label" style={{ color: 'var(--violet)' }}>{v.s8_matLabel}</div>
          <div className="title">{v.s8_matTitle}</div>
        </div>
      </div>
      <div className="row center" style={{ gap: 0, alignItems: 'stretch' }}>
        <motion.div className="node" style={{ width: 220, borderRadius: '12px 0 0 12px', borderColor: 'var(--storage)' }}
          animate={{ background: ['var(--surface)', 'rgba(0,200,140,.08)', 'var(--surface)'] }} transition={loop()}>
          <div className="label" style={{ color: 'var(--storage)' }}>{v.s8_stableLabel}</div>
          <div className="title">{v.s8_stableTitle}</div>
        </motion.div>
        <div className="col center" style={{ padding: '0 14px' }}>
          <div className="mono" style={{ fontSize: 20 }}>+</div>
          <div className="mut" style={{ fontSize: 12 }}>{v.s8_compose}</div>
        </div>
        <motion.div className="node" style={{ width: 220, borderRadius: '0 12px 12px 0', borderColor: 'var(--amber)' }}
          animate={{ background: ['var(--surface)', 'rgba(255,180,84,.09)', 'var(--surface)'] }} transition={loop(0.4)}>
          <div className="label" style={{ color: 'var(--amber)' }}>{v.s8_ingestLabel}</div>
          <div className="title">{v.s8_ingestTitle}</div>
        </motion.div>
      </div>
      <motion.div className="chip" style={{ borderColor: 'var(--storage)', color: 'var(--storage)' }}
        animate={{ opacity: [0.4, 1, 0.4] }} transition={loop()}>{v.s8_chip}</motion.div>
    </div>
  )
}

function ScenePageService({ v }) {
  const servers = [0, 1, 2, 3]
  return (
    <div className="col center" style={{ gap: 22, minHeight: 320 }}>
      <motion.div className="node compute" style={{ width: 230 }}
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [0.8, 1, 1], opacity: [0, 1, 1] }} transition={loop()}>
        <div className="label">{v.s9_newLabel}</div>
        <div className="title">{v.s9_newTitle}</div>
        <div className="mut" style={{ marginTop: 4 }}>{v.s9_newSub}</div>
      </motion.div>
      <Arrow dir="↓" color="var(--storage)" />
      <div className="row center" style={{ gap: 14 }}>
        {servers.map((i) => (
          <motion.div key={i} className="node storage" style={{ width: 110, padding: '10px 12px' }}
            animate={{ y: [0, -6, 0], borderColor: ['var(--line)', 'var(--storage)', 'var(--line)'] }} transition={loop(i * 0.18)}>
            <div className="label">{v.s9_srv}{i + 1}</div>
            <div className="title" style={{ fontSize: 13 }}>{v.s9_hot}</div>
          </motion.div>
        ))}
      </div>
      <div className="mut">{v.s9_foot}</div>
    </div>
  )
}

function SceneResult({ v }) {
  const extra = [0, 1, 2]
  return (
    <div className="col center" style={{ gap: 20, minHeight: 320 }}>
      <div className="row center" style={{ gap: 14 }}>
        <div className="node compute" style={{ width: 130 }}><div className="label">{v.lbl_compute}</div><div className="title">{v.s10_computeTitle}</div></div>
        {extra.map((i) => (
          <motion.div key={i} className="node compute" style={{ width: 110 }}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 1], scale: [0.6, 1, 1] }} transition={loop(0.4 + i * 0.3)}>
            <div className="label">{v.s10_replica}</div>
            <div className="title" style={{ fontSize: 13 }}>{v.s10_inSeconds}</div>
          </motion.div>
        ))}
      </div>
      <motion.div style={{ fontSize: 26 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={loop()}>{v.s10_decoupled}</motion.div>
      <div className="row center" style={{ gap: 14 }}>
        <div className="node storage" style={{ width: 150 }}><div className="label">{v.lbl_storage}</div><div className="title">{v.s10_storageTitle}</div></div>
        <div className="chip" style={{ borderColor: 'var(--storage)', color: 'var(--storage)' }}>{v.s10_neverClear}</div>
      </div>
    </div>
  )
}

/* ordered list of visuals — text comes from i18n */
export const VISUALS = [
  SceneCheckpoint,
  SceneNonCanonical,
  SceneGlued,
  SceneRedoLog,
  SceneLag,
  SceneSecurity,
  SceneLogService,
  SceneMaterializer,
  ScenePageService,
  SceneResult,
]

/* act number per scene index (for the act pills) */
export const SCENE_ACTS = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3]
