import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Calculator, FileText, CheckCircle } from "lucide-react";
import { trackCalendarClicked } from "@/lib/tracking";

const Index = () => {
  const navigate = useNavigate();

  const scrollToCalendar = () => {
    trackCalendarClicked();
    document.getElementById("calendar-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 text-balance">
            Every missed call costs you money
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Run a 60 second diagnostic to see how much revenue slips away each month when your phone is ringing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/calculator")}
            >
              Run the Revenue Leakage Diagnostic
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 rounded-full font-semibold"
              onClick={scrollToCalendar}
            >
              Book My Revenue Leak Review
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            No login. No fluff. Just your numbers.
          </p>
        </div>
      </section>

      {/* Proof and Belief Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Most businesses do not have a lead problem. They have a response problem.
          </h2>
          
          <div className="space-y-6">
            {[
              "Missed calls do not wait around. They call the next company.",
              "Speed to lead beats marketing spend.",
              "Fixing missed calls is the fastest way to increase booked jobs."
            ].map((bullet, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-lg text-foreground">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-14">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Calculator, step: "1", title: "Run the diagnostic", description: "Enter 3 quick numbers about your business" },
              { icon: Phone, step: "2", title: "See your monthly revenue leak", description: "Get your estimated loss instantly" },
              { icon: FileText, step: "3", title: "Get the full 12 month recovery audit and quick fix plan", description: "Unlock your complete breakdown" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">Step {item.step}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar-section" className="px-4 py-20 bg-muted/50">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Schedule your Revenue Leak Review
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            In 10 minutes I will show you where the leak is happening and what to fix first.
          </p>
          
          {/* Calendar Embed Placeholder */}
          <div className="bg-card border rounded-xl p-8 md:p-12 shadow-sm">
            <div className="text-muted-foreground text-center py-12">
              <p className="text-lg font-medium mb-2">[CALENDAR EMBED GOES HERE]</p>
              <p className="text-sm">Replace this with your GHL calendar embed code</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t">
        <div className="container max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            No spam. No pressure. Just a clear plan.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
