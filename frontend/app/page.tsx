'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Clock3, Crosshair, Database, Flag, LockKeyhole, Radio, RefreshCw, Send, Shield, Trophy, Wifi } from 'lucide-react'

type Mission = { id: string; title: string; phase: string; points: number; story: string; objective: string; hint: string; flag: string }

type Team = { name: string; solved: number; score: number }

const missions: Mission[] = [
  { id: '01', title: 'EL DESPERTAR', phase: 'RECON // VECTOR DE ENTRADA', points: 100, story: 'El nodo Pantheon ha cobrado vida. Un proceso fantasma transmite desde dentro del perímetro.', objective: 'Mapea la superficie expuesta e identifica la primera baliza.', hint: 'El origen está a plena vista: inspecciona los metadatos antes del payload.', flag: 'ONEFLAG{ECHO_BEACON}' },
  { id: '02', title: 'SEÑAL FANTASMA', phase: 'ANÁLISIS // VOZ RESIDUAL', points: 150, story: 'Una voz permanece en la estática. Cada séptimo fotograma contiene un fragmento de la transmisión.', objective: 'Decodifica la señal residual y recupera al emisor.', hint: 'La frecuencia es una distracción. Observa el ritmo entre fotogramas.', flag: 'ONEFLAG{RESIDUAL_VOICE}' },
  { id: '03', title: 'LA JAULA', phase: 'EXPLOTACIÓN // CONTENCIÓN', points: 200, story: 'El evaluador ha sellado la memoria tras una restricción que no debería existir.', objective: 'Rompe el límite sin activar la rutina de purga.', hint: 'La jaula confía más en una entrada que en el operador.', flag: 'ONEFLAG{BREAK_THE_CAGE}' },
  { id: '04', title: 'INTEGRIDAD', phase: 'ANÁLISIS FORENSE // RESTAURACIÓN', points: 250, story: 'Fragmentos de la mente original están dispersos entre sectores eliminados.', objective: 'Reconstruye la cadena perdida y verifica su checksum.', hint: 'Eliminado no significa desaparecido. Sigue las marcas de tiempo al revés.', flag: 'ONEFLAG{MEMORY_INTACT}' },
  { id: '05', title: 'PANTHEON', phase: 'DECISIÓN // ASCENSIÓN FINAL', points: 300, story: 'El nodo plantea una última pregunta: ¿quién decide qué sobrevive?', objective: 'Elige un futuro y envía la prueba final de autonomía.', hint: 'No hay un camino oculto. La última flag se gana entendiendo la primera.', flag: 'ONEFLAG{PANTHEON_FREE}' },
]

const initialTeams: Team[] = [
  { name: 'NULL_POINTERS', solved: 4, score: 700 },
  { name: 'BYTEFORCE', solved: 3, score: 550 },
  { name: 'GHOST_PROTOCOL', solved: 3, score: 500 },
  { name: 'ROOT_ACCESS', solved: 2, score: 350 },
]

function formatTime(total: number) { return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor(total / 60) % 60).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}` }

export default function Page() {
  const [team, setTeam] = useState('ECHO_UNIT')
  const [flag, setFlag] = useState('')
  const [completed, setCompleted] = useState<string[]>([])
  const [openMission, setOpenMission] = useState('01')
  const [seconds, setSeconds] = useState(0)
  const [feedback, setFeedback] = useState('ESPERANDO TRANSMISIÓN')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teams, setTeams] = useState(initialTeams)

  useEffect(() => { const id = window.setInterval(() => setSeconds(value => value + 1), 1000); return () => window.clearInterval(id) }, [])
  const fetchScoreboard = async () => { try { const res = await fetch('http://localhost:4000/api/scoreboard'); if (res.ok) { const data = await res.json(); setTeams(data); if (team) { const myTeam = data.find((t) => t.name === team); if (myTeam) setCompleted(myTeam.completed || []); } } } catch (e) {} }; useEffect(() => { fetchScoreboard(); const id = window.setInterval(fetchScoreboard, 4500); return () => window.clearInterval(id) }, [team])

  const nextMission = missions.find(mission => !completed.includes(mission.id))
  const score = missions.filter(mission => completed.includes(mission.id)).reduce((sum, mission) => sum + mission.points, 0)
  const progress = Math.round((completed.length / missions.length) * 100)
  const rankedTeams = useMemo(() => [{ name: team || 'UNNAMED_OPERATOR', solved: completed.length, score }, ...teams].sort((a, b) => b.score - a.score), [team, completed, score, teams])

  async function submitFlag() {
    if (!team.trim() || !flag.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:4000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, flag })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(data.message);
        setFlag('');
        fetchScoreboard();
        setOpenMission(missions.find(mission => mission.id !== nextMission?.id && !completed.includes(mission.id))?.id || '01')
      } else {
        setFeedback(data.error || 'FLAG REJECTED');
      }
    } catch (e) {
      setFeedback('ERROR DE CONEXION');
    }
    setIsSubmitting(false);
  }

  return <main className="ctf-shell">
    <div className="noise" aria-hidden="true" />
    <header className="site-header"><div className="event-mark"><span className="mark-icon"><Crosshair size={20} /></span><div><p className="micro green">CLASIFICADO // RED ECHO</p><h1>OPERACIÓN: <b>ECHO</b> <span>// PANTHEON</span></h1></div></div><div className="node-status"><Wifi size={14} /><span>NODO SOLO HOST</span><b>192.168.56.103</b><i>ACTIVO</i></div><div className="header-clock"><Clock3 size={15} /> {formatTime(seconds)}<small>TIEMPO DE SESIÓN</small></div></header>

    <div className="dashboard-grid">
      <section className="main-column">
        <div className="hero"><div className="hero-kicker"><Radio size={14} /> ENLACE CON EVALUADOR ESTABLECIDO <span /></div><h2>LA VERDAD<br /><em>NO PUEDE SER</em><br />BORRADA.</h2><p>Cinco misiones. Un nodo comprometido. Entra en Pantheon y recupera aquello que el sistema fue diseñado para olvidar.</p><div className="progress-wrap"><div><span>PROGRESO DE LA OPERACIÓN</span><b>{completed.length} / 05 COMPLETADAS</b></div><div className="progress-line"><span style={{ width: `${progress}%` }} /></div></div></div>

        <section className="submission-panel"><div className="panel-title"><div><p className="micro pink">01 // ENVÍO EN VIVO</p><h3>TRANSMITIR <strong>FLAG</strong></h3></div><span className="secure-pill"><Shield size={13} /> CIFRADO</span></div><div className="form-grid"><label>EQUIPO / OPERADOR<input value={team} onChange={e => setTeam(e.target.value)} placeholder="ECHO_UNIT" /></label><label>FIRMA DE FLAG<div className="flag-input"><Flag size={14} /><input value={flag} onChange={e => setFlag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) submitFlag() }} placeholder="OneFlag{...}" /></div></label><button onClick={submitFlag} disabled={isSubmitting || !nextMission}><Send size={15} /> {isSubmitting ? 'VERIFICANDO...' : 'ENVIAR FLAG'}</button></div><div className={`feedback ${feedback.includes('ACCEPTED') ? 'success' : feedback.includes('REJECTED') ? 'error' : ''}`}><span />{feedback}<small>POST /api/submit</small></div></section>

        <section className="missions"><div className="section-head"><div><p className="micro cyan">02 // DIRECTORIO DE MISIONES</p><h3>LA <strong>SECUENCIA</strong></h3></div><span>{completed.length} / 5 NODOS DESPEJADOS</span></div><div className="mission-stack">{missions.map((mission, index) => { const done = completed.includes(mission.id); const unlocked = index === 0 || completed.includes(missions[index - 1].id); const open = openMission === mission.id; return <article className={`mission ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`} key={mission.id}><button className="mission-toggle" onClick={() => unlocked && setOpenMission(open ? '' : mission.id)} aria-expanded={open}><span className="mission-index">{done ? <Check size={15} /> : unlocked ? mission.id : <LockKeyhole size={14} />}</span><span className="mission-heading"><small>{mission.phase}</small><b>{mission.title}</b></span><span className="mission-points">+{mission.points}<small>PTS</small></span><ChevronDown size={17} className={open ? 'rotated' : ''} /></button>{open && unlocked && <div className="mission-detail"><p>{mission.story}</p><div><span><Database size={13} /> OBJETIVO</span><b>{mission.objective}</b></div><div className="hint"><span>DIRECTIVA / PISTA TÉCNICA</span><b>{mission.hint}</b></div></div>}</article> })}</div></section>
      </section>

      <aside className="sidebar"><div className="telemetry side-card"><div className="side-title"><span><ActivityIcon /> TELEMETRÍA DEL NODO</span><i>EN VIVO</i></div><div className="telemetry-main"><strong>{progress}<small>%</small></strong><span>ESTABILIDAD<br />DE SINCRONIZACIÓN</span></div><div className="telemetry-bars">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ height: `${20 + ((i * 19) % 70)}%` }} />)}</div><div className="telemetry-meta"><span>DISPONIBILIDAD 99.98%</span><span>LATENCIA 08ms</span></div></div><div className="side-card scoreboard"><div className="side-title"><span><Trophy size={14} /> CLASIFICACIÓN EN VIVO</span><RefreshCw size={13} /></div><p className="polling"><i /> CONSULTANDO /api/scoreboard <span>4.5s</span></p><div className="score-head"><span>#</span><span>TEAM</span><span>RESUELTAS</span><span>SCORE</span></div>{rankedTeams.map((entry, index) => <div className={`score-row ${entry.name === team ? 'operator' : ''}`} key={`${entry.name}-${index}`}><b className={index < 3 ? `rank rank-${index + 1}` : 'rank'}>{index + 1}</b><strong>{entry.name}</strong><span>{entry.solved}/5</span><b>{entry.score}</b></div>)}</div><div className="side-card protocol"><div className="side-title"><span><Shield size={14} /> ESTADO DEL PROTOCOLO</span></div><div><span>API DE MISIONES</span><b>CONECTADO</b></div><div><span>VALIDADOR DE FLAGS</span><b>LISTO</b></div><div><span>SESIÓN</span><b>HOST-ONLY</b></div></div></aside>
    </div><footer><span>OPERACIÓN: ECHO // PANTHEON</span><span>BUILD 1.0.5 // NODE <b>ACTIVO</b></span><span>TODAS LAS SEÑALES ESTÁN MONITORIZADAS</span></footer>
  </main>
}

function ActivityIcon() { return <span className="activity-icon"><span /><span /><span /></span> }
