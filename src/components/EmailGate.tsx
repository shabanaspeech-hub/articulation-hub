import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Mail, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const EmailGate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name: name.trim() },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Magic link sent! Check your inbox.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 border"
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Articulation Hub" className="w-20 h-20 mx-auto mb-3 object-contain" />
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3 font-nunito">
            <Sparkles className="w-3 h-3" />
            Premium Access
          </div>
          <h1 className="font-fredoka text-3xl font-bold text-foreground">
            Articulation <span className="text-primary">Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground font-nunito mt-1">
            By Speech Language Therapist Shabana Tariq
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-fredoka text-xl font-bold mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground font-nunito">
              We sent a magic link to <strong>{email}</strong>. Tap it to unlock the app.
            </p>
            <Button variant="ghost" className="mt-4 text-sm" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-nunito">Your name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Parent / Therapist name"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-nunito">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 font-fredoka text-base">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <>Unlock with magic link <Sparkles className="w-4 h-4" /></>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground font-nunito">
              No password needed. We'll email you a secure link.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default EmailGate;
