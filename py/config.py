# ============================================================
#  FreeLink — config.py
#  Configurações do Flask e do banco de dados (MySQL / Azure)
# ============================================================

import os
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis do arquivo .env

class Config:
    # Chave secreta para JWT e sessões Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'troque-esta-chave-em-producao')
    JWT_SECRET = os.getenv('JWT_SECRET', 'jwt-secret-troque-em-producao')

    # Conexão com MySQL (Azure Database for MySQL)
    # Configure as variáveis no arquivo .env
    DB_HOST     = os.getenv('DB_HOST',     'localhost')
    DB_PORT     = int(os.getenv('DB_PORT', 3306))
    DB_NAME     = os.getenv('DB_NAME',     'freelink')
    DB_USER     = os.getenv('DB_USER',     'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')

    # String de conexão para SQLAlchemy (opcional)
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False