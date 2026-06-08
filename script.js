/**
 * CALISTENIA ASIÁTICA — script.js
 * Para mulheres praticantes de calistenia
 * Gerencia: Dashboard, Peso Corporal, Treino do Dia
 * Persistência: LocalStorage
 */

/* ================================================================
   BANCO DE EXERCÍCIOS — Foco em iniciantes
   reps = repetições ou segundos (conforme o exercício)
   ================================================================ */
const EXERCISES_DB = [
  {
    id: 1, name: "Prancha", level: "Iniciante",
    series: 3, reps: 30,
    video: "https://www.youtube.com/embed/FmAs74_Ywkw",
    desc: "Apoie as mãos no chão com os ombros à frente dos pulsos. Mantenha o corpo reto, contraindo abdômen e glúteos. Segure a posição pelos 30 segundos indicados. Descanse 30s entre as séries."
  },
  {
    id: 2, name: "Prancha Lateral", level: "Iniciante",
    series: 3, reps: 20,
    video: "https://www.youtube.com/embed/ShkY1ngVch8",
    desc: "Posicione-se de lado com o cotovelo flexionado e o antebraço apoiado no chão. Eleve o quadril formando uma linha reta com o ombro. Segure 20 segundos de cada lado. Descanse 30s entre as séries."
  },
  {
    id: 3, name: "Abdominal Giro Russo", level: "Iniciante",
    series: 3, reps: 12,
    video: "https://www.youtube.com/embed/rd1X5PinKYA",
    desc: "Sente-se no chão, incline o tronco levemente para trás e contraia o abdômen. Gire o tronco de um lado para o outro em movimentos suaves. Pode manter os pés no chão no início. Cada giro conta como 1 repetição."
  },
  {
    id: 4, name: "Flexão Simples", level: "Iniciante",
    series: 3, reps: 8,
    video: "https://www.youtube.com/embed/5r1N75P33JU",
    desc: "Apoie as mãos no chão na altura do peito, um pouco mais afastadas que os ombros. Deixe os joelhos apoiados no chão. Contraia abdômen e glúteos, flexione os cotovelos descendo o corpo com controle e suba. Se necessário, use um apoio elevado como sofá ou cadeira."
  },
  {
    id: 5, name: "Pike Push Up", level: "Iniciante",
    series: 3, reps: 8,
    video: "https://www.youtube.com/embed/r-OxqgWvhmA",
    desc: "Fique em pé, incline o corpo para frente e apoie as mãos no chão formando um V invertido. Flexione os cotovelos até a cabeça quase tocar o chão e suba. Trabalha principalmente os ombros. Use um suporte elevado se sentir dificuldade."
  },
  {
    id: 6, name: "Tríceps no Banco (Dip)", level: "Iniciante",
    series: 3, reps: 10,
    video: "https://www.youtube.com/embed/tGrcSEZic6E",
    desc: "Fique de costas para uma cadeira ou banco. Apoie as duas mãos com os dedos voltados para frente. Flexione e estenda os cotovelos elevando e abaixando o corpo com controle. Mantenha o quadril próximo ao suporte e a coluna ereta. Pode dobrar as pernas para facilitar."
  },
  {
    id: 7, name: "Passada com Salto", level: "Intermediário",
    series: 3, reps: 10,
    video: "https://www.youtube.com/embed/cFaDlAoKKsQ",
    desc: "Dê uma passada à frente e flexione a perna de trás até quase tocar o chão. Realize um salto e troque a posição das pernas no ar. Pouse com todo o pé da frente no chão. Se for difícil, faça a passada comum sem salto primeiro."
  },
  {
    id: 8, name: "Agachamento Isométrico na Parede", level: "Iniciante",
    series: 3, reps: 30,
    video: "https://www.youtube.com/embed/HOj3SWjMYkc",
    desc: "Encoste as costas na parede e desça até as coxas ficarem paralelas ao chão, como se estivesse sentada em uma cadeira imaginária. As pernas devem formar 90 graus. Segure a posição pelos 30 segundos indicados. Descanse 45s entre as séries."
  },
  {
    id: 9, name: "Alpinista", level: "Iniciante",
    series: 3, reps: 20,
    video: "https://www.youtube.com/embed/h0cWLVOJXv0",
    desc: "Posicione-se em prancha alta com os ombros à frente dos pulsos. Eleve um joelho em direção às mãos de forma controlada e retorne. Alterne as pernas. Cada joelho elevado conta como 1 repetição. Use um apoio elevado se sentir dificuldade."
  },
  {
    id: 10, name: "Polichinelo", level: "Iniciante",
    series: 3, reps: 20,
    video: "https://www.youtube.com/embed/3c1qnjfNu9Y",
    desc: "Una as mãos sobre a cabeça e afaste os pés ao mesmo tempo. Em seguida, una os pés e abaixe os braços até as laterais do corpo. Adicione pequenos saltos para juntar e afastar os pés. Ótimo para aquecimento ou finalizar o treino."
  },
  {
    id: 11, name: "Subida Unilateral", level: "Iniciante",
    series: 3, reps: 10,
    video: "https://www.youtube.com/embed/TNFcnm_3_cE",
    desc: "Use um banco firme, degrau ou mureta na altura dos quadris. Suba com uma perna só, estendendo-a completamente, e retorne com controle. Faça todas as repetições de um lado antes de trocar. Cada subida conta como 1 repetição."
  },
  {
    id: 12, name: "Elevação Pélvica", level: "Iniciante",
    series: 3, reps: 15,
    video: "https://www.youtube.com/embed/j1n3jHR-SMk",
    desc: "Deite de costas com as pernas flexionadas e os pés apoiados no chão. Eleve o quadril contraindo os glúteos até o corpo formar uma linha reta dos ombros aos joelhos. Segure 2 segundos no topo e desça com controle. Excelente para glúteos e posterior de coxa."
  },
  {
    id: 13, name: "Agachamento Búlgaro", level: "Intermediário",
    series: 3, reps: 8,
    video: "https://www.youtube.com/embed/A9FeeYd2uzw",
    desc: "Apoie o peito do pé de trás em uma cadeira ou superfície elevada. Com a perna da frente, desça o corpo até a coxa ficar paralela ao chão. Mantenha o tronco ereto e o joelho da frente alinhado com o pé. Faça todas as reps de um lado e troque."
  },
  {
    id: 14, name: "Flexão Inclinada", level: "Intermediário",
    series: 3, reps: 8,
    video: "https://www.youtube.com/embed/7cCl3AA6dsM",
    desc: "Apoie as mãos em uma barra fixa, mesa ou superfície elevada, ficando inclinada em relação ao chão. Flexione e estenda os cotovelos mantendo o corpo reto. Recruta a região inferior do peitoral, ombros e tríceps. Quanto mais inclinada, mais fácil."
  }
];

/* ================================================================
   ESTADO DA APLICAÇÃO
   ================================================================ */
const State = {
  pesos:       JSON.parse(localStorage.getItem('ca_pesos')      || '[]'),
  treino:      JSON.parse(localStorage.getItem('ca_treino')     || 'null'),
  treinoDate:  localStorage.getItem('ca_treino_date') || '',

  save() {
    localStorage.setItem('ca_pesos',      JSON.stringify(this.pesos));
    localStorage.setItem('ca_treino',     JSON.stringify(this.treino));
    localStorage.setItem('ca_treino_date',this.treinoDate);
  }
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
  const copy = [...arr];
  const result = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
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

/* ── HAMBURGER ─────────────────────────────────────────────────── */
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

/* ================================================================
   HEADER DATE
   ================================================================ */
(function setHeaderDate() {
  const d = new Date();
  const opts = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
  document.getElementById('headerDate').textContent = d.toLocaleDateString('pt-BR', opts);
})();

/* ================================================================
   DASHBOARD
   ================================================================ */
function renderDashboard() {
  const pesosArr = State.pesos;

  // Cards de stats
  document.getElementById('dashPeso').textContent =
    pesosArr.length ? pesosArr[pesosArr.length - 1].kg + ' kg' : '—';
  document.getElementById('dashTreinos').textContent =
    State.treino ? State.treino.filter(e => e.done).length : 0;
  document.getElementById('dashPesos').textContent = State.pesos.length;

  // Exercício do dia
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

  // Mini gráfico
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

document.getElementById('addPesoBtn').addEventListener('click', () => {
  const data = document.getElementById('pesoData').value;
  const kg   = parseFloat(document.getElementById('pesoValor').value);

  if (!data) { showToast('Informe a data!', 'error'); return; }
  if (isNaN(kg) || kg <= 0) { showToast('Informe um peso válido!', 'error'); return; }

  if (State.pesos.find(p => p.date === data)) {
    showToast('Já existe um registro para esta data!', 'error'); return;
  }

  State.pesos.push({ id: Date.now(), date: data, kg });
  State.pesos.sort((a, b) => a.date.localeCompare(b.date));
  State.save();
  renderPesoList();
  renderPesoChart();
  renderPesoStats();
  document.getElementById('pesoValor').value = '';
  showToast('Peso registrado com sucesso! ⚖', 'success');
});

function renderPesoStats() {
  const arr = State.pesos;
  if (arr.length === 0) {
    ['pesoAtual','pesoMin','pesoMax','pesoVar'].forEach(id => {
      document.getElementById(id).textContent = '—';
    });
    return;
  }
  const kgs   = arr.map(p => p.kg);
  const atual = arr[arr.length - 1].kg;
  const min   = Math.min(...kgs);
  const max   = Math.max(...kgs);
  const diff  = arr.length > 1 ? (atual - arr[0].kg).toFixed(1) : 0;

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
    list.innerHTML = `
      <div class="empty-state">
        <span>⚖</span>
        <p>Nenhum registro de peso ainda</p>
      </div>`;
    return;
  }

  const sorted = [...State.pesos];

  list.innerHTML = arr.map(p => {
    const sortedIdx = sorted.findIndex(x => x.id === p.id);
    const prev = sortedIdx > 0 ? sorted[sortedIdx - 1] : null;
    let diffHtml = '';
    if (prev) {
      const d   = (p.kg - prev.kg).toFixed(1);
      const cls = d < 0 ? 'diff-down' : d > 0 ? 'diff-up' : 'diff-same';
      const sign = d > 0 ? '+' : '';
      diffHtml = `<span class="peso-diff ${cls}">${sign}${d} kg</span>`;
    }
    return `
      <div class="peso-item">
        <span class="peso-date">📅 ${formatDate(p.date)}</span>
        <span class="peso-kg">${p.kg} kg</span>
        ${diffHtml}
        <button class="btn-danger" onclick="deletePeso(${p.id})" style="margin-left:auto">🗑</button>
      </div>`;
  }).join('');

  // Atualiza dashboard
  document.getElementById('dashPesos').textContent = State.pesos.length;
  const ultimo = State.pesos[State.pesos.length - 1];
  document.getElementById('dashPeso').textContent = ultimo ? ultimo.kg + ' kg' : '—';
}

function deletePeso(id) {
  if (!confirm('Deseja remover este registro de peso?')) return;
  State.pesos = State.pesos.filter(p => p.id !== id);
  State.save();
  renderPesoList();
  renderPesoChart();
  renderPesoStats();
  showToast('Registro removido.', '');
}

/* ── GRÁFICO DE PESO ────────────────────────────────────────────── */
function drawChart(ctx, pesos, W, H, mini = false) {
  const PAD = mini
    ? { t: 16, r: 16, b: 30, l: 44 }
    : { t: 24, r: 24, b: 44, l: 56 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const kgs  = pesos.map(p => p.kg);
  const minK = Math.min(...kgs) - 2;
  const maxK = Math.max(...kgs) + 2;

  // Grid lines
  const gridLines = 4;
  ctx.strokeStyle = '#e8e8ec';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridLines; i++) {
    const y = PAD.t + (cH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(PAD.l, y);
    ctx.lineTo(PAD.l + cW, y);
    ctx.stroke();

    const val = maxK - ((maxK - minK) / gridLines) * i;
    ctx.fillStyle = '#999';
    ctx.font = `${mini ? 10 : 11}px Space Mono, monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(val.toFixed(1), PAD.l - 6, y + 4);
  }

  // Pontos calculados
  const pts = pesos.map((p, i) => ({
    x: PAD.l + (i / (pesos.length - 1 || 1)) * cW,
    y: PAD.t + cH - ((p.kg - minK) / (maxK - minK)) * cH
  }));

  // Área gradiente
  const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + cH);
  grad.addColorStop(0, 'rgba(255,79,163,0.25)');
  grad.addColorStop(1, 'rgba(255,79,163,0.02)');

  ctx.beginPath();
  ctx.moveTo(pts[0].x, PAD.t + cH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, PAD.t + cH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Linha
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#FF4FA3';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Pontos e labels
  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, mini ? 4 : 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FF4FA3';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (!mini) {
      ctx.fillStyle = '#333';
      ctx.font = '10px Space Mono, monospace';
      ctx.textAlign = 'center';
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
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const pesos = [...State.pesos].sort((a, b) => a.date.localeCompare(b.date));
  if (pesos.length < 2) {
    ctx.fillStyle = '#aaa';
    ctx.font = '13px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Adicione pelo menos 2 registros para ver o gráfico', W / 2, H / 2);
    return;
  }

  drawChart(ctx, pesos, W, H, false);
}

/* ================================================================
   TREINO DO DIA
   ================================================================ */
function checkTreinoDate() {
  if (State.treinoDate !== today()) {
    State.treino = null;
    State.treinoDate = today();
    State.save();
  }
}

document.getElementById('gerarTreinoBtn').addEventListener('click', gerarTreino);

function gerarTreino() {
  const n  = Math.floor(Math.random() * 3) + 4; // 4–6 exercícios
  const ex = pickRandom(EXERCISES_DB, n);
  State.treino     = ex.map(e => ({ ...e, done: false }));
  State.treinoDate = today();
  State.save();
  renderTreino();
  showToast(`Treino gerado com ${n} exercícios! 💪`, 'success');
}

function toggleExercise(id) {
  if (!State.treino) return;
  const ex = State.treino.find(e => e.id === id);
  if (ex) ex.done = !ex.done;
  State.save();
  renderTreino();

  const done  = State.treino.filter(e => e.done).length;
  const total = State.treino.length;
  if (done === total) showToast('Treino concluído! Você arrasou hoje! 🏆🌸', 'success');
}

function renderTreino() {
  const grid = document.getElementById('treinoGrid');

  if (!State.treino || State.treino.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span>💪</span>
        <p>Clique em "Gerar Novo Treino" para começar!</p>
      </div>`;
    updateProgress(0, 0);
    return;
  }

  const done  = State.treino.filter(e => e.done).length;
  const total = State.treino.length;
  updateProgress(done, total);

  // Normaliza o nível para usar como classe CSS (sem acentos, sem ç)
  function levelClass(level) {
    return level.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ç/g, 'c');
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
        <button class="btn-video" onclick="toggleVideo(${ex.id}, this)" type="button">
          ▶ Ver execução
        </button>
        <div class="ex-video-frame" id="video-${ex.id}" style="display:none">
          <iframe
            src="${ex.video}?rel=0&modestbranding=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
      </div>` : ''}
    </div>`).join('');
}

function toggleVideo(id, btn) {
  const wrap = document.getElementById(`video-${id}`);
  if (!wrap) return;
  const isHidden = wrap.style.display === 'none';
  wrap.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? '✖ Fechar vídeo' : '▶ Ver execução';
}

function updateProgress(done, total) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${done}/${total}`;
  document.getElementById('dashTreinos').textContent = done;
}

/* ================================================================
   INICIALIZAÇÃO
   ================================================================ */
/* ================================================================
   INICIALIZAÇÃO PRINCIPAL
   ================================================================ */
/* ================================================================
   INICIALIZAÇÃO
   ================================================================ *//* Aplica o perfil salvo na interface */
function applyPerfil() {
  if (!State.perfil) return;
  const { nome } = State.perfil;
  const greet = document.getElementById('greetName');
  if (greet) greet.textContent = nome;
}

(function init() {
  checkTreinoDate();
  applyPerfil();
  renderDashboard();
  renderPesoList();
  renderPesoStats();
  renderTreino();
})();

/* ================================================================
   ONBOARDING — aparece apenas na primeira vez
   ================================================================ */
(function initOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay) return;

  // Se já tem perfil salvo, esconde o onboarding
  if (State.perfil) {
    overlay.classList.add('hidden');
    applyPerfil();
    return;
  }

  // Mostra o onboarding
  let currentStep = 1;

  function goTo(step) {
    document.querySelectorAll('.ob-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.ob-dot').forEach((d, i) => {
      d.classList.toggle('active', i + 1 === step);
    });
    document.getElementById(`ob-step-${step}`).classList.add('active');
    currentStep = step;
  }

  // Passo 1 → 2
  document.getElementById('obStartBtn').addEventListener('click', () => goTo(2));

  // Passo 2 → 3
  document.getElementById('obNomeBtn').addEventListener('click', () => {
    const nome      = document.getElementById('obNome').value.trim();
    const sobrenome = document.getElementById('obSobrenome').value.trim();
    if (!nome) {
      document.getElementById('obNome').focus();
      document.getElementById('obNome').style.borderColor = 'var(--pink)';
      return;
    }
    document.getElementById('obNome').style.borderColor = '';
    goTo(3);
  });

  // Passo 3 → 4
  document.getElementById('obIdadeBtn').addEventListener('click', () => {
    const idade = parseInt(document.getElementById('obIdade').value);
    if (!idade || idade < 10 || idade > 99) {
      document.getElementById('obIdade').focus();
      document.getElementById('obIdade').style.borderColor = 'var(--pink)';
      return;
    }
    document.getElementById('obIdade').style.borderColor = '';

    const nome      = document.getElementById('obNome').value.trim();
    const sobrenome = document.getElementById('obSobrenome').value.trim();

    // Mostra nome na tela de conclusão
    document.getElementById('obNomeFinal').textContent = nome;
    goTo(4);
  });

  // Passo 4 — Finalizar
  document.getElementById('obFinishBtn').addEventListener('click', () => {
    const nome      = document.getElementById('obNome').value.trim();
    const sobrenome = document.getElementById('obSobrenome').value.trim();
    const idade     = parseInt(document.getElementById('obIdade').value);

    State.perfil = { nome, sobrenome, idade };
    State.save();

    // Animação de saída
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.style.opacity = '';
      applyPerfil();
      renderDashboard();
    }, 400);
  });

  // Enter nos inputs avança
  document.getElementById('obNome').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('obSobrenome').focus();
  });
  document.getElementById('obSobrenome').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('obNomeBtn').click();
  });
  document.getElementById('obIdade').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('obIdadeBtn').click();
  });
})();


