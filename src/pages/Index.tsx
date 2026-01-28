import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Download, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  trackCalculatorStarted,
  trackCalculatorSubmitted,
  trackMonthlyResultShown,
  trackAuditOptinSubmitted,
  trackCalendarClicked,
} from "@/lib/tracking";

const Index = () => {
  // Calculator state
  const [avgCustomerValue, setAvgCustomerValue] = useState<string>("");
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState<string>("");
  const [closingRate, setClosingRate] = useState<number[]>([35]);
  const [hasStartedCalculator, setHasStartedCalculator] = useState(false);

  // Results state
  const [showResults, setShowResults] = useState(false);
  const [monthlyRevenueLeak, setMonthlyRevenueLeak] = useState(0);
  const [monthlyMissedCalls, setMonthlyMissedCalls] = useState(0);
  const [expectedWonJobs, setExpectedWonJobs] = useState(0);

  // Lead capture state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);

  // Refs
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Load GHL calendar script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://links.clickthrive.io/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Track calculator started
  useEffect(() => {
    if (!hasStartedCalculator && (avgCustomerValue || missedCallsPerWeek)) {
      setHasStartedCalculator(true);
      trackCalculatorStarted();
    }
  }, [avgCustomerValue, missedCallsPerWeek, hasStartedCalculator]);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCalendar = () => {
    trackCalendarClicked();
    calendarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculateMonthlyLoss = () => {
    const avgValue = parseFloat(avgCustomerValue) || 0;
    const missedCalls = parseFloat(missedCallsPerWeek) || 0;
    const closeRate = closingRate[0] / 100;

    const weeksPerMonth = 4.3;
    const monthly = missedCalls * weeksPerMonth;
    const wonJobs = monthly * closeRate;
    const leak = Math.round(wonJobs * avgValue);

    setMonthlyMissedCalls(Math.round(monthly));
    setExpectedWonJobs(Math.round(wonJobs * 10) / 10);
    setMonthlyRevenueLeak(leak);
    setShowResults(true);

    trackCalculatorSubmitted({ monthlyLoss: leak });
    trackMonthlyResultShown({ monthlyLoss: leak });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("webhook-handler", {
        body: {
          action: "optin",
          data: {
            firstName: firstName || null,
            email,
            monthlyRevenueLeak,
            annualRevenueLeak: monthlyRevenueLeak * 12,
            monthlyMissedCalls,
            expectedWonJobs,
            avgCustomerValue: parseFloat(avgCustomerValue),
            missedCallsPerWeek: parseFloat(missedCallsPerWeek),
            closingRate: closingRate[0],
          },
        },
      });

      if (error) throw error;

      trackAuditOptinSubmitted({ email, hasPhone: false });
      setHasSubmittedEmail(true);
      toast.success("Your full breakdown has been sent to your email!");
    } catch (error) {
      console.error("Opt-in error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Section 1: Hero */}
      <section className="px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 md:pt-20 md:pb-16">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4 sm:mb-6 text-balance">
            How much money did you lose this week because calls went unanswered
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Run the 60 second Revenue Leakage Diagnostic to see the monthly dollar leak hiding in your missed calls.
          </p>

          <p className="text-sm text-muted-foreground mb-8 max-w-xl mx-auto">
            Most owners underestimate missed call losses by 3 to 10 times. This shows the real number.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <div className="flex flex-col items-center">
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={scrollToCalculator}
              >
                Run the Revenue Leakage Diagnostic
              </Button>
              <p className="text-xs text-muted-foreground mt-2">See your number instantly</p>
            </div>
            <div className="flex flex-col items-center">
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-semibold"
                onClick={scrollToCalendar}
              >
                Book My Revenue Leak Review
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Get a 10 minute plan</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            No login. No pressure. Just the math.
          </p>
        </div>
      </section>

      {/* Calculator Section (directly below hero) */}
      <section ref={calculatorRef} className="px-4 pb-12 sm:pb-16">
        <div className="container max-w-lg mx-auto">
          <Card className="shadow-lg border-2">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Revenue Leakage Diagnostic</CardTitle>
              <CardDescription className="text-sm">Enter your 3 numbers below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
              {/* Average Customer Value */}
              <div className="space-y-2">
                <Label htmlFor="avgValue" className="text-sm sm:text-base font-medium">
                  Average customer value
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="avgValue"
                    type="number"
                    placeholder="1500"
                    inputMode="decimal"
                    className="pl-8 h-12 text-lg"
                    value={avgCustomerValue}
                    onChange={(e) => setAvgCustomerValue(e.target.value)}
                  />
                </div>
              </div>

              {/* Missed Calls Per Week */}
              <div className="space-y-2">
                <Label htmlFor="missedCalls" className="text-sm sm:text-base font-medium">
                  Missed calls per week
                </Label>
                <Input
                  id="missedCalls"
                  type="number"
                  placeholder="5"
                  inputMode="numeric"
                  className="h-12 text-lg"
                  value={missedCallsPerWeek}
                  onChange={(e) => setMissedCallsPerWeek(e.target.value)}
                />
              </div>

              {/* Closing Rate Slider */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Label className="text-sm sm:text-base font-medium">
                    Closing rate
                  </Label>
                  <span className="text-base sm:text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg w-fit">
                    {closingRate[0]}%
                  </span>
                </div>
                <Slider
                  value={closingRate}
                  onValueChange={setClosingRate}
                  max={100}
                  min={0}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold shadow-lg"
                onClick={calculateMonthlyLoss}
                disabled={!avgCustomerValue || !missedCallsPerWeek}
              >
                Show My Monthly Loss
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="px-4 pb-12 sm:pb-16 animate-fade-in">
          <div className="container max-w-lg mx-auto space-y-4 sm:space-y-6">
            {/* Teaser Result Warning Card */}
            <Card className="bg-destructive text-destructive-foreground shadow-xl">
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1 opacity-80">
                      Estimated Monthly Revenue Leak
                    </p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                      {formatCurrency(monthlyRevenueLeak)}
                    </p>
                    <p className="text-xs sm:text-sm opacity-90">
                      This is an estimate. Your exact breakdown is available.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gated Lead Capture or Recovery Pack */}
            {!hasSubmittedEmail ? (
              <Card className="shadow-lg">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                  <CardTitle className="text-lg sm:text-xl">Email me the full breakdown</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm">First name (optional)</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Email Me My Results"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      I will send your breakdown and the 3 fastest fixes. No spam.
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="animate-fade-in space-y-4 sm:space-y-6">
                {/* Full Breakdown */}
                <Card className="shadow-lg border-primary/20">
                  <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      Your Full Revenue Leak Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="grid gap-3 sm:gap-4">
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground text-sm sm:text-base">Monthly missed calls</span>
                        <span className="text-lg sm:text-xl font-bold">{monthlyMissedCalls}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground text-sm sm:text-base">Jobs lost per month</span>
                        <span className="text-lg sm:text-xl font-bold">{expectedWonJobs.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-muted rounded-lg">
                        <span className="text-muted-foreground text-sm sm:text-base">Monthly revenue leak</span>
                        <span className="text-lg sm:text-xl font-bold text-destructive">{formatCurrency(monthlyRevenueLeak)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <span className="text-foreground font-medium text-sm sm:text-base">Annual revenue leak</span>
                        <span className="text-xl sm:text-2xl font-bold text-destructive">{formatCurrency(monthlyRevenueLeak * 12)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recovery Pack */}
                <Card className="shadow-lg">
                  <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                    <CardTitle className="text-lg sm:text-xl">Your Recovery Pack</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 space-y-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold"
                      asChild
                    >
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Download className="w-5 h-5 mr-2" />
                        Download the Missed Call Survival Guide
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold shadow-lg"
                      onClick={scrollToCalendar}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule My Revenue Leak Review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 2: Response Problem */}
      <section className="px-4 py-12 sm:py-16 bg-muted/50">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-10">
            You do not have a lead problem. You have a response problem.
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {[
              "Missed calls do not wait around. They call the next company.",
              "Speed to lead beats ad spend every time.",
              "Fixing missed calls is the fastest way to increase booked jobs without increasing your budget.",
              "If you are not calling back in minutes, you are donating revenue to competitors."
            ].map((bullet, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-base sm:text-lg text-foreground">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: What Happens Next */}
      <section className="px-4 py-12 sm:py-16 md:py-20">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10 sm:mb-14">
            What happens next
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: "1", title: "Enter 3 numbers", description: "Takes about 60 seconds." },
              { step: "2", title: "See your monthly revenue leak", description: "Instant estimate based on a 7 day week." },
              { step: "3", title: "Get your 12 month recovery plan", description: "I will email the breakdown and the fastest fixes." }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Calendar Booking */}
      <section ref={calendarRef} className="px-4 py-12 sm:py-16 bg-muted/50">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Schedule your Revenue Leak Review
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
            In 10 minutes I will show you where the leak is happening and what to fix first so you stop losing money this week.
          </p>

          {/* 3 bullets above calendar */}
          <div className="text-left max-w-md mx-auto mb-6 sm:mb-8 space-y-3">
            {[
              "Where missed calls are coming from",
              "The fastest fix you can implement first",
              "How to recover the lost revenue over the next 30 days"
            ].map((bullet, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-foreground">{bullet}</p>
              </div>
            ))}
          </div>

          {/* GHL Calendar Embed */}
          <div className="bg-card border rounded-xl p-2 sm:p-4 shadow-sm overflow-hidden mb-4">
            <iframe
              src="https://links.clickthrive.io/widget/booking/cgqCCep465fAjrZPMZdz"
              style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "600px" }}
              scrolling="no"
              id="cgqCCep465fAjrZPMZdz_landing"
              title="Book a Revenue Leak Review"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Best for service businesses that rely on inbound calls to book jobs.
          </p>
        </div>
      </section>

      {/* Section 5: Footer */}
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
