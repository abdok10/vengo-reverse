import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up:", { email, password });
    try {
      // API call for login
      setLoading(true);
      const response = await fetch("http://xapi.vengoreserve.com/api/newlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoading(false);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log(data);
      
      if (data.access_token) {
        // Store the access_token in localStorage
        localStorage.setItem("token", data.access_token);
        // Redirect or reload the page
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        showToast(error.message);
      } else {
        console.error("Login error:", error);
        showToast("Unknown error. Please try again.");
      }
    }
  };

  function showToast(msg: string) {
    toast({
      variant: "destructive",
      title: "Login error",
      description: msg,
      action: <ToastAction altText="Réessayer">Réessayer</ToastAction>,
    });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="flex-1 hidden md:flex items-center justify-center p-10 bg-white">
        <img
          src="/images/640.gif"
          alt="3D illustration of data and cloud computing elements"
          className="max-w-full h-auto w-[300px] md:w-[600px]"
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">
              Bienvenue sur
              <img
                src="/Vengo-reserve.png"
                alt="Praxedo Logo"
                className="h-10 mx-auto"
              />
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <h2 className="text-3xl text-center font-bold text-gray-900">
              Se connecter
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="agree-terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-900"
              >
                J'accepte les conditions d'utilisation
              </label>
            </div>

            <div>
              {loading ? (
                <Button
                  disabled
                  className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}