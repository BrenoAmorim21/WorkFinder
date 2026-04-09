// ── WorkFinder — pub_vaga.js ──

let modalidadeSelecionada = 'remoto';
let skillsList = [];

// ── Inicia a página ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona "Remoto" por padrão
  selecionarModalidade('remoto');

  // Input de habilidades ao pressionar Enter ou vírgula
  const inpHab = document.getElementById('inp-habilidades');
  if (inpHab) {
    inpHab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        adicionarSkill(inpHab.value.trim().replace(',', ''));
        inpHab.value = '';
      }
    });
    inpHab.addEventListener('blur', () => {
      const v = inpHab.value.trim();
      if (v) { adicionarSkill(v); inpHab.value = ''; }
    });
  }

  // Listeners para preview em tempo real
  ['inp-titulo', 'inp-desc', 'inp-orcamento-min', 'inp-orcamento-max', 'inp-prazo'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', atualizarPreview);
  });
});

function selecionarModalidade(modo) {
  modalidadeSelecionada = modo;
  document.querySelectorAll('.modal-opt').forEach(el => el.classList.remove('selected'));
  document.querySelector(`[data-modalidade="${modo}"]`)?.classList.add('selected');
  atualizarPreview();
}

function adicionarSkill(nome) {
  if (!nome || skillsList.includes(nome)) return;
  skillsList.push(nome);
  renderSkills();
  atualizarPreview();
}

function removerSkill(nome) {
  skillsList = skillsList.filter(s => s !== nome);
  renderSkills();
  atualizarPreview();
}

function renderSkills() {
  const wrap = document.getElementById('skills-preview');
  if (!wrap) return;
  wrap.innerHTML = skillsList.map(s => `
    <span class="skill-chip">
      ${s}
      <button type="button" onclick="removerSkill('${s}')">✕</button>
    </span>
  `).join('');
}

function atualizarPreview() {
  const titulo    = document.getElementById('inp-titulo')?.value || 'Título do projeto';
  const desc      = document.getElementById('inp-desc')?.value   || 'Descrição será exibida aqui...';
  const min       = document.getElementById('inp-orcamento-min')?.value;
  const max       = document.getElementById('inp-orcamento-max')?.value;
  const prazo     = document.getElementById('inp-prazo')?.value  || '–';

  const orcamento = (min && max)
    ? `R$ ${Number(min).toLocaleString('pt-BR')} – R$ ${Number(max).toLocaleString('pt-BR')}`
    : min ? `A partir de R$ ${Number(min).toLocaleString('pt-BR')}`
    : '–';

  const labelModal = {
    remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial'
  };
  const classModal = {
    remoto: 'badge-remoto', hibrido: 'badge-hibrido', presencial: 'badge-presencial'
  };

  const el = document.getElementById('preview-content');
  if (!el) return;

  el.innerHTML = `
    <div class="preview-job-title">${titulo}</div>
    <div class="preview-meta">
      <span class="badge ${classModal[modalidadeSelecionada]}">${labelModal[modalidadeSelecionada]}</span>
      <span class="budget-preview">${orcamento}</span>
      <span style="font-size:.82rem;color:var(--ink-light)">⏱ ${prazo}</span>
    </div>
    <div class="preview-desc">${desc.substring(0, 180)}${desc.length > 180 ? '...' : ''}</div>
    ${skillsList.length ? `<div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.75rem">${skillsList.map(s => `<span class="skill-chip">${s}</span>`).join('')}</div>` : ''}
  `;
}

function publicarVaga() {
  const titulo = document.getElementById('inp-titulo')?.value?.trim();
  const desc   = document.getElementById('inp-desc')?.value?.trim();
  const tipo   = document.getElementById('inp-tipo')?.value;

  if (!titulo) { alert('Informe o título do projeto.'); return; }
  if (!desc)   { alert('Descreva o projeto.'); return; }
  if (!tipo)   { alert('Selecione o tipo de contratação.'); return; }

  // Monta objeto da vaga
  const min = document.getElementById('inp-orcamento-min')?.value;
  const max = document.getElementById('inp-orcamento-max')?.value;

  const vaga = {
    id: Date.now(),
    titulo,
    descricao: desc,
    tags: skillsList,
    modalidade: modalidadeSelecionada,
    tipo,
    orcamento: (min && max)
      ? `R$ ${Number(min).toLocaleString('pt-BR')} – R$ ${Number(max).toLocaleString('pt-BR')}`
      : '–',
    prazo: document.getElementById('inp-prazo')?.value || 'A combinar',
    status: 'aberta',
    publicado: 'agora mesmo',
    propostas: []
  };

  // Salva no localStorage (integra com dash_empresa.js)
  const jobs = JSON.parse(localStorage.getItem('wf_jobs') || '[]');
  jobs.unshift(vaga);
  localStorage.setItem('wf_jobs', JSON.stringify(jobs));

  // Mostra tela de sucesso
  document.getElementById('form-section').style.display = 'none';
  document.getElementById('success-section').classList.add('show');
}

function salvarRascunho() {
  alert('Rascunho salvo!\n(Funcionalidade completa disponível com o backend)');
}
