import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const LoginStatusIndicator = () => {
  const { user, isAdmin, isStaff, roles, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (loading || !user) return null;

  const name =
    (user.user_metadata?.name as string) ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Friend";

  const roleLabel = isAdmin
    ? "Admin"
    : roles.includes("therapist")
    ? "Therapist"
    : roles.includes("content_manager")
    ? "Content Manager"
    : "Member";

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  return (
    <div className="fixed top-3 right-3 z-40">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 shadow-md border backdrop-blur transition
            ${isAdmin
              ? "bg-gradient-to-r from-amber-400/90 to-orange-500/90 border-orange-300 text-white"
              : "bg-white/90 border-orange-200 text-orange-700"}`}
          aria-label="Account menu"
        >
          {isAdmin ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
          <span className="text-xs font-bold font-nunito hidden sm:inline">
            {name}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full
            ${isAdmin ? "bg-white/25" : "bg-orange-100 text-orange-700"}`}>
            {roleLabel}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-80" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-orange-100 p-4 z-50 font-nunito">
              <div className="flex items-center gap-3 pb-3 border-b border-orange-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${isAdmin ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-orange-400 to-pink-400"}`}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-orange-900 truncate">{name}</p>
                  <p className="text-xs text-orange-600 truncate">{user.email}</p>
                </div>
              </div>

              <div className={`mt-3 rounded-xl p-3 text-xs leading-relaxed
                ${isAdmin
                  ? "bg-amber-50 text-amber-900 border border-amber-200"
                  : isStaff
                  ? "bg-blue-50 text-blue-900 border border-blue-200"
                  : "bg-orange-50 text-orange-900 border border-orange-200"}`}>
                {isAdmin ? (
                  <>
                    <p className="font-bold mb-1">👑 Admin access</p>
                    <p>You can manage users, roles and content from the admin dashboard.</p>
                  </>
                ) : isStaff ? (
                  <>
                    <p className="font-bold mb-1">⭐ Team member</p>
                    <p>You have full access to all therapy content.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold mb-1">🎉 You're signed in!</p>
                    <p>Enjoy unlimited practice. Your progress stays with this account.</p>
                  </>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/admin");
                  }}
                  className="w-full mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-bold transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Open admin dashboard
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-sm font-bold transition"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginStatusIndicator;
