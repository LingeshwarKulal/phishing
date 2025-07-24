# PhishGuard - Phishing Detection System

PhishGuard is an advanced cybersecurity tool designed to protect users from phishing threats through real-time URL analysis and comprehensive security checks.

## Features

- Real-time URL analysis
- Machine learning-based detection
- Comprehensive security checks
- User-friendly interface
- Multi-language support
- Dark mode support
- PWA support

## Tech Stack

### Backend
- FastAPI
- Python ML libraries
- SQLite database

### Frontend
- React
- Tailwind CSS
- Vite
- i18n for translations

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LingeshwarKulal/phishing.git
cd phishing
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd phishguard
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
cd phishguard
npm run dev
```

## License

This project is licensed under the MIT License.
