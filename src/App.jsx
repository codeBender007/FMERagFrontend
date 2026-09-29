import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { AuthProvider, ChatProvider, ThemeProvider } from "./context";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
