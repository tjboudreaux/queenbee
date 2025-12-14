import { html, render } from 'lit-html';
import { debug } from '../utils/logging.js';

/**
 * @typedef {Object} Assignment
 * @property {string} id
 * @property {string} issue_id
 * @property {string} droid
 * @property {string} status
 * @property {string} assigned_at
 * @property {string} [completed_at]
 * @property {string} [worktree]
 * @property {string} [reason]
 */

/**
 * Create the assignments view for Queen agent coordination.
 *
 * @param {HTMLElement} mount_element
 * @param {{ getState: () => any, subscribe: (fn: (s: any) => void) => () => void }} store
 * @param {{ onRefresh?: () => void }} [callbacks]
 */
export function createAssignmentsView(mount_element, store, callbacks = {}) {
  const log = debug('views:assignments');
  /** @type {(() => void) | null} */
  let unsubscribe = null;
  /** @type {string | null} */
  let filter_status = null;
  /** @type {string | null} */
  let filter_droid = null;

  /**
   * Format a timestamp for display.
   *
   * @param {string} timestamp
   * @returns {string}
   */
  function formatTime(timestamp) {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  }

  /**
   * Get status badge class.
   *
   * @param {string} status
   * @returns {string}
   */
  function statusClass(status) {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'blocked':
        return 'status-blocked';
      case 'released':
        return 'status-released';
      default:
        return '';
    }
  }

  /**
   * @param {Assignment} assignment
   * @returns {import('lit-html').TemplateResult}
   */
  function assignmentRow(assignment) {
    return html`
      <tr class="assignment-row">
        <td class="col-issue">
          <a href="#/issues?issue=${encodeURIComponent(assignment.issue_id)}" class="issue-link">
            ${assignment.issue_id}
          </a>
        </td>
        <td class="col-droid">
          <span class="droid-badge">${assignment.droid}</span>
        </td>
        <td class="col-status">
          <span class="status-badge ${statusClass(assignment.status)}">
            ${assignment.status}
          </span>
        </td>
        <td class="col-worktree">${assignment.worktree || '-'}</td>
        <td class="col-assigned">${formatTime(assignment.assigned_at)}</td>
        <td class="col-actions">
          ${assignment.status === 'active'
            ? html`<button class="btn btn-sm btn-release" @click=${() => onRelease(assignment)}>
                Release
              </button>`
            : ''}
        </td>
      </tr>
    `;
  }

  /**
   * @param {Assignment} assignment
   */
  function onRelease(assignment) {
    log('release assignment: %s', assignment.id);
    // TODO: Implement release via queen CLI
  }

  /**
   * @param {string | null} status
   */
  function onFilterStatus(status) {
    filter_status = filter_status === status ? null : status;
    doRender();
  }

  /**
   * @param {string | null} droid
   */
  function onFilterDroid(droid) {
    filter_droid = filter_droid === droid ? null : droid;
    doRender();
  }

  function template() {
    const state = store.getState();
    const assignments = state.queen_assignments || [];
    const droids = state.queen_droids || [];

    // Get unique statuses
    const statuses = [...new Set(assignments.map((/** @type {Assignment} */ a) => a.status))];

    // Apply filters
    let filtered = assignments;
    if (filter_status) {
      filtered = filtered.filter((/** @type {Assignment} */ a) => a.status === filter_status);
    }
    if (filter_droid) {
      filtered = filtered.filter((/** @type {Assignment} */ a) => a.droid === filter_droid);
    }

    // Sort by assigned_at descending (most recent first)
    filtered = filtered.sort(
      (/** @type {Assignment} */ a, /** @type {Assignment} */ b) =>
        new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime()
    );

    // Compute stats
    const active_count = assignments.filter(
      (/** @type {Assignment} */ a) => a.status === 'active'
    ).length;
    const by_droid = assignments
      .filter((/** @type {Assignment} */ a) => a.status === 'active')
      .reduce((/** @type {Map<string, number>} */ acc, /** @type {Assignment} */ a) => {
        acc.set(a.droid, (acc.get(a.droid) || 0) + 1);
        return acc;
      }, new Map());

    return html`
      <div class="queen-assignments">
        <div class="assignments-header">
          <h2>Assignments</h2>
          <div class="assignments-toolbar">
            <button
              class="btn btn-refresh"
              @click=${() => callbacks.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        <div class="assignments-stats">
          <div class="stat">
            <span class="stat-value">${active_count}</span>
            <span class="stat-label">Active</span>
          </div>
          ${Array.from(by_droid.entries()).map(
            ([droid, count]) => html`
              <div
                class="stat droid-stat ${filter_droid === droid ? 'active' : ''}"
                @click=${() => onFilterDroid(droid)}
              >
                <span class="stat-value">${count}</span>
                <span class="stat-label">${droid}</span>
              </div>
            `
          )}
        </div>
        <div class="assignments-filters">
          ${statuses.map(
            (status) => html`
              <button
                class="filter-btn ${filter_status === status ? 'active' : ''}"
                @click=${() => onFilterStatus(status)}
              >
                ${status}
              </button>
            `
          )}
        </div>
        <div class="assignments-table-container">
          ${filtered.length === 0
            ? html`<div class="empty-state">No assignments</div>`
            : html`
                <table class="assignments-table">
                  <thead>
                    <tr>
                      <th>Issue</th>
                      <th>Droid</th>
                      <th>Status</th>
                      <th>Worktree</th>
                      <th>Assigned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filtered.map((/** @type {Assignment} */ a) => assignmentRow(a))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `;
  }

  function doRender() {
    render(template(), mount_element);
  }

  return {
    load() {
      log('load assignments view');
      doRender();
      unsubscribe = store.subscribe(() => doRender());
    },
    unload() {
      log('unload assignments view');
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
    destroy() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      render(html``, mount_element);
    }
  };
}
