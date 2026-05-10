import type { CSSProperties } from 'react'
import type { EngineDefinition } from '../data/engines'
import type { SimulationState } from '../lib/simulation'

type EngineInfoPanelProps = {
  engine: EngineDefinition
  state: SimulationState
}

export function EngineInfoPanel({ engine, state }: EngineInfoPanelProps) {
  const liveMetrics = [
    { label: 'Cuplu relativ', value: `${state.torque}%`, hint: 'Cuplu produs la arborele cotit' },
    { label: 'Putere estimata', value: `${state.power} kW`, hint: 'Estimat din cuplu * turatie' },
    { label: 'Consum relativ', value: `${state.fuelUse}%`, hint: 'Combustibil consumat per minut' },
    { label: 'Eficienta termica', value: `${state.efficiency}%`, hint: 'Energie utila / energie chimica' },
    { label: 'Presiune cilindru', value: `${state.cylinderPressure.toFixed(1)} bar`, hint: 'Presiunea instantanee in cilindru' },
    { label: 'Temperatura', value: `${Math.round(state.cylinderTemperature)} K`, hint: 'Temperatura estimata a gazelor' },
  ]

  return (
    <aside
      className="info-column"
      aria-label="Informatii despre motor"
      style={{ '--engine-color': engine.color, '--engine-glow': engine.glow } as CSSProperties}
    >
      <section className="panel live-info-panel" aria-labelledby="live-title">
        <header className="panel-header">
          <div>
            <div className="section-eyebrow live-eyebrow">
              <span className="pulse-dot" aria-hidden="true" />
              Informatii live
            </div>
            <h2 id="live-title">{state.phase.name}</h2>
          </div>
        </header>

        <p className="phase-summary">{state.phase.summary}</p>

        <div className="metrics-grid">
          {liveMetrics.map((metric) => (
            <div className="metric" key={metric.label} title={metric.hint}>
              <span className="metric-label">{metric.label}</span>
              <strong className="metric-value">{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className="phase-progress">
          <div className="phase-progress-bar">
            <div
              className="phase-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, state.phaseProgress * 100))}%` }}
            />
          </div>
          <small className="phase-progress-label">
            Progres in faza: {Math.round(state.phaseProgress * 100)}%
          </small>
        </div>
      </section>
    </aside>
  )
}
