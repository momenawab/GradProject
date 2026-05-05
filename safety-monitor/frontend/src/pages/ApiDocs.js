import Sidebar from "../components/Sidebar";
import { API_BASE_URL, ENDPOINTS } from "../config/endpoints";
import "./ApiDocs.css";

const endpointRows = Object.entries(ENDPOINTS).map(([key, value]) => ({
  key,
  path: typeof value === "function" ? "Dynamic function endpoint" : value,
  type: typeof value === "function" ? "dynamic" : "static"
}));

export default function ApiDocs() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="api-docs-main">
        <section className="api-docs-hero">
          <h1>API Documentation</h1>
          <p>
            This page documents all API integration points used by the frontend. Update endpoint
            URLs in one place only: <code>src/config/endpoints.js</code>.
          </p>
        </section>

        <section className="api-docs-card">
          <h2>Base URL</h2>
          <p>
            Current base URL:
            <code>{API_BASE_URL}</code>
          </p>
          <p>
            You can override it with environment variable:
            <code>REACT_APP_API_BASE_URL</code>
          </p>
        </section>

        <section className="api-docs-card">
          <h2>Core API Functions</h2>
          <div className="api-function-grid">
            <article>
              <h4>apiGet(keyOrPath, ...args)</h4>
              <p>Resolves endpoint key or raw path and sends a GET request.</p>
            </article>
            <article>
              <h4>apiPost(keyOrPath, data, ...args)</h4>
              <p>Sends JSON data to a resolved endpoint using POST.</p>
            </article>
            <article>
              <h4>apiDelete(keyOrPath, ...args)</h4>
              <p>Calls DELETE on a resolved endpoint (supports dynamic IDs).</p>
            </article>
            <article>
              <h4>resolveEndpoint(key, ...args)</h4>
              <p>Maps keys from <code>ENDPOINTS</code> to final request paths.</p>
            </article>
          </div>
        </section>

        <section className="api-docs-card">
          <h2>Endpoint Registry</h2>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Path</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {endpointRows.map((row) => (
                  <tr key={row.key}>
                    <td><code>{row.key}</code></td>
                    <td><code>{row.path}</code></td>
                    <td>{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="api-docs-card">
          <h2>Usage Examples</h2>
          <pre>{`// GET camera list
const cameras = await apiGet("cameras");

// POST new worker
await apiPost("saveWorker", workerPayload);

// DELETE worker by ID
await apiDelete("workerById", workerId);`}</pre>
        </section>
      </main>
    </div>
  );
}
