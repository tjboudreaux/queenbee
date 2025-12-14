/**
 * Build a canonical issue hash that retains the view.
 *
 * @param {'issues'|'epics'|'board'|'messages'|'assignments'|'reservations'|'droids'} view
 * @param {string} id
 */
export function issueHashFor(view, id) {
  // For Queen views, fall back to issues since they don't have issue details
  const v = view === 'epics' || view === 'board' ? view : 'issues';
  return `#/${v}?issue=${encodeURIComponent(id)}`;
}
