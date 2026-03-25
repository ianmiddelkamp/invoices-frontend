import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';
import ProjectList from './pages/projects/ProjectList';
import ProjectForm from './pages/projects/ProjectForm';
import TimesheetList from './pages/timesheets/TimesheetList';
import TimesheetForm from './pages/timesheets/TimesheetForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/clients" replace />} />

          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/:id/edit" element={<ClientForm />} />

          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />

          <Route path="timesheets" element={<TimesheetList />} />
          <Route path="timesheets/new" element={<TimesheetForm />} />
          <Route path="timesheets/:id/edit" element={<TimesheetForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
