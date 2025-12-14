import { html, render } from 'lit-html';
import { debug } from '../utils/logging.js';

/**
 * @typedef {Object} Reservation
 * @property {string} id
 * @property {string} path
 * @property {string} droid
 * @property {boolean} exclusive
 * @property {string} created_at
 * @property {string} expires_at
 * @property {string} [reason]
 * @property {boolean} [has_conflict]
 * @property {string[]} [conflicting_droids]
 */

/**
 * Create the reservations view for Queen file reservation management.
 *
 * @param {HTMLElement} mount_element
 * @param {{ getState: () => any, subscribe: (fn: (s: any) => void) => () => void }} store
 * @param {{ onRefresh?: () => void }} [callbacks]
 */
export function createReservationsView(mount_element, store, callbacks = {}) {
  const log = debug('views:reservations');
  /** @type {(() => void) | null} */
  let unsubscribe = null;
  /** @type {string | null} */
  let filter_droid = null;
  /** @type {boolean} */
  let show_expired = false;

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
   * Format time remaining until expiration.
   *
   * @param {string} expires_at
   * @returns {string}
   */
  function formatExpiry(expires_at) {
    try {
      const expiry = new Date(expires_at);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) return 'Expired';

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (minutes < 60) return `${minutes}m left`;
      if (hours < 24) return `${hours}h left`;
      return `${Math.floor(hours / 24)}d left`;
    } catch {
      return expires_at;
    }
  }

  /**
   * Check if a reservation is expired.
   *
   * @param {string} expires_at
   * @returns {boolean}
   */
  function isExpired(expires_at) {
    try {
      return new Date(expires_at).getTime() < Date.now();
    } catch {
      return false;
    }
  }

  /**
   * @param {Reservation} reservation
   * @returns {import('lit-html').TemplateResult}
   */
  function reservationRow(reservation) {
    const expired = isExpired(reservation.expires_at);
    const has_conflict = reservation.has_conflict || false;

    return html`
      <tr class="reservation-row ${expired ? 'expired' : ''} ${has_conflict ? 'has-conflict' : ''}">
        <td class="col-path">
          <span class="path-badge ${reservation.exclusive ? 'exclusive' : 'shared'}">
            ${reservation.exclusive ? '🔒' : '👁️'}
          </span>
          <code class="file-path">${reservation.path}</code>
          ${has_conflict
            ? html`<span class="conflict-indicator" title="Conflict with: ${reservation.conflicting_droids?.join(', ')}">⚠️</span>`
            : ''}
        </td>
        <td class="col-droid">
          <span class="droid-badge">${reservation.droid}</span>
        </td>
        <td class="col-type">
          <span class="type-badge ${reservation.exclusive ? 'exclusive' : 'shared'}">
            ${reservation.exclusive ? 'Exclusive' : 'Shared'}
          </span>
        </td>
        <td class="col-expiry ${expired ? 'expired-text' : ''}">
          ${formatExpiry(reservation.expires_at)}
        </td>
        <td class="col-created">${formatTime(reservation.created_at)}</td>
        <td class="col-actions">
          ${!expired
            ? html`
                <button
                  class="btn btn-sm btn-release"
                  @click=${() => onRelease(reservation)}
                  title="Release reservation"
                >
                  Release
                </button>
                <button
                  class="btn btn-sm btn-renew"
                  @click=${() => onRenew(reservation)}
                  title="Extend reservation"
                >
                  Renew
                </button>
              `
            : html`
                <span class="expired-label">Expired</span>
              `}
        </td>
      </tr>
    `;
  }

  /**
   * @param {Reservation} reservation
   */
  function onRelease(reservation) {
    log('release reservation: %s', reservation.id);
    // TODO: Implement release via queen CLI
  }

  /**
   * @param {Reservation} reservation
   */
  function onRenew(reservation) {
    log('renew reservation: %s', reservation.id);
    // TODO: Implement renew via queen CLI
  }

  /**
   * @param {string | null} droid
   */
  function onFilterDroid(droid) {
    filter_droid = filter_droid === droid ? null : droid;
    doRender();
  }

  function onToggleExpired() {
    show_expired = !show_expired;
    doRender();
  }

  function template() {
    const state = store.getState();
    const reservations = state.queen_reservations || [];

    // Get unique droids
    const droids = [...new Set(reservations.map((/** @type {Reservation} */ r) => r.droid))];

    // Apply filters
    let filtered = reservations;
    if (filter_droid) {
      filtered = filtered.filter((/** @type {Reservation} */ r) => r.droid === filter_droid);
    }
    if (!show_expired) {
      filtered = filtered.filter((/** @type {Reservation} */ r) => !isExpired(r.expires_at));
    }

    // Sort by expiry (soonest first)
    filtered = filtered.sort(
      (/** @type {Reservation} */ a, /** @type {Reservation} */ b) =>
        new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
    );

    // Compute stats
    const active_count = reservations.filter(
      (/** @type {Reservation} */ r) => !isExpired(r.expires_at)
    ).length;
    const conflict_count = reservations.filter(
      (/** @type {Reservation} */ r) => r.has_conflict
    ).length;
    const exclusive_count = reservations.filter(
      (/** @type {Reservation} */ r) => r.exclusive && !isExpired(r.expires_at)
    ).length;

    return html`
      <div class="queen-reservations">
        <div class="reservations-header">
          <h2>File Reservations</h2>
          <div class="reservations-toolbar">
            <label class="toggle-expired">
              <input
                type="checkbox"
                ?checked=${show_expired}
                @change=${onToggleExpired}
              />
              Show expired
            </label>
            <button
              class="btn btn-refresh"
              @click=${() => callbacks.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        <div class="reservations-stats">
          <div class="stat">
            <span class="stat-value">${active_count}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat">
            <span class="stat-value">${exclusive_count}</span>
            <span class="stat-label">Exclusive</span>
          </div>
          ${conflict_count > 0
            ? html`
                <div class="stat stat-warning">
                  <span class="stat-value">${conflict_count}</span>
                  <span class="stat-label">Conflicts</span>
                </div>
              `
            : ''}
          ${droids.map(
            (droid) => html`
              <div
                class="stat droid-stat ${filter_droid === droid ? 'active' : ''}"
                @click=${() => onFilterDroid(droid)}
              >
                <span class="stat-value">${reservations.filter((/** @type {Reservation} */ r) => r.droid === droid && !isExpired(r.expires_at)).length}</span>
                <span class="stat-label">${droid}</span>
              </div>
            `
          )}
        </div>
        <div class="reservations-table-container">
          ${filtered.length === 0
            ? html`<div class="empty-state">No reservations</div>`
            : html`
                <table class="reservations-table">
                  <thead>
                    <tr>
                      <th>Path</th>
                      <th>Droid</th>
                      <th>Type</th>
                      <th>Expires</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filtered.map((/** @type {Reservation} */ r) => reservationRow(r))}
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
      log('load reservations view');
      doRender();
      unsubscribe = store.subscribe(() => doRender());
    },
    unload() {
      log('unload reservations view');
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
