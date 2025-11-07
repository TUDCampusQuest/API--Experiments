import React, { useState } from 'react';

const GEMINI_API_KEY = 'MY_API_KEY';

const MODEL = 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`;

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '(No content returned)';
  const text = parts.map(p => p?.text || '').join('');
  return text.trim() || '(No content returned)';
}

export function App() {
  const [prompt, setPrompt] = useState('Say hello to React + Gemini 2.5 Flash!');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    setLoading(true);
    setReply('');

    try {
      const res = await fetch(`${ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setReply(extractText(data));
    } catch (err) {
      setReply(`Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>Gemini API Demo</h1>
      <h2>Ask the model something</h2>

      <form className="panel" onSubmit={handleAsk}>
        <label className="row">
          <span>Prompt</span>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything…"
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>

      <div className="output">
        <div className="output-label">Response (gemini-2.5-flash)</div>
        <pre className="output-text">{reply}</pre>
      </div>
    </div>
  );
}

console.log('Hello console');