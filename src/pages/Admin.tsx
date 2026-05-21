import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface Row {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

const ROLES: AppRole[] = ["owner", "admin", "therapist", "content_manager", "user"];

const Admin = () => {
  const { signOut, user, roles } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, AppRole[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: allRoles }] = await Promise.all([
        supabase.from("profiles").select("id,email,name,created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      setRows((profiles ?? []) as Row[]);
      const map: Record<string, AppRole[]> = {};
      (allRoles ?? []).forEach((r: any) => {
        map[r.user_id] = [...(map[r.user_id] ?? []), r.role];
      });
      setRoleMap(map);
      setLoading(false);
    })();
  }, []);

  const setRole = async (userId: string, role: AppRole) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role });
    setRoleMap((m) => ({ ...m, [userId]: [role] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-fredoka text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/"><Button variant="outline" size="sm">Back to app</Button></Link>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="w-4 h-4" /> Sign out</Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div className="bg-card rounded-2xl p-4 border">
          <p className="text-sm text-muted-foreground font-nunito">
            Signed in as <strong>{user?.email}</strong> · Roles: {roles.join(", ") || "none"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-fredoka text-lg font-bold">Users ({rows.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="divide-y">
              {rows.map((r) => (
                <div key={r.id} className="p-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-semibold font-nunito">{r.name || "—"}</p>
                    <p className="text-sm text-muted-foreground">{r.email}</p>
                  </div>
                  <select
                    value={roleMap[r.id]?.[0] ?? "user"}
                    onChange={(e) => setRole(r.id, e.target.value as AppRole)}
                    className="bg-background border rounded-md px-3 py-1.5 text-sm"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              ))}
              {rows.length === 0 && <p className="p-8 text-center text-muted-foreground">No users yet</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
