import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/ThemeContext";
import Index from "./pages/Index";
import WorksPage from "./pages/WorksPage";
import WorkDetailPage from "./pages/WorkDetailPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/works/:slug" element={<WorkDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
