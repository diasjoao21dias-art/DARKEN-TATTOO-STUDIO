import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#16161b", border: "1px solid rgba(237,232,223,.12)", color: "#ede8df", borderRadius: 0 } }} />
    </div>
  );
}

export default App;
