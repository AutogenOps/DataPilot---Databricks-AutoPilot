import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from './pages/ChatPage';
import JobsPage from './pages/JobsPage';
import PipelinesPage from './pages/PipelinesPage';
import ClustersPage from './pages/ClustersPage';
import DBTPage from './pages/DBTPage';
import AlertsPage from './pages/AlertsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<ChatPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="pipelines" element={<PipelinesPage />} />
            <Route path="clusters" element={<ClustersPage />} />
            <Route path="dbt" element={<DBTPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
