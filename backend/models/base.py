from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime, func
from uuid import uuid4
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
