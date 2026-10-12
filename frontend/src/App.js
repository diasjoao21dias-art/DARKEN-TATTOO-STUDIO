import "@/App.css";
import { Toaster } from "sonner";
import Home from "@/pages/Home";

function App() {
  return (
    <div className="grain">
      <Home />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#16161b", border: "1px solid rgba(237,232,223,.12)", color: "#ede8df", borderRadius: 0 } }} />
    </div>
  );
}

export default App;
