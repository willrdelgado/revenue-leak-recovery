import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    console.log(`[webhook-handler] Processing action: ${action}`);
    console.log(`[webhook-handler] Data:`, JSON.stringify(data, null, 2));

    if (action === "optin") {
      // Send to CRM webhook
      const crmWebhookUrl = Deno.env.get("CRM_WEBHOOK_URL");
      
      if (!crmWebhookUrl) {
        console.error("[webhook-handler] CRM_WEBHOOK_URL not configured");
        throw new Error("CRM webhook not configured");
      }

      console.log(`[webhook-handler] Sending to CRM webhook`);

      const crmResponse = await fetch(crmWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.firstName,
          email: data.email,
          phone: data.phone,
          sms_consent: data.smsConsent,
          monthly_revenue_leak: data.monthlyRevenueLeak,
          annual_revenue_leak: data.annualRevenueLeak,
          monthly_missed_calls: data.monthlyMissedCalls,
          expected_won_jobs: data.expectedWonJobs,
          avg_customer_value: data.avgCustomerValue,
          missed_calls_per_week: data.missedCallsPerWeek,
          closing_rate: data.closingRate,
          source: "missed-call-calculator",
          timestamp: new Date().toISOString(),
        }),
      });

      console.log(`[webhook-handler] CRM response status: ${crmResponse.status}`);

      if (!crmResponse.ok) {
        const errorText = await crmResponse.text();
        console.error(`[webhook-handler] CRM error: ${errorText}`);
        throw new Error(`CRM webhook failed: ${crmResponse.status}`);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Opt-in processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sms") {
      // Send to SMS webhook
      const smsWebhookUrl = Deno.env.get("SMS_WEBHOOK_URL");

      if (!smsWebhookUrl) {
        console.error("[webhook-handler] SMS_WEBHOOK_URL not configured");
        throw new Error("SMS webhook not configured");
      }

      console.log(`[webhook-handler] Sending to SMS webhook`);

      const smsResponse = await fetch(smsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          first_name: data.firstName,
          monthly_revenue_leak: data.monthlyRevenueLeak,
          action: "quick_fix_plan",
          source: "missed-call-calculator",
          timestamp: new Date().toISOString(),
        }),
      });

      console.log(`[webhook-handler] SMS response status: ${smsResponse.status}`);

      if (!smsResponse.ok) {
        const errorText = await smsResponse.text();
        console.error(`[webhook-handler] SMS error: ${errorText}`);
        throw new Error(`SMS webhook failed: ${smsResponse.status}`);
      }

      return new Response(
        JSON.stringify({ success: true, message: "SMS triggered" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[webhook-handler] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
