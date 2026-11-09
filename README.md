# 📝 FormFlow - Enterprise-Grade Dynamic Form Builder

> A comprehensive full-stack solution for building, customizing, and managing dynamic forms with real-time previews and secure data isolation.

## 🚀 Project Overview
FormFlow bridges the gap between complex data collection and user-friendly design. Engineered with a decoupled client-server architecture, this platform empowers users to generate highly customizable forms on the fly without writing a single line of code. 

By leveraging **Next.js** for a snappy, component-driven UI and **Node.js/MongoDB** for robust data persistence, FormFlow ensures that every form is strictly mapped to the authenticated user, guaranteeing data privacy and seamless state management.

---

## 🧠 Core Architecture & Business Logic

- **Client-Server Decoupling:** Independent frontend and backend repositories communicating seamlessly via RESTful APIs.
- **Data Isolation:** User email integration at the schema level ensures that users can only view, edit, and manage their own specific forms.
- **State Management:** Efficient React Hook utilization (`useState`, `useRef`, `useEffect`) to handle complex real-time canvas updates and drag-and-drop sorting.
- **Dynamic Routing:** Next.js App Router utilization for instant navigation between dashboard, builder, and preview modes.

---

## ✨ Standout Features

### 🛠️ Advanced Form Canvas
* **Drag-and-Drop Sorting:** Easily reorder form fields on the canvas for optimal flow.
* **10+ Dynamic Input Types:** Supports standard inputs (Text, Email, Phone, Dropdowns, Checkboxes) and **Premium Inputs** (Interactive Star Ratings, Range Sliders, Image/File Uploads).
* **Digital Signature Pad:** Built-in HTML5 Canvas implementation allowing users to draw signatures via mouse or touch inputs.

### 👁️ Real-Time Interactivity
* **Live Preview Engine:** Instantly toggle between Builder Mode and Preview Mode to test form logic, validation, and visual appeal before deployment.
* **Smart Theming:** 1-click UI customization (Indigo, Emerald, Rose, Amber, Slate) dynamically applied across all form components.

### 💾 Lifecycle Management
* **Draft vs. Publish States:** Save forms as inactive 'Drafts' for later editing, or 'Publish' them instantly to generate live sharing capabilities.
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile viewing using Tailwind CSS grid and flexbox utilities.

---

## 💻 Tech Stack & Tooling

### Frontend
* **Framework:** Next.js (React.js)
* **Language:** TypeScript / JavaScript (ES6+)
* **Styling:** Tailwind CSS (Utility-first framework)
* **Icons & UI:** Heroicons, Custom SVG integrations

### Backend & Database
* **Runtime Environment:** Node.js
* **Framework:** Express.js (REST API creation)
* **Database:** MongoDB (NoSQL data storage)
* **ODM:** Mongoose (Schema validation and modeling)
* **Security:** CORS, Environment Variables (`.env`)

---

## ⚙️ Local Installation & Setup

Want to run FormFlow on your local machine? Follow these steps:

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/formflow.git
cd formflow
\`\`\`

### 2. Initialize Backend (Server)
\`\`\`bash
cd backend
npm install
\`\`\`
Create a \`.env\` file in the `backend` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
\`\`\`
Start the development server:
\`\`\`bash
npm start
\`\`\`

### 3. Initialize Frontend (Client)
Open a new terminal window/tab:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
> The frontend will typically run on `http://localhost:3000` and communicate with the backend on `http://localhost:5000`.

---

## 🚧 Roadmap for Future Updates
- [ ] Graphical Analytics Dashboard for form responses.
- [ ] Export responses to CSV/Excel format.
- [ ] Drag-and-drop file upload interface (integration with Cloudinary/AWS S3).

---
*Built with  by [Shivani Sharma]*
