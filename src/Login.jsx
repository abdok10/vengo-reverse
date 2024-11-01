import { useState } from "react";
import axios from "./lib/axios";
// import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    console.log({
      email,
      password,
    });

    try {
      const response = await axios.post("/newlogin", {
        email,
        password,
      });

      console.log("Teeest");
      console.log({ response });

      const { access_token } = response.data;
      if (!access_token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          className="border border-gray-300 rounded-md p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          className="border border-gray-300 rounded-md p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Login
        </button>
        {error && <div className="text-red-700">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
