import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// Create an apiKey client for the Secret model
const apiKeyClient = generateClient<Schema>({ authMode: "apiKey" });

//const client = generateClient<Schema>({ authMode: "userPool" });

function App() {
  const [lambdaSecrets, setLambdaSecrets] = useState<string>("");
  const [lambdaLoading, setLambdaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelSecrets, setModelSecrets] = useState<string>("");
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSecrets() {
      setLambdaLoading(true);
      try {
        // Call the lambda-backed query automatically
        const { data, errors } = await apiKeyClient.queries.readSecrets();
        console.log('readerLambda data:', data);
        console.log('readerLambda errors:', errors);
        if (errors?.length) {
          setError(`readerLambda: ${errors.map(e => e.message).join(", ")}`);
          setLambdaSecrets("");
        } else {
          setLambdaSecrets(data ?? "");
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || String(err));
        setLambdaSecrets("");
      } finally {
        setLambdaLoading(false);
      }
    }
    async function fetchModelSecrets() {
      setModelLoading(true);
      try {
        const { data, errors } = await apiKeyClient.models.Secret.list();
        console.log('modelSecrets data:', data);
        console.log('modelSecrets errors:', errors);
        if (errors?.length) {
          setModelError(`modelSecrets: ${errors.map(e => e.message).join(", ")}`);
          setModelSecrets("");
        } else {
          setModelSecrets(typeof data === "string" ? data : JSON.stringify(data ?? ""));
          setModelError(null);
        }
      } catch (err: any) {
        setModelError(err.message || String(err));
        setModelSecrets("");
      } finally {
        setModelLoading(false);
      }
    }
    fetchSecrets();
    fetchModelSecrets();
  }, []);

  return (
    <main style={{ background: 'white', color: 'black', minHeight: '100vh' }}>
      <h1>Welcome</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <section>
        <h2>Secrets (readerLambda)</h2>
        {lambdaLoading ? <div>Loading...</div> : (
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{lambdaSecrets}</pre>
        )}
      </section>
      <section>
        <h2>Secrets (model.list)</h2>
        {modelError && <div style={{ color: 'red' }}>Error: {modelError}</div>}
        {modelLoading ? <div>Loading...</div> : (
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{modelSecrets}</pre>
        )}
      </section>
    </main>
  );
}

export default App;
