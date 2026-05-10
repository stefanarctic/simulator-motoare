import { useMemo, type CSSProperties } from 'react'
import type { EngineDefinition } from '../data/engines'
import { buildPVCurve, type SimulatorControls, type SimulationState } from '../lib/simulation'

type PVDiagramProps = {
  engine: EngineDefinition
  controls: SimulatorControls
  state: SimulationState
}

const VIEW_W = 460
const VIEW_H = 320
const PADDING = { top: 28, right: 24, bottom: 44, left: 56 }

export function PVDiagram({ engine, controls, state }: PVDiagramProps) {
  const points = useMemo(() => buildPVCurve(engine, controls, 540), [engine, controls])

  const maxPressure = Math.max(...points.map((p) => p.pressure), state.cylinderPressure) * 1.1
  const maxVolume = Math.max(...points.map((p) => p.volume))
  const minVolume = Math.min(...points.map((p) => p.volume)) * 0.9

  const innerW = VIEW_W - PADDING.left - PADDING.right
  const innerH = VIEW_H - PADDING.top - PADDING.bottom

  const xScale = (volume: number) =>
    PADDING.left + ((volume - minVolume) / (maxVolume - minVolume)) * innerW
  const yScale = (pressure: number) =>
    PADDING.top + (1 - pressure / maxPressure) * innerH

  const pathD = points
    .map((point, i) => `${i === 0 ? 'M' : 'L'}${xScale(point.volume).toFixed(2)} ${yScale(point.pressure).toFixed(2)}`)
    .join(' ')

  const cursorX = xScale(state.cylinderVolume)
  const cursorY = yScale(state.cylinderPressure)

  const gridLines = Array.from({ length: 5 }, (_, i) => i)

  return (
    <section
      className="panel pv-panel"
      aria-labelledby="pv-title"
      style={{ '--engine-color': engine.color } as CSSProperties}
    >
      <header className="panel-header">
        <div>
          <div className="section-eyebrow">Diagrama termodinamica</div>
          <h2 id="pv-title">Ciclul P-V (presiune - volum)</h2>
        </div>
        <span className="pv-mode-badge">
          Ciclu {engine.combustionMode === 'otto' ? 'Otto' : engine.combustionMode === 'diesel' ? 'Diesel' : 'Mixt'}
        </span>
      </header>

      <svg className="pv-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="Diagrama presiune volum">
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} className="pv-bg" />

        {gridLines.map((i) => {
          const y = PADDING.top + (i / 4) * innerH
          const value = (maxPressure * (1 - i / 4)).toFixed(0)
          return (
            <g key={`gy-${i}`} className="pv-grid">
              <line x1={PADDING.left} y1={y} x2={PADDING.left + innerW} y2={y} />
              <text x={PADDING.left - 8} y={y + 4} textAnchor="end" className="pv-axis-label">
                {value}
              </text>
            </g>
          )
        })}
        {gridLines.map((i) => {
          const x = PADDING.left + (i / 4) * innerW
          const v = minVolume + (maxVolume - minVolume) * (i / 4)
          return (
            <g key={`gx-${i}`} className="pv-grid">
              <line x1={x} y1={PADDING.top} x2={x} y2={PADDING.top + innerH} />
              <text x={x} y={PADDING.top + innerH + 18} textAnchor="middle" className="pv-axis-label">
                {v.toFixed(2)}
              </text>
            </g>
          )
        })}

        <text
          x={PADDING.left - 40}
          y={PADDING.top + innerH / 2}
          className="pv-axis-title"
          transform={`rotate(-90 ${PADDING.left - 40} ${PADDING.top + innerH / 2})`}
        >
          Presiune (bar)
        </text>
        <text x={PADDING.left + innerW / 2} y={VIEW_H - 8} className="pv-axis-title" textAnchor="middle">
          Volum relativ (V / V_max)
        </text>

        <path d={pathD} className="pv-curve" />

        <circle cx={cursorX} cy={cursorY} r="6" className="pv-cursor" />
        <circle cx={cursorX} cy={cursorY} r="12" className="pv-cursor-glow" />
      </svg>

      <p className="pv-explanation">
        Aria inchisa de curba reprezinta lucrul mecanic produs intr-un ciclu. Cu cat este mai mare aria, cu atat mai mare
        este energia obtinuta. Compresia urca pe curba spre stanga sus, arderea o urca brusc, destinderea coboara spre
        dreapta, iar evacuarea inchide ciclul.
      </p>
    </section>
  )
}
