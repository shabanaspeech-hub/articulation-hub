import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const from = (location.state as any)?.from?.pathname || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) {
          toast.error("Please enter your name");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { name: name.trim(), full_name: name.trim() },
          },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Account created! You're signed in.");
        navigate(from, { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Welcome back!");
        navigate(from, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-6 sm:p-8 border"
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Articulation Hub" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 object-contain" />
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 font-nunito">
            <Sparkles className="w-3 h-3" />
            Premium Access
          </div>
          <h1 className="font-fredoka text-2xl sm:text-3xl font-bold text-foreground">
            Articulation <span className="text-primary">Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-nunito mt-1">
            By Speech Language Therapist Shabana Tariq
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="si-email" className="font-nunito">Email</Label>
                <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="si-pw" className="font-nunito">Password</Label>
                <Input id="si-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 font-fredoka">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="su-name" className="font-nunito">Name</Label>
                <Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="su-email" className="font-nunito">Email</Label>
                <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="su-pw" className="font-nunito">Password</Label>
                <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 font-fredoka">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button type="button" variant="outline" onClick={handleGoogle} disabled={loading} className="w-full h-11 font-nunito">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>
      </motion.div>
    </div>
  );
};

export default Auth;
