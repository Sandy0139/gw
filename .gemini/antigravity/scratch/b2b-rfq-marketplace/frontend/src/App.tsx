import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoControlPanel } from './components/DemoControlPanel';
import { FeddyAssistant } from './components/FeddyAssistant';
import { LoadingSpinner } from './components/LoadingSpinner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { BrowseRFQs } from './pages/BrowseRFQs';
import { CreateRFQ } from './pages/CreateRFQ';
import { EditRFQ } from './pages/EditRFQ';
import { RFQDetails } from './pages/RFQDetails';
import { MyQuotations } from './pages/MyQuotations';

const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRole?: 'BUYER' | 'SUPPLIER' }> = ({
  children,
  allowedRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullPage message="Authenticating user session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'BUYER' ? '/buyer/dashboard' : '/browse'} replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Minimalist Welcome Landing Page */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<BrowseRFQs />} />

              {/* Shared Detail Route */}
              <Route
                path="/rfqs/:id"
                element={
                  <ProtectedRoute>
                    <RFQDetails />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRole="BUYER">
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rfqs/create"
                element={
                  <ProtectedRoute allowedRole="BUYER">
                    <CreateRFQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rfqs/edit/:id"
                element={
                  <ProtectedRoute allowedRole="BUYER">
                    <EditRFQ />
                  </ProtectedRoute>
                }
              />

              {/* Supplier Routes */}
              <Route
                path="/supplier/quotations"
                element={
                  <ProtectedRoute allowedRole="SUPPLIER">
                    <MyQuotations />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Demo Control Panel for Evaluators */}
          <DemoControlPanel />

          {/* Feddy AI Procurement Assistant Widget (Federal Bank Inspired) */}
          <FeddyAssistant />

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
