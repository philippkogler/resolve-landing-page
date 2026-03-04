/**
 * ReSolve Analytics — lightweight tracker for impressions, actions, and form submissions.
 *
 * Reads `utm_medium` and `utm_campaign` from the URL query string and sends them with every event.
 * All calls are fire-and-forget (no await, no error surfaced to the user).
 */

function getUtmParams(): { utm_medium: string; utm_campaign: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
  };
}

function getApiBase(): string {
  // Injected by Astro's astro:env at build time via the inline script in Layout
  return (window as any).__API_BASE_URL__ ?? '';
}

function post(endpoint: string, data: Record<string, string>): void {
  const base = getApiBase();
  if (!base) return;

  const body = new URLSearchParams(data);

  fetch(`${base}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  }).catch(() => {
    // silently ignore – analytics should never break the page
  });
}

/** Track a page impression (called once on landing page load). */
export function trackImpression(): void {
  post('impression.php', getUtmParams());
}

/** Track a named action (button click, link click, etc.). */
export function trackAction(actionName: string): void {
  post('action.php', {
    ...getUtmParams(),
    action_name: actionName,
  });
}

/** Submit the contact / access-request form. Returns the fetch Response. */
export async function submitForm(data: {
  email: string;
  company: string;
  role: string;
  usecase: string;
}): Promise<Response> {
  const base = getApiBase();
  const body = new URLSearchParams({
    ...getUtmParams(),
    email: data.email,
    company: data.company,
    role: data.role,
    usecase: data.usecase,
  });

  return fetch(`${base}/submit.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
}
