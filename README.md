# Invoice App — React Frontend

A React 19 single-page application for managing clients, projects, time entries, and invoices. Built as the frontend for the Invoice App Rails API.

## Tech Stack

- **React** 19
- **React Router** 7 — client-side routing
- **Tailwind CSS** 3 — utility-first styling
- **Create React App** — build tooling

## Getting Started

### Prerequisites

- Node.js 18+
- The [Rails API backend](../invoice_app) running on `http://localhost:3000`

### Install and Run

```bash
npm install
npm start
```

The app runs at `http://localhost:8080` by default.

### API Configuration

The frontend connects to the Rails API at `http://localhost:3000` by default. To point to a different backend, set the environment variable before starting:

```bash
REACT_APP_API_URL=http://your-api-host npm start
```

## Pages and Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | — | Redirects to `/clients` |
| `/clients` | ClientList | View all clients |
| `/clients/new` | ClientForm | Create a new client |
| `/clients/:id/edit` | ClientForm | Edit an existing client |
| `/projects` | ProjectList | View all projects |
| `/projects/new` | ProjectForm | Create a new project |
| `/projects/:id/edit` | ProjectForm | Edit an existing project |
| `/timesheets` | TimesheetList | View all time entries with invoice status |
| `/timesheets/new` | TimesheetForm | Log a new time entry |
| `/timesheets/:id/edit` | TimesheetForm | Edit a time entry |
| `/invoices` | InvoiceList | View all invoices with status badges |
| `/invoices/new` | InvoiceForm | Generate an invoice from time entries |
| `/invoices/:id` | InvoiceDetail | View line items, send, download, or regenerate PDF |
| `/settings` | SettingsPage | Configure business profile |

## Project Structure

```
src/
  api/              # API client modules (one per resource)
  components/       # Shared components (Layout, sidebar nav)
  pages/
    clients/
    projects/
    timesheets/
    invoices/
    settings/
  index.js
  App.js
```

## API Modules

Each module in `src/api/` wraps the corresponding backend endpoints:

| Module | Covers |
|--------|--------|
| `clients.js` | CRUD for clients |
| `projects.js` | CRUD for projects |
| `timeEntries.js` | CRUD for time entries (nested under projects) |
| `rates.js` | Get/set rates for clients and projects |
| `invoices.js` | CRUD, PDF download, regenerate, send invoice |
| `businessProfile.js` | Get/update business profile |

## Key Features

- **Timesheets** show whether each time entry has been invoiced, with a link to the invoice
- **Invoice generation** selects a client and date range; the backend finds all unbilled entries
- **Invoice detail** supports status transitions (pending → sent → paid), PDF download, PDF regeneration, and emailing the invoice to the client
- **Client and project rates** support a billing rate hierarchy — project rate overrides client default
- **Settings page** manages business name, contact info, and HST number used on PDFs and emails

## Building for Production

```bash
npm run build
```

Output goes to the `build/` directory. Since this is a single-page app, your web server must serve `index.html` for all routes. Example nginx config:

```nginx
location / {
  try_files $uri /index.html;
}
```
