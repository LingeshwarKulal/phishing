# PhishGuard - Phishing Website Detector

PhishGuard is a modern web-based cybersecurity tool designed to help users detect potentially malicious or phishing websites. It combines a clean React.js frontend with a powerful Python backend to analyze URLs and identify potential phishing threats.

## Features

- 🔍 URL analysis for phishing detection
- 🚦 Color-coded risk assessment (Safe, Suspicious, Phishing)
- 📊 Detailed analysis breakdown
- 📱 Responsive design
- ⚡ Real-time feedback

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: FastAPI (Python)
- Additional Tools: URL parsing, TLD analysis, Pattern matching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phishguard.git
   cd phishguard
   ```

2. Set up the frontend:
   ```bash
   cd phishguard
   npm install
   ```

3. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the frontend development server:
   ```bash
   cd phishguard
   npm run dev
   ```

2. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Usage

1. Open the application in your web browser
2. Enter a URL in the input field
3. Click "Check URL" to analyze
4. Review the results and detailed analysis

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 