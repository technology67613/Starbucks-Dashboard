# Starbucks Patna Store Dashboard

**Live Demo:** [https://starbuckdashboardpu.netlify.app/](https://starbuckdashboardpu.netlify.app/)

An internal, single-store business management dashboard for Starbucks Patna (P&M Mall) staff. This project is a front-end prototype built to give the store admin a fast, accurate read on daily performance, and to manage orders, menu items, and inventory. 

This project was built as a hackathon submission, focusing on functionality, UI/UX, and time efficiency.

## 🚀 Technologies Used

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Data Parsing:** PapaParse (for handling CSV data)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/technology67613/Starbucks-Dashboard.git
   cd Starbucks-Dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## ✨ Features & Screens

The dashboard consists of 6 primary screens:

1. **Dashboard:** Provides daily KPIs (Total Sales, Orders, Average Order Value), a sales trend chart, and today's highlights.
2. **Orders:** A comprehensive view of all historical orders with filtering (by status, date, and search) and pagination.
3. **Menu:** Manage all menu categories (Hot Beverages, Cold Beverages, Bakery, Food, Merchandise) and check availability.
4. **Inventory:** Track stock levels for raw materials and packaging (In Stock, Low Stock, Out of Stock).
5. **Reports:** Detailed analytics across a customizable date range, including top-selling items and sales by category.
6. **Settings:** Store configuration, regional preferences, and account settings.

## 📊 Data Source

The application is entirely frontend-driven. It uses a provided local CSV dataset (`mock_starbucks_patna_dataset.csv`) as the single source of truth for all sales and order data spanning from July 2025 to September 2025.

Inventory data is provided via a separate mocked JSON file, as it functions independently from sales data.

## 🛠 Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles TypeScript and builds the app for production.
- `npm run lint` - Runs ESLint to catch and fix code issues.
- `npm run preview` - Previews the production build locally.
