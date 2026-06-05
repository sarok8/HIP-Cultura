import React, { useState, useEffect, useMemo } from "react";

/* =========================================================================
   HIP CULTURA — Autoavaluació d'innovació ciutadana en institucions culturals
   Basat en el model Hexàgon de la Innovació Pública (HIP) de Raúl Oliván.
   Sis vectors: OPEN, TRANS, FAST, PROTO, CO, TEC.
   ========================================================================= */

const VECTORS = [
  {
    id: "OPEN",
    nom: "OPEN",
    subtitol: "Obertura",
    color: "#8FC9B5",
    descripcio:
      "Obrir processos, dades i continguts a la ciutadania. Llicències lliures, transparència i cultura del compartir.",
    preguntes: [
      "Publiquem dades, continguts o materials amb llicències obertes (Creative Commons, codi obert…).",
      "La ciutadania pot accedir lliurement als nostres processos de decisió i a com fem les coses.",
      "Documentem i compartim públicament els nostres projectes perquè altres els puguin replicar.",
      "Fem servir o promovem programari i eines lliures dins la institució.",
    ],
  },
  {
    id: "TRANS",
    nom: "TRANS",
    subtitol: "Transversalitat",
    color: "#EFD98A",
    descripcio:
      "Mesclar disciplines, perfils i sectors. Trencar compartiments i crear ponts entre àrees, institucions i comunitats.",
    preguntes: [
      "Treballem amb equips que barregen disciplines diferents (art, tecnologia, ciència social…).",
      "Col·laborem habitualment amb altres institucions, sectors o àmbits aliens al nostre.",
      "Creem espais on es troben perfils molt diversos de ciutadania (edats, orígens, capacitats…).",
      "Busquem formats híbrids que combinen allò presencial i digital, o allò cultural i social.",
    ],
  },
  {
    id: "FAST",
    nom: "FAST",
    subtitol: "Agilitat",
    color: "#F2B8C6",
    descripcio:
      "Actuar ràpid, iterar, escalar i replicar. Cicles curts i capacitat d'adaptació enfront de processos lents i rígids.",
    preguntes: [
      "Podem posar en marxa una iniciativa nova sense processos administratius llargs i feixucs.",
      "Treballem per cicles curts, provant i ajustant sobre la marxa en comptes d'esperar el pla perfecte.",
      "Quan una cosa funciona, sabem escalar-la o replicar-la a altres contextos.",
      "Ens adaptem amb rapidesa a canvis o imprevistos de l'entorn.",
    ],
  },
  {
    id: "PROTO",
    nom: "PROTO",
    subtitol: "Prototipatge",
    color: "#A9D3EC",
    descripcio:
      "Treballar amb maquetes, pilots i productes mínims viables. Cultura maker: fer per pensar, aprendre fent.",
    preguntes: [
      "Provem idees amb prototips, pilots o maquetes abans de desplegar-les del tot.",
      "Disposem d'espais, eines o recursos per fabricar i experimentar (maker, tallers…).",
      "Acceptem l'error i l'aprenentatge com a part natural del procés d'innovar.",
      "Llancem versions inicials (PMV) i les anem millorant amb el retorn de la ciutadania.",
    ],
  },
  {
    id: "CO",
    nom: "CO",
    subtitol: "Col·laboració",
    color: "#C5B8E0",
    descripcio:
      "Cocreació amb la ciutadania de baix a dalt. Comunitat, intel·ligència col·lectiva i protagonisme ciutadà.",
    preguntes: [
      "La ciutadania participa en el disseny dels projectes, no només com a públic receptor.",
      "Tenim una comunitat activa al voltant de la institució que aporta i decideix.",
      "Fem servir dinàmiques de cocreació (tallers de codisseny, processos participatius…).",
      "Donem protagonisme a iniciatives que neixen de baix a dalt (de la ciutadania cap a la institució).",
    ],
  },
  {
    id: "TEC",
    nom: "TEC",
    subtitol: "Tecnologia",
    color: "#F4C49A",
    descripcio:
      "Aprofitar allò digital: mitjans, audiovisual, dades. La tecnologia com a palanca de connexió i creativitat.",
    preguntes: [
      "Fem servir eines digitals per connectar amb la ciutadania i ampliar el nostre abast.",
      "Produïm o difonem continguts en formats digitals i audiovisuals.",
      "Recollim i analitzem dades per entendre millor la nostra comunitat i millorar.",
      "L'equip té competències digitals suficients per innovar amb tecnologia.",
    ],
  },
];

/* Recomanacions per vector segons el nivell de puntuació */
const RECOMANACIONS = {
  OPEN: [
    "Comenceu publicant un projecte amb llicència Creative Commons i documentant-ne el procés.",
    "Obriu un repositori públic (web, GitHub o similar) amb materials reutilitzables.",
    "Adopteu una política de dades obertes per defecte: obert tret que hi hagi raó per no fer-ho.",
  ],
  TRANS: [
    "Convideu un perfil d'una disciplina aliena a participar en el vostre proper projecte.",
    "Establiu una aliança estable amb una institució d'un altre sector (educatiu, social, tecnològic).",
    "Dissenyeu un format híbrid presencial+digital per a una activitat existent.",
  ],
  FAST: [
    "Creeu una via ràpida interna per a microprojectes que eviti la burocràcia llarga.",
    "Adopteu cicles curts de treball (sprints) amb revisions freqüents.",
    "Identifiqueu un projecte que funcioni i feu un pla senzill per replicar-lo.",
  ],
  PROTO: [
    "Abans del proper gran projecte, feu un pilot petit per validar la idea.",
    "Habiliteu un espai o kit bàsic d'experimentació (maker) per a l'equip i la comunitat.",
    "Instaureu una cultura de PMV: llanceu aviat, milloreu amb el retorn rebut.",
  ],
  CO: [
    "Incorporeu un taller de codisseny amb ciutadania a la fase inicial d'un projecte.",
    "Cultiveu una comunitat activa: trobades periòdiques, canals oberts, reconeixement.",
    "Doneu suport a una iniciativa que hagi sorgit de baix a dalt des de la comunitat.",
  ],
  TEC: [
    "Reforceu les competències digitals de l'equip amb formació pràctica.",
    "Comenceu a recollir dades senzilles sobre la vostra comunitat i a fer-ne servir per decidir.",
    "Experimenteu amb un format audiovisual o digital nou per difondre la vostra feina.",
  ],
};

const ESCALA = [
  { v: 1, label: "Gens" },
  { v: 2, label: "Poc" },
  { v: 3, label: "Força" },
  { v: 4, label: "Molt" },
];

const STORAGE_KEY = "hip_cultura_historic";

/* =========================================================================
   ▼▼▼  CONFIGURACIÓ EDITABLE  ▼▼▼
   Canvia aquí els textos de la pantalla de presentació i el logo.
   No cal tocar res més del fitxer.
   ========================================================================= */
const CONFIG = {
  // Text petit de dalt (categoria)
  kicker: "Hexàgon de la Innovació Pública",
  // Títol principal
  titol: "HIP Cultura",
  // Paràgraf de presentació (pots escriure el que vulguis)
  presentacio:
    "Una eina d'autoavaluació perquè la teva institució cultural descobreixi on posar més esforços per avançar cap a la innovació ciutadana. Basada en els sis vectors del model HIP de Raúl Oliván.",
  // Peu de la pantalla d'inici
  peu: "24 preguntes · 4 per vector · escala 1–4",

  // LOGO:
  // Opció 1 (per defecte): logo dibuixat en SVG, no cal cap fitxer.
  // Opció 2: posa el teu logo a la carpeta "public" (p. ex. public/logo.png)
  //          i escriu aquí la ruta -> logoSrc: "logo.png"
  //          Deixa-ho a null per fer servir el logo SVG per defecte.
  logoSrc: null,
};
/* ▲▲▲  FI DE LA CONFIGURACIÓ EDITABLE  ▲▲▲ */

/* Logo: si CONFIG.logoSrc té una ruta, mostra la imatge; si no, el logo SVG. */
function Logo() {
  if (CONFIG.logoSrc) {
    return (
      <img
        src={CONFIG.logoSrc}
        alt="ADHOC Cultura"
        style={{ height: 56, width: "auto", display: "block", marginBottom: 8 }}
      />
    );
  }
  // Logo SVG per defecte (marca hexagonal + nom), substituïble pel logo oficial.
  return (
    <svg width="190" height="56" viewBox="0 0 190 56" style={{ display: "block", marginBottom: 8 }}>
      <polygon
        points="28,6 47,17 47,39 28,50 9,39 9,17"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2.5"
      />
      <polygon points="28,16 37,21.5 37,32.5 28,38 19,32.5 19,21.5" fill="#9a3b3b" />
      <text x="60" y="26" style={{ font: "700 20px 'Space Grotesk', sans-serif", fill: "#1a1a1a" }}>
        ADHOC
      </text>
      <text x="60" y="44" style={{ font: "700 14px 'Space Mono', monospace", letterSpacing: "0.22em", fill: "#9a3b3b" }}>
        CULTURA
      </text>
    </svg>
  );
}

/* ---- Geometria de l'hexàgon radar ---- */
function hexPoint(cx, cy, r, i) {
  // 6 vèrtexs, començant a dalt i en sentit horari
  const ang = (Math.PI / 180) * (60 * i - 90);
  return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
}

function HexRadar({ scores, size = 360 }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.34;
  const rings = [0.25, 0.5, 0.75, 1];

  const gridPolys = rings.map((f) =>
    VECTORS.map((_, i) => hexPoint(cx, cy, R * f, i).join(",")).join(" ")
  );

  const dataPts = VECTORS.map((vec, i) => {
    const s = scores[vec.id] ?? 0; // 0..4
    const f = s / 4;
    return hexPoint(cx, cy, R * f, i);
  });
  const dataPoly = dataPts.map((p) => p.join(",")).join(" ");

  const labels = VECTORS.map((vec, i) => {
    const [x, y] = hexPoint(cx, cy, R * 1.28, i);
    return { x, y, vec };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }}>
      {/* anells */}
      {gridPolys.map((pts, idx) => (
        <polygon
          key={idx}
          points={pts}
          fill="none"
          stroke="#1a1a1a"
          strokeOpacity={0.12}
          strokeWidth={1}
        />
      ))}
      {/* radis */}
      {VECTORS.map((_, i) => {
        const [x, y] = hexPoint(cx, cy, R, i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#1a1a1a"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        );
      })}
      {/* degradats radials per vector */}
      <defs>
        {VECTORS.map((vec, i) => (
          <radialGradient key={i} id={`grad-${vec.id}`} cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor={vec.color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={vec.color} stopOpacity={0.85} />
          </radialGradient>
        ))}
      </defs>
      {/* sectors acolorits: un triangle per vector, centre → vèrtex → vèrtex següent */}
      {dataPts.map((p, i) => {
        const next = dataPts[(i + 1) % dataPts.length];
        return (
          <polygon
            key={`sector-${i}`}
            points={`${cx},${cy} ${p[0]},${p[1]} ${next[0]},${next[1]}`}
            fill={`url(#grad-${VECTORS[i].id})`}
            stroke="#fff"
            strokeWidth={0.75}
          />
        );
      })}
      {/* contorn de l'àrea de dades */}
      <polygon
        points={dataPoly}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={2}
      />
      {/* punts de dades amb color de vector */}
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={6} fill={VECTORS[i].color} stroke="#1a1a1a" strokeWidth={1.5} />
      ))}
      {/* etiquetes */}
      {labels.map(({ x, y, vec }, i) => (
        <g key={i}>
          <text
            x={x}
            y={y - 4}
            textAnchor="middle"
            style={{ font: "700 14px 'Space Mono', monospace", fill: "#1a1a1a" }}
          >
            {vec.nom}
          </text>
          <text
            x={x}
            y={y + 12}
            textAnchor="middle"
            style={{ font: "600 12px 'Space Mono', monospace", fill: vec.color }}
          >
            {(scores[vec.id] ?? 0).toFixed(1)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function HIPCultura() {
  const [fase, setFase] = useState("intro"); // intro | test | resultat | historic
  const [respostes, setRespostes] = useState({}); // {OPEN-0: 3, ...}
  const [vectorActual, setVectorActual] = useState(0);
  const [nomInstitucio, setNomInstitucio] = useState("");
  const [historic, setHistoric] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistoric(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setResposta = (vecId, qIdx, val) =>
    setRespostes((r) => ({ ...r, [`${vecId}-${qIdx}`]: val }));

  const scores = useMemo(() => {
    const out = {};
    VECTORS.forEach((vec) => {
      const vals = vec.preguntes.map((_, i) => respostes[`${vec.id}-${i}`] || 0);
      const omplerts = vals.filter((v) => v > 0);
      out[vec.id] = omplerts.length
        ? omplerts.reduce((a, b) => a + b, 0) / omplerts.length
        : 0;
    });
    return out;
  }, [respostes]);

  const totalPreguntes = VECTORS.length * 4;
  const respostes_fetes = Object.values(respostes).filter((v) => v > 0).length;
  const completat = respostes_fetes === totalPreguntes;
  const global =
    VECTORS.reduce((a, v) => a + (scores[v.id] || 0), 0) / VECTORS.length;

  const vectorsFebles = useMemo(
    () =>
      [...VECTORS]
        .map((v) => ({ ...v, score: scores[v.id] || 0 }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3),
    [scores]
  );

  const desar = () => {
    const registre = {
      data: new Date().toISOString(),
      institucio: nomInstitucio || "Sense nom",
      scores,
      global,
    };
    const nou = [registre, ...historic].slice(0, 50);
    setHistoric(nou);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nou));
    } catch (e) {
      console.error(e);
    }
  };

  const reiniciar = () => {
    setRespostes({});
    setVectorActual(0);
    setFase("intro");
  };

  const vec = VECTORS[vectorActual];
  const vecComplet = vec.preguntes.every((_, i) => respostes[`${vec.id}-${i}`] > 0);

  /* ----------------------------- ESTILS ----------------------------- */
  const S = {
    wrap: {
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      background: "#F4F1EA",
      color: "#1a1a1a",
      minHeight: "100vh",
      padding: "0",
    },
    inner: { maxWidth: 880, margin: "0 auto", padding: "32px 24px 80px" },
    kicker: {
      font: "700 12px 'Space Mono', monospace",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "#9a3b3b",
    },
    h1: { font: "700 clamp(34px,7vw,58px) 'Space Grotesk', sans-serif", lineHeight: 1.02, margin: "8px 0 16px", letterSpacing: "-0.02em" },
    btn: {
      background: "#1a1a1a",
      color: "#F4F1EA",
      border: "none",
      padding: "14px 26px",
      font: "700 15px 'Space Grotesk', sans-serif",
      cursor: "pointer",
      borderRadius: 2,
    },
    btnGhost: {
      background: "transparent",
      color: "#1a1a1a",
      border: "1.5px solid #1a1a1a",
      padding: "14px 26px",
      font: "700 15px 'Space Grotesk', sans-serif",
      cursor: "pointer",
      borderRadius: 2,
    },
  };

  /* ----------------------------- INTRO ----------------------------- */
  if (fase === "intro") {
    return (
      <div style={S.wrap}>
        <FontLink />
        <div style={S.inner}>
          <Logo />
          <p style={S.kicker}>{CONFIG.kicker}</p>
          <h1 style={S.h1}>{CONFIG.titol}</h1>
          <p style={{ font: "400 19px/1.55 'Space Grotesk'", maxWidth: 620, color: "#333" }}>
            {CONFIG.presentacio}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "32px 0" }}>
            {VECTORS.map((v) => (
              <div
                key={v.id}
                style={{
                  background: v.color,
                  padding: "10px 16px",
                  borderRadius: 2,
                  font: "700 14px 'Space Mono', monospace",
                  border: "1.5px solid #1a1a1a",
                }}
              >
                {v.nom} · {v.subtitol}
              </div>
            ))}
          </div>

          <div style={{ margin: "24px 0 32px", maxWidth: 420 }}>
            <label style={{ font: "700 13px 'Space Mono'", display: "block", marginBottom: 8 }}>
              NOM DE LA INSTITUCIÓ (opcional)
            </label>
            <input
              value={nomInstitucio}
              onChange={(e) => setNomInstitucio(e.target.value)}
              placeholder="p. ex. Museu, Centre cultural, Biblioteca, Institució…"
              style={{
                width: "100%",
                padding: "12px 14px",
                font: "400 16px 'Space Grotesk'",
                border: "1.5px solid #1a1a1a",
                borderRadius: 2,
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={S.btn} onClick={() => setFase("test")}>
              Començar l'autoavaluació →
            </button>
            {historic.length > 0 && (
              <button style={S.btnGhost} onClick={() => setFase("historic")}>
                Veure històric ({historic.length})
              </button>
            )}
          </div>

          <p style={{ font: "400 13px 'Space Mono'", color: "#888", marginTop: 48 }}>
            {CONFIG.peu}
          </p>
        </div>
      </div>
    );
  }

  /* ----------------------------- TEST ----------------------------- */
  if (fase === "test") {
    return (
      <div style={S.wrap}>
        <FontLink />
        <div style={S.inner}>
          {/* progress vectors */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {VECTORS.map((v, i) => {
              const fet = v.preguntes.every((_, qi) => respostes[`${v.id}-${qi}`] > 0);
              return (
                <button
                  key={v.id}
                  onClick={() => setVectorActual(i)}
                  title={v.nom}
                  style={{
                    flex: 1,
                    height: 8,
                    border: "1px solid #1a1a1a",
                    cursor: "pointer",
                    background: i === vectorActual ? "#1a1a1a" : fet ? v.color : "transparent",
                    borderRadius: 1,
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span
              style={{
                background: vec.color,
                padding: "6px 14px",
                font: "700 22px 'Space Mono'",
                border: "1.5px solid #1a1a1a",
                borderRadius: 2,
              }}
            >
              {vec.nom}
            </span>
            <span style={{ font: "700 22px 'Space Grotesk'" }}>{vec.subtitol}</span>
            <span style={{ font: "400 13px 'Space Mono'", color: "#888", marginLeft: "auto" }}>
              {vectorActual + 1} / {VECTORS.length}
            </span>
          </div>

          <p style={{ font: "400 16px/1.5 'Space Grotesk'", color: "#444", maxWidth: 640, margin: "12px 0 28px" }}>
            {vec.descripcio}
          </p>

          {vec.preguntes.map((q, qi) => {
            const val = respostes[`${vec.id}-${qi}`] || 0;
            return (
              <div
                key={qi}
                style={{
                  background: "#fff",
                  border: "1.5px solid #1a1a1a",
                  borderRadius: 2,
                  padding: "18px 20px",
                  marginBottom: 14,
                }}
              >
                <p style={{ font: "500 16px/1.4 'Space Grotesk'", margin: "0 0 14px" }}>{q}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ESCALA.map((e) => (
                    <button
                      key={e.v}
                      onClick={() => setResposta(vec.id, qi, e.v)}
                      style={{
                        flex: "1 1 80px",
                        padding: "10px 8px",
                        cursor: "pointer",
                        borderRadius: 2,
                        border: "1.5px solid #1a1a1a",
                        background: val === e.v ? vec.color : "#F4F1EA",
                        font: "700 13px 'Space Grotesk'",
                        transition: "background .15s",
                      }}
                    >
                      <span style={{ display: "block", font: "700 18px 'Space Mono'" }}>{e.v}</span>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            {vectorActual > 0 && (
              <button style={S.btnGhost} onClick={() => setVectorActual((i) => i - 1)}>
                ← Anterior
              </button>
            )}
            {vectorActual < VECTORS.length - 1 ? (
              <button
                style={{ ...S.btn, opacity: vecComplet ? 1 : 0.4 }}
                disabled={!vecComplet}
                onClick={() => setVectorActual((i) => i + 1)}
              >
                Següent vector →
              </button>
            ) : (
              <button
                style={{ ...S.btn, opacity: completat ? 1 : 0.4 }}
                disabled={!completat}
                onClick={() => {
                  desar();
                  setFase("resultat");
                }}
              >
                Veure resultats →
              </button>
            )}
            <button style={{ ...S.btnGhost, marginLeft: "auto" }} onClick={reiniciar}>
              Cancel·lar
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- RESULTAT ----------------------------- */
  if (fase === "resultat") {
    return (
      <div style={S.wrap}>
        <FontLink />
        <div style={S.inner}>
          <p style={S.kicker}>Resultat de l'autoavaluació</p>
          <h1 style={{ ...S.h1, fontSize: "clamp(28px,5vw,42px)" }}>
            {nomInstitucio || "La teva institució"}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "12px 0 24px",
            }}
          >
            <HexRadar scores={scores} size={460} />
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <div style={{ font: "700 13px 'Space Mono'", color: "#888" }}>PUNTUACIÓ GLOBAL</div>
              <div style={{ font: "700 64px 'Space Grotesk'", lineHeight: 1 }}>
                {global.toFixed(1)}
                <span style={{ font: "400 22px 'Space Mono'", color: "#888" }}> / 4</span>
              </div>
            </div>
          </div>

          {/* recomanacions */}
          <p style={S.kicker}>On posar esforços ara</p>
          <h2 style={{ font: "700 26px 'Space Grotesk'", margin: "6px 0 20px" }}>
            Els teus 3 vectors més fluixos
          </h2>
          {vectorsFebles.map((v) => (
            <div
              key={v.id}
              style={{
                background: "#fff",
                border: "1.5px solid #1a1a1a",
                borderLeft: `6px solid ${v.color}`,
                borderRadius: 2,
                padding: "18px 20px",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ font: "700 17px 'Space Grotesk'" }}>
                  {v.nom} · {v.subtitol}
                </span>
                <span style={{ font: "700 15px 'Space Mono'", color: "#9a3b3b" }}>
                  {v.score.toFixed(1)} / 4
                </span>
              </div>
              <ul style={{ margin: "12px 0 0", paddingLeft: 20 }}>
                {RECOMANACIONS[v.id].map((r, i) => (
                  <li key={i} style={{ font: "400 15px/1.5 'Space Grotesk'", color: "#333", marginBottom: 6 }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <button style={S.btn} onClick={() => window.print()}>
              Imprimir / desar PDF
            </button>
            <button style={S.btnGhost} onClick={() => setFase("historic")}>
              Veure històric
            </button>
            <button style={S.btnGhost} onClick={reiniciar}>
              Nova avaluació
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- HISTÒRIC ----------------------------- */
  if (fase === "historic") {
    return (
      <div style={S.wrap}>
        <FontLink />
        <div style={S.inner}>
          <p style={S.kicker}>Evolució en el temps</p>
          <h1 style={{ ...S.h1, fontSize: "clamp(28px,5vw,42px)" }}>Històric</h1>

          {historic.length === 0 ? (
            <p style={{ font: "400 17px 'Space Grotesk'", color: "#666" }}>
              Encara no hi ha avaluacions desades.
            </p>
          ) : (
            <div style={{ marginTop: 20 }}>
              {historic.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #1a1a1a",
                    borderRadius: 2,
                    padding: "16px 20px",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ font: "700 16px 'Space Grotesk'" }}>{h.institucio}</span>
                    <span style={{ font: "400 13px 'Space Mono'", color: "#888" }}>
                      {new Date(h.data).toLocaleDateString("ca-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {VECTORS.map((v) => (
                      <span
                        key={v.id}
                        style={{
                          font: "700 12px 'Space Mono'",
                          background: v.color,
                          padding: "3px 8px",
                          borderRadius: 2,
                          border: "1px solid #1a1a1a",
                        }}
                      >
                        {v.nom} {(h.scores[v.id] || 0).toFixed(1)}
                      </span>
                    ))}
                    <span
                      style={{
                        font: "700 12px 'Space Mono'",
                        background: "#1a1a1a",
                        color: "#fff",
                        padding: "3px 8px",
                        borderRadius: 2,
                        marginLeft: "auto",
                      }}
                    >
                      GLOBAL {h.global.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <button style={S.btn} onClick={reiniciar}>
              Nova avaluació
            </button>
            {historic.length > 0 && (
              <button
                style={S.btnGhost}
                onClick={() => {
                  if (window.confirm("Esborrar tot l'històric?")) {
                    setHistoric([]);
                    try {
                      localStorage.removeItem(STORAGE_KEY);
                    } catch (e) {}
                  }
                }}
              >
                Esborrar històric
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function FontLink() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
      * { box-sizing: border-box; }
      @media print {
        button { display: none !important; }
        body { background: #fff !important; }
      }
    `}</style>
  );
}
