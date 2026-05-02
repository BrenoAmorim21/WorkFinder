# ============================================================
#  WorkFinder — py/routes/messages.py
#  GET  /api/mensagens/<contract_id>            lista mensagens
#  POST /api/mensagens/<contract_id>            envia mensagem
#  POST /api/mensagens/<contract_id>/lidas      marca como lidas
#  GET  /api/mensagens/<contract_id>/nao-lidas  conta não lidas
# ============================================================

from flask import Blueprint, request, jsonify, g
from decorators import login_required
from db import get_conn, query_one, query_all, execute, criar_notificacao

messages_bp = Blueprint('messages', __name__)


def _validar_acesso(contract_id):
    """Valida que o usuário logado é parte do contrato. Retorna contrato + dados, ou None."""
    return query_one('''
        SELECT ct.id, ct.status,
               c.user_id AS empresa_uid, c.nome_empresa,
               f.user_id AS free_uid,    f.nome AS freelancer_nome,
               j.titulo
        FROM contracts ct
        JOIN companies c   ON c.id = ct.company_id
        JOIN freelancers f ON f.id = ct.freelancer_id
        JOIN jobs j        ON j.id = ct.job_id
        WHERE ct.id = %s AND (c.user_id = %s OR f.user_id = %s)
    ''', (contract_id, g.user_id, g.user_id))


@messages_bp.route('/<int:contract_id>', methods=['GET'])
@login_required
def listar(contract_id):
    """Lista todas as mensagens de um contrato, em ordem cronológica."""
    if not _validar_acesso(contract_id):
        return jsonify({'mensagem': 'Contrato não encontrado ou acesso negado.'}), 403

    rows = query_all('''
        SELECT m.id, m.sender_user_id, m.conteudo, m.lida, m.criado_em, u.tipo AS sender_tipo,
               COALESCE(f.nome, c.nome_empresa) AS sender_nome
        FROM messages m
        JOIN users u            ON u.id = m.sender_user_id
        LEFT JOIN freelancers f ON f.user_id = u.id
        LEFT JOIN companies   c ON c.user_id = u.id
        WHERE m.contract_id = %s
        ORDER BY m.criado_em ASC
    ''', (contract_id,))
    for r in rows:
        r['criado_em'] = str(r['criado_em'])
        r['eu_enviei'] = (r['sender_user_id'] == g.user_id)
    return jsonify(rows), 200


@messages_bp.route('/<int:contract_id>', methods=['POST'])
@login_required
def enviar(contract_id):
    """Envia uma mensagem nova. Cria notificação para o destinatário."""
    contrato = _validar_acesso(contract_id)
    if not contrato:
        return jsonify({'mensagem': 'Contrato não encontrado ou acesso negado.'}), 403
    if contrato['status'] != 'em_andamento':
        return jsonify({'mensagem': 'Só é possível conversar em contratos em andamento.'}), 409

    conteudo = (request.get_json(silent=True) or {}).get('conteudo', '').strip()
    if not conteudo:
        return jsonify({'mensagem': 'Mensagem vazia.'}), 400
    if len(conteudo) > 2000:
        return jsonify({'mensagem': 'Mensagem muito longa (máx. 2000 caracteres).'}), 400

    execute(
        'INSERT INTO messages (contract_id, sender_user_id, conteudo) VALUES (%s, %s, %s)',
        (contract_id, g.user_id, conteudo)
    )

    # Notifica o outro lado
    destinatario_uid = contrato['free_uid'] if g.user_id == contrato['empresa_uid'] else contrato['empresa_uid']
    remetente_nome = contrato['nome_empresa'] if g.user_id == contrato['empresa_uid'] else contrato['freelancer_nome']
    criar_notificacao(
        destinatario_uid, 'mensagem_chat',
        f'💬 Nova mensagem de {remetente_nome}',
        conteudo[:80] + ('...' if len(conteudo) > 80 else ''),
        f'contratos.html?abrir_chat={contract_id}'
    )

    return jsonify({'mensagem': 'Enviada.'}), 201


@messages_bp.route('/<int:contract_id>/lidas', methods=['POST'])
@login_required
def marcar_lidas(contract_id):
    """Marca como lidas todas as mensagens enviadas pelo OUTRO usuário neste contrato."""
    if not _validar_acesso(contract_id):
        return jsonify({'mensagem': 'Acesso negado.'}), 403

    execute('''
        UPDATE messages
        SET lida = 1
        WHERE contract_id = %s AND sender_user_id != %s AND lida = 0
    ''', (contract_id, g.user_id))
    return jsonify({'mensagem': 'Marcadas.'}), 200


@messages_bp.route('/<int:contract_id>/nao-lidas', methods=['GET'])
@login_required
def contar_nao_lidas(contract_id):
    """Conta quantas mensagens não lidas o usuário tem neste contrato."""
    if not _validar_acesso(contract_id):
        return jsonify({'total': 0}), 200
    row = query_one('''
        SELECT COUNT(*) AS total FROM messages
        WHERE contract_id = %s AND sender_user_id != %s AND lida = 0
    ''', (contract_id, g.user_id))
    return jsonify({'total': int(row['total'] or 0)}), 200