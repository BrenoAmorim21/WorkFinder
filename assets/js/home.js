// ── WorkFinder — home.js (Feed de projetos para Freelancers) ──

// ── Mock data ──────────────────────────────────────────
const PROJETOS = [
  {
    id: 1,
    titulo: 'Desenvolvimento de plataforma e-commerce em React + Node',
    empresa: 'Lojafy Soluções',
    logo: 'LJ',
    logoColor: '#EBF2FF',
    logoText: '#1A56DB',
    verificada: true,
    descricao: 'Precisamos de um desenvolvedor full-stack para criar do zero nossa plataforma de e-commerce. O projeto inclui catálogo de produtos, carrinho, checkout com pagamento e painel administrativo.',
    tags: ['React', 'Node.js', 'MySQL', 'Stripe', 'TypeScript'],
    area: 'Dev Web',
    modalidade: 'remoto',
    tipo: 'projeto',
    orcamento: 'R$ 18.000 – R$ 25.000',
    prazo: '60 dias',
    propostas: 7,
    publicado: 'há 2 dias',
    urgente: false,
    featured: true,
  },
  {
    id: 2,
    titulo: 'Designer UI/UX para redesign de aplicativo mobile',
    empresa: 'FinTrack',
    logo: 'FT',
    logoColor: '#D1FAE5',
    logoText: '#059669',
    verificada: true,
    descricao: 'Buscamos designer para reformular completamente a experiência do nosso app de finanças pessoais. Trabalho com prototipagem em Figma, testes de usabilidade e handoff para devs.',
    tags: ['Figma', 'UI Design', 'UX Research', 'Design System'],
    area: 'Design',
    modalidade: 'remoto',
    tipo: 'freelance',
    orcamento: 'R$ 6.000 – R$ 10.000',
    prazo: '30 dias',
    propostas: 14,
    publicado: 'há 3 dias',
    urgente: false,
    featured: false,
  },
  {
    id: 3,
    titulo: 'Desenvolvimento de app React Native — delivery de alimentos',
    empresa: 'Sabor Express',
    logo: 'SE',
    logoColor: '#FEF3C7',
    logoText: '#D97706',
    verificada: false,
    descricao: 'Projeto de app de delivery com funcionalidades de geolocalização, rastreamento de pedido em tempo real, integração com Pix e gestão de cardápio para restaurantes parceiros.',
    tags: ['React Native', 'Firebase', 'Maps API', 'Pix API'],
    area: 'Mobile',
    modalidade: 'hibrido',
    tipo: 'projeto',
    orcamento: 'R$ 22.000 – R$ 35.000',
    prazo: '90 dias',
    propostas: 5,
    publicado: 'há 1 dia',
    urgente: true,
    featured: false,
  },
  {
    id: 4,
    titulo: 'Cientista de dados para análise preditiva de churn',
    empresa: 'SaaS Corp',
    logo: 'SC',
    logoColor: '#EDE9FE',
    logoText: '#6D28D9',
    verificada: true,
    descricao: 'Precisamos modelar e implementar um pipeline de machine learning para prever cancelamentos de clientes. Trabalho inclui ETL, feature engineering, treinamento e deploy do modelo.',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'SQL', 'Power BI'],
    area: 'Dados',
    modalidade: 'remoto',
    tipo: 'freelance',
    orcamento: 'R$ 12.000 – R$ 18.000',
    prazo: '45 dias',
    propostas: 9,
    publicado: 'há 5 dias',
    urgente: false,
    featured: true,
  },
  {
    id: 5,
    titulo: 'Desenvolvedor backend Python para API de integração IoT',
    empresa: 'SmartHome BR',
    logo: 'SH',
    logoColor: '#FEE2E2',
    logoText: '#DC2626',
    verificada: false,
    descricao: 'Desenvolvimento de API REST com Flask para integrar dispositivos IoT com nossa plataforma de automação residencial. Inclui autenticação, websockets e dashboard de monitoramento.',
    tags: ['Python', 'Flask', 'MQTT', 'WebSockets', 'Docker'],
    area: 'Dev Web',
    modalidade: 'remoto',
    tipo: 'projeto',
    orcamento: 'R$ 8.000 – R$ 14.000',
    prazo: '45 dias',
    propostas: 11,
    publicado: 'há 1 semana',
    urgente: false,
    featured: false,
  },
  {
    id: 6,
    titulo: 'Gestor de tráfego pago — campanhas Google e Meta Ads',
    empresa: 'Crescer Digital',
    logo: 'CD',
    logoColor: '#ECFDF5',
    logoText: '#047857',
    verificada: true,
    descricao: 'Busca por profissional para gerenciar campanhas de performance para 5 e-commerces clientes. Escopo inclui planejamento, criação, otimização e relatórios mensais de resultados.',
    tags: ['Google Ads', 'Meta Ads', 'Analytics', 'CRO', 'Tag Manager'],
    area: 'Marketing',
    modalidade: 'remoto',
    tipo: 'part-time',
    orcamento: 'R$ 3.500 / mês',
    prazo: 'Contrato 6 meses',
    propostas: 22,
    publicado: 'há 4 dias',
    urgente: false,
    featured: false,
  },
];

let filtroAtivo = 'todos';
let busca = '';

function badgeModalidade(m) {
  const map   = { remoto: 'badge-remoto', presencial: 'badge-presencial', hibrido: 'badge-hibrido' };
  const label = { remoto: 'Remoto', presencial: 'Presencial', hibrido: 'Híbrido' };
  return `<span class="badge ${map[m]}">${label[m]}</span>`;
}

function renderCard(p) {
  const tagsHtml = p.tags
    .map((t, i) => `<span class="tag ${i === 0 ? 'highlight' : ''}">${t}</span>`)
    .join('');

  return `
    <div class="project-card ${p.featured ? 'featured' : ''}" onclick="abrirProjeto(${p.id})">
      <div class="card-top">
        <div class="company-info">
          <div class="company-logo" style="background:${p.logoColor};color:${p.logoText}">${p.logo}</div>
          <div>
            <div class="company-name">${p.empresa}</div>
            ${p.verificada ? '<span class="company-badge">✓ Verificada</span>' : ''}
          </div>
        </div>
        <button class="card-bookmark" onclick="event.stopPropagation(); toggleSave(this)" title="Salvar projeto">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2Z"/>
          </svg>
        </button>
      </div>

      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
        ${p.urgente ? '<span class="badge badge-urgente">Urgente</span>' : ''}
        ${badgeModalidade(p.modalidade)}
      </div>

      <div class="card-title">${p.titulo}</div>
      <div class="card-desc">${p.descricao}</div>

      <div class="card-tags">${tagsHtml}</div>

      <div class="card-footer">
        <div class="card-meta">
          <span class="budget">${p.orcamento}</span>
          <span class="meta-item">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z"/>
            </svg>
            ${p.prazo}
          </span>
          <span class="meta-item">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372c1.17 0 2.29-.203 3.316-.573M12 13.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8.375A9.375 9.375 0 0 1 12 13.5"/>
            </svg>
            ${p.propostas} propostas
          </span>
          <span class="meta-item">${p.publicado}</span>
        </div>
        <button class="btn-apply" onclick="event.stopPropagation(); enviarProposta(${p.id})">
          Enviar proposta
        </button>
      </div>
    </div>
  `;
}

function renderFeed() {
  const grid = document.getElementById('project-grid');
  let lista = PROJETOS;

  if (filtroAtivo !== 'todos') {
    lista = lista.filter(p => p.area === filtroAtivo);
  }

  if (busca.trim()) {
    const q = busca.toLowerCase();
    lista = lista.filter(p =>
      p.titulo.toLowerCase().includes(q) ||
      p.empresa.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  document.getElementById('feed-count').textContent =
    `${lista.length} projeto${lista.length !== 1 ? 's' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div style="font-size:2.5rem">🔍</div>
        <p>Nenhum projeto encontrado com esses filtros.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(renderCard).join('');
}

function filterChip(el, area) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filtroAtivo = area;
  renderFeed();
}

function toggleSave(btn) {
  btn.classList.toggle('saved');
}

function abrirProjeto(id) {
  window.location.href = 'detal_vaga.html';
}

function enviarProposta(id) {
  window.location.href = `detal_vaga.html?projeto=${id}`;
}

// Busca ao digitar
document.getElementById('search-input')?.addEventListener('input', (e) => {
  busca = e.target.value;
  renderFeed();
});

// Render inicial
renderFeed();
