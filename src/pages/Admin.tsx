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
  last_login: string | null;
}

const ROLES: AppRole[] = ["owner", "admin", "therapist", "content_manager", "user"];

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const Admin = () => {
  const { signOut, user, roles } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, AppRole[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: allRoles }] = await Promise.all([
        supabase.from("profiles").select("id,email,name,created_at,last_login").order("created_at", { ascending: false }),
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

      <main className="container py-6 sm:py-8 space-y-6">
        <div className="bg-card rounded-2xl p-4 border">
          <p className="text-sm text-muted-foreground font-nunito">
            Signed in as <strong>{user?.email}</strong> · Roles: {roles.join(", ") || "none"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground uppercase font-nunito">Total Users</p>
            <p className="font-fredoka text-3xl font-bold mt-1">{rows.length}</p>
          </div>
          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground uppercase font-nunito">Active (last 7d)</p>
            <p className="font-fredoka text-3xl font-bold mt-1">
              {rows.filter((r) => r.last_login && Date.now() - new Date(r.last_login).getTime() < 7 * 86400000).length}
            </p>
          </div>
          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground uppercase font-nunito">New (last 7d)</p>
            <p className="font-fredoka text-3xl font-bold mt-1">
              {rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 7 * 86400000).length}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-fredoka text-lg font-bold">Users ({rows.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3 font-nunito">Name</th>
                    <th className="p-3 font-nunito">Email</th>
                    <th className="p-3 font-nunito hidden md:table-cell">Signed up</th>
                    <th className="p-3 font-nunito hidden md:table-cell">Last login</th>
                    <th className="p-3 font-nunito">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="p-3 font-semibold font-nunito">{r.name || "—"}</td>
                      <td className="p-3 text-muted-foreground">{r.email}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{fmt(r.created_at)}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{fmt(r.last_login)}</td>
                      <td className="p-3">
                        <select
                          value={roleMap[r.id]?.[0] ?? "user"}
                          onChange={(e) => setRole(r.id, e.target.value as AppRole)}
                          className="bg-background border rounded-md px-2 py-1 text-sm"
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
