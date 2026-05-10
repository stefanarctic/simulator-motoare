import type { CSSProperties } from 'react'
import type { EngineDefinition, EngineId } from '../data/engines'
import type { SimulatorControls } from '../lib/simulation'

type EngineControlsProps = {
  engines: EngineDefinition[]
  selectedEngineId: EngineId
  controls: SimulatorControls
  isPlaying: boolean
  timeScale: number
  onEngineChange: (engineId: EngineId) => void
  onControlsChange: (controls: SimulatorControls) => void
  onTimeScaleChange: (timeScale: number) => void
  onTogglePlaying: () => void
  onNextStep: () => void
  onReset: () => void
}

const SLIDERS: { key: keyof SimulatorControls; label: string; min: number; max: number; step: number; suffix: string; help: string }[] = [
  {
    key: 'rpm',
    label: 'Turatie motor',
    min: 600,
    max: 7000,
    step: 50,
    suffix: 'rpm',
    help: 'Viteza de rotatie a manivelei. Cu cat e mai mare, cu atat ciclul se repeta mai rapid.',
  },
  {
    key: 'throttle',
    label: 'Acceleratie',
    min: 0,
    max: 100,
    step: 5,
    suffix: '%',
    help: 'Cat de mult aer si combustibil intra in cilindru. Influenteaza presiunea de admisie.',
  },
  {
    key: 'load',
    label: 'Sarcina mecanica',
    min: 10,
    max: 100,
    step: 5,
    suffix: '%',
    help: 'Cerinta de cuplu de la transmisie. La sarcina mare, arderea elibereaza mai multa caldura.',
  },
]

export function EngineControls({
  engines,
  selectedEngineId,
  controls,
  isPlaying,
  timeScale,
  onEngineChange,
  onControlsChange,
  onTimeScaleChange,
  onTogglePlaying,
  onNextStep,
  onReset,
}: EngineControlsProps) {
  const updateControl = (key: keyof SimulatorControls, value: number) => {
    onControlsChange({ ...controls, [key]: value })
  }

  const formatValue = (key: keyof SimulatorControls, suffix: string) => {
    if (key === 'rpm') return `${controls.rpm.toLocaleString('ro-RO')} ${suffix}`
    return `${controls[key]} ${suffix}`
  }

  return (
    <section className="panel controls-panel" aria-labelledby="controls-title">
      <header className="panel-header">
        <div>
          <div className="section-eyebrow">Panou de comanda</div>
          <h2 id="controls-title">Configurare simulare</h2>
        </div>
      </header>

      <div className="engine-picker" role="tablist" aria-label="Tipuri de motoare">
        {engines.map((engine) => (
          <button
            type="button"
            key={engine.id}
            className={engine.id === selectedEngineId ? 'engine-card active' : 'engine-card'}
            onClick={() => onEngineChange(engine.id)}
            style={{ '--engine-color': engine.color, '--engine-glow': engine.glow } as CSSProperties}
            role="tab"
            aria-selected={engine.id === selectedEngineId}
          >
            <span className="engine-card-name">{engine.name}</span>
            <span className="engine-card-subtitle">{engine.subtitle}</span>
            <span className="engine-card-meta">
              <strong>{engine.specs.compressionRatio}</strong>
              <small>raport compresie</small>
            </span>
          </button>
        ))}
      </div>

      <div className="time-block">
        <div className="time-actions">
          <button
            type="button"
            className={isPlaying ? 'btn btn-primary playing' : 'btn btn-primary'}
            onClick={onTogglePlaying}
            aria-pressed={isPlaying}
          >
            {isPlaying ? 'Pauza' : 'Porneste'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onNextStep}>
            Pasul urmator
          </button>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            Reseteaza la 0°
          </button>
        </div>

        <label className="slider">
          <div className="slider-head">
            <span className="slider-label">Viteza timpului</span>
            <strong className="slider-value">{timeScale.toFixed(2)}x</strong>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.6"
            step="0.01"
            value={timeScale}
            onChange={(event) => onTimeScaleChange(Number(event.target.value))}
          />
          <small className="slider-help">Independent de turatia motorului. La 0.05x ciclul dureaza ~10s.</small>
        </label>
      </div>

      <div className="sliders-block">
        {SLIDERS.map((slider) => (
          <label key={slider.key} className="slider">
            <div className="slider-head">
              <span className="slider-label">{slider.label}</span>
              <strong className="slider-value">{formatValue(slider.key, slider.suffix)}</strong>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={controls[slider.key]}
              onChange={(event) => updateControl(slider.key, Number(event.target.value))}
            />
            <small className="slider-help">{slider.help}</small>
          </label>
        ))}
      </div>
    </section>
  )
}
