import { useState } from "react";

export function CsvImport({ onDone }: { onDone?: () => void }) {
  const [csv, setCsv] = useState(
    "name,grade,email\nSara,10,sara@example.com\nOmar,10,omar@example.com",
  );
  const [res, setRes] = useState("");

  const send = () => {
    void fetch("/api/students/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    })
      .then((r) => r.json())
      .then((j) => {
        setRes(`Added ${j.added}, total ${j.total}`);
        onDone?.();
      });
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-semibold text-ink">Bulk import students (CSV)</h3>
      <p className="text-xs text-muted">
        Paste Excel → Save as CSV → paste here. Header: name,grade,email
      </p>
      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        rows={5}
        className="mt-3 w-full rounded-lg border border-border bg-surface p-3 font-mono text-sm focus:border-primary focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={send}
        className="mt-3 rounded-full bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-hover"
      >
        Import CSV
      </button>
      {res ? <p className="mt-2 text-sm text-green-600">{res}</p> : null}
    </div>
  );
}
