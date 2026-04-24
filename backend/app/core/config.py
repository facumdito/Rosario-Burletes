from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "development"
    database_url: str = "postgresql+psycopg://parana:parana@localhost:5432/parana"

    secret_key: str = "dev-secret-change-me"
    access_token_expire_minutes: int = 60

    anthropic_api_key: str = ""
    claude_model_sonnet: str = "claude-sonnet-4-6"
    claude_model_haiku: str = "claude-haiku-4-5-20251001"

    whatsapp_access_token: str = ""
    whatsapp_phone_number_id: str = ""
    whatsapp_verify_token: str = "parana-verify-token"

    cors_origins: str = "http://localhost:3000,http://localhost:3001"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
