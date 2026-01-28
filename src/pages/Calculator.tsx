import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Lock, Calendar, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  trackCalculatorStarted,
  trackCalculatorSubmitted,
  trackMonthlyResultShown,
  trackAuditOptinSubmitted,
  trackCalendarClicked,
} from "@/lib/tracking";

const Calculator = () => {
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

  // Opt-in state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calendar embed ref
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Load GHL calendar script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://links.clickthrive.io/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Track calculator started
  useEffect(() => {
    if (!hasStartedCalculator && (avgCustomerValue || missedCallsPerWeek)) {
      setHasStartedCalculator(true);
      trackCalculatorStarted();
    }
  }, [avgCustomerValue, missedCallsPerWeek, hasStartedCalculator]);

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

  const handleOptinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("webhook-handler", {
        body: {
          action: "optin",
          data: {
            firstName,
            email,
            phone: phone || null,
            smsConsent: phone ? smsConsent : false,
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

      trackAuditOptinSubmitted({ email, hasPhone: !!phone });
      setIsUnlocked(true);
      toast.success("Your full audit has been sent to your email!");
    } catch (error) {
      console.error("Opt-in error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSmsRequest = async () => {
    if (!phone) {
      toast.error("Please add your mobile number above to receive the quick fix plan by text.");
      return;
    }

    try {
      await supabase.functions.invoke("webhook-handler", {
        body: {
          action: "sms",
          data: {
            phone,
            firstName,
            monthlyRevenueLeak,
          },
        },
      });

      toast.success("Quick fix plan sent to your phone!");
    } catch (error) {
      console.error("SMS error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const scrollToCalendar = () => {
    trackCalendarClicked();
    document.getElementById("calculator-calendar")?.scrollIntoView({ behavior: "smooth" });
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
      {/* Hero Section */}
      <section className="px-4 pt-8 pb-6 sm:pt-12 sm:pb-8 md:pt-16">
        <div className="container max-w-2xl mx-auto text-center px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3 sm:mb-4 text-balance">
            How much revenue are missed calls costing you every month
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-2">
            Enter 3 quick numbers. Get your estimated monthly loss instantly. Unlock the full 12 month breakdown after.
          </p>
          <p className="text-sm text-muted-foreground">
            No login. No fluff. Just math.
          </p>
        </div>
      </section>

      {/* Calculator Card */}
      <section className="px-3 sm:px-4 pb-6 sm:pb-8">
        <div className="container max-w-lg mx-auto">
          <Card className="shadow-lg border-2">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl">Revenue Leak Calculator</CardTitle>
              <CardDescription className="text-sm">Fill in your numbers below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
              {/* Average Customer Value */}
              <div className="space-y-2">
                <Label htmlFor="avgValue" className="text-sm sm:text-base font-medium">
                  Average value of a new customer
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
                  Number of calls your office misses per week
                </Label>
                <Input
                  id="missedCalls"
                  type="number"
                  placeholder="5"
                  inputMode="numeric"
                  className="h-11 sm:h-12 text-base sm:text-lg"
                  value={missedCallsPerWeek}
                  onChange={(e) => setMissedCallsPerWeek(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  If you are unsure, start conservative.
                </p>
              </div>

              {/* Closing Rate Slider */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Label className="text-sm sm:text-base font-medium">
                    Your closing rate on answered calls percent
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
        <section className="px-3 sm:px-4 pb-6 sm:pb-8 animate-fade-in">
          <div className="container max-w-lg mx-auto">
            {/* Warning Card */}
            <Card className="bg-destructive text-destructive-foreground shadow-xl mb-4 sm:mb-6">
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1 opacity-80">Warning</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
                      You are losing approximately {formatCurrency(monthlyRevenueLeak)} every single month.
                    </p>
                    <p className="text-xs sm:text-sm opacity-90 mb-2">
                      This estimate is based only on missed calls. It does not include after hours calls, web leads, or slow follow up.
                    </p>
                    <p className="text-xs opacity-70">
                      Estimates assume a 7 day week and 4.3 weeks per month. Actual results vary.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gated Content Preview */}
            {!isUnlocked && (
              <Card className="mb-4 sm:mb-6 overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 backdrop-blur-md bg-background/80 z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground mb-2 sm:mb-3" />
                    <p className="font-semibold text-foreground text-sm sm:text-base">Complete the form below to unlock your full audit</p>
                  </div>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 select-none">
                    <p className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">What you will unlock:</p>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex gap-2"><span className="text-primary">1.</span> Your estimated annual revenue leak</li>
                      <li className="flex gap-2"><span className="text-primary">2.</span> Missed calls per month and lost jobs estimate</li>
                      <li className="flex gap-2"><span className="text-primary">3.</span> The 3 fastest fixes to recover revenue this week</li>
                    </ul>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Opt-in Form */}
            {!isUnlocked && (
              <Card className="shadow-lg">
                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                  <CardTitle className="text-lg sm:text-xl">Get your full 12 month revenue recovery audit</CardTitle>
                  <CardDescription className="text-sm">
                    I will email your full breakdown plus the 3 step Phone to Profit protocol.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleOptinSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm">First name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-11 sm:h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Business email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 sm:h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Mobile number (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 sm:h-12"
                      />
                    </div>

                    {phone && (
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted rounded-lg animate-fade-in">
                        <Checkbox
                          id="smsConsent"
                          checked={smsConsent}
                          onCheckedChange={(checked) => setSmsConsent(checked === true)}
                          className="mt-0.5"
                        />
                        <label htmlFor="smsConsent" className="text-xs sm:text-sm text-muted-foreground leading-tight cursor-pointer">
                          I agree to receive SMS and email about my audit and related offers. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.
                        </label>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send My Full Audit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Unlocked Results */}
            {isUnlocked && (
              <div className="animate-fade-in space-y-4 sm:space-y-6">
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
                        <span className="text-muted-foreground text-sm sm:text-base">Estimated won jobs lost per month</span>
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

                <div className="flex flex-col gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold shadow-lg"
                    onClick={scrollToCalendar}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule My Revenue Leak Review
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rounded-full font-semibold"
                    onClick={handleSmsRequest}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Text Me The Quick Fix Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Calendar Section */}
      <section id="calculator-calendar" className="px-3 sm:px-4 py-12 sm:py-16 bg-muted/50">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Schedule your Revenue Leak Review
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            In 10 minutes I will show you where the leak is happening and what to fix first.
          </p>

          <div ref={calendarRef} className="bg-card border rounded-xl p-2 sm:p-4 shadow-sm overflow-hidden">
            <iframe 
              src="https://links.clickthrive.io/widget/booking/cgqCCep465fAjrZPMZdz" 
              style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "600px" }}
              scrolling="no" 
              id="cgqCCep465fAjrZPMZdz_1769571094041"
              title="Book a Revenue Leak Review"
            />
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

export default Calculator;
