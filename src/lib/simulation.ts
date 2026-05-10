import type { EngineDefinition, EnginePhase } from '../data/engines'

export type SimulatorControls = {
  rpm: number
  throttle: number
  load: number
}

export type SimulationState = {
  cycleDegrees: number
  crankAngle: number
  phase: EnginePhase
  phaseProgress: number
  pistonPosition: number
  pistonNormalized: number
  crankPin: { x: number; y: number }
  pistonPin: { x: number; y: number }
  intakeLift: number
  exhaustLift: number
  scavengePortOpen: number
  exhaustPortOpen: number
  sparkActive: boolean
  injectorActive: boolean
  combustionGlow: number
  cylinderPressure: number
  cylinderVolume: number
  cylinderTemperature: number
  intakeFlow: number
  exhaustFlow: number
  torque: number
  power: number
  fuelUse: number
  efficiency: number
}

const GAMMA = 1.4
const ATM = 1.013

export const ENGINE_GEOMETRY = {
  crankCenterX: 320,
  crankCenterY: 430,
  crankRadius: 48,
  rodLength: 175,
  bore: 110,
  pistonHeight: 60,
  cylinderTop: 70,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const normalizePercent = (value: number) => clamp(value, 0, 100) / 100

const wrapAngle = (angle: number, cycle: number) => ((angle % cycle) + cycle) % cycle

function valveLift(
  cycleDegrees: number,
  open: number,
  close: number,
  cycle: number,
): number {
  const wrappedOpen = wrapAngle(open, cycle)
  const wrappedClose = wrapAngle(close, cycle)
  const wrappedNow = wrapAngle(cycleDegrees, cycle)
  const window =
    wrappedClose >= wrappedOpen ? wrappedClose - wrappedOpen : cycle - wrappedOpen + wrappedClose
  if (window <= 0) return 0
  const since =
    wrappedNow >= wrappedOpen
      ? wrappedNow - wrappedOpen
      : cycle - wrappedOpen + wrappedNow
  const progress = since / window
  if (progress < 0 || progress > 1) return 0
  return Math.sin(Math.PI * progress)
}

function portOpening(
  cycleDegrees: number,
  port: { open: number; close: number } | undefined,
  cycle: number,
): number {
  if (!port) return 0
  const open = wrapAngle(port.open, cycle)
  const close = wrapAngle(port.close, cycle)
  const now = wrapAngle(cycleDegrees, cycle)
  const inside =
    close >= open ? now >= open && now <= close : now >= open || now <= close
  if (!inside) return 0
  const window = close >= open ? close - open : cycle - open + close
  const since = now >= open ? now - open : cycle - open + now
  return Math.sin(Math.PI * (since / window))
}

export function getCycleDegrees(engine: EngineDefinition, elapsedMs: number, rpm: number) {
  const rotationsPerMs = rpm / 60 / 1000
  const degrees = rotationsPerMs * elapsedMs * 360
  return wrapAngle(degrees, engine.cycleDegrees)
}

export function getActivePhase(engine: EngineDefinition, cycleDegrees: number) {
  return (
    engine.phases.find((phase) => cycleDegrees >= phase.start && cycleDegrees < phase.end) ??
    engine.phases[engine.phases.length - 1]
  )
}

export function pistonOffsetFromTDC(crankAngleRad: number) {
  const r = ENGINE_GEOMETRY.crankRadius
  const l = ENGINE_GEOMETRY.rodLength
  const sin = Math.sin(crankAngleRad)
  return r * (1 - Math.cos(crankAngleRad)) + l * (1 - Math.sqrt(1 - (r / l) ** 2 * sin * sin))
}

export function getPistonGeometry(crankAngleDeg: number) {
  const rad = (crankAngleDeg * Math.PI) / 180
  const offset = pistonOffsetFromTDC(rad)
  const r = ENGINE_GEOMETRY.crankRadius
  const l = ENGINE_GEOMETRY.rodLength
  const tdcY = ENGINE_GEOMETRY.crankCenterY - r - l
  const pistonPinY = tdcY + offset
  const pistonPin = { x: ENGINE_GEOMETRY.crankCenterX, y: pistonPinY }
  const crankPin = {
    x: ENGINE_GEOMETRY.crankCenterX + r * Math.sin(rad),
    y: ENGINE_GEOMETRY.crankCenterY - r * Math.cos(rad),
  }
  const stroke = 2 * r
  const pistonNormalized = clamp(offset / stroke, 0, 1)
  return { pistonPin, crankPin, pistonPosition: offset, pistonNormalized, stroke }
}

export function cylinderVolumeRatio(pistonNormalized: number, compressionRatio: number) {
  return 1 / compressionRatio + (1 - 1 / compressionRatio) * pistonNormalized
}

function pressureForFourStroke(
  engine: EngineDefinition,
  cycleDegrees: number,
  pistonNormalized: number,
  load: number,
  throttle: number,
): number {
  const v = cylinderVolumeRatio(pistonNormalized, engine.compressionRatio)
  const intakePressure = ATM * (0.55 + 0.45 * throttle)
  const compressionPressure = intakePressure * Math.pow(1 / Math.max(v, 0.001), GAMMA)
  const peakBoost = engine.combustionMode === 'diesel' ? 6.5 : 5
  const peakPressure = compressionPressure * (1 + peakBoost * (0.45 + 0.55 * load))

  if (cycleDegrees < 180) return intakePressure * (0.85 + 0.15 * (1 - pistonNormalized))
  if (cycleDegrees < 360) return compressionPressure
  if (cycleDegrees < 540) {
    const burnEnd = engine.combustionMode === 'diesel' ? 470 : 410
    if (cycleDegrees < burnEnd) {
      const burnProgress = (cycleDegrees - 360) / (burnEnd - 360)
      return compressionPressure + (peakPressure - compressionPressure) * Math.sin((Math.PI * burnProgress) / 2)
    }
    const expansionStart = peakPressure
    const vAtBurnEnd = cylinderVolumeRatio(
      pistonOffsetFromTDC((burnEnd * Math.PI) / 180) / (2 * ENGINE_GEOMETRY.crankRadius),
      engine.compressionRatio,
    )
    return expansionStart * Math.pow(vAtBurnEnd / Math.max(v, 0.001), GAMMA)
  }
  const blowdown = clamp((cycleDegrees - 540) / 40, 0, 1)
  return ATM * (1 + (1 - blowdown) * 0.3)
}

function pressureForTwoStroke(
  engine: EngineDefinition,
  cycleDegrees: number,
  pistonNormalized: number,
  load: number,
  throttle: number,
): number {
  const v = cylinderVolumeRatio(pistonNormalized, engine.compressionRatio)
  const trappedPressure = ATM * (0.6 + 0.4 * throttle)
  const compressionPressure = trappedPressure * Math.pow(1 / Math.max(v, 0.001), GAMMA)
  const peakPressure = compressionPressure * (1 + 4 * (0.45 + 0.55 * load))

  if (cycleDegrees < 180) return compressionPressure
  if (cycleDegrees < 240) {
    const burnProgress = (cycleDegrees - 180) / 60
    return compressionPressure + (peakPressure - compressionPressure) * Math.sin((Math.PI * burnProgress) / 2)
  }
  const expansion = peakPressure * Math.pow(0.18 / Math.max(v, 0.001), GAMMA)
  if (cycleDegrees < 290) return expansion
  return ATM * (1 + 0.15 * Math.cos(((cycleDegrees - 290) / 70) * Math.PI))
}

export function simulateEngine(
  engine: EngineDefinition,
  controls: SimulatorControls,
  elapsedMs: number,
): SimulationState {
  const cycleDegrees = getCycleDegrees(engine, elapsedMs, controls.rpm)
  const phase = getActivePhase(engine, cycleDegrees)
  const phaseProgress = (cycleDegrees - phase.start) / Math.max(phase.end - phase.start, 1)
  const throttle = normalizePercent(controls.throttle)
  const load = normalizePercent(controls.load)
  const rpmFactor = clamp((controls.rpm - 600) / 6400, 0, 1)
  const crankAngle = cycleDegrees % 360

  const { pistonPin, crankPin, pistonPosition, pistonNormalized } = getPistonGeometry(crankAngle)

  const isFourStroke = engine.cycleDegrees === 720
  const intakeLift = isFourStroke
    ? valveLift(cycleDegrees, engine.intakeValve.open, engine.intakeValve.close, engine.cycleDegrees)
    : 0
  const exhaustLift = isFourStroke
    ? valveLift(cycleDegrees, engine.exhaustValve.open, engine.exhaustValve.close, engine.cycleDegrees)
    : 0
  const scavengePortOpen = portOpening(cycleDegrees, engine.scavengePort, engine.cycleDegrees)
  const exhaustPortOpen = portOpening(cycleDegrees, engine.exhaustPort, engine.cycleDegrees)

  const sparkAdvance = engine.sparkAdvance
  const sparkActive =
    engine.ignitionMode === 'spark' && sparkAdvance !== undefined && cycleDegrees > sparkAdvance && cycleDegrees < sparkAdvance + 18
  const injectorActive =
    engine.ignitionMode === 'compression' &&
    engine.injectionStart !== undefined &&
    engine.injectionEnd !== undefined &&
    cycleDegrees >= engine.injectionStart &&
    cycleDegrees <= engine.injectionEnd

  const cylinderPressure = isFourStroke
    ? pressureForFourStroke(engine, cycleDegrees, pistonNormalized, load, throttle)
    : pressureForTwoStroke(engine, cycleDegrees, pistonNormalized, load, throttle)
  const cylinderVolume = cylinderVolumeRatio(pistonNormalized, engine.compressionRatio)
  const cylinderTemperature = (cylinderPressure / ATM) * 290 * (1 / Math.max(cylinderVolume, 0.05) ** 0.2)

  const burnWindow = isFourStroke ? cycleDegrees > 360 && cycleDegrees < 470 : cycleDegrees > 180 && cycleDegrees < 250
  const burnProgress = burnWindow
    ? Math.sin(Math.PI * clamp((cycleDegrees - (isFourStroke ? 360 : 180)) / (isFourStroke ? 110 : 70), 0, 1))
    : 0
  const combustionGlow = burnProgress * (0.6 + 0.4 * load)

  const intakeFlow = isFourStroke ? intakeLift * (0.4 + throttle * 0.6) : scavengePortOpen * (0.3 + throttle * 0.7)
  const exhaustFlow = isFourStroke ? exhaustLift : exhaustPortOpen

  const torqueCurve = Math.sin(Math.PI * clamp(rpmFactor * 0.85 + 0.15, 0, 1))
  const torque = Math.round(
    (24 + 86 * throttle * load * torqueCurve * engine.torqueBias) * (burnProgress > 0 ? 1.05 : 0.78),
  )
  const power = Math.round((torque * controls.rpm) / 7127)
  const fuelUse = Math.round((20 + controls.rpm / 110 + throttle * 60 + load * 32) * engine.fuelIntensity)
  const efficiency = Math.round(
    (engine.baseEfficiency + load * 0.07 - rpmFactor * 0.05 + (engine.combustionMode === 'diesel' ? 0.04 : 0)) * 100,
  )

  return {
    cycleDegrees,
    crankAngle,
    phase,
    phaseProgress,
    pistonPosition,
    pistonNormalized,
    crankPin,
    pistonPin,
    intakeLift,
    exhaustLift,
    scavengePortOpen,
    exhaustPortOpen,
    sparkActive,
    injectorActive,
    combustionGlow,
    cylinderPressure,
    cylinderVolume,
    cylinderTemperature,
    intakeFlow,
    exhaustFlow,
    torque,
    power,
    fuelUse,
    efficiency,
  }
}

export function buildPVCurve(
  engine: EngineDefinition,
  controls: SimulatorControls,
  steps = 360,
): { volume: number; pressure: number; angle: number }[] {
  const points: { volume: number; pressure: number; angle: number }[] = []
  const throttle = normalizePercent(controls.throttle)
  const load = normalizePercent(controls.load)
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * engine.cycleDegrees
    const { pistonNormalized } = getPistonGeometry(angle % 360)
    const v = cylinderVolumeRatio(pistonNormalized, engine.compressionRatio)
    const p =
      engine.cycleDegrees === 720
        ? pressureForFourStroke(engine, angle, pistonNormalized, load, throttle)
        : pressureForTwoStroke(engine, angle, pistonNormalized, load, throttle)
    points.push({ volume: v, pressure: p, angle })
  }
  return points
}
