"use client";

import { useEffect, useRef, useState } from "react";

const defaultWsUrl =
  typeof window !== "undefined"
    ? window.LOG_SOCKET_URL || `ws://${window.location.hostname}:3001`
    : null;

function prettyTime(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [levelFilter, setLevelFilter] = useState("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  // use SSE by default to avoid trying WS when server isn't started
  const [useSSE, setUseSSE] = useState(true);
  const [wsUrl, setWsUrl] = useState(defaultWsUrl);
  const [connectCounter, setConnectCounter] = useState(0);
  // auto-detect WS
  const [autoDetect, setAutoDetect] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [lastDetectedAt, setLastDetectedAt] = useState(null);
  // detectRef holds timer and probing flag to avoid overlapping probes
  const detectRef = useRef({ timer: null, probing: false });
  const listRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectRef = useRef({ tries: 0, timer: null });

  useEffect(() => {
    // Auto-detect WS: poll by attempting short WS connections to wsUrl
    async function probeWs(url, timeout = 1500) {
      if (detectRef.current.probing) return false;
      detectRef.current.probing = true;
      return new Promise((resolve) => {
        let done = false;
        try {
          const ws = new WebSocket(url);
          const timer = setTimeout(() => {
            if (done) return;
            done = true;
            try {
              ws.close();
            } catch {}
            detectRef.current.probing = false;
            resolve(false);
          }, timeout);
          ws.onopen = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            try {
              ws.close();
            } catch {}
            detectRef.current.probing = false;
            resolve(true);
          };
          ws.onerror = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            try {
              ws.close();
            } catch {}
            detectRef.current.probing = false;
            resolve(false);
          };
        } catch (e) {
          detectRef.current.probing = false;
          resolve(false);
        }
      });
    }

    let mounted = true;
    if (!autoDetect) {
      if (detectRef.current.timer) {
        clearInterval(detectRef.current.timer);
        detectRef.current.timer = null;
      }
      detectRef.current.probing = false;
      setDetecting(false);
      return;
    }

    setDetecting(true);
    const interval = 5000;
    const runProbe = async () => {
      if (!mounted) return;
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        setDetecting(false);
        return;
      }
      const url = wsUrl || defaultWsUrl;
      if (!url) return;
      const ok = await probeWs(url);
      if (ok && mounted) {
        setDetecting(false);
        setLastDetectedAt(new Date().toISOString());
        setUseSSE(false);
        setConnectCounter((c) => c + 1);
        if (detectRef.current.timer) {
          clearInterval(detectRef.current.timer);
          detectRef.current.timer = null;
        }
      }
    };

    // run immediately and then on interval
    runProbe();
    detectRef.current.timer = setInterval(runProbe, interval);

    return () => {
      mounted = false;
      if (detectRef.current.timer) {
        clearInterval(detectRef.current.timer);
        detectRef.current.timer = null;
      }
      detectRef.current.probing = false;
      setDetecting(false);
    };
  }, [autoDetect, wsUrl]);

  useEffect(() => {
    let mounted = true;

    // If we switched to SSE fallback, open EventSource instead
    if (useSSE) {
      setError(null);
      setConnected(false);
      const es = new EventSource("/api/log/stream");
      es.onopen = () => {
        if (!mounted) return;
        setConnected(true);
        reconnectRef.current.tries = 0;
      };
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data && data.line) {
            // line is the raw JSON string from file
            try {
              const parsed = JSON.parse(data.line);
              setLogs((prev) => [...prev, parsed]);
            } catch (e) {
              setLogs((prev) => [...prev, { raw: data.line }]);
            }
          }
        } catch (err) {
          // ignore parse errors
        }
      };
      es.onerror = () => {
        if (!mounted) return;
        setError("SSE error");
        setConnected(false);
      };

      return () => {
        mounted = false;
        es.close();
      };
    }

    function connect() {
      setError(null);
      // if already connecting/open, do not create another
      if (
        wsRef.current &&
        (wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted) return;
        setConnected(true);
        reconnectRef.current.tries = 0;
        // clear any detecting/probing state
        if (detectRef.current.timer) {
          clearInterval(detectRef.current.timer);
          detectRef.current.timer = null;
        }
        detectRef.current.probing = false;
      };

      ws.onmessage = (ev) => {
        if (!mounted) return;
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "history") {
            setLogs((prev) => [...prev, ...msg.payload]);
          } else if (msg.type === "lines") {
            setLogs((prev) => [...prev, ...msg.payload]);
          } else {
            // allow plain objects
            setLogs((prev) => [...prev, msg]);
          }
        } catch (err) {
          // fallback raw
          setLogs((prev) => [...prev, { raw: ev.data }]);
        }
      };

      ws.onclose = () => {
        if (!mounted) return;
        setConnected(false);
        // reconnect with backoff and switch to SSE after several failures
        const tries = ++reconnectRef.current.tries;
        if (tries >= 4) {
          // fallback to SSE
          setUseSSE(true);
          return;
        }
        const delay = Math.min(30000, 1000 * Math.pow(1.5, tries));
        reconnectRef.current.timer = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        setError("WebSocket error");
      };
    }

    // Connect only when not using SSE
    if (!useSSE) {
      connect();
    }

    return () => {
      mounted = false;
      if (reconnectRef.current.timer) clearTimeout(reconnectRef.current.timer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [useSSE, wsUrl, connectCounter]);

  useEffect(() => {
    if (!autoScroll) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [logs, autoScroll]);

  const clearLogs = () => setLogs([]);

  function exportJSON(items) {
    try {
      const data = JSON.stringify(items || [], null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logs_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  }

  function exportCSV(items) {
    try {
      const lines = [];
      lines.push(["timestamp", "level", "message"].join(";"));
      (items || []).forEach((it) => {
        const timestamp =
          it.timestamp ||
          it.receivedAt ||
          (it.payload && it.payload.timestamp) ||
          "";
        const level = (it.level || it.payload?.level || "").toString();
        const msg =
          it.message ||
          it.payload?.message ||
          JSON.stringify(it.payload || it.raw || it);
        // escape semicolons/newlines
        const safe = String(msg).replace(/\n/g, " ").replace(/"/g, '""');
        lines.push([timestamp, level, `"${safe}"`].join(";"));
      });
      const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logs_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  }

  // search (removed pagination - show all filtered logs)
  const [searchText, setSearchText] = useState("");

  const filtered = logs.filter((l) => {
    if (!l) return false;
    const lvl = (
      l.level ||
      l?.payload?.level ||
      (l.raw && l.raw.level) ||
      "info"
    ).toLowerCase();
    if (levelFilter !== "all" && lvl !== levelFilter) return false;
    if (!searchText) return true;
    try {
      const s = searchText.toLowerCase();
      const raw = JSON.stringify(l).toLowerCase();
      return raw.includes(s);
    } catch (e) {
      return true;
    }
  });

  const displayed = filtered;

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Logs (Real-time)</h1>
        <div className="text-sm text-neutral-400">
          Última detecção: {lastDetectedAt ? prettyTime(lastDetectedAt) : "—"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500 mr-2">
            Modo:{" "}
            <strong className="ml-2">{useSSE ? "SSE" : "WebSocket"}</strong>
          </span>
          <span
            className={`text-sm ${
              connected ? "text-green-600" : "text-red-600"
            }`}
          >
            {connected
              ? "Conectado"
              : useSSE
              ? "Conectado (SSE)"
              : "Desconectado"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  await fetch("/api/log", { method: "DELETE" });
                } catch (e) {
                  // ignore server error, still clear local view
                  console.warn("failed to clear server logs", e);
                }
                clearLogs();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Limpar
            </button>
            <button
              onClick={() => exportJSON(filtered)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Exportar JSON
            </button>
            <button
              onClick={() => exportCSV(filtered)}
              className="px-3 py-1 bg-amber-500 text-white rounded"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* no pagination - showing all filtered logs */}

      <div className="flex gap-3 items-center mb-4">
        <label className="text-sm">Buscar:</label>
        <input
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="Pesquisar texto nos logs"
          className="border rounded px-2 py-1 flex-1"
        />

        <label className="text-sm">Nível:</label>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">Todos</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>

        <label className="flex items-center gap-2 ml-4">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          <span className="text-sm">Auto-scroll</span>
        </label>
        {error && <span className="text-sm text-red-600 ml-4">{error}</span>}

        {/* WS controls */}
        <div className="ml-4 flex items-center gap-2">
          <input
            value={wsUrl || ""}
            onChange={(e) => setWsUrl(e.target.value)}
            className="border px-2 py-1 text-sm"
            style={{ minWidth: 260 }}
            placeholder={defaultWsUrl || "ws://localhost:3001"}
          />
          <button
            onClick={() => {
              setUseSSE(false);
              setConnectCounter((c) => c + 1);
              setError(null);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Conectar WS
          </button>
          <button
            onClick={() => {
              setUseSSE(true);
              setConnectCounter((c) => c + 1);
              setError(null);
            }}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            Usar SSE
          </button>
        </div>
        <label className="flex items-center gap-2 ml-4">
          <input
            type="checkbox"
            checked={autoDetect}
            onChange={(e) => setAutoDetect(e.target.checked)}
          />
          <span className="text-sm">Auto-detect WS e conectar</span>
          {detecting && (
            <span className="text-xs text-yellow-400 ml-2">Detectando...</span>
          )}
        </label>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-auto p-3 bg-neutral-900 text-neutral-100 rounded"
        style={{ height: "100%", minHeight: 0 }}
      >
        {filtered.length === 0 && (
          <div className="text-sm text-neutral-400">Nenhum log</div>
        )}
        <ul className="space-y-2">
          {displayed.map((l, i) => {
            const level = (
              l.level ||
              l?.payload?.level ||
              "info"
            ).toLowerCase();
            const time =
              l.timestamp ||
              l?.payload?.timestamp ||
              l.receivedAt ||
              l?.timestamp ||
              null;
            const body =
              l.message || l?.payload?.message || l?.payload || l.raw || l;
            const color =
              level === "error"
                ? "text-red-400"
                : level === "warn"
                ? "text-yellow-300"
                : "text-green-300";
            return (
              <li key={i} className="flex gap-3">
                <div className="w-32 text-xs text-neutral-400">
                  {prettyTime(time)}
                </div>
                <div className={`w-16 text-xs font-medium ${color}`}>
                  {level.toUpperCase()}
                </div>
                <div className="flex-1 text-sm break-words">
                  <pre className="whitespace-pre-wrap">
                    {typeof body === "object"
                      ? JSON.stringify(body, null, 2)
                      : String(body)}
                  </pre>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
