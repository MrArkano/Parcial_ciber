const fs = require('fs');
let code = fs.readFileSync('frontend/app/page.tsx', 'utf-8');

code = code.replace(
  "useEffect(() => { const id = window.setInterval(() => setTeams(value => [...value].sort((a, b) => b.score - a.score)), 4500); return () => window.clearInterval(id) }, [])",
  "const fetchScoreboard = async () => { try { const res = await fetch('http://localhost:4000/api/scoreboard'); if (res.ok) { const data = await res.json(); setTeams(data); if (team) { const myTeam = data.find((t) => t.name === team); if (myTeam) setCompleted(myTeam.completed || []); } } } catch (e) {} }; useEffect(() => { fetchScoreboard(); const id = window.setInterval(fetchScoreboard, 4500); return () => window.clearInterval(id) }, [team])"
);

code = code.replace(
  `  function submitFlag() {
    if (!nextMission || isSubmitting) return
    setIsSubmitting(true)
    window.setTimeout(() => {
      if (flag.trim().toUpperCase() === nextMission.flag) {
        setCompleted(value => [...value, nextMission.id]); setFeedback(\`FLAG ACCEPTED // \${nextMission.id} \${nextMission.title}\`); setFlag(''); setOpenMission(missions.find(mission => mission.id !== nextMission.id && !completed.includes(mission.id))?.id || '01')
      } else setFeedback('FLAG REJECTED // SIGNATURE DOES NOT MATCH')
      setIsSubmitting(false)
    }, 650)
  }`,
  `  async function submitFlag() {
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
  }`
);

fs.writeFileSync('frontend/app/page.tsx', code);
