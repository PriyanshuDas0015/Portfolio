import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProjectsManager from './pages/ProjectsManager/ProjectsManager';
import ProjectEditor from './pages/ProjectEditor/ProjectEditor';
import SkillsManager from './pages/SkillsManager/SkillsManager';
import SimpleManager from './pages/SimpleManager/SimpleManager';
import EducationManager from './pages/EducationManager/EducationManager';
import ResumeManager from './pages/ResumeManager/ResumeManager';
import MessagesManager from './pages/MessagesManager/MessagesManager';
import SettingsManager from './pages/SettingsManager/SettingsManager';
import CertificatesManager from './pages/CertificatesManager/CertificatesManager';
import MediaLibrary from './pages/MediaLibrary/MediaLibrary';
import WebsiteSettings from './pages/WebsiteSettings/WebsiteSettings';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import ProfileManager from './pages/ProfileManager/ProfileManager';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="admin/dashboard" element={<Dashboard />} />
              <Route path="hero" element={<SettingsManager mode="hero" />} />
              <Route path="about" element={<SettingsManager mode="about" />} />
              <Route path="profile" element={<ProfileManager />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="projects/new" element={<ProjectEditor />} />
              <Route path="projects/:id/edit" element={<ProjectEditor />} />
              <Route path="experience" element={<SimpleManager resource="timeline" />} />
              <Route path="education" element={<EducationManager />} />
              <Route path="certificates" element={<CertificatesManager />} />
              <Route path="services" element={<SimpleManager resource="services" />} />
              <Route path="resume" element={<ResumeManager />} />
              <Route path="contact" element={<SettingsManager mode="contact" />} />
              <Route path="social-links" element={<SettingsManager mode="settings" />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<WebsiteSettings />} />
              <Route path="account" element={<AccountSettings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
