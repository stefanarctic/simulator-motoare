import type { CSSProperties } from 'react'
import type { EngineDefinition, EnginePhase } from '../data/engines'

type PhaseTimelineProps = {
  engine: EngineDefinition
  cycleDegrees: number
  activePhaseId: string
  onJumpToPhase: (phase: EnginePhase) => void
}

export function PhaseTimeline({ engine, cycleDegrees, activePhaseId, onJumpToPhase }: PhaseTimelineProps) {
  const cursor = (cycleDegrees / engine.cycleDegrees) * 100

  return (
    <section
      className="panel timeline-panel"
      aria-labelledby="timeline-title"
      style={{ '--engine-color': engine.color } as CSSProperties}
    >
      <header className="panel-header">
        <div>
          <div className="section-eyebrow">Timeline ciclu</div>
          <h2 id="timeline-title">Pozitia in cele {engine.cycleDegrees}° ale ciclului</h2>
        </div>
        <span className="timeline-degrees">
          {Math.round(cycleDegrees)}° / {engine.cycleDegrees}°
        </span>
      </header>

      <div className="timeline-track" role="presentation">
        {engine.phases.map((phase) => {
          const left = (phase.start / engine.cycleDegrees) * 100
          const width = ((phase.end - phase.start) / engine.cycleDegrees) * 100
          const active = phase.id === activePhaseId
          return (
            <button
              type="button"
              key={phase.id}
              className={active ? 'timeline-segment active' : 'timeline-segment'}
              style={{
                left: `${left}%`,
                width: `${width}%`,
              }}
              onClick={() => onJumpToPhase(phase)}
              aria-label={`Sari la faza ${phase.name}`}
            >
              <span className="timeline-segment-name">{phase.shortName}</span>
              <span className="timeline-segment-range">
                {phase.start}° - {phase.end}°
              </span>
            </button>
          )
        })}
        <div className="timeline-cursor" style={{ left: `${cursor}%` }} aria-hidden="true" />
        <div className="timeline-rail-marks">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ left: `${(i / 8) * 100}%` }}>
              {Math.round(((i / 8) * engine.cycleDegrees) / 10) * 10}°
            </span>
          ))}
        </div>
      </div>

      <p className="timeline-hint">
        Apasa pe orice segment pentru a sari direct la inceputul fazei. Cursorul portocaliu arata pozitia actuala.
      </p>
    </section>
  )
}
