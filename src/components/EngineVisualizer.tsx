import type { CSSProperties } from 'react'
import type { CylinderContent, EngineDefinition } from '../data/engines'
import { ENGINE_GEOMETRY, type SimulationState } from '../lib/simulation'

type EngineVisualizerProps = {
  engine: EngineDefinition
  state: SimulationState
  isPlaying: boolean
}

const CONTENT_COLOR: Record<CylinderContent, string> = {
  air: '#7dd3fc',
  mixture: '#facc15',
  compressed: '#fbbf24',
  burning: '#f97316',
  expanded: '#fb923c',
  exhaust: '#475569',
  scavenge: '#a78bfa',
}

const CONTENT_LABEL: Record<CylinderContent, string> = {
  air: 'aer curat',
  mixture: 'amestec aer-benzina',
  compressed: 'amestec comprimat',
  burning: 'gaze in ardere',
  expanded: 'gaze in destindere',
  exhaust: 'gaze arse',
  scavenge: 'baleiaj',
}

export function EngineVisualizer({ engine, state, isPlaying }: EngineVisualizerProps) {
  const isFourStroke = engine.cycleDegrees === 720
  const { crankCenterX, crankCenterY, crankRadius, rodLength, bore, pistonHeight, cylinderTop } = ENGINE_GEOMETRY

  const pistonHalf = pistonHeight / 2
  const pistonTopY = state.pistonPin.y - pistonHalf
  const pistonBottomY = state.pistonPin.y + pistonHalf
  const pistonWidth = bore - 6
  const pistonLeftX = crankCenterX - pistonWidth / 2
  const cylinderLeftX = crankCenterX - bore / 2
  const cylinderRightX = crankCenterX + bore / 2

  const rodDx = state.crankPin.x - state.pistonPin.x
  const rodDy = state.crankPin.y - state.pistonPin.y
  const rodAngleDeg = (Math.atan2(rodDx, rodDy) * 180) / Math.PI

  const intakeValveOffset = state.intakeLift * 22
  const exhaustValveOffset = state.exhaustLift * 22

  const cylinderContentColor = CONTENT_COLOR[state.phase.cylinderContent]
  const cylinderContentLabel = CONTENT_LABEL[state.phase.cylinderContent]
  const contentTopY = cylinderTop + 22
  const contentHeight = Math.max(pistonTopY - contentTopY, 4)
  const compressionTint = 0.35 + state.cylinderPressure / 60
  const contentOpacity = Math.min(0.85, compressionTint)

  return (
    <section
      className={isPlaying ? 'panel viz-panel' : 'panel viz-panel viz-paused'}
      aria-labelledby="visualizer-title"
      style={{ '--engine-color': engine.color, '--engine-glow': engine.glow } as CSSProperties}
    >
      <header className="viz-header">
        <div>
          <div className="section-eyebrow">Schema cinematica</div>
          <h2 id="visualizer-title">{engine.name}</h2>
          <p className="viz-subtitle">
            Pozitia pistonului foloseste relatia reala bielă-manivelă. Supapele si ferestrele se deschid progresiv,
            iar continutul cilindrului isi schimba culoarea in functie de etapa.
          </p>
        </div>
        <div className="viz-status" role="status" aria-live="polite">
          <span className="viz-status-pill">{state.phase.shortName}</span>
          <span className="viz-status-meta">
            Unghi manivela <strong>{Math.round(state.cycleDegrees)}°</strong> / {engine.cycleDegrees}°
          </span>
          <span className="viz-status-meta">
            In cilindru <strong>{cylinderContentLabel}</strong>
          </span>
        </div>
      </header>

      <svg
        className="engine-svg"
        viewBox="0 0 640 540"
        role="img"
        aria-label={`Animatie ${engine.name}, faza ${state.phase.name}`}
      >
        <defs>
          <linearGradient id="block-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="head-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="piston-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="rod-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="combustion-glow">
            <stop offset="0%" stopColor={engine.color} stopOpacity="0.95" />
            <stop offset="60%" stopColor={engine.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={engine.color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="counterweight-grad">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <clipPath id="cylinder-clip">
            <rect x={cylinderLeftX} y={cylinderTop} width={bore} height={crankCenterY - cylinderTop + 20} />
          </clipPath>
        </defs>

        <rect className="viz-grid" x="0" y="0" width="640" height="540" />

        <g className="runner intake-runner">
          <path
            d={`M0 ${cylinderTop + 60} C 80 ${cylinderTop + 60} 110 ${cylinderTop + 30} ${cylinderLeftX - 8} ${cylinderTop + 30}`}
          />
          <path
            className={state.intakeFlow > 0.05 ? 'runner-flow active' : 'runner-flow'}
            d={`M0 ${cylinderTop + 60} C 80 ${cylinderTop + 60} 110 ${cylinderTop + 30} ${cylinderLeftX - 8} ${cylinderTop + 30}`}
          />
          <text x="14" y={cylinderTop + 50} className="runner-label">
            ADMISIE
          </text>
        </g>

        <g className="runner exhaust-runner">
          <path
            d={`M${cylinderRightX + 8} ${cylinderTop + 30} C ${cylinderRightX + 80} ${cylinderTop + 30} 560 ${cylinderTop + 60} 640 ${cylinderTop + 60}`}
          />
          <path
            className={state.exhaustFlow > 0.05 ? 'runner-flow active' : 'runner-flow'}
            d={`M${cylinderRightX + 8} ${cylinderTop + 30} C ${cylinderRightX + 80} ${cylinderTop + 30} 560 ${cylinderTop + 60} 640 ${cylinderTop + 60}`}
          />
          <text x="626" y={cylinderTop + 50} className="runner-label" textAnchor="end">
            EVACUARE
          </text>
        </g>

        <path
          d={`M ${cylinderLeftX - 30} ${cylinderTop + 24}
              Q ${cylinderLeftX - 30} ${cylinderTop} ${cylinderLeftX} ${cylinderTop}
              L ${cylinderRightX} ${cylinderTop}
              Q ${cylinderRightX + 30} ${cylinderTop} ${cylinderRightX + 30} ${cylinderTop + 24}
              L ${cylinderRightX + 30} ${crankCenterY - 30}
              Q ${cylinderRightX + 30} ${crankCenterY + 10} ${cylinderRightX + 80} ${crankCenterY + 10}
              L ${cylinderRightX + 110} ${crankCenterY + 10}
              Q ${cylinderRightX + 130} ${crankCenterY + 10} ${cylinderRightX + 130} ${crankCenterY + 30}
              L ${cylinderRightX + 130} ${crankCenterY + 80}
              Q ${cylinderRightX + 130} ${crankCenterY + 100} ${cylinderRightX + 110} ${crankCenterY + 100}
              L ${cylinderLeftX - 110} ${crankCenterY + 100}
              Q ${cylinderLeftX - 130} ${crankCenterY + 100} ${cylinderLeftX - 130} ${crankCenterY + 80}
              L ${cylinderLeftX - 130} ${crankCenterY + 30}
              Q ${cylinderLeftX - 130} ${crankCenterY + 10} ${cylinderLeftX - 110} ${crankCenterY + 10}
              L ${cylinderLeftX - 80} ${crankCenterY + 10}
              Q ${cylinderLeftX - 30} ${crankCenterY + 10} ${cylinderLeftX - 30} ${crankCenterY - 30}
              Z`}
          className="engine-block"
        />

        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`fin-${i}`} className="cooling-fins">
            <line
              x1={cylinderLeftX - 28}
              y1={cylinderTop + 60 + i * 38}
              x2={cylinderLeftX - 4}
              y2={cylinderTop + 60 + i * 38}
            />
            <line
              x1={cylinderRightX + 4}
              y1={cylinderTop + 60 + i * 38}
              x2={cylinderRightX + 28}
              y2={cylinderTop + 60 + i * 38}
            />
          </g>
        ))}

        <g clipPath="url(#cylinder-clip)">
          <rect
            x={cylinderLeftX + 2}
            y={contentTopY}
            width={bore - 4}
            height={contentHeight}
            fill={cylinderContentColor}
            opacity={contentOpacity}
            className="cylinder-content"
          />
          {state.combustionGlow > 0.05 && (
            <>
              <circle
                cx={crankCenterX}
                cy={contentTopY + contentHeight / 2}
                r={70 + state.combustionGlow * 40}
                fill="url(#combustion-glow)"
                opacity={0.55 + state.combustionGlow * 0.35}
              />
              <circle
                cx={crankCenterX}
                cy={contentTopY + contentHeight / 2}
                r={42 + state.combustionGlow * 28}
                fill="url(#combustion-glow)"
                filter="url(#soft-glow)"
              />
            </>
          )}
        </g>

        {isFourStroke && (
          <>
            <g className={state.intakeLift > 0.05 ? 'valve open' : 'valve'}>
              <line
                x1={crankCenterX - 30}
                y1={cylinderTop - 26}
                x2={crankCenterX - 30}
                y2={cylinderTop + 18 + intakeValveOffset}
                className="valve-stem"
              />
              <ellipse
                cx={crankCenterX - 30}
                cy={cylinderTop + 22 + intakeValveOffset}
                rx="20"
                ry="6"
                className="valve-head"
              />
              <g className="valve-spring">
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={`is-${i}`}
                    x1={crankCenterX - 38}
                    y1={cylinderTop - 28 + i * 6}
                    x2={crankCenterX - 22}
                    y2={cylinderTop - 24 + i * 6}
                  />
                ))}
              </g>
              <text x={crankCenterX - 30} y={cylinderTop - 36} className="port-label">
                I
              </text>
            </g>

            <g className={state.exhaustLift > 0.05 ? 'valve open' : 'valve'}>
              <line
                x1={crankCenterX + 30}
                y1={cylinderTop - 26}
                x2={crankCenterX + 30}
                y2={cylinderTop + 18 + exhaustValveOffset}
                className="valve-stem"
              />
              <ellipse
                cx={crankCenterX + 30}
                cy={cylinderTop + 22 + exhaustValveOffset}
                rx="20"
                ry="6"
                className="valve-head"
              />
              <g className="valve-spring">
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={`es-${i}`}
                    x1={crankCenterX + 22}
                    y1={cylinderTop - 28 + i * 6}
                    x2={crankCenterX + 38}
                    y2={cylinderTop - 24 + i * 6}
                  />
                ))}
              </g>
              <text x={crankCenterX + 30} y={cylinderTop - 36} className="port-label">
                E
              </text>
            </g>
          </>
        )}

        {!isFourStroke && (
          <>
            <rect
              x={cylinderLeftX - 6}
              y={crankCenterY - 80}
              width="14"
              height={28 - state.scavengePortOpen * 16}
              className={state.scavengePortOpen > 0.05 ? 'port active' : 'port'}
              rx="2"
            />
            <text x={cylinderLeftX - 12} y={crankCenterY - 60} className="port-label" textAnchor="end">
              transfer
            </text>
            <rect
              x={cylinderRightX - 8}
              y={crankCenterY - 84}
              width="14"
              height={32 - state.exhaustPortOpen * 18}
              className={state.exhaustPortOpen > 0.05 ? 'port active' : 'port'}
              rx="2"
            />
            <text x={cylinderRightX + 12} y={crankCenterY - 60} className="port-label">
              evacuare
            </text>
          </>
        )}

        {engine.ignitionMode === 'spark' && (
          <g className={state.sparkActive ? 'spark-plug firing' : 'spark-plug'}>
            <rect x={crankCenterX - 7} y={cylinderTop - 38} width="14" height="22" className="plug-body" rx="2" />
            <line x1={crankCenterX} y1={cylinderTop - 16} x2={crankCenterX} y2={cylinderTop + 4} className="plug-tip" />
            {state.sparkActive && (
              <path
                className="spark-arc"
                d={`M${crankCenterX} ${cylinderTop + 4} L${crankCenterX - 6} ${cylinderTop + 12} L${crankCenterX + 5} ${cylinderTop + 14} L${crankCenterX - 4} ${cylinderTop + 22}`}
              />
            )}
            <text x={crankCenterX} y={cylinderTop - 46} className="port-label">
              bujie
            </text>
          </g>
        )}

        {engine.ignitionMode === 'compression' && (
          <g className={state.injectorActive ? 'injector firing' : 'injector'}>
            <rect x={crankCenterX - 5} y={cylinderTop - 42} width="10" height="34" className="injector-body" rx="2" />
            {state.injectorActive && (
              <>
                <path
                  d={`M${crankCenterX} ${cylinderTop - 8}
                      L${crankCenterX - 22} ${cylinderTop + 26}
                      M${crankCenterX} ${cylinderTop - 8}
                      L${crankCenterX} ${cylinderTop + 32}
                      M${crankCenterX} ${cylinderTop - 8}
                      L${crankCenterX + 22} ${cylinderTop + 26}`}
                  className="injector-spray"
                />
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle
                    key={`d-${i}`}
                    cx={crankCenterX + (i - 2) * 7}
                    cy={cylinderTop + 18 + Math.abs(i - 2) * 4}
                    r={1.6}
                    className="injector-droplet"
                  />
                ))}
              </>
            )}
            <text x={crankCenterX} y={cylinderTop - 50} className="port-label">
              injector
            </text>
          </g>
        )}

        <g className="piston-group">
          <rect
            x={pistonLeftX}
            y={pistonTopY}
            width={pistonWidth}
            height={pistonHeight}
            rx="6"
            className="piston-body"
            fill="url(#piston-gradient)"
          />
          {[8, 16, 24].map((offset) => (
            <line
              key={`ring-${offset}`}
              x1={pistonLeftX + 3}
              y1={pistonTopY + offset}
              x2={pistonLeftX + pistonWidth - 3}
              y2={pistonTopY + offset}
              className="piston-ring"
            />
          ))}
          <line
            x1={pistonLeftX + 3}
            y1={pistonTopY}
            x2={pistonLeftX + pistonWidth - 3}
            y2={pistonTopY}
            className="piston-crown"
          />
          <circle cx={state.pistonPin.x} cy={state.pistonPin.y} r="8" className="piston-pin" />
          <line
            x1={pistonLeftX}
            y1={pistonBottomY}
            x2={pistonLeftX + pistonWidth}
            y2={pistonBottomY}
            className="piston-skirt"
          />
        </g>

        <g
          className="connecting-rod"
          transform={`translate(${state.pistonPin.x} ${state.pistonPin.y}) rotate(${rodAngleDeg})`}
        >
          <rect x="-7" y="14" width="14" height={rodLength - 28} rx="3" fill="url(#rod-gradient)" stroke="#0f172a" strokeWidth="1.4" />
          <circle cx="0" cy="0" r="13" className="rod-small-end" />
          <circle cx="0" cy="0" r="6" className="rod-pin-hole" />
          <circle cx="0" cy={rodLength} r="22" className="rod-big-end" />
          <circle cx="0" cy={rodLength} r="11" className="rod-pin-hole" />
        </g>

        <g className="crankshaft">
          <circle cx={crankCenterX} cy={crankCenterY} r={crankRadius + 22} fill="url(#counterweight-grad)" />
          <line
            x1={crankCenterX}
            y1={crankCenterY}
            x2={state.crankPin.x}
            y2={state.crankPin.y}
            className="crank-arm"
          />
          <circle
            cx={crankCenterX - (state.crankPin.x - crankCenterX)}
            cy={crankCenterY - (state.crankPin.y - crankCenterY)}
            r="22"
            className="counterweight"
          />
          <circle cx={crankCenterX} cy={crankCenterY} r="14" className="main-bearing" />
          <circle cx={crankCenterX} cy={crankCenterY} r="5" className="bearing-pin" />
          <circle cx={state.crankPin.x} cy={state.crankPin.y} r="8" className="crank-pin" />
        </g>

        <g className="legend">
          <line x1="20" y1="510" x2="40" y2="510" className="legend-swatch valve-line" />
          <text x="48" y="514" className="legend-text">
            element static
          </text>
          <circle cx="186" cy="510" r="6" className="legend-dot active-dot" />
          <text x="200" y="514" className="legend-text">
            element activ
          </text>
          <text x={crankCenterX} y="514" className="legend-text" textAnchor="middle">
            PMS sus ↑   PMI jos ↓
          </text>
        </g>
      </svg>

      <footer className="viz-footer">
        <div className="viz-readout">
          <span>Pozitie piston (din cursa)</span>
          <strong>{Math.round(state.pistonNormalized * 100)}%</strong>
        </div>
        <div className="viz-readout">
          <span>Presiune cilindru</span>
          <strong>{state.cylinderPressure.toFixed(1)} bar</strong>
        </div>
        <div className="viz-readout">
          <span>Volum relativ</span>
          <strong>{state.cylinderVolume.toFixed(2)}</strong>
        </div>
        <div className="viz-readout">
          <span>Temperatura estimata</span>
          <strong>{Math.round(state.cylinderTemperature)} K</strong>
        </div>
      </footer>
    </section>
  )
}
