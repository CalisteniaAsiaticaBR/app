/**
 * CALISTENIA ASIÁTICA — script.js
 * Firebase Auth + Firestore
 */

/* ================================================================
   FIREBASE — CDN (via import no index.html)
   ================================================================ */
import { initializeApp }                        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider,
         signInWithPopup, signOut,
         onAuthStateChanged }                   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc,
         collection, addDoc, deleteDoc,
         getDocs, query, orderBy }              from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDvuehkv2Z1h9RcYDSv_lGc-2C4mUpZYD0",
  authDomain:        "calistenia-asiatica-92e59.firebaseapp.com",
  projectId:         "calistenia-asiatica-92e59",
  storageBucket:     "calistenia-asiatica-92e59.firebasestorage.app",
  messagingSenderId: "474292731295",
  appId:             "1:474292731295:web:7a25053fa8a809aad211aa"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* ================================================================
   BANCO DE EXERCÍCIOS
   ================================================================ */
const EXERCISES_DB = [
  { id:1,  name:"Prancha",                        level:"Iniciante",    series:3, reps:30, video:"https://www.youtube.com/embed/FmAs74_Ywkw",    desc:"Apoie as mãos no chão com os ombros à frente dos pulsos. Mantenha o corpo reto, contraindo abdômen e glúteos. Segure a posição pelos 30 segundos indicados. Descanse 30s entre as séries." },
  { id:2,  name:"Prancha Lateral",                level:"Iniciante",    series:3, reps:20, video:"https://www.youtube.com/embed/ShkY1ngVch8",    desc:"Posicione-se de lado com o cotovelo flexionado e o antebraço apoiado no chão. Eleve o quadril formando uma linha reta com o ombro. Segure 20 segundos de cada lado. Descanse 30s entre as séries." },
  { id:3,  name:"Abdominal Giro Russo",           level:"Iniciante",    series:3, reps:12, video:"https://www.youtube.com/embed/rd1X5PinKYA",    desc:"Sente-se no chão, incline o tronco levemente para trás e contraia o abdômen. Gire o tronco de um lado para o outro em movimentos suaves. Pode manter os pés no chão no início. Cada giro conta como 1 repetição." },
  { id:4,  name:"Flexão Simples",                 level:"Iniciante",    series:3, reps:8,  video:"https://www.youtube.com/embed/5r1N75P33JU",    desc:"Apoie as mãos no chão na altura do peito, um pouco mais afastadas que os ombros. Deixe os joelhos apoiados no chão. Contraia abdômen e glúteos, flexione os cotovelos descendo o corpo com controle e suba." },
  { id:5,  name:"Pike Push Up",                   level:"Iniciante",    series:3, reps:8,  video:"https://www.youtube.com/embed/r-OxqgWvhmA",    desc:"Fique em pé, incline o corpo para frente e apoie as mãos no chão formando um V invertido. Flexione os cotovelos até a cabeça quase tocar o chão e suba. Trabalha principalmente os ombros." },
  { id:6,  name:"Tríceps no Banco (Dip)",         level:"Iniciante",    series:3, reps:10, video:"https://www.youtube.com/embed/tGrcSEZic6E",    desc:"Fique de costas para uma cadeira ou banco. Apoie as duas mãos com os dedos voltados para frente. Flexione e estenda os cotovelos elevando e abaixando o corpo com controle." },
  { id:7,  name:"Passada com Salto",              level:"Intermediário", series:3, reps:10, video:"https://www.youtube.com/embed/cFaDlAoKKsQ",   desc:"Dê uma passada à frente e flexione a perna de trás até quase tocar o chão. Realize um salto e troque a posição das pernas no ar. Se for difícil, faça a passada comum sem salto primeiro." },
  { id:8,  name:"Agachamento Isométrico na Parede", level:"Iniciante", series:3, reps:30, video:"https://www.youtube.com/embed/HOj3SWjMYkc",    desc:"Encoste as costas na parede e desça até as coxas ficarem paralelas ao chão. As pernas devem formar 90 graus. Segure a posição pelos 30 segundos indicados. Descanse 45s entre as séries." },
  { id:9,  name:"Alpinista",                      level:"Iniciante",    series:3, reps:20, video:"https://www.youtube.com/embed/h0cWLVOJXv0",    desc:"Posicione-se em prancha alta com os ombros à frente dos pulsos. Eleve um joelho em direção às mãos de forma controlada e retorne. Alterne as pernas. Cada joelho elevado conta como 1 repetição." },
  { id:10, name:"Polichinelo",                    level:"Iniciante",    series:3, reps:20, video:"https://www.youtube.com/embed/3c1qnjfNu9Y",    desc:"Una as mãos sobre a cabeça e afaste os pés ao mesmo tempo. Em seguida, una os pés e abaixe os braços. Adicione pequenos saltos. Ótimo para aquecimento ou finalizar o treino." },
  { id:11, name:"Subida Unilateral",              level:"Iniciante",    series:3, reps:10, video:"https://www.youtube.com/embed/TNFcnm_3_cE",    desc:"Use um banco firme, degrau ou mureta. Suba com uma perna só, estendendo-a completamente, e retorne com controle. Faça todas as repetições de um lado antes de trocar." },
  { id:12, name:"Elevação Pélvica",               level:"Iniciante",    series:3, reps:15, video:"https://www.youtube.com/embed/j1n3jHR-SMk",    desc:"Deite de costas com as pernas flexionadas e os pés apoiados no chão. Eleve o quadril contraindo os glúteos até o corpo formar uma linha reta dos ombros aos joelhos. Segure 2 segundos no topo." },
  { id:13, name:"Agachamento Búlgaro",            level:"Intermediário", series:3, reps:8,  video:"https://www.youtube.com/embed/A9FeeYd2uzw",  desc:"Apoie o peito do pé de trás em uma cadeira ou superfície elevada. Desça o corpo até a coxa ficar paralela ao chão. Mantenha o tronco ereto e o joelho da frente alinhado com o pé." },
  { id:14, name:"Flexão Inclinada",               level:"Intermediário", series:3, reps:8,  video:"https://www.youtube.com/embed/7cCl3AA6dsM",  desc:"Apoie as mãos em uma barra fixa, mesa ou superfície elevada, ficando inclinada em relação ao chão. Flexione e estenda os cotovelos mantendo o corpo reto." }
];

/* ================================================================
   ESTADO
   ================================================================ */
const State = {
  user:       null,   // usuária logada
  perfil:     null,   // { nome, sobrenome, idade }
  pesos:      [],
  treino:     null,
  treinoDate: ''
};

/* ================================================================
   UTILS
   ================================================================ */
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => { t.className = 'toast'; }, 3000);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

function pickRandom(arr, n) {
  const copy = [...arr], result = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/* ================================================================
   FIRESTORE — HELPERS
   ================================================================ */
function userRef(path) {
  return doc(db, 'usuarios', State.user.uid, ...path.split('/'));
}

function userCol(path) {
  return collection(db, 'usuarios', State.user.uid, path);
}

async function salvarPerfil(perfil) {
  await setDoc(userRef('dados/perfil'), perfil);
}

async function carregarPerfil() {
  const snap = await getDoc(userRef('dados/perfil'));
  return snap.exists() ? snap.data() : null;
}

async function salvarTreino(treino, data) {
  await setDoc(userRef('dados/treino'), { exercicios: treino, data });
}

async function carregarTreino() {
  const snap = await getDoc(userRef('dados/treino'));
  return snap.exists() ? snap.data() : null;
}

async function adicionarPeso(registro) {
  const ref = await addDoc(userCol('pesos'), registro);
  return ref.id;
}

async function removerPeso(firestoreId) {
  await deleteDoc(doc(db, 'usuarios', State.user.uid, 'pesos', firestoreId));
}

async function carregarPesos() {
  const q    = query(userCol('pesos'), orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
}

/* ================================================================
   AUTENTICAÇÃO
   ================================================================ */
const provider = new GoogleAuthProvider();

document.getElementById('loginGoogleBtn').addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    showToast('Erro ao fazer login. Tente novamente.', 'error');
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (!confirm('Deseja sair da sua conta?')) return;
  await signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    State.user = user;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appContent').classList.remove('hidden');
    await inicializarApp();
  } else {
    State.user = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appContent').classList.add('hidden');
  }
});

/* ================================================================
   INICIALIZAÇÃO PÓS-LOGIN
   ================================================================ */
async function inicializarApp() {
  showLoading(true);
  try {
    // Carrega perfil
    State.perfil = await carregarPerfil();

    // Carrega pesos
    State.pesos = await carregarPesos();

    // Carrega treino
    const treinoSalvo = await carregarTreino();
    if (treinoSalvo && treinoSalvo.data === today()) {
      State.treino     = treinoSalvo.exercicios;
      State.treinoDate = treinoSalvo.data;
    } else {
      State.treino     = null;
      State.treinoDate = today();
    }

    // Atualiza header com nome do usuário Google
    const nomeExibir = State.perfil?.nome || State.user.displayName?.split(' ')[0] || 'Guerreira';
    const greet = document.getElementById('greetName');
    if (greet) greet.textContent = nomeExibir;

    // Atualiza info do usuário na sidebar
    document.getElementById('userDisplayName').textContent = nomeExibir;
    document.getElementById('userEmail').textContent       = State.user.email;

    renderDashboard();
    renderPesoList();
    renderPesoStats();
    renderTreino();

    // Onboarding se não tem perfil
    if (!State.perfil) {
      initOnboarding();
    } else {
      document.getElementById('onboardingOverlay')?.classList.add('hidden');
    }

  } catch(e) {
    showToast('Erro ao carregar dados. Tente recarregar.', 'error');
    console.error(e);
  }
  showLoading(false);
}

function showLoading(show) {
  const el = document.getElementById('loadingScreen');
  if (el) el.classList.toggle('hidden', !show);
}

/* ================================================================
   NAVEGAÇÃO (TABS)
   ================================================================ */
const tabLabels = {
  dashboard: 'Dashboard',
  peso:      'Acompanhamento de Peso',
  treino:    'Treino do Dia'
};

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById('headerTitle').textContent = tabLabels[tab];
    closeSidebar();
    if (tab === 'dashboard') renderDashboard();
    if (tab === 'peso')      renderPesoChart();
  });
});

const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('sidebarOverlay');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});
overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

(function setHeaderDate() {
  const d    = new Date();
  const opts = { weekday:'short', day:'2-digit', month:'short', year:'numeric' };
  document.getElementById('headerDate').textContent = d.toLocaleDateString('pt-BR', opts);
})();

/* ================================================================
   DASHBOARD
   ================================================================ */
function renderDashboard() {
  const pesosArr = State.pesos;
  document.getElementById('dashPeso').textContent =
    pesosArr.length ? pesosArr[pesosArr.length - 1].kg + ' kg' : '—';
  document.getElementById('dashTreinos').textContent =
    State.treino ? State.treino.filter(e => e.done).length : 0;
  document.getElementById('dashPesos').textContent = pesosArr.length;

  const eodEl = document.getElementById('exerciseOfDay');
  if (State.treino && State.treino.length > 0) {
    const ex = State.treino[0];
    eodEl.innerHTML = `
      <div class="eod-card">
        <div class="eod-name">${ex.name}</div>
        <div class="eod-detail">📌 ${ex.level}</div>
        <div class="eod-detail">💪 ${ex.series} séries × ${ex.reps} reps</div>
        <div class="eod-detail" style="margin-top:6px;font-size:0.72rem;color:var(--gray-5)">${ex.desc}</div>
      </div>`;
  } else {
    eodEl.innerHTML = '<div class="eod-loading">Gere um treino na aba Treino do Dia!</div>';
  }
  renderMiniChart();
}

function renderMiniChart() {
  const canvas = document.getElementById('miniChart');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const pesos = [...State.pesos].sort((a, b) => a.date.localeCompare(b.date));
  if (pesos.length < 2) {
    ctx.fillStyle = '#aaa';
    ctx.font = '12px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Adicione registros de peso para ver o gráfico', W / 2, H / 2);
    return;
  }
  drawChart(ctx, pesos, W, H, true);
}

/* ================================================================
   PESO CORPORAL
   ================================================================ */
document.getElementById('pesoData').value = today();

document.getElementById('addPesoBtn').addEventListener('click', async () => {
  const data = document.getElementById('pesoData').value;
  const kg   = parseFloat(document.getElementById('pesoValor').value);

  if (!data)               { showToast('Informe a data!', 'error'); return; }
  if (isNaN(kg) || kg <= 0){ showToast('Informe um peso válido!', 'error'); return; }
  if (State.pesos.find(p => p.date === data)) {
    showToast('Já existe um registro para esta data!', 'error'); return;
  }

  const btn = document.getElementById('addPesoBtn');
  btn.disabled = true;
  try {
    const registro = { date: data, kg };
    const firestoreId = await adicionarPeso(registro);
    State.pesos.push({ firestoreId, ...registro });
    State.pesos.sort((a, b) => a.date.localeCompare(b.date));
    renderPesoList();
    renderPesoChart();
    renderPesoStats();
    document.getElementById('pesoValor').value = '';
    showToast('Peso registrado! ⚖', 'success');
  } catch(e) {
    showToast('Erro ao salvar. Tente novamente.', 'error');
  }
  btn.disabled = false;
});

function renderPesoStats() {
  const arr = State.pesos;
  if (arr.length === 0) {
    ['pesoAtual','pesoMin','pesoMax','pesoVar'].forEach(id => {
      document.getElementById(id).textContent = '—';
    });
    return;
  }
  const kgs  = arr.map(p => p.kg);
  const atual = arr[arr.length - 1].kg;
  const min  = Math.min(...kgs);
  const max  = Math.max(...kgs);
  const diff = arr.length > 1 ? (atual - arr[0].kg).toFixed(1) : 0;

  document.getElementById('pesoAtual').textContent = atual + ' kg';
  document.getElementById('pesoMin').textContent   = min + ' kg';
  document.getElementById('pesoMax').textContent   = max + ' kg';
  const varEl = document.getElementById('pesoVar');
  varEl.textContent = (diff > 0 ? '+' : '') + diff + ' kg';
  varEl.style.color = diff < 0 ? '#16a34a' : diff > 0 ? '#dc2626' : 'var(--pink)';
}

function renderPesoList() {
  const list  = document.getElementById('pesoList');
  const count = document.getElementById('pesoCount');
  const arr   = [...State.pesos].reverse();

  count.textContent = `${State.pesos.length} registro${State.pesos.length !== 1 ? 's' : ''}`;

  if (arr.length === 0) {
    list.innerHTML = `<div class="empty-state"><span>⚖</span><p>Nenhum registro de peso ainda</p></div>`;
    return;
  }

  const sorted = [...State.pesos];
  list.innerHTML = arr.map(p => {
    const sortedIdx = sorted.findIndex(x => x.firestoreId === p.firestoreId);
    const prev = sortedIdx > 0 ? sorted[sortedIdx - 1] : null;
    let diffHtml = '';
    if (prev) {
      const d   = (p.kg - prev.kg).toFixed(1);
      const cls = d < 0 ? 'diff-down' : d > 0 ? 'diff-up' : 'diff-same';
      diffHtml  = `<span class="peso-diff ${cls}">${d > 0 ? '+' : ''}${d} kg</span>`;
    }
    return `
      <div class="peso-item">
        <span class="peso-date">📅 ${formatDate(p.date)}</span>
        <span class="peso-kg">${p.kg} kg</span>
        ${diffHtml}
        <button class="btn-danger" onclick="deletePeso('${p.firestoreId}')" style="margin-left:auto">🗑</button>
      </div>`;
  }).join('');

  document.getElementById('dashPesos').textContent = State.pesos.length;
  const ultimo = State.pesos[State.pesos.length - 1];
  document.getElementById('dashPeso').textContent = ultimo ? ultimo.kg + ' kg' : '—';
}

window.deletePeso = async function(firestoreId) {
  if (!confirm('Deseja remover este registro de peso?')) return;
  try {
    await removerPeso(firestoreId);
    State.pesos = State.pesos.filter(p => p.firestoreId !== firestoreId);
    renderPesoList();
    renderPesoChart();
    renderPesoStats();
    showToast('Registro removido.', '');
  } catch(e) {
    showToast('Erro ao remover. Tente novamente.', 'error');
  }
};

/* ── GRÁFICO ────────────────────────────────────────────────────── */
function drawChart(ctx, pesos, W, H, mini = false) {
  const PAD = mini ? { t:16, r:16, b:30, l:44 } : { t:24, r:24, b:44, l:56 };
  const cW  = W - PAD.l - PAD.r;
  const cH  = H - PAD.t - PAD.b;
  const kgs = pesos.map(p => p.kg);
  const minK = Math.min(...kgs) - 2;
  const maxK = Math.max(...kgs) + 2;

  ctx.strokeStyle = '#e8e8ec'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.t + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + cW, y); ctx.stroke();
    const val = maxK - ((maxK - minK) / 4) * i;
    ctx.fillStyle = '#999';
    ctx.font = `${mini ? 10 : 11}px Space Mono, monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(val.toFixed(1), PAD.l - 6, y + 4);
  }

  const pts = pesos.map((p, i) => ({
    x: PAD.l + (i / (pesos.length - 1 || 1)) * cW,
    y: PAD.t + cH - ((p.kg - minK) / (maxK - minK)) * cH
  }));

  const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + cH);
  grad.addColorStop(0, 'rgba(255,79,163,0.25)');
  grad.addColorStop(1, 'rgba(255,79,163,0.02)');
  ctx.beginPath(); ctx.moveTo(pts[0].x, PAD.t + cH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length-1].x, PAD.t + cH);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#FF4FA3'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

  pts.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, mini ? 4 : 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FF4FA3'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    if (!mini) {
      ctx.fillStyle = '#333'; ctx.font = '10px Space Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText(pesos[i].kg + 'kg', p.x, p.y - 10);
      ctx.fillStyle = '#999';
      ctx.fillText(formatDate(pesos[i].date).slice(0, 5), p.x, PAD.t + cH + 16);
    }
  });
}

function renderPesoChart() {
  const canvas = document.getElementById('pesoChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pesos = [...State.pesos].sort((a, b) => a.date.localeCompare(b.date));
  if (pesos.length < 2) {
    ctx.fillStyle = '#aaa'; ctx.font = '13px Space Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText('Adicione pelo menos 2 registros para ver o gráfico', canvas.width/2, canvas.height/2);
    return;
  }
  drawChart(ctx, pesos, canvas.width, canvas.height, false);
}

/* ================================================================
   TREINO DO DIA
   ================================================================ */
document.getElementById('gerarTreinoBtn').addEventListener('click', gerarTreino);

async function gerarTreino() {
  const n  = Math.floor(Math.random() * 3) + 4;
  const ex = pickRandom(EXERCISES_DB, n);
  State.treino     = ex.map(e => ({ ...e, done: false }));
  State.treinoDate = today();
  try {
    await salvarTreino(State.treino, State.treinoDate);
    renderTreino();
    showToast(`Treino gerado com ${n} exercícios! 💪`, 'success');
  } catch(e) {
    showToast('Erro ao salvar treino.', 'error');
  }
}

window.toggleExercise = async function(id) {
  if (!State.treino) return;
  const ex = State.treino.find(e => e.id === id);
  if (ex) ex.done = !ex.done;
  try {
    await salvarTreino(State.treino, State.treinoDate);
  } catch(e) { /* silencioso */ }
  renderTreino();
  const done  = State.treino.filter(e => e.done).length;
  const total = State.treino.length;
  if (done === total) showToast('Treino concluído! Você arrasou hoje! 🏆🌸', 'success');
};

function renderTreino() {
  const grid = document.getElementById('treinoGrid');
  if (!State.treino || State.treino.length === 0) {
    grid.innerHTML = `<div class="empty-state"><span>💪</span><p>Clique em "Gerar Novo Treino" para começar!</p></div>`;
    updateProgress(0, 0);
    return;
  }

  const done  = State.treino.filter(e => e.done).length;
  const total = State.treino.length;
  updateProgress(done, total);

  function levelClass(level) {
    return level.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c');
  }

  grid.innerHTML = State.treino.map(ex => `
    <div class="exercise-card ${ex.done ? 'done' : ''}" id="card-${ex.id}">
      <div class="ex-card-top" onclick="toggleExercise(${ex.id})">
        <span class="ex-level level-${levelClass(ex.level)}">${ex.level}</span>
        <div class="ex-name">${ex.name}</div>
        <div class="ex-desc">${ex.desc}</div>
        <div class="ex-meta">
          <span>🔁 <strong>${ex.series}</strong> séries</span>
          <span>💪 <strong>${ex.reps}</strong> reps</span>
        </div>
        <div class="ex-click-hint">${ex.done ? '✓ Concluído — clique para desfazer' : 'Clique para marcar como concluída'}</div>
      </div>
      ${ex.video ? `
      <div class="ex-video-wrap">
        <button class="btn-video" onclick="toggleVideo(${ex.id}, this)" type="button">▶ Ver execução</button>
        <div class="ex-video-frame" id="video-${ex.id}" style="display:none">
          <iframe src="${ex.video}?rel=0&modestbranding=1" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"></iframe>
        </div>
      </div>` : ''}
    </div>`).join('');
}

window.toggleVideo = function(id, btn) {
  const wrap = document.getElementById(`video-${id}`);
  if (!wrap) return;
  const isHidden = wrap.style.display === 'none';
  wrap.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? '✖ Fechar vídeo' : '▶ Ver execução';
};

function updateProgress(done, total) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${done}/${total}`;
  document.getElementById('dashTreinos').textContent = done;
}

/* ================================================================
   ONBOARDING
   ================================================================ */
function initOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');

  let currentStep = 1;

  function goTo(step) {
    document.querySelectorAll('.ob-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.ob-dot').forEach((d, i) => d.classList.toggle('active', i + 1 === step));
    document.getElementById(`ob-step-${step}`).classList.add('active');
    currentStep = step;
  }

  document.getElementById('obStartBtn').onclick = () => goTo(2);

  document.getElementById('obNomeBtn').onclick = () => {
    const nome = document.getElementById('obNome').value.trim();
    if (!nome) { document.getElementById('obNome').focus(); document.getElementById('obNome').style.borderColor = 'var(--pink)'; return; }
    document.getElementById('obNome').style.borderColor = '';
    goTo(3);
  };

  document.getElementById('obIdadeBtn').onclick = () => {
    const idade = parseInt(document.getElementById('obIdade').value);
    if (!idade || idade < 10 || idade > 99) { document.getElementById('obIdade').focus(); document.getElementById('obIdade').style.borderColor = 'var(--pink)'; return; }
    document.getElementById('obIdade').style.borderColor = '';
    document.getElementById('obNomeFinal').textContent = document.getElementById('obNome').value.trim();
    goTo(4);
  };

  document.getElementById('obFinishBtn').onclick = async () => {
    const nome      = document.getElementById('obNome').value.trim();
    const sobrenome = document.getElementById('obSobrenome').value.trim();
    const idade     = parseInt(document.getElementById('obIdade').value);
    const perfil    = { nome, sobrenome, idade };

    try {
      await salvarPerfil(perfil);
      State.perfil = perfil;
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.style.opacity = '';
        document.getElementById('greetName').textContent = nome;
        document.getElementById('userDisplayName').textContent = nome;
        renderDashboard();
      }, 400);
    } catch(e) {
      showToast('Erro ao salvar perfil. Tente novamente.', 'error');
    }
  };

  document.getElementById('obNome').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('obSobrenome').focus(); });
  document.getElementById('obSobrenome').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('obNomeBtn').click(); });
  document.getElementById('obIdade').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('obIdadeBtn').click(); });
}
