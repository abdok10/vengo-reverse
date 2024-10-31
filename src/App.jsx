import { useEffect, useState } from "react";
// import axios from "./lib/axios";
import Login from "./Login";
import FormBuilder from "./FormBuilder";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [formSchema, setFormSchema] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchFormSchema();
    }
  }, []);

  const fetchFormSchema = async () => {};

  const handleLogout = () => {};

  return (
    <div>
      {!isLoggedIn ? (
        <div className="py-2 container mx-auto">
          <nav className="flex items-center justify-between ">
            <h1 className="font-bold text-2xl">Vengo Reverse </h1>

            <button
              className="bg-red-500 text-white p-2 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
          <FormBuilder />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
