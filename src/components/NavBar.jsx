import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function NavBar() {
  const [profileInitial, setProfileInitial] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProfileInitial = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setProfileInitial("");
        return;
      }

      const user = userData.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const nameFromProfile = profile?.full_name?.trim();
      const nameFromMetadata = user.user_metadata?.full_name?.trim();
      const nameFromEmail = user.email?.trim();

      const seed = nameFromProfile || nameFromMetadata || nameFromEmail || "U";
      const first = seed.charAt(0).toUpperCase();

      setProfileInitial(first);
    };

    loadProfileInitial();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfileInitial();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleViewProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setIsOpen(false);
    setProfileInitial("");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <NavLink
          to="/"
          className="text-lg font-semibold tracking-[0.2em] text-gray-900"
        >
          TRACE
        </NavLink>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white"
          >
            {profileInitial || "U"}
          </button>

          {isOpen && (
            <div className="absolute right-0 top-12 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={handleViewProfile}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
