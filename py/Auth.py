# ============================================================
#  FreeLink — routes/auth.py
#  Rotas: POST /api/auth/cadastro  e  POST /api/auth/login
# ============================================================

from flask import Blueprint, request, jsonify
import mysql.connector
import bcrypt
import jwt
import datetime
from config import Config

auth_bp = Blueprint('auth', __name__)


def get_db():
    """Retorna uma conexão com o banco MySQL."""
    return mysql.connector.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        database=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD
    )


def gerar_token(user_id, tipo):
    """Gera JWT com 7 dias de validade."""
    payload = {
        'sub': user_id,
        'tipo': tipo,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')


# ─── CADASTRO ───────────────────────────────────────────────

@auth_bp.route('/cadastro', methods=['POST'])
def cadastro():
    dados = request.get_json()

    tipo  = dados.get('tipo')   # 'empresa' ou 'freelancer'
    email = dados.get('email', '').strip().lower()
    senha = dados.get('senha', '')

    if not tipo or not email or not senha:
        return jsonify({'mensagem': 'Campos obrigatórios faltando.'}), 400

    # Hash da senha
    senha_hash = bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()

    conn = get_db()
    cur  = conn.cursor(dictionary=True)

    try:
        # Verifica se e-mail já existe
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({'mensagem': 'Este e-mail já está cadastrado.'}), 409

        # Insere usuário base
        cur.execute(
            "INSERT INTO users (email, senha_hash, tipo) VALUES (%s, %s, %s)",
            (email, senha_hash, tipo)
        )
        user_id = cur.lastrowid

        # Insere perfil específico
        if tipo == 'empresa':
            cur.execute(
                """INSERT INTO companies (user_id, nome_empresa, cnpj, setor, tamanho, descricao)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (
                    user_id,
                    dados.get('nome_empresa', ''),
                    dados.get('cnpj', ''),
                    dados.get('setor', ''),
                    dados.get('tamanho', ''),
                    dados.get('descricao', '')
                )
            )
            nome = dados.get('nome_empresa', 'Empresa')

        else:  # freelancer
            cur.execute(
                """INSERT INTO freelancers (user_id, nome, cpf, area, experiencia, habilidades, portfolio)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (
                    user_id,
                    dados.get('nome', ''),
                    dados.get('cpf', ''),
                    dados.get('area', ''),
                    dados.get('experiencia', ''),
                    dados.get('habilidades', ''),
                    dados.get('portfolio', '')
                )
            )
            nome = dados.get('nome', 'Freelancer')

        conn.commit()
        token = gerar_token(user_id, tipo)

        return jsonify({
            'token': token,
            'tipo': tipo,
            'nome': nome,
            'id': user_id
        }), 201

    except Exception as e:
        conn.rollback()
        print(f'Erro no cadastro: {e}')
        return jsonify({'mensagem': 'Erro interno. Tente novamente.'}), 500

    finally:
        cur.close()
        conn.close()


# ─── LOGIN ──────────────────────────────────────────────────

@auth_bp.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email', '').strip().lower()
    senha = dados.get('senha', '')

    if not email or not senha:
        return jsonify({'mensagem': 'E-mail e senha são obrigatórios.'}), 400

    conn = get_db()
    cur  = conn.cursor(dictionary=True)

    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user or not bcrypt.checkpw(senha.encode(), user['senha_hash'].encode()):
            return jsonify({'mensagem': 'E-mail ou senha incorretos.'}), 401

        # Busca nome do perfil
        tipo = user['tipo']
        if tipo == 'empresa':
            cur.execute("SELECT nome_empresa AS nome FROM companies WHERE user_id = %s", (user['id'],))
        else:
            cur.execute("SELECT nome FROM freelancers WHERE user_id = %s", (user['id'],))

        perfil = cur.fetchone()
        nome   = perfil['nome'] if perfil else email

        token = gerar_token(user['id'], tipo)

        return jsonify({
            'token': token,
            'tipo': tipo,
            'nome': nome,
            'id': user['id']
        }), 200

    except Exception as e:
        print(f'Erro no login: {e}')
        return jsonify({'mensagem': 'Erro interno. Tente novamente.'}), 500

    finally:
        cur.close()
        conn.close()