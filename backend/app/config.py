import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")
    HINDSIGHT_BASE_URL: str = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DEFAULT_BANK_ID: str = os.getenv("DEFAULT_BANK_ID", "renewal_os_bank")

    class Config:
        env_file = ".env"

settings = Settings()
