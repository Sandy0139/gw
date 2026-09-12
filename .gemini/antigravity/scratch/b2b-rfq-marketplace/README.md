# Quotio B2B - Full-Stack B2B RFQ Marketplace

**Quotio B2B** is a full-stack Request for Quotation (RFQ) Marketplace designed for modern industrial procurement. **Quotio B2B** connects Buyers & Suppliers with live bidding, side-by-side quotation comparison, verified badges, and automated RBAC security.

Built with **Node.js, Express, TypeScript, Prisma ORM, SQLite, React 18, Vite, Zod, and Tailwind CSS**.

---

## 🌟 Key Features

### 1. User Roles & Authentication
- **Buyer & Supplier Personas**: Dedicated user roles with tailored dashboards, authorization rules, and UI navigation.
- **Secure Auth**: JWT-based stateless authentication with password hashing via `bcryptjs`.
- **Role-Based Access Control (RBAC)**: Enforced via Express middleware on all sensitive API endpoints.

### 2. Marketplace Design & Features
- **Quotio B2B Header & Vector Logo**: Clean SVG vector logo mark with global category search and location indicator.
- **Top Category Icon Strip**: Top horizontal row with icon shortcuts (*Electronics*, *Machining & CNC*, *Energy*, *Raw Materials*, *Logistics*).
- **Feddy AI Assistant**: Interactive chatbot guide.
- **Order Summary Box & Offer Comparison Matrix**: Side-by-side bid comparison table automatically awarding **LOWEST PRICE** 🟢, **FASTEST SHIPPING** 🔵, and **BEST VALUE** 🟡.

---

## ⚡ Pre-Seeded Indian Demo Credentials

For quick evaluation, use these pre-seeded accounts:

| Persona | Name | Indian Company | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Buyer Demo** | Rajesh Sharma | Sharma Enterprise Solutions Pvt Ltd | `rajesh@sharma-enterprises.in` | `password123` |
| **Supplier Demo**| Vikram Malhotra | Malhotra Electronics & Manufacturing | `vikram@malhotra-electronics.in` | `password123` |

---

## 🚀 Local Development Setup

```bash
# 1. Start Backend API (Port 5000)
cd backend
npm install
npx prisma db push
npx ts-node src/seed.ts
npm run dev

# 2. Start Frontend App (Port 3000)
cd ../frontend
npm install
npm run dev
```

---

## 📄 License & Copyright

© 2026 **Sandy**. All rights reserved.
