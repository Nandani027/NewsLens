# NewsLens – AI-Powered News Verification Platform

**NewsLens** is an AI-powered news verification platform that helps users determine the credibility of news headlines and articles by comparing them with trusted news sources and generating an AI-based analysis.

Users can either paste a **news headline** or the **URL of a news article**. NewsLens analyzes the input, searches trusted news sources, and provides a credibility assessment along with supporting articles. The platform includes a **Latest News** page where users can instantly view and verify trending news with a single click. 

---

##  Features

* Verify news using a headline or article URL
* Analyze and verify news articles directly from their URLs.
* AI-generated credibility analysis
* Confidence score with verification status
* Displays matching articles from trusted news sources
* AI-generated verification summary
* Latest news section categorized by topic
* Browse trending news and verify any article instantly. 
* Modern and responsive user interface

---

## Tech Stack
```text
Frontend
├── React.js
├── Vite
├── React Router DOM
├── CSS3
└── Axios
        │
        ▼
Backend
├── Node.js
└── Express.js
        │
        ▼
External Services
├── NewsAPI
├── Jina Reader
└── Gemini Flash API
        │
        ▼
Deployment & Tools
├── Vercel (Frontend)
├── Railway (Backend)
├── Git
└── GitHub
```
---

## System Workflow
```text
                                    ┌────────────────────┐
                                    │       User         │
                                    └─────────┬──────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
                      ▼                                               ▼
              Latest News Page                               Verify News Page
                      │                                               │
                      ▼                                               ▼
          React Frontend (Vite)                           React Frontend (Vite)
                      │                                               │
            GET /latest-news                              POST /verify
                      │                                               │
                      └───────────────────┬───────────────────────────┘
                                          ▼
                              Node.js + Express Backend
                                          │
              ┌───────────────────────────┴───────────────────────────┐
              │                                                       │
              ▼                                                       ▼
     Fetch Latest Headlines                                Process Verification
         from NewsAPI                                             Request
              │                                                       │
              ▼                                                       ▼
   Latest News JSON Response                          Is input URL or Headline?
              │                                                       │
              ▼                             ┌──────────────────────────┴─────────────────────────┐
 Display Latest News Cards                  │                                                    │
                                            ▼                                                    ▼
                                     URL Submitted?                                   Headline Submitted?
                                            │                                                    │
                                            ▼                                                    ▼
                               Extract Article (Jina AI)                             Use Headline Directly
                                            │                                                    │
                                            └──────────────────────┬─────────────────────────────┘
                                                                   ▼
                                                     Generate Search Keywords
                                                                   │
                                                                   ▼
                                               Search Related Articles using NewsAPI
                                                                   │
                                                                   ▼
                                                 Retrieve Trusted Matching Articles
                                                                   │
                                                                   ▼
                                              Send Data to Gemini AI for Verification
                                                                   │
                                         ┌─────────────────────────────────────────────────────────────┐
                                         │               │                     │                       │               
                                         ▼               ▼                     ▼                       ▼               
                                       Verdict   Confidence Score     Verification Summary      Trusted Sources      
                                                                   │
                                                                   ▼
                                                        Prepare JSON Response
                                                                   │
                                                                   ▼
                                                     React Frontend Receives Data
                                                                   │
                                                                   ▼
                                                  Display Verification Result, Summary,
                                              Trusted Sources, Confidence & Matching Articles
```
---

## Project Structure

```text
NewsLens/
│
├── public/                 # Static assets
│
├── src/
│   ├── assets/             # Images and static resources
│   ├── components/
│   │   ├── Hero/
│   │   ├── Navbar/
│   │   ├── SearchBar/
│   │   ├── VerificationResult/
│   │   ├── VerificationSummary/
│   │   ├── TrustedSources/
│   │   ├── MatchingArticles/
│   │   ├── NewsCard/
│   │   ├── LatestNews/
│   │   └── CategoryPills/
│   ├── pages/              # Home, Verify, Latest News
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── server.js           # Express server
│   ├── .env                # Environment variables
│   └── package.json
│
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nandani027/NewsLens.git
```

### 2. Navigate into the project

```bash
cd NewsLens
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the **server** folder.

```env
NEWS_API_KEY=your_newsapi_key
GEMINI_API_KEY=your_gemini_api_key

```

### 5. Start the backend

```bash
cd server
node server.js
```

### 6.  Start the frontend

Open a new terminal in the project root and run:

```bash
cd client
npm run dev
```

### 7. Open the Application

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:5000`
---

## API Endpoints

- **POST** `/verify` – Verifies a news headline or article URL.
- **GET** `/latest-news` – Retrieves the latest news by category.

  ---

  ## Deployment

NewsLens is deployed using separate platforms for the frontend and backend.

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Railway |

### Live Application

- **Frontend:** https://news-lens-tls.vercel.app
- **Backend API:** https://newslens-production-4e6e.up.railway.app/

---
##  License

This project is intended for educational and academic purposes.

---





