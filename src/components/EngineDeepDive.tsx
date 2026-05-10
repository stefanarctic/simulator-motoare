import type { CSSProperties } from 'react'
import type { EngineDefinition } from '../data/engines'

type EngineDeepDiveProps = {
  engine: EngineDefinition
  allEngines: EngineDefinition[]
}

export function EngineDeepDive({ engine, allEngines }: EngineDeepDiveProps) {
  return (
    <section
      className="deep-dive"
      aria-label="Informatii detaliate despre motor"
      style={{ '--engine-color': engine.color, '--engine-glow': engine.glow } as CSSProperties}
    >
      <div className="panel principle-panel">
        <div className="section-eyebrow">Principiul de functionare</div>
        <h2>Cum lucreaza {engine.shortName}</h2>
        <p className="principle-text">{engine.workingPrinciple}</p>
        <div className="principle-grid">
          <div>
            <h3>Pe scurt</h3>
            <p>{engine.summary}</p>
          </div>
          <div>
            <h3>Istorie</h3>
            <p>{engine.history}</p>
          </div>
        </div>
      </div>

      <div className="panel specs-panel">
        <div className="section-eyebrow">Specificatii tehnice</div>
        <h2>Numere si parametri</h2>
        <dl className="specs-list">
          {Object.entries(engine.specs).map(([key, value]) => (
            <div key={key} className="specs-row">
              <dt>{translateSpec(key)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="panel phases-panel">
        <div className="section-eyebrow">Fazele in detaliu</div>
        <h2>Ce se intampla in cele {engine.cycleDegrees}°</h2>
        <ol className="phases-list">
          {engine.phases.map((phase, index) => (
            <li key={phase.id} className="phase-detail-item">
              <div className="phase-detail-head">
                <span className="phase-step-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{phase.name}</h3>
                  <small>
                    {phase.start}° → {phase.end}°
                  </small>
                </div>
              </div>
              <p>{phase.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="panel comparison-panel">
        <div className="section-eyebrow">Comparatie rapida</div>
        <h2>Cum se aseamana si cum difera</h2>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Caracteristica</th>
                {allEngines.map((other) => (
                  <th key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Aprindere</th>
                {allEngines.map((other) => (
                  <td key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.specs.ignition.split(',')[0]}
                  </td>
                ))}
              </tr>
              <tr>
                <th>Raport compresie</th>
                {allEngines.map((other) => (
                  <td key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.specs.compressionRatio}
                  </td>
                ))}
              </tr>
              <tr>
                <th>Ciclu</th>
                {allEngines.map((other) => (
                  <td key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.cycleDegrees}°
                  </td>
                ))}
              </tr>
              <tr>
                <th>Eficienta tipica</th>
                {allEngines.map((other) => (
                  <td key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.specs.typicalEfficiency}
                  </td>
                ))}
              </tr>
              <tr>
                <th>Combustibil</th>
                {allEngines.map((other) => (
                  <td key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.specs.fuel}
                  </td>
                ))}
              </tr>
              <tr>
                <th>Aplicatii</th>
                {allEngines.map((other) => (
                  <td key={other.id} className={other.id === engine.id ? 'col-active' : ''}>
                    {other.bestFor[0]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pros-cons">
          <div>
            <h3>Avantaje principale</h3>
            <ul>
              {engine.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Compromisuri</h3>
            <ul>
              {engine.tradeoffs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function translateSpec(key: string): string {
  const map: Record<string, string> = {
    bore: 'Alezaj (diametru cilindru)',
    stroke: 'Cursa pistonului',
    displacement: 'Cilindree totala',
    compressionRatio: 'Raport de compresie',
    peakPressure: 'Presiune de varf in ardere',
    fuel: 'Combustibil',
    airFuelRatio: 'Raport aer-combustibil',
    ignition: 'Sistem de aprindere',
    cycleType: 'Tip ciclu termodinamic',
    invented: 'Inventator si an',
    typicalRpm: 'Plaja tipica de turatie',
    typicalEfficiency: 'Eficienta termica tipica',
  }
  return map[key] ?? key
}
