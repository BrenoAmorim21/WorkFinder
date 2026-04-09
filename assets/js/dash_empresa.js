// ── WorkFinder — dash_empresa.js ──

const JOBS_KEY = 'wf_jobs';

const JOBS_MOCK = [
  {
    id: 1, titulo: 'Desenvolvimento de plataforma e-commerce',
    descricao: 'Criação do zero de uma plataforma de e-commerce com catálogo, carrinho, checkout Stripe e painel admin.',
    tags: ['React','Node.js','MySQL','Stripe'],
    modalidade: 'remoto', tipo: 'projeto', orcamento: 'R$ 18.000 – R$ 25.000',
    prazo: '60 dias', status: 'aberta', publicado: 'há 2 dias',
    propostas: [
      { nome: 'Mateus Vieira',  area: 'Dev Full-Stack', valor: 'R$ 19.500', avatar: 'MV', cor: '#667eea' },
      { nome: 'Carol Mendes',   area: 'Dev Frontend',   valor: 'R$ 17.000', avatar: 'CM', cor: '#0D9488' },
      { nome: 'Rafael Souza',   area: 'Dev Full-Stack', valor: 'R$ 22.000', avatar: 'RS', cor: '#D97706' },
    ]
  },
  {
    id: 2, titulo: 'API REST para integração IoT com painel de monitoramento',
    descricao: 'Backend em Flask para receber dados de sensores via MQTT, armazenar e exibir em dashboard em tempo real.',
    tags: ['Python','Flask','MQTT','Docker','React'],
    modalidade: 'remoto', tipo: 'projeto', orcamento: 'R$ 8.000 – R$ 14.000',
    prazo: '45 dias', status: 'aberta', publicado: 'há 5 dias',
    propostas: [
      { nome: 'Lucas Ferreira', area: 'Dev Backend', valor: 'R$ 9.200',  avatar: 'LF', cor: '#6D28D9' },
      { nome: 'Ana Costa',      area: 'Dev Python',  valor: 'R$ 11.000', avatar: 'AC', cor: '#059669' },
    ]
  },
  {
    id: 3, titulo: 'Design e prototipagem do app mobile de delivery',
    descricao: 'Redesign completo do fluxo de pedido, cardápio e rastreamento em Figma, com handoff para devs.',
    tags: ['Figma','UI/UX','Design System','Prototipagem'],
    modalidade: 'hibrido', tipo: 'freelance', orcamento: 'R$ 5.000 – R$ 8.000',
    prazo: '30 dias', status: 'fechada', publicado: 'há 3 semanas',
    propostas: [
      { nome: 'Bia Alves', area: 'UI/UX Designer', valor: 'R$ 6.000', avatar: 'BA', cor: '#DB2777' },
    ]
  },
];

function carregarJobs() {
  const raw = localStorage.getItem(JOBS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch(e) {}
  }
  localStorage.setItem(JOBS_KEY, JSON.stringify(JOBS_MOCK));
  return JOBS_MOCK;
}

let jobs = carregarJobs();
let filtroAtivo = 'todos';

function badgeModal(m) {
  const map   = { remoto: 'badge-remoto', presencial: 'badge-presencial', hibrido: 'badge-hibrido' };
  const label = { remoto: 'Remoto', presencial: 'Presencial', hibrido: 'Híbrido' };
  return `<span class="badge ${map[m]}">${label[m]}</span>`;
}

function badgeStatus(s) {
  const map   = { aberta: 'badge-aberta', fechada: 'badge-fechada', pausada: 'badge-pausada' };
  const label = { aberta: 'Aberta', fechada: 'Fechada', pausada: 'Pausada' };
  return `<span class="badge ${map[s]}">${label[s]}</span>`;
}

function renderJobs() {
  const lista = filtroAtivo === 'todos' ? jobs : jobs.filter(j => j.status === filtroAtivo);
  const el = document.getElementById('job-list');

  if (lista.length === 0) {
    el.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📭</div>
        <p>Nenhum projeto nesta categoria.</p>
        <button class="btn-primary" onclick="location.href='pub_vaga.html'">+ Publicar projeto</button>
      </div>`;
    return;
  }

  el.innerHTML = lista.map(j => `
    <div class="job-card">
      <div>
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem">
          ${badgeStatus(j.status)} ${badgeModal(j.modalidade)}
          <span class="badge" style="background:var(--surface);color:var(--ink-mid)">${j.tipo}</span>
        </div>
        <div class="job-title">${j.titulo}</div>
        <div class="job-meta-row">
          <span class="meta-item">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z"/>
            </svg>
            ${j.prazo}
          </span>
          <span class="meta-item" style="color:var(--green);font-weight:500">${j.orcamento}</span>
          <span class="meta-item">${j.publicado}</span>
        </div>
        <div class="job-desc">${j.descricao}</div>
        <div class="job-tags">${j.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="job-actions">
        <span class="propostas-count" onclick="abrirCandidatos(${j.id})">
          👥 ${j.propostas.length} proposta${j.propostas.length !== 1 ? 's' : ''}
        </span>
        <button class="btn-sm btn-sm-outline" onclick="editarJob(${j.id})">✎ Editar</button>
        ${j.status === 'aberta'
          ? `<button class="btn-sm btn-sm-outline" onclick="pausarJob(${j.id})">⏸ Pausar</button>`
          : j.status === 'pausada'
          ? `<button class="btn-sm btn-sm-primary" onclick="reativarJob(${j.id})">▶ Reativar</button>`
          : ''}
        <button class="btn-sm btn-sm-danger" onclick="encerrarJob(${j.id})">Encerrar</button>
      </div>
    </div>
  `).join('');
}

function setTab(el, filtro) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  filtroAtivo = filtro;
  renderJobs();
}

function abrirCandidatos(id) {
  const job = jobs.find(j => j.id === id);
  document.getElementById('modal-cand-titulo').textContent = `Propostas — ${job.titulo}`;
  document.getElementById('modal-cand-lista').innerHTML = job.propostas.length === 0
    ? '<p style="color:var(--ink-light);font-size:.875rem">Nenhuma proposta recebida ainda.</p>'
    : job.propostas.map(p => `
      <div class="candidato-card">
        <div class="cand-avatar" style="background:${p.cor}22;color:${p.cor}">${p.avatar}</div>
        <div class="cand-info">
          <div class="cand-name">${p.nome}</div>
          <div class="cand-area">${p.area}</div>
          <div class="cand-valor">Proposta: ${p.valor}</div>
        </div>
        <div class="cand-actions">
          <button class="btn-accept" onclick="aceitarProposta('${p.nome}',${id})">✓ Aceitar</button>
          <button class="btn-reject">✕</button>
        </div>
      </div>`).join('');
  document.getElementById('modal-cand').classList.add('open');
}

function aceitarProposta(nome, jobId) {
  alert(`Proposta de ${nome} aceita!\n(Integração com e-mail será implementada com o backend)`);
  const job = jobs.find(j => j.id === jobId);
  if (job) job.status = 'fechada';
  salvarJobs();
  fecharModal('modal-cand');
  renderJobs();
}

function pausarJob(id) {
  const job = jobs.find(j => j.id === id);
  if (job) { job.status = 'pausada'; salvarJobs(); renderJobs(); }
}

function reativarJob(id) {
  const job = jobs.find(j => j.id === id);
  if (job) { job.status = 'aberta'; salvarJobs(); renderJobs(); }
}

function encerrarJob(id) {
  if (!confirm('Encerrar este projeto? Ele não receberá mais propostas.')) return;
  const job = jobs.find(j => j.id === id);
  if (job) { job.status = 'fechada'; salvarJobs(); renderJobs(); }
}

function editarJob(id) {
  location.href = `pub_vaga.html?editar=${id}`;
}

function fecharModal(id) { document.getElementById(id).classList.remove('open'); }
function fecharModalFora(e) { if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); }

function salvarJobs() { localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); }

function sair() {
  if (!confirm('Deseja sair?')) return;
  ['wf_token','wf_tipo','wf_nome','wf_id'].forEach(k => localStorage.removeItem(k));
  location.href = '../index.html';
}

// Carrega nome da empresa
const nomeEmpresa = localStorage.getItem('wf_nome') || localStorage.getItem('fl_nome') || 'Lojafy Soluções';
const elNome = document.getElementById('nome-empresa');
if (elNome) elNome.textContent = nomeEmpresa;

renderJobs();
