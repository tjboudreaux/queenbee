import { html, render } from 'lit-html';
import { debug } from '../utils/logging.js';

/**
 * Render the top navigation with tabs and handle route changes.
 *
 * @param {HTMLElement} mount_element
 * @param {{ getState: () => any, subscribe: (fn: (s: any) => void) => () => void }} store
 * @param {{ gotoView: (v: 'issues'|'epics'|'board'|'messages'|'assignments'|'reservations'|'droids'|'worktrees') => void }} router
 */
export function createTopNav(mount_element, store, router) {
  const log = debug('views:nav');
  /** @type {(() => void) | null} */
  let unsubscribe = null;

  /**
   * @param {'issues'|'epics'|'board'|'messages'|'assignments'|'reservations'|'droids'|'worktrees'} view
   * @returns {(ev: MouseEvent) => void}
   */
  function onClick(view) {
    return (ev) => {
      ev.preventDefault();
      log('click tab %s', view);
      router.gotoView(view);
    };
  }

  function template() {
    const s = store.getState();
    const active = s.view || 'issues';
    return html`
      <nav class="header-nav" aria-label="Primary">
        <a
          href="#/issues"
          class="tab ${active === 'issues' ? 'active' : ''}"
          @click=${onClick('issues')}
          >Issues</a
        >
        <a
          href="#/epics"
          class="tab ${active === 'epics' ? 'active' : ''}"
          @click=${onClick('epics')}
          >Epics</a
        >
        <a
          href="#/board"
          class="tab ${active === 'board' ? 'active' : ''}"
          @click=${onClick('board')}
          >Board</a
        >
        <div class="queen-nav">
          <a
            href="#/messages"
            class="tab ${active === 'messages' ? 'active' : ''}"
            @click=${onClick('messages')}
            >Messages</a
          >
          <a
            href="#/assignments"
            class="tab ${active === 'assignments' ? 'active' : ''}"
            @click=${onClick('assignments')}
            >Assigns</a
          >
          <a
            href="#/reservations"
            class="tab ${active === 'reservations' ? 'active' : ''}"
            @click=${onClick('reservations')}
            >Files</a
          >
          <a
            href="#/droids"
            class="tab ${active === 'droids' ? 'active' : ''}"
            @click=${onClick('droids')}
            >Droids</a
          >
          <a
            href="#/worktrees"
            class="tab ${active === 'worktrees' ? 'active' : ''}"
            @click=${onClick('worktrees')}
            >Trees</a
          >
        </div>
      </nav>
    `;
  }

  function doRender() {
    render(template(), mount_element);
  }

  doRender();
  unsubscribe = store.subscribe(() => doRender());

  return {
    destroy() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      render(html``, mount_element);
    }
  };
}
