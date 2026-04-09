// ── WorkFinder — perfil-freelancer.js ──

// ── Dados iniciais ──────────────────────────────────────
let skills = [
  { nome: 'Python',     nivel: 'Avançado' },
  { nome: 'Flask',      nivel: 'Avançado' },
  { nome: 'React',      nivel: 'Intermediário' },
  { nome: 'Node.js',    nivel: 'Intermediário' },
  { nome: 'MySQL',      nivel: 'Avançado' },
  { nome: 'Docker',     nivel: 'Intermediário' },
  { nome: 'Git',        nivel: 'Avançado' },
  { nome: 'REST APIs',  nivel: 'Avançado' },
  { nome: 'TypeScript', nivel: 'Básico' },
  { nome: 'Linux',      nivel: 'Intermediário' },
];

function renderSkills() {
  document.getElementById('skills-grid').innerHTML = skills
    .map(s => `
      <div class="skill-tag">
        ${s.nome}
        <span class="skill-level">· ${s.nivel}</span>
      </div>`)
    .join('');
}

// ── Modal ───────────────────────────────────────────────
function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

function fecharModalFora(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
}

// ── Salvar bio ──────────────────────────────────────────
function salvarBio(e) {
  e.preventDefault();
  document.getElementById('display-nome').textContent   = document.getElementById('input-nome').value;
  document.getElementById('display-titulo').textContent = document.getElementById('input-titulo').value;
  document.getElementById('display-bio').textContent    = document.getElementById('input-bio').value;
  fecharModal('modal-bio');
}

// ── Salvar skills ───────────────────────────────────────
function salvarSkills(e) {
  e.preventDefault();
  const raw = document.getElementById('input-skills').value;
  skills = raw.split(',').map(s => ({ nome: s.trim(), nivel: 'Intermediário' })).filter(s => s.nome);
  renderSkills();
  fecharModal('modal-skills');
}

// ── Tabs da nav ─────────────────────────────────────────
function setTab(el) {
  document.querySelectorAll('.profile-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

// ── Sair ────────────────────────────────────────────────
function sair() {
  if (confirm('Deseja sair da sua conta?')) {
    ['wf_token','wf_tipo','wf_nome','wf_id',
     'fl_token','fl_tipo','fl_nome','fl_id'].forEach(k => localStorage.removeItem(k));
    window.location.href = '../index.html';
  }
}

// ── Render inicial ──────────────────────────────────────
renderSkills();
