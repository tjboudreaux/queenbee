import { html, render } from 'lit-html';
import { debug } from '../utils/logging.js';

/**
 * @typedef {Object} Droid
 * @property {string} name
 * @property {string} path
 * @property {string} [description]
 * @property {string} [model]
 * @property {string} [location]
 * @property {string} status
 * @property {string} [current_assignment]
 * @property {number} [message_count]
 * @property {number} [unread_count]
 * @property {string} [last_active]
 */

/**
 * Create the droids status view for Queen agent monitoring.
 *
 * @param {HTMLElement} mount_element
 * @param {{ getState: () => any, subscribe: (fn: (s: any) => void) => () => void }} store
 * @param {{ onRefresh?: () => void }} [callbacks]
 */
export function createDroidsView(mount_element, store, callbacks = {}) {
  const log = debug('views:droids');
  /** @type {(() => void) | null} */
  let unsubscribe = null;
  /** @type {string | null} */
  let filter_status = null;
  /** @type {string | null} */
  let filter_location = null;

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
      return timestamp || 'never';
    }
  }

  /**
   * Get status icon and class.
   *
   * @param {string} status
   * @returns {{ icon: string, class: string }}
   */
  function statusInfo(status) {
    switch (status) {
      case 'active':
        return { icon: '🟢', class: 'status-active' };
      case 'idle':
        return { icon: '🟡', class: 'status-idle' };
      case 'busy':
        return { icon: '🔵', class: 'status-busy' };
      case 'offline':
        return { icon: '⚫', class: 'status-offline' };
      default:
        return { icon: '⚪', class: 'status-unknown' };
    }
  }

  /**
   * @param {Droid} droid
   * @returns {import('lit-html').TemplateResult}
   */
  function droidCard(droid) {
    const info = statusInfo(droid.status);
    const has_assignment = droid.current_assignment && droid.current_assignment.length > 0;
    const has_unread = (droid.unread_count || 0) > 0;

    return html`
      <div class="droid-card ${info.class}">
        <div class="droid-header">
          <div class="droid-status">
            <span class="status-icon">${info.icon}</span>
            <span class="droid-name">${droid.name}</span>
          </div>
          ${droid.location
            ? html`<span class="droid-location">${droid.location}</span>`
            : ''}
        </div>
        ${droid.description
          ? html`<div class="droid-description">${droid.description}</div>`
          : ''}
        <div class="droid-meta">
          ${droid.model
            ? html`<span class="droid-model" title="Model">${droid.model}</span>`
            : ''}
          <span class="droid-path" title="Path">${droid.path}</span>
        </div>
        <div class="droid-activity">
          ${has_assignment
            ? html`
                <div class="droid-assignment">
                  <span class="label">Working on:</span>
                  <a href="#/issues?issue=${encodeURIComponent(droid.current_assignment || '')}" class="issue-link">
                    ${droid.current_assignment}
                  </a>
                </div>
              `
            : html`<div class="droid-assignment idle">No active assignment</div>`}
          <div class="droid-stats">
            <span class="stat-item ${has_unread ? 'has-unread' : ''}">
              ${has_unread ? `${droid.unread_count} unread` : `${droid.message_count || 0} messages`}
            </span>
            <span class="stat-item">
              Active: ${formatTime(droid.last_active || '')}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @param {string | null} status
   */
  function onFilterStatus(status) {
    filter_status = filter_status === status ? null : status;
    doRender();
  }

  /**
   * @param {string | null} location
   */
  function onFilterLocation(location) {
    filter_location = filter_location === location ? null : location;
    doRender();
  }

  function template() {
    const state = store.getState();
    const droids = state.queen_droids || [];

    // Get unique statuses and locations
    const _statuses = [...new Set(droids.map((/** @type {Droid} */ d) => d.status))]; // eslint-disable-line no-unused-vars
    const locations = [...new Set(droids.map((/** @type {Droid} */ d) => d.location).filter(Boolean))];

    // Apply filters
    let filtered = droids;
    if (filter_status) {
      filtered = filtered.filter((/** @type {Droid} */ d) => d.status === filter_status);
    }
    if (filter_location) {
      filtered = filtered.filter((/** @type {Droid} */ d) => d.location === filter_location);
    }

    // Sort by status (active first) then name
    const status_order = { active: 0, busy: 1, idle: 2, offline: 3 };
    filtered = filtered.sort(
      (/** @type {Droid} */ a, /** @type {Droid} */ b) => {
        const a_order = status_order[/** @type {keyof typeof status_order} */ (a.status)] ?? 4;
        const b_order = status_order[/** @type {keyof typeof status_order} */ (b.status)] ?? 4;
        if (a_order !== b_order) return a_order - b_order;
        return a.name.localeCompare(b.name);
      }
    );

    // Compute stats
    const active_count = droids.filter((/** @type {Droid} */ d) => d.status === 'active').length;
    const idle_count = droids.filter((/** @type {Droid} */ d) => d.status === 'idle').length;
    const total_unread = droids.reduce((/** @type {number} */ acc, /** @type {Droid} */ d) => acc + (d.unread_count || 0), 0);

    return html`
      <div class="queen-droids">
        <div class="droids-header">
          <h2>Droids</h2>
          <div class="droids-toolbar">
            <button
              class="btn btn-refresh"
              @click=${() => callbacks.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        <div class="droids-stats">
          <div class="stat ${filter_status === 'active' ? 'active' : ''}" @click=${() => onFilterStatus('active')}>
            <span class="stat-value">${active_count}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat ${filter_status === 'idle' ? 'active' : ''}" @click=${() => onFilterStatus('idle')}>
            <span class="stat-value">${idle_count}</span>
            <span class="stat-label">Idle</span>
          </div>
          <div class="stat">
            <span class="stat-value">${droids.length}</span>
            <span class="stat-label">Total</span>
          </div>
          ${total_unread > 0
            ? html`
                <div class="stat stat-warning">
                  <span class="stat-value">${total_unread}</span>
                  <span class="stat-label">Unread</span>
                </div>
              `
            : ''}
        </div>
        ${locations.length > 1
          ? html`
              <div class="droids-filters">
                ${locations.map(
                  (loc) => html`
                    <button
                      class="filter-btn ${filter_location === loc ? 'active' : ''}"
                      @click=${() => onFilterLocation(loc)}
                    >
                      ${loc}
                    </button>
                  `
                )}
              </div>
            `
          : ''}
        <div class="droids-grid">
          ${filtered.length === 0
            ? html`<div class="empty-state">No droids discovered</div>`
            : filtered.map((/** @type {Droid} */ d) => droidCard(d))}
        </div>
      </div>
    `;
  }

  function doRender() {
    render(template(), mount_element);
  }

  return {
    load() {
      log('load droids view');
      doRender();
      unsubscribe = store.subscribe(() => doRender());
    },
    unload() {
      log('unload droids view');
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
