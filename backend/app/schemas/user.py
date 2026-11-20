from pydantic import BaseModel, EmailStr, Field, field_validator


class EmailSchema(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).lower()


class UserRegister(EmailSchema):
    name: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=8, max_length=128)

class UserLogin(EmailSchema):
    password: str = Field(min_length=1, max_length=128)
