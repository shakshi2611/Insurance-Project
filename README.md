# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



# Insurance Project

## Overview

This project is a **React.js** based web application that allows users to upload and manage insurance and broker files, view detailed comparisons, and export reports. The app provides a user-friendly interface for handling multi-file uploads, performing file comparisons, and generating summaries in various formats such as PDF, Excel, and DOC.

The application uses **JSON Server** for simulating backend APIs, and various libraries for file processing, charting, and PDF/Excel generation.

---

## Features

- **Multi-File Upload:** Upload insurance and broker files (JPG, PDF, Excel, DOC).
- **File Comparison:** View and compare uploaded files by amount and percentage.
- **File Export:** Export comparison results as PDF, Excel, DOC, and JPG.
- **Data Tables:** Display file data in table formats with sorting and filtering.
- **Search Functionality:** Search files by name, policy number, amount, or percentage.
- **Mock API:** Uses JSON Server to simulate backend API requests.

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your local development machine:

- **Node.js** (v16.x or later)
- **npm** (v7.x or later)

---

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-repo/insurance-project.git
   cd insurance-project
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

---

### Running the Application

To start the application in development mode and run the mock servers:

1. **Start JSON servers** and the app together:
   ```bash
   npm run start-dev
   ```

This will:
- Clear `db2.json` and initialize it with empty arrays for `insuranceFiles` and `brokerFiles`.
- Start JSON Server on ports 5000 and 5001, simulating two different databases (`db1.json` and `db2.json`).
- Launch the React application with Vite for faster development builds.

Alternatively, to just run the React app in development mode without the JSON servers:

```bash
npm run dev
```

---

### Building for Production

To build the project for production:

```bash
npm run build
```

This will create an optimized production build in the `dist/` folder.

---

### API Simulation

This project uses **JSON Server** to simulate API responses. You can find two mock databases in the root directory:

- `db1.json` simulates the insurance data.
- `db2.json` simulates the broker data.

To manually start the JSON servers:

```bash
npm run start-servers
```

---

### Cleaning Up the Database

To clear the broker files database (`db2.json`), use the following command:

```bash
npm run clear-db
```

---

## Scripts

- `npm run dev`: Start the development server with Vite.
- `npm run build`: Build the app for production.
- `npm run lint`: Run ESLint to check for linting errors.
- `npm run preview`: Preview the production build.
- `npm run start-servers`: Start both JSON Server instances.
- `npm run dev-full`: Run the development server and start the JSON servers.
- `npm run clear-db`: Clear the broker files database (`db2.json`).

---

## Technologies Used

- **React.js** for building the UI.
- **Vite** for bundling and fast builds.
- **MUI (Material UI)** for pre-built UI components.
- **Axios** for making HTTP requests.
- **JSON Server** for simulating API requests.
- **Framer Motion** for animations.
- **Recharts** for displaying charts and graphs.
- **TailwindCSS** for styling the app.
- **jsPDF** and **xlsx** for generating PDF and Excel files.
- **docx** for creating Word documents.
- **ESLint** for linting and code formatting.
- **npm-run-all** for running multiple scripts in parallel.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## Acknowledgments

- Special thanks to all the open-source contributors for the tools and libraries used in this project.

---

### Troubleshooting

- If the app fails to start, ensure all dependencies are installed and the correct Node.js version is used.
- For any issues with file uploads, ensure your file formats match the accepted types (JPG, PDF, DOC, Excel).

--- 

