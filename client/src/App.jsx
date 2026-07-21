import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Goals from './pages/Goals';
import Stats from './pages/Stats';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DataProvider>
              <DashboardLayout />
            </DataProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="goals" element={<Goals />} />
        <Route path="stats" element={<Stats />} />
      </Route>

      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
