# ============================================================
#  FreeLink — app.py
#  Ponto de entrada do backend Flask
# ============================================================

from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.users import users_bp
from routes.proposals import proposals_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Permite requisições do frontend (localhost durante dev)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Registra os Blueprints (grupos de rotas)
    app.register_blueprint(auth_bp,      url_prefix='/api/auth')
    app.register_blueprint(jobs_bp,      url_prefix='/api/vagas')
    app.register_blueprint(users_bp,     url_prefix='/api/usuarios')
    app.register_blueprint(proposals_bp, url_prefix='/api/propostas')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)