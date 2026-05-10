import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './App.css'
import { EngineControls } from './components/EngineControls'
import { EngineDeepDive } from './components/EngineDeepDive'
import { EngineInfoPanel } from './components/EngineInfoPanel'
import { EngineVisualizer } from './components/EngineVisualizer'
import { PVDiagram } from './components/PVDiagram'
import { PhaseTimeline } from './components/PhaseTimeline'
import { defaultEngine, engines, findEngine, type EnginePhase, type EngineId } from './data/engines'
import { simulateEngine, type SimulatorControls } from './lib/simulation'

function App() {
  const [selectedEngineId, setSelectedEngineId] = useState<EngineId>(defaultEngine.id)
  const [controls, setControls] = useState<SimulatorControls>({
    rpm: 1200,
    throttle: 50,
    load: 50,
  })
  const [elapsedMs, setElapsedMs] = useState(0)
  const [timeScale, setTimeScale] = useState(0.06)
  const [isPlaying, setIsPlaying] = useState(false)
  const elapsedRef = useRef(elapsedMs)

  useEffect(() => {
    elapsedRef.current = elapsedMs
  }, [elapsedMs])

  const selectedEngine = useMemo(() => findEngine(selectedEngineId), [selectedEngineId])

  useEffect(() => {
    if (!isPlaying) return
    let frameId = 0
    let previous = performance.now()
    const tick = (now: number) => {
      const delta = now - previous
      previous = now
      elapsedRef.current += delta * timeScale
      setElapsedMs(elapsedRef.current)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying, timeScale])

  const simulationState = useMemo(
    () => simulateEngine(selectedEngine, controls, elapsedMs),
    [selectedEngine, controls, elapsedMs],
  )

  const setCycleAngle = useCallback(
    (targetDegrees: number) => {
      const wrapped = ((targetDegrees % selectedEngine.cycleDegrees) + selectedEngine.cycleDegrees) % selectedEngine.cycleDegrees
      const degreesPerMs = (controls.rpm / 60 / 1000) * 360
      if (degreesPerMs <= 0) {
        setElapsedMs(0)
        return
      }
      setElapsedMs(wrapped / degreesPerMs)
    },
    [selectedEngine.cycleDegrees, controls.rpm],
  )

  const goToNextStep = useCallback(() => {
    setIsPlaying(false)
    const phases = selectedEngine.phases
    const currentIndex = phases.findIndex((phase) => phase.id === simulationState.phase.id)
    const nextPhase = phases[(currentIndex + 1) % phases.length]
    setCycleAngle(nextPhase.start + 0.5)
  }, [selectedEngine.phases, simulationState.phase.id, setCycleAngle])

  const onJumpToPhase = useCallback(
    (phase: EnginePhase) => {
      setIsPlaying(false)
      setCycleAngle(phase.start + 0.5)
    },
    [setCycleAngle],
  )

  const onReset = useCallback(() => {
    setIsPlaying(false)
    setElapsedMs(0)
  }, [])

  const handleEngineChange = useCallback((id: EngineId) => {
    setIsPlaying(false)
    setSelectedEngineId(id)
    setElapsedMs(0)
  }, [])

  return (
    <div
      className="app-shell"
      style={{ '--engine-color': selectedEngine.color, '--engine-glow': selectedEngine.glow } as CSSProperties}
    >
      <header className="app-header">
        <div className="app-brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" />
              <path d="M16 5 L16 12 L22 16 L16 20 L16 27" />
              <circle cx="16" cy="16" r="3" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-eyebrow">Simulator educational</span>
            <h1>Motoare cu ardere interna</h1>
          </div>
        </div>
        <p className="app-tagline">
          Vezi cum lucreaza un motor in interior, cu cinematica reala bielă-manivelă,
          ciclul P-V termodinamic si explicatii pentru fiecare etapa.
        </p>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <EngineControls
            engines={engines}
            selectedEngineId={selectedEngineId}
            controls={controls}
            isPlaying={isPlaying}
            timeScale={timeScale}
            onEngineChange={handleEngineChange}
            onControlsChange={setControls}
            onTimeScaleChange={setTimeScale}
            onTogglePlaying={() => setIsPlaying((current) => !current)}
            onNextStep={goToNextStep}
            onReset={onReset}
          />
        </aside>

        <section className="app-stage">
          <EngineVisualizer engine={selectedEngine} state={simulationState} isPlaying={isPlaying} />
          <PhaseTimeline
            engine={selectedEngine}
            cycleDegrees={simulationState.cycleDegrees}
            activePhaseId={simulationState.phase.id}
            onJumpToPhase={onJumpToPhase}
          />
          <PVDiagram engine={selectedEngine} controls={controls} state={simulationState} />
        </section>

        <EngineInfoPanel engine={selectedEngine} state={simulationState} />
      </main>

      <EngineDeepDive engine={selectedEngine} allEngines={engines} />

      <footer className="app-footer">
        <span>
          Toate valorile fizice sunt ilustrative, calibrate pentru a reflecta corect comportamentul calitativ al fiecarui
          tip de motor. Nu inlocuiesc un model CFD sau un dynamometru real.
        </span>
      </footer>
    </div>
  )
}

export default App
