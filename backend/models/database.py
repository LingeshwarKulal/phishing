from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    notification_preferences = Column(String, default="email")  # email, push, both
    language_preference = Column(String, default="en")
    fcm_token = Column(String, nullable=True)  # For Firebase Cloud Messaging

class URLScan(Base):
    __tablename__ = "url_scans"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    domain = Column(String, index=True)
    status = Column(String)  # safe, suspicious, phishing
    risk_score = Column(Float)
    features = Column(String)  # JSON string of features
    scanned_at = Column(DateTime, default=datetime.utcnow)
    scanned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    reports = relationship("URLReport", back_populates="scan")
    user = relationship("User")

class URLReport(Base):
    __tablename__ = "url_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("url_scans.id"))
    reported_by = Column(Integer, ForeignKey("users.id"))
    report_type = Column(String)  # false_positive, confirmed_phishing
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scan = relationship("URLScan", back_populates="reports")
    user = relationship("User")

class BlockedDomain(Base):
    __tablename__ = "blocked_domains"
    
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True)
    reason = Column(String)
    blocked_by = Column(Integer, ForeignKey("users.id"))
    blocked_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")

class NotificationHistory(Base):
    __tablename__ = "notification_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    notification_type = Column(String)  # email, push
    title = Column(String)
    message = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")

# Database URL configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./phishguard.db"

# Create engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 