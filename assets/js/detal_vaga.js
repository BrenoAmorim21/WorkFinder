// ── WorkFinder — detal_vaga.js ──

function enviarProposta() {
  const valor = document.getElementById('inp-valor').value;
  const prazo = document.getElementById('inp-prazo-prop').value;
  const msg   = document.getElementById('inp-msg').value.trim();

  if (!valor) { alert('Informe o valor da sua proposta.'); return; }
  if (!prazo)  { alert('Informe o prazo que consegue entregar.'); return; }
  if (!msg)    { alert('Escreva uma mensagem para a empresa.'); return; }

  // Salva no localStorage
  const propostas = JSON.parse(localStorage.getItem('wf_propostas') || '[]');
  propostas.unshift({
    id: Date.now(),
    titulo: 'Desenvolvimento de plataforma e-commerce em React + Node',
    empresa: 'Lojafy Soluções',
    valor: `R$ ${Number(valor).toLocaleString('pt-BR')}`,
    prazo,
    mensagem: msg,
    status: 'pendente',
    data: 'agora mesmo',
  });
  localStorage.setItem('wf_propostas', JSON.stringify(propostas));

  // Esconde form e mostra sucesso
  document.getElementById('form-proposta').style.display = 'none';
  document.getElementById('success-prop').classList.add('show');
}

function salvarVaga(btn) {
  btn.textContent = '✅ Salvo!';
  btn.style.color = 'var(--green)';
  btn.style.borderColor = 'var(--green)';
  setTimeout(() => {
    btn.textContent = '🔖 Salvar para depois';
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 2500);
}
