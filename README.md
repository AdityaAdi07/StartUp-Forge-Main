# StartUp Forge 🚀

**StartUp Forge** is a next-generation ecosystem designed to bridge the gap between **Startup Founders** and **Investors**. Unlike traditional platforms that rely on manual searching and opaque networks, StartUp Forge leverages **Advanced AI**, **Graph Databases**, and **Decentralized Technologies** to create transparent, high-quality, and conflict-free connections.

---

## 🌟 Why StartUp Forge?

### The Problem
- **Founders** struggle to find investors who are truly interested in their specific domain and stage. Cold outreach is often ignored.
- **Investors** are overwhelmed with pitch decks that don't match their thesis.
- **Hidden Conflicts**: Identifying if an investor has already invested in a competitor is difficult and time-consuming, leading to wasted meetings and IP risks.

### The Solution
StartUp Forge solves these issues by:
1.  **AI-Powered Matchmaking**: Using Retrieval-Augmented Generation (RAG) to semantically understand a startup's pitch and match it with an investor's thesis.
2.  **Automated Conflict Analysis**: Instantly detecting potential Conflicts of Interest (COI) by analyzing an investor's existing portfolio using Graph logic.
3.  **Growth Prediction**: Providing data-driven insights into a startup's potential trajectory.
4.  **Trust & Privacy**: Ensuring communication is secure and decentralized.

---

## � Technical Deep Dive

### 1. RAG-Powered AI Chatbot & Search
We don't use simple keyword matching. StartUp Forge implements a **Retrieval-Augmented Generation (RAG)** pipeline to "reason" about matchmaking.

*   **Architecture**:
    *   **Embeddings**: We use the `BAAI/bge-base-en-v1.5` model to convert founder pitches and investor theses into 768-dimensional vectors.
    *   **Vector Database (ChromaDB)**: These vectors are stored in a localized vector store for millisecond-latency similarity search.
    *   **LLM Reasoning (Llama 3.2)**: When a user performs a search, the system retrieves the top-k most semantically relevant profiles and feeds them into a local **Llama 3.2** model. The LLM then generates a natural language explanation of *why* this match makes sense.
*   **Chatbot Capabilities**: Users can chat with the "System" to refine their search (e.g., *"Show me investors who like SaaS but avoid Fintech"*). The RAG pipeline respects these negative constraints.

### 2. Conflict of Interest (COI) Engine
This is the platform's "Safety Shield". Before a founder reveals their pitch deck, the system runs a deep graph traversal to ensure safety.

*   **Level 1 Conflict (Sector Overlap)**: Checks if the investor has heavily invested in the exact same narrow sector (e.g., *Generative AI Video*).
*   **Level 2 Conflict (Direct Competitor)**: Uses **Neo4j Graph Database** to check if the investor holds a board seat or significant equity in a direct competitor.
*   **The Math**: We treat the investor-startup network as a directed graph $G(V, E)$. A potential conflict is identified if there exists a path of length $\le 2$ between the target Investor node and a Competitor node.

### 3. Growth Prediction Model
An ML-powered oracle that gives Investors a "Credit Score" like view of a startup's potential.

*   **Inputs**: Funding Round, Market Size, Team Experience (Years), Competitor Density/Count.
*   **Outputs**:
    *   **Growth Classification**: High/Medium/Low velocity.
    *   **Valuation Projection**: Forecasted valuation at 3-month, 1-year, and 5-year intervals.
    *   **Acquisition Probability**: Likelihood of M&A exit.
*   **Model Stack**: An ensemble model combining **Gradient Boosting (XGBoost)** for regression (valuation) and **Random Forest** for classification (growth tier).

### 4. Decentralized Messaging (Gun.js)
We believe private negotiations should stay private.
*   **No Central Database**: Unlike WhatsApp or Slack where a central server stores messages, StartUp Forge uses **Gun.js**, a decentralized graph database.
*   **Peer-to-Peer Sync**: Messages are encrypted and synced directly between online peers. If a peer is offline, the localized Relay Server holds the encrypted packet until delivery, then forgets it.

---

## 📊 Dataset Creation & Publication
To build these high-accuracy models, we curated and cleaned a massive dataset of startup-investor interactions.

**The output dataset has been published on Kaggle for the open-source community:**
👉 **[Startup Founders and Investors Dataset](https://www.kaggle.com/datasets/adityaankanath/startup-founders-and-investors-dataset)**

*   **Size**: 1000+ Profiles.
*   **Features**: Includes detailed "About" sections (for NLP), funding history (for Regression), and portfolio mappings (for Graph Analysis).
  ![WhatsApp Image 2025-12-28 at 1 06 38 AM](https://github.com/user-attachments/assets/bb55e89a-be35-48ab-9105-7527f11de31b)
  ![WhatsApp Image 2025-12-28 at 1 06 38 AM](https://github.com/user-attachments/assets/3a06ceb4-77c9-4daf-a7ff-be4f6c8f04f0)


---

## 🏗️ System Architecture

The project consists of four main microservices working in harmony:

1.  **Frontend (`/frontend`)**:
    -   Built with **React 18**, **TypeScript**, and **Vite**.
    -   Modern UI with Tailwind CSS, Shadcn/Radix components.
    -   Handles all user interactions, dashboards, and visualizations.

2.  **Core Backend (`/backend`)**:
    -   **Node.js & Express**.
    -   Manages User Authentication (PostgreSQL).
    -   Orchestrates data flow between services.
    -   Connects to **Neo4j** for complex relationship queries.

3.  **AI Service (`/rag_backend`)**:
    -   **Python & FastAPI**.
    -   Hosts the **Llama 3.2** model (via Ollama) and interactions.
    -   Handles vector embeddings and RAG search logic.
    -   Runs the Growth Prediction models.

4.  **Real-Time Relay (`/gun_server`)**:
    -   **Node.js & Gun.js**.
    -   Acts as a relay peer for decentralized data synchronization (Chat, Live Notifications).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)
- **Docker** (for PostgreSQL & Neo4j)
- **Ollama** (with `llama3.2` model pulled)

### 1. Database Setup
Start the required databases using Docker:
```bash
# Ensure you have a docker-compose or start containers manually
docker start startupforge-postgres
docker start startupforge-neo4j
```

### 2. Core Backend
```bash
cd backend
npm install
node server.js
# server runs on port 3000
```

### 3. AI Service (RAG)
```bash
cd rag_backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
# API runs on port 8000
```

### 4. Gun.js Relay
```bash
cd gun_server
npm install
node gun.js
# Relay runs on port 8765
```

### 5. Frontend Client
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---
## Gallery
<img width="1919" height="974" alt="Screenshot 2026-01-20 015823" src="https://github.com/user-attachments/assets/66871880-80b0-4f96-8c1e-d554664698b3" />
<img width="1919" height="972" alt="Screenshot 2026-01-20 015946" src="https://github.com/user-attachments/assets/2327fffc-d413-44a2-8a1b-db0145e3fa84" />
<img width="1919" height="965" alt="Screenshot 2026-01-20 020035" src="https://github.com/user-attachments/assets/699fe6b4-6e35-4b50-a209-28329fc37bec" />
<img width="1916" height="963" alt="Screenshot 2026-01-20 021953" src="https://github.com/user-attachments/assets/db55a745-faa9-494a-94ff-6012f9121d24" />
<img width="1912" height="964" alt="Screenshot 2026-01-20 022001" src="https://github.com/user-attachments/assets/5131ceed-0b5c-42a2-b9f1-547757201d54" />
<img width="1845" height="892" alt="Screenshot 2026-01-20 022020" src="https://github.com/user-attachments/assets/5b7d28ff-0a3f-43a3-95e5-b5dee8d11505" />
<img width="1524" height="961" alt="Screenshot 2026-01-20 163929" src="https://github.com/user-attachments/assets/0de7683e-8acb-4e97-a770-0cddc2758691" />
<img width="1919" height="954" alt="Screenshot 2026-01-23 015357" src="https://github.com/user-attachments/assets/3b02de0b-7fc1-4664-8b78-ea746e4ab963" />
<img width="1919" height="943" alt="Screenshot 2026-01-23 015420" src="https://github.com/user-attachments/assets/66a32459-b398-4295-b22a-4823ca461939" />
<img width="1919" height="938" alt="Screenshot 2026-01-23 015435" src="https://github.com/user-attachments/assets/a9e44492-3413-4f0a-9e4e-6426a0620025" />
<img width="1919" height="938" alt="Screenshot 2026-01-23 015445" src="https://github.com/user-attachments/assets/15ce298b-8810-4dc1-9a6a-313c19ed52da" />

---

## 📂 Project Structure

| Directory | Description |
|-----------|-------------|
| `frontend/` | The React client application. |
| `backend/` | Main Node.js API gateway and DB controller. |
| `rag_backend/` | Python AI service for Search & Reasoning. |
| `gun_server/` | Decentralized WebSocket relay. |
| `growth_predict/` | ML notebooks and scripts for valuation models. |
| `coi/` | Legacy scripts for Conflict of Interest logic. |

---

## 🤝 Contribution
1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
**Built with ❤️ by the StartUp Forge Team**
