# 📌 Pastebin-Lite (Node.js + Redis)
 
A lightweight Pastebin-like backend service where users can create text pastes and share a link to view them.
 
Each paste can optionally expire based on:

- ⏳ Time-to-live (TTL)

- 👀 Maximum view count  
 
Whichever condition triggers first invalidates the paste.
 
---
 
## 🚀 Features
 
- Create text pastes via API

- Shareable paste URLs

- Optional TTL expiration

- Optional view-count limits

- Atomic view tracking (race-condition safe)

- Secure HTML rendering (XSS-safe)

- Serverless-friendly architecture

- Redis-backed persistence (Upstash)
 
---
 
## 🧱 Tech Stack
 
- **Node.js**

- **Express.js**

- **Upstash Redis**

- **ES Modules**

- **dotenv**
 
---
 
## 📂 Project Structure
```
PASTEBIN-APPLICATION/
│
├── api/
│   └── index.js
│
├── src/
│   ├── server.js
│   ├── redis.js
│   │
│   ├── routes/
│   │   ├── health.js
│   │   ├── pastes.js
│   │   └── view.js
│   │
│   ├── middlewares/
│   │   └── validate.js
│   │
│   └── utils/
│       ├── escapeHtml.js
│       └── time.js
│
├── package.json
├── package-lock.json
└── vercel.json
```

---

 
