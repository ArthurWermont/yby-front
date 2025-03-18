import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import MainRoutes from "./routes";

// Function to verify and clear localStorage daily
const clearLocalStorageDaily = () => {
  const lastSaveDate = parseInt(
    localStorage.getItem("lastSaveDate") || "0",
    10
  );
  const now = new Date().getTime();

  // If there is no record of the date or if more than 24 hours have passed (86400000 ms)
  if (!lastSaveDate || now - lastSaveDate > 86400000) {
    // Remove the data stored in localStorage
    localStorage.removeItem("ids");

    // Update the last save date
    localStorage.setItem("lastSaveDate", now.toString());
  }
};

const App = () => {
  // Check and clear localStorage, if necessary, when the app is loaded
  clearLocalStorageDaily();

  return (
    <AuthProvider>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
