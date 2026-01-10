import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Projector from './pages/Projector';
import ProjectorAdmin from './pages/ProjectorAdmin';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/projetor" element={<Projector />} />
        <Route
          path="/projetor-admin"
          element={
            <ProtectedRoute>
              <ProjectorAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

