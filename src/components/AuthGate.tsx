import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import EmailGate from "./EmailGate";
import { Loader2 } from "lucide-react";

const AuthGate = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <EmailGate />;
  return <>{children}</>;
};

export default AuthGate;
