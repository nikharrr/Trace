import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn({onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const onOpenSignUp = () => {
  navigate("/signup");
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#9ec5d9] via-[#b7d4e5] to-[#e6f0f6]" />

      {/* optional clouds effect */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,white,transparent_70%)]" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-8 h-[65vh]">

    

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Sign in with email
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          Enter your Album
        </p>

        {/* FORM */}
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
            Dont have an account ? 
            <button
              type="button"
              onClick={onOpenSignUp}
              className="ml-1 font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900"
            >
              Sign up
            </button>
          </div>

          <button
            onClick={onSignIn}
            className="w-full py-3 rounded-full bg-gradient-to-b from-gray-900 to-gray-700 text-white font-medium shadow-lg"
          >
            Get Started
          </button>

        </div>

<div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

      </div>
    </div>
  );
}
