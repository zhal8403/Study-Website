# StudyOS

**StudyOS** is an AI-powered student dashboard that combines your Google services into one intelligent workspace. It helps students stay organized by bringing together their calendar, assignments, email, and AI-generated daily briefings (beta) in a single application.

---

## Features

- Google Calendar integration
- AI-generated daily briefings
- Upcoming events dashboard
- Weekly schedule overview
- Due date and deadline reminders
- Multiple Google Calendar support
- Smart event filtering (Today, Week, Month)
- Local AI powered by Ollama 

---

## Preview

### Dashboard

<img width="1877" height="876" alt="Screenshot 2026-07-14 125825" src="https://github.com/user-attachments/assets/88b52830-8f41-49bb-aa42-ac954897ba17" />


---

## Code and Softwares used

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express
- CORS

### APIs & Services
- Google OAuth
- Google Calendar API
- Ollama
- Llama 3.2 3B

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/studyos.git
cd studyos
```

### 2. Install frontend dependencies

```bash
cd studyos
npm install
```

### 3. Install backend

```bash
cd ../server
npm install
```

### 4. Install Ollama

Download Ollama:

https://ollama.com/download

Pull the AI model:

```bash
ollama pull llama3.2:3b
```

---

## Running the Project

### Start Ollama

```bash
ollama serve
```

*(If it says the port is already in use, Ollama is already running.)*

### Start the AI server

```bash
cd server
node server.js
```

### Start the React app

```bash
cd studyos
npm run dev
```

---

## License

This project is licensed under the MIT License.
