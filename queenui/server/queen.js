import { spawn } from 'node:child_process';
import { debug } from './logging.js';

const log = debug('queen');

/**
 * Resolve the queen executable path.
 *
 * @returns {string}
 */
export function getQueenBin() {
  const env_value = process.env.QUEEN_BIN;
  if (env_value && env_value.length > 0) {
    return env_value;
  }
  return 'queen';
}

/**
 * Run the `queen` CLI with provided arguments.
 * Shell is not used to avoid injection; args must be pre-split.
 *
 * @param {string[]} args - Arguments to pass (e.g., ["msg", "list", "--json"]).
 * @param {{ cwd?: string, env?: Record<string, string | undefined>, timeout_ms?: number }} [options]
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
export function runQueen(args, options = {}) {
  const bin = getQueenBin();

  const spawn_opts = {
    cwd: options.cwd || process.cwd(),
    env: options.env || process.env,
    shell: false
  };

  return new Promise((resolve) => {
    const child = spawn(bin, args, spawn_opts);

    /** @type {string[]} */
    const out_chunks = [];
    /** @type {string[]} */
    const err_chunks = [];

    if (child.stdout) {
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        out_chunks.push(String(chunk));
      });
    }
    if (child.stderr) {
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (chunk) => {
        err_chunks.push(String(chunk));
      });
    }

    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timer;
    if (options.timeout_ms && options.timeout_ms > 0) {
      timer = setTimeout(() => {
        child.kill('SIGKILL');
      }, options.timeout_ms);
      timer.unref?.();
    }

    /**
     * @param {number | string | null} code
     */
    const finish = (code) => {
      if (timer) {
        clearTimeout(timer);
      }
      resolve({
        code: Number(code || 0),
        stdout: out_chunks.join(''),
        stderr: err_chunks.join('')
      });
    };

    child.on('error', (err) => {
      log('spawn error running %s %o', bin, err);
      finish(127);
    });
    child.on('close', (code) => {
      finish(code);
    });
  });
}

/**
 * Run `queen` and parse JSON from stdout if exit code is 0.
 *
 * @param {string[]} args - Must include flags that cause JSON to be printed (e.g., `--json`).
 * @param {{ cwd?: string, env?: Record<string, string | undefined>, timeout_ms?: number }} [options]
 * @returns {Promise<{ code: number, stdoutJson?: unknown, stderr?: string }>}
 */
export async function runQueenJson(args, options = {}) {
  const result = await runQueen(args, options);
  if (result.code !== 0) {
    log(
      'queen exited with code %d (args=%o) stderr=%s',
      result.code,
      args,
      result.stderr
    );
    return { code: result.code, stderr: result.stderr };
  }
  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(result.stdout || 'null');
  } catch (err) {
    log('queen returned invalid JSON (args=%o): %o', args, err);
    return { code: 0, stderr: 'Invalid JSON from queen' };
  }
  return { code: 0, stdoutJson: parsed };
}

/**
 * List all Queen messages.
 *
 * @param {{ cwd?: string, timeout_ms?: number }} [options]
 * @returns {Promise<{ code: number, messages?: unknown[], stderr?: string }>}
 */
export async function listMessages(options = {}) {
  const result = await runQueenJson(['msg', 'list', '--json'], options);
  if (result.code !== 0 || result.stderr) {
    return { code: result.code, stderr: result.stderr };
  }
  const messages = Array.isArray(result.stdoutJson) ? result.stdoutJson : [];
  return { code: 0, messages };
}

/**
 * List all Queen assignments.
 *
 * @param {{ cwd?: string, timeout_ms?: number }} [options]
 * @returns {Promise<{ code: number, assignments?: unknown[], stderr?: string }>}
 */
export async function listAssignments(options = {}) {
  const result = await runQueenJson(['assign', 'list', '--json'], options);
  if (result.code !== 0 || result.stderr) {
    return { code: result.code, stderr: result.stderr };
  }
  const assignments = Array.isArray(result.stdoutJson)
    ? result.stdoutJson
    : [];
  return { code: 0, assignments };
}

/**
 * List all Queen reservations.
 *
 * @param {{ cwd?: string, timeout_ms?: number }} [options]
 * @returns {Promise<{ code: number, reservations?: unknown[], stderr?: string }>}
 */
export async function listReservations(options = {}) {
  const result = await runQueenJson(['reserve', 'list', '--json'], options);
  if (result.code !== 0 || result.stderr) {
    return { code: result.code, stderr: result.stderr };
  }
  const reservations = Array.isArray(result.stdoutJson)
    ? result.stdoutJson
    : [];
  return { code: 0, reservations };
}

/**
 * List all discovered droids.
 *
 * @param {{ cwd?: string, timeout_ms?: number }} [options]
 * @returns {Promise<{ code: number, droids?: unknown[], stderr?: string }>}
 */
export async function listDroids(options = {}) {
  const result = await runQueenJson(['droid', 'list', '--json'], options);
  if (result.code !== 0 || result.stderr) {
    return { code: result.code, stderr: result.stderr };
  }
  const droids = Array.isArray(result.stdoutJson) ? result.stdoutJson : [];
  return { code: 0, droids };
}
