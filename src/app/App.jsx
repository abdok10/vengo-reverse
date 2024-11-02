import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "@/app/Login";
import FormBuilder from "@/app/FormBuilder";
import FormPreview from "@/components/FormPreview";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/form-builder" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/form-builder"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FormBuilder handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-display/:formId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FormPreview handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/form-builder" replace />} />
        <Route path="*" element={<Navigate to="/form-builder" replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
