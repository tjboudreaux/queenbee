import { html, render } from 'lit-html';
import debug from 'debug';

const log = debug('queenui:worktrees');

/**
 * @typedef {Object} Worktree
 * @property {string} path - Full filesystem path
 * @property {string} branch - Branch name
 * @property {string} commit - Current HEAD commit
 * @property {boolean} [is_bare] - Whether this is a bare worktree
 * @property {boolean} [is_current] - Whether this is the current worktree
 */

/**
 * @typedef {Object} WorktreesCallbacks
 * @property {(path: string) => void} [onSelect] - Called when a worktree is selected
 * @property {(path: string) => void} [onSwitch] - Called when switching worktrees
 * @property {(path: string) => void} [onFilterIssues] - Called to filter issues by worktree
 * @property {(path: string) => void} [onFilterReservations] - Called to filter reservations by worktree
 * @property {(path: string) => void} [onFilterAssignments] - Called to filter assignments by worktree
 */

/**
 * Create the worktrees view component.
 *
 * @param {HTMLElement} mount_element - DOM element to render into
 * @param {{ subscribe?: (fn: (state: any) => void) => (() => void) }} store - Application state store
 * @param {WorktreesCallbacks} [callbacks] - Callbacks for worktree actions
 * @returns {{ load: () => void, unload: () => void }}
 */
export function createWorktreesView(mount_element, store, callbacks = {}) {
  log('createWorktreesView called');

  /** @type {(() => void) | null | undefined} */
  let unsubscribe = null;

  /** @type {Worktree[]} */
  let worktrees = [];

  /** @type {string | null} */
  let current_worktree = null;

  /** @type {string | null} */
  let selected_worktree = null;

  /**
   * Get short name from path.
   *
   * @param {string} path
   * @returns {string}
   */
  function getShortName(path) {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  }

  /**
   * Get branch display name.
   *
   * @param {string} branch
   * @returns {string}
   */
  function getBranchDisplay(branch) {
    if (branch === 'detached') return '(detached HEAD)';
    return branch;
  }

  /**
   * Format commit as short hash.
   *
   * @param {string} commit
   * @returns {string}
   */
  function shortCommit(commit) {
    return commit ? commit.slice(0, 7) : '';
  }

  /**
   * Handle worktree tab click.
   *
   * @param {string} path
   */
  function onSelectWorktree(path) {
    selected_worktree = path;
    if (callbacks.onSelect) {
      callbacks.onSelect(path);
    }
    doRender();
  }

  /**
   * Handle switch button click.
   *
   * @param {string} path
   */
  function onSwitchWorktree(path) {
    if (callbacks.onSwitch) {
      callbacks.onSwitch(path);
    }
  }

  /**
   * Worktree tab component.
   *
   * @param {Worktree} worktree
   * @returns {import('lit-html').TemplateResult}
   */
  function worktreeTab(worktree) {
    const is_current = worktree.is_current;
    const is_selected = worktree.path === selected_worktree;
    const short_name = getShortName(worktree.path);

    return html`
      <button
        class="worktree-tab ${is_selected ? 'worktree-tab--selected' : ''} ${is_current ? 'worktree-tab--current' : ''}"
        @click=${() => onSelectWorktree(worktree.path)}
        title="${worktree.path}"
      >
        <span class="worktree-tab__icon">${is_current ? '📍' : '📁'}</span>
        <span class="worktree-tab__name">${short_name}</span>
        <span class="worktree-tab__branch">${getBranchDisplay(worktree.branch)}</span>
      </button>
    `;
  }

  /**
   * Worktree detail card component.
   *
   * @param {Worktree | null} worktree
   * @returns {import('lit-html').TemplateResult}
   */
  function worktreeDetail(worktree) {
    if (!worktree) {
      return html`
        <div class="worktree-detail worktree-detail--empty">
          <p>Select a worktree to view details</p>
        </div>
      `;
    }

    const is_current = worktree.is_current;

    return html`
      <div class="worktree-detail">
        <div class="worktree-detail__header">
          <h3>${getShortName(worktree.path)}</h3>
          ${is_current
            ? html`<span class="worktree-badge worktree-badge--current">Current</span>`
            : html`
                <button
                  class="btn btn--sm btn--primary"
                  @click=${() => onSwitchWorktree(worktree.path)}
                >
                  Switch to this worktree
                </button>
              `}
        </div>

        <dl class="worktree-detail__info">
          <dt>Path</dt>
          <dd class="worktree-detail__path">${worktree.path}</dd>

          <dt>Branch</dt>
          <dd>${getBranchDisplay(worktree.branch)}</dd>

          <dt>Commit</dt>
          <dd class="worktree-detail__commit">${shortCommit(worktree.commit)}</dd>

          ${worktree.is_bare
            ? html`
                <dt>Type</dt>
                <dd>Bare repository</dd>
              `
            : ''}
        </dl>

        <div class="worktree-detail__actions">
          <h4>Quick Actions</h4>
          <div class="worktree-actions">
            <button
              class="btn btn--sm"
              @click=${() => callbacks.onFilterIssues?.(worktree.path)}
              title="Show issues related to this worktree"
            >
              📋 View Issues
            </button>
            <button
              class="btn btn--sm"
              @click=${() => callbacks.onFilterReservations?.(worktree.path)}
              title="Show file reservations in this worktree"
            >
              🔒 View Reservations
            </button>
            <button
              class="btn btn--sm"
              @click=${() => callbacks.onFilterAssignments?.(worktree.path)}
              title="Show assignments for this worktree"
            >
              👤 View Assignments
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Main template.
   *
   * @returns {import('lit-html').TemplateResult}
   */
  function template() {
    const selected = worktrees.find((w) => w.path === selected_worktree) || null;
    const non_bare = worktrees.filter((w) => !w.is_bare);

    return html`
      <div class="worktrees-view">
        <div class="worktrees-header">
          <h2>Git Worktrees</h2>
          <span class="worktrees-count">${non_bare.length} worktree${non_bare.length !== 1 ? 's' : ''}</span>
        </div>

        ${non_bare.length === 0
          ? html`
              <div class="worktrees-empty">
                <p>No git worktrees found.</p>
                <p class="worktrees-empty__hint">
                  Create worktrees with: <code>git worktree add ../feature-branch feature-branch</code>
                </p>
              </div>
            `
          : html`
              <div class="worktrees-tabs">
                ${non_bare.map((w) => worktreeTab(w))}
              </div>

              ${worktreeDetail(selected)}

              <div class="worktrees-summary">
                <h4>Worktree Summary</h4>
                <table class="worktrees-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Branch</th>
                      <th>Commit</th>
                      <th>Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${non_bare.map(
                      (w) => html`
                        <tr
                          class="${w.is_current ? 'worktrees-table__row--current' : ''}"
                          @click=${() => onSelectWorktree(w.path)}
                        >
                          <td>${w.is_current ? '📍' : ''}</td>
                          <td>${getShortName(w.path)}</td>
                          <td>${getBranchDisplay(w.branch)}</td>
                          <td class="worktrees-table__commit">${shortCommit(w.commit)}</td>
                          <td class="worktrees-table__path">${w.path}</td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            `}
      </div>
    `;
  }

  function doRender() {
    try {
      render(template(), mount_element);
    } catch (err) {
      log('render error %o', err);
    }
  }

  return {
    load() {
      log('worktrees view load');
      unsubscribe = store.subscribe?.((state) => {
        if (state.worktrees) {
          worktrees = state.worktrees;
          current_worktree = state.current_worktree || null;

          // Mark current worktree
          worktrees = worktrees.map((w) => ({
            ...w,
            is_current: w.path === current_worktree
          }));

          // Auto-select current if nothing selected
          if (!selected_worktree && current_worktree) {
            selected_worktree = current_worktree;
          }
        }
        doRender();
      });

      // Initial render with empty state
      doRender();
    },

    unload() {
      log('worktrees view unload');
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      render(html``, mount_element);
    }
  };
}
