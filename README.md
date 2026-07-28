# AEMC - Asian Educational Consultancy (Frontend)

The official web frontend for **AEMC (Asian Educational Consultancy)**, an educational consultancy platform helping students apply for medical studies (MBBS) and higher education programs abroad (India, Malaysia, China, etc.) and in Uzbekistan (BIEMU).

---

## 🚀 Tech Stack

- **Framework & Bundler:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), PostCSS, Autoprefixer
- **Icons & UI Helpers:** [Lucide React](https://lucide.dev/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Animations & Sliders:** [GSAP](https://greensock.com/gsap/), [Swiper](https://swiperjs.com/)
- **Forms & Notifications:** [React Dropzone](https://react-dropzone.js.org/), [Sonner Toast Notifications](https://sonner.emilkowal.si/)
- **Typography:** JetBrains Mono, Space Grotesk (`@fontsource`)

---

## 📂 Project Structure

```text
frontend/
├── public/                 # Static assets and media files
├── src/
│   ├── components/         # Reusable UI components (Navbar, Footer, Modals, Cards)
│   ├── pages/              # Page views (Home, MBBS, Services, About Us, Contacts, etc.)
│   ├── services/           # API integration and asynchronous requests
│   ├── styles/             # Global CSS styles and Tailwind imports
│   ├── utils/              # Helper utilities and formatters
│   ├── App.jsx             # Main routing and view structure
│   └── main.jsx            # Application root entry point
├── .env.example            # Environment variables example template
├── .gitignore              # Ignored files for Git version control
├── index.html              # Primary HTML entry file
├── package.json            # Dependencies and build scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build tool configuration
```

---

## 🔑 Key Features

- **MBBS & University Admission Hub:** Comprehensive admission information for foreign universities and BIEMU.
- **Interactive Application Modal:** Step-by-step admission application form with file upload support.
- **Consultation Booking:** Dynamic forms with real-time toast feedback notifications.
- **Modern Responsive Design:** Mobile-optimized layout with interactive animations powered by GSAP and Swiper.

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend` root directory by copying the template:

```bash
cp .env.example .env
```

Define your environment configuration in `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

The production-ready output will be generated inside the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

---

## 📤 Pushing to GitHub

If you are initializing and pushing this frontend repository to GitHub for the first time:

```bash
# Navigate to the frontend directory
cd frontend

# Initialize Git repository
git init
git branch -M main

# Stage and commit files
git add .
git commit -m "feat: initial commit for AEMC frontend"

# Add remote origin and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```
