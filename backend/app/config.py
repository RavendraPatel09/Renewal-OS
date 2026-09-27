import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "RenewalOS API"
    APP_URL: str = os.getenv("APP_URL", "http://localhost:5173")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./renewalos.db")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "renewal_os_super_secret_jwt_key_2026_dev")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days session
    
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
    HINDSIGHT_BANK_ID: str = os.getenv("HINDSIGHT_BANK_ID", "renewal_os_bank")
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
