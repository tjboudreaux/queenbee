import { html, render } from 'lit-html';
import { debug } from '../utils/logging.js';

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} from
 * @property {string} to
 * @property {string} subject
 * @property {string} body
 * @property {string} [thread_id]
 * @property {string} [in_reply_to]
 * @property {string} created_at
 * @property {string} [read_at]
 */

/**
 * Create the messages view for Queen agent coordination.
 *
 * @param {HTMLElement} mount_element
 * @param {{ getState: () => any, subscribe: (fn: (s: any) => void) => () => void }} store
 * @param {{ onRefresh?: () => void }} [callbacks]
 */
export function createMessagesView(mount_element, store, callbacks = {}) {
  const log = debug('views:messages');
  /** @type {(() => void) | null} */
  let unsubscribe = null;
  /** @type {string | null} */
  let selected_message_id = null;
  /** @type {string | null} */
  let active_thread_id = null;
  /** @type {boolean} */
  let show_compose = false;

  /**
   * @param {string} id
   */
  function onSelectMessage(id) {
    selected_message_id = id;
    // Find the message to get its thread
    const state = store.getState();
    const messages = state.queen_messages || [];
    const msg = messages.find((/** @type {Message} */ m) => m.id === id);
    if (msg && msg.thread_id) {
      active_thread_id = msg.thread_id;
    }
    doRender();
  }

  function onToggleCompose() {
    show_compose = !show_compose;
    doRender();
  }

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
   * @param {Message} message
   * @returns {import('lit-html').TemplateResult}
   */
  function messageRow(message) {
    const is_selected = message.id === selected_message_id;
    const is_unread = !message.read_at;
    return html`
      <div
        class="message-row ${is_selected ? 'selected' : ''} ${is_unread ? 'unread' : ''}"
        @click=${() => onSelectMessage(message.id)}
        tabindex="0"
        @keydown=${(/** @type {KeyboardEvent} */ e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectMessage(message.id);
          }
        }}
      >
        <div class="message-header">
          <span class="message-from">${message.from}</span>
          <span class="message-time">${formatTime(message.created_at)}</span>
        </div>
        <div class="message-subject">${message.subject}</div>
        <div class="message-preview">${message.body?.slice(0, 80)}${message.body?.length > 80 ? '...' : ''}</div>
      </div>
    `;
  }

  /**
   * @param {Message} message
   * @returns {import('lit-html').TemplateResult}
   */
  function messageDetail(message) {
    return html`
      <div class="message-detail">
        <div class="message-detail-header">
          <h3>${message.subject}</h3>
          <div class="message-meta">
            <span>From: <strong>${message.from}</strong></span>
            <span>To: <strong>${message.to}</strong></span>
            <span>${formatTime(message.created_at)}</span>
          </div>
        </div>
        <div class="message-body">
          ${message.body}
        </div>
        <div class="message-actions">
          <button class="btn btn-reply" @click=${onToggleCompose}>
            Reply
          </button>
        </div>
      </div>
    `;
  }

  /**
   * @returns {import('lit-html').TemplateResult}
   */
  function composeForm() {
    return html`
      <div class="compose-form">
        <h3>New Message</h3>
        <form @submit=${onSubmitMessage}>
          <div class="form-group">
            <label for="msg-to">To:</label>
            <input type="text" id="msg-to" name="to" required placeholder="droid name" />
          </div>
          <div class="form-group">
            <label for="msg-subject">Subject:</label>
            <input type="text" id="msg-subject" name="subject" required />
          </div>
          <div class="form-group">
            <label for="msg-body">Message:</label>
            <textarea id="msg-body" name="body" rows="6" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Send</button>
            <button type="button" class="btn btn-secondary" @click=${onToggleCompose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;
  }

  /**
   * @param {Event} e
   */
  function onSubmitMessage(e) {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.target);
    const data = new FormData(form);
    log('send message: to=%s subject=%s', data.get('to'), data.get('subject'));
    // TODO: Implement send via queen CLI
    show_compose = false;
    doRender();
  }

  function template() {
    const state = store.getState();
    const messages = state.queen_messages || [];
    const selected = messages.find(
      (/** @type {Message} */ m) => m.id === selected_message_id
    );

    // Group messages by thread
    const threads = new Map();
    for (const msg of messages) {
      const tid = msg.thread_id || msg.id;
      if (!threads.has(tid)) {
        threads.set(tid, []);
      }
      threads.get(tid).push(msg);
    }

    // Sort threads by most recent message
    const sorted_threads = Array.from(threads.entries()).sort((a, b) => {
      const a_latest = a[1][a[1].length - 1];
      const b_latest = b[1][b[1].length - 1];
      return new Date(b_latest.created_at).getTime() - new Date(a_latest.created_at).getTime();
    });

    // Get messages for current view
    let display_messages = messages;
    if (active_thread_id) {
      display_messages = messages.filter(
        (/** @type {Message} */ m) =>
          m.thread_id === active_thread_id || m.id === active_thread_id
      );
    }

    return html`
      <div class="queen-messages">
        <div class="messages-header">
          <h2>Messages</h2>
          <div class="messages-toolbar">
            <button
              class="btn btn-compose"
              @click=${onToggleCompose}
              title="New message"
            >
              + New
            </button>
            <button
              class="btn btn-refresh"
              @click=${() => callbacks.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        ${show_compose ? composeForm() : ''}
        <div class="messages-container">
          <div class="messages-list">
            ${display_messages.length === 0
              ? html`<div class="empty-state">No messages</div>`
              : display_messages.map((/** @type {Message} */ m) => messageRow(m))}
          </div>
          <div class="messages-detail">
            ${selected
              ? messageDetail(selected)
              : html`<div class="empty-state">Select a message to view</div>`}
          </div>
        </div>
      </div>
    `;
  }

  function doRender() {
    render(template(), mount_element);
  }

  return {
    load() {
      log('load messages view');
      doRender();
      unsubscribe = store.subscribe(() => doRender());
    },
    unload() {
      log('unload messages view');
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
