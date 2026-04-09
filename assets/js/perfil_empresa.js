// ── WorkFinder — perfil_empresa.js ──

function setTab(el) {
  document.querySelectorAll('.company-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

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

function salvarPerfil(e) {
  e.preventDefault();
  const nome = document.getElementById('inp-nome-empresa')?.value;
  const desc = document.getElementById('inp-desc-empresa')?.value;
  if (nome) document.getElementById('display-nome-empresa').textContent = nome;
  if (desc) document.getElementById('display-desc-empresa').textContent = desc;
  fecharModal('modal-edit');
}

function abrirProjeto(id) {
  window.location.href = 'detal_vaga.html';
}
