import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div>
      {showSignup ? (
        <Signup
          onSwitchToLogin={() =>
            setShowSignup(false)
          }
        />
      ) : (
        <Login
          onSwitchToSignup={() =>
            setShowSignup(true)
          }
        />
      )}
    </div>
  );
}

export default App;