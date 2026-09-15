/**
 * Pure mapping from a trackable thing to a PostHog event payload.
 *
 * Kept free of any PostHog import so it can be unit-tested without a browser
 * or a network. The actual `posthog.capture()` call lives in
 * components/Analytics.astro, which reads the data-* attributes these
 * helpers produce.
 */

export type TrackableKind = 'hub' | 'project' | 'social' | 'resume';

export type TrackedLink = {
  /** Stable identifier — becomes the event label. Renaming splits history. */
  id: string;
  label: string;
  url: string;
  kind: TrackableKind;
  /** Where the link was clicked from, e.g. "/resume". */
  surface: string;
};

export type LinkEvent = {
  event: string;
  label: string;
  destination: string;
  kind: TrackableKind;
  surface: string;
  outbound: boolean;
};

/** Event name used for every outbound or internal link click. */
export const LINK_CLICK_EVENT = 'link_click';

/** Event name fired when the resume PDF is downloaded. */
export const RESUME_DOWNLOAD_EVENT = 'resume_download';

/** Event name fired when someone taps "Save contact". */
export const CONTACT_SAVE_EVENT = 'contact_save';

/** Matches the private NFC card path segment: /c/<key> */
const CARD_PATH = /\/c\/[A-Za-z0-9_-]+/g;

/**
 * Replace the private card key in every string property before an event
 * leaves the browser, so the key is never stored in PostHog.
 *
 * Scrubs all string values rather than a list of known keys: PostHog records
 * the URL in several properties ($current_url, $pathname, ...), and missing
 * one would leak the key.
 */
export function scrubCardPaths<T extends Record<string, unknown>>(properties: T): T {
  const out: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(properties)) {
    out[name] = typeof value === 'string' ? value.replace(CARD_PATH, '/c/card') : value;
  }
  return out as T;
}

/**
 * True when the href leaves this site. Protocol-relative and absolute URLs
 * count as outbound; root-relative paths and fragments do not.
 */
export function isOutbound(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || /^mailto:/i.test(url);
}

/**
 * Build the payload captured for a link click.
 *
 * Note: `destination` is the raw href rather than a parsed hostname, because
 * two links to the same host (a repo and its releases page) are different
 * things and should not collapse into one series.
 */
export function toLinkEvent(link: TrackedLink): LinkEvent {
  return {
    event: LINK_CLICK_EVENT,
    label: link.id,
    destination: link.url,
    kind: link.kind,
    surface: link.surface,
    outbound: isOutbound(link.url),
  };
}

/**
 * The data-* attributes a trackable element carries. A single delegated
 * listener reads these, so adding links never adds JavaScript.
 */
export function toDataAttrs(link: TrackedLink): Record<string, string> {
  const e = toLinkEvent(link);
  return {
    'data-ph-event': e.event,
    'data-ph-label': e.label,
    'data-ph-dest': e.destination,
    'data-ph-kind': e.kind,
    'data-ph-surface': e.surface,
  };
}
