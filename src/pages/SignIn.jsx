import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onOpenSignUp = () => {
    navigate("/signup");
  };

  // 🔥 SIGN IN FUNCTION
  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("User logged in:", data);
    alert("Login successful");

    // 👉 redirect after login
    navigate("/dashboard"); // change if needed
  };

  // 🔥 GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}dashboard`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#9ec5d9] via-[#b7d4e5] to-[#e6f0f6]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,white,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-8 h-[65vh]">
        
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Sign in with email
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          Enter your Album
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/60 text-gray-800 placeholder:text-gray-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/60 text-gray-800 placeholder:text-gray-400 outline-none"
          />

          <div className="text-right text-sm text-gray-500">
            Forgot password?
          </div>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?
            <button
              type="button"
              onClick={onOpenSignUp}
              className="ml-1 font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900"
            >
              Sign up
            </button>
          </div>

          <button
            type="button"
            onClick={handleSignIn}
            className="w-full py-3 rounded-full bg-gradient-to-b from-gray-900 to-gray-700 text-white font-medium shadow-lg"
          >
            Get Started
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow"
          >
            {/* Google SVG */}
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5..." />
            </svg>
            Sign in with Google
          </button>
        </div>

      </div>
    </div>
  );
}
