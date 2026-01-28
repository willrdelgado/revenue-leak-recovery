// Tracking events for the funnel
export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  // Dispatch custom event for analytics
  const event = new CustomEvent(eventName, { detail: data });
  window.dispatchEvent(event);
  
  // Log for debugging
  console.log(`[Tracking] ${eventName}`, data || '');
};

// Specific tracking functions
export const trackCalculatorStarted = () => trackEvent('calculator_started');
export const trackCalculatorSubmitted = (data: { monthlyLoss: number }) => trackEvent('calculator_submitted', data);
export const trackMonthlyResultShown = (data: { monthlyLoss: number }) => trackEvent('monthly_result_shown', data);
export const trackAuditOptinSubmitted = (data: { email: string; hasPhone: boolean }) => trackEvent('audit_optin_submitted', data);
export const trackCalendarClicked = () => trackEvent('calendar_clicked');
