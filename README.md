# 🩺 Primare care and specialist care platform
Distributed telemedicine platform developed with REST, RPC, and WebSockets, providing two portals: one for primary care physicians (MAP) and one for medical specialists (ME). The system manages patient cases, messaging, and image processing, with persistent data storage and integration with external APIs. Additional functionality enables specialists to evaluate MAP referrals (1–10), calculate averages, and view rankings. MAPs can access their scores, averages, and relative position. Includes database extensions to support persistence of cases, messages, and ratings. Built with Node.js, Express, and a modular architecture for clinical system simulation.
This project implements a **distributed telemedicine platform** using **REST services, RPC, and WebSockets**. It provides two separate portals:  
- **MAP Portal** – Primary Care Physicians  
- **ME Portal** – Medical Specialists  

The goal is to simulate digital clinical infrastructure for managing patient referrals, enabling medical collaboration, and supporting advanced functionalities like chat, persistence, and ratings.

---

## ⚙️ Core Features

### 1. Distributed Architecture
- **REST** → Used for MAP portal (registration, login, patient case management).  
- **RPC** → Used for ME portal (assignment of cases, responses, and image filtering).  
- **WebSockets** → Enables **real-time messaging** between MAP and ME, both in group and personal chats.  

### 2. Persistence Layer
- Initial version stored data in arrays (memory only).  
- Extended version integrates with a **database** for persistent storage of doctors, patients, and cases.  
- External API integration with the **Ministry of Health** to report cases by region.  

### 3. Patient Case Management
- MAPs can create, edit, and delete patient cases.  
- Specialists can assign and resolve cases based on their specialty.  
- Case data includes personal info, specialty requested, creation/assignment/resolution dates, and medical notes.  

### 4. Image Processing (ME portal)
- Integration of **ttimagen** CLI tool for filtering uploaded patient images.  
- Supports operations like blur, invert, grayscale, threshold, and more.  
- Processed images are temporary and displayed only during the session.  

### 5. Ratings Functionality (Extension)
- **Specialists** can rate MAP referrals (1–10).  
- Ratings are associated with each case and stored in the database.  
- MAPs can view:
  - A list of all their ratings  
  - Their average score  
  - Their **relative ranking** among all MAPs (e.g. “You are ranked 2 out of 9”).  

---

## 🛠️ Technologies Used

- **Node.js + Express** – Server-side  
- **REST, RPC, WebSockets** – Communication mechanisms  
- **JavaScript (front-end)** – MAP and ME portals  
- **ttimagen (Node CLI tool)** – Image processing  
- **SQL Database** – Persistence of users, cases, messages, and ratings  

---

## 🚀 How to Run

1. Clone the repository and install dependencies:  
   ```bash
   npm install
Start the server:

bash
Copiar
Editar
node server.js
Open the portals in a browser:

MAP Portal → http://localhost:3000/map

ME Portal → http://localhost:3000/me

📚 Academic Context
This project was developed as part of the Telemedicine and Clinical Systems Infrastructure course during the Biomedical Engineering Degree (2023–2024, University of Alicante).

It demonstrates integration of distributed systems, web services, persistence, and medical collaboration tools in a simulated healthcare environment.
