import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data?.user;

      if (!user) {
        alert("Signup succeeded, but user data was not returned.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: name,
        username : user.email,
      });

      if (profileError) {
        alert(profileError.message);
        return;
      }

      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#9ec5d9] via-[#b7d4e5] to-[#e6f0f6]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,white,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Create account
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2 mb-6">
          Start building your timeline
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/60 text-gray-800 placeholder:text-gray-400 outline-none"
          />

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

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-b from-gray-900 to-gray-700 text-white font-medium shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-gray-600">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/")}
            className="ml-1 font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
