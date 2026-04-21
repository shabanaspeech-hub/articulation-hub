import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary font-nunito text-sm mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <h1 className="font-fredoka text-3xl md:text-4xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>

        <div className="space-y-4 font-nunito text-foreground/90 leading-relaxed">
          <p>
            This app does not collect, store, or share personal user data. All
            activity remains on the user&apos;s device.
          </p>
          <p>
            Voice recordings made through the practice screens are processed
            locally in your browser and are never uploaded to any server.
          </p>
          <p>
            We do not use analytics, tracking cookies, or third-party
            advertising. The app is delivered over HTTPS and works fully
            offline once installed.
          </p>
          <p className="text-sm text-muted-foreground pt-4 border-t border-border">
            Made by Speech Language Therapist Shabana Tariq.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
