import { useEffect, useState } from "react";
import { api, apiGet } from "../lib/api";
type Rec = { id: string; date: string; present: boolean };
export function AttendancePanel({ studentId = "s1" }: { studentId?: string }) {
  const [rate, setRate] = useState(0);
  const [records, setRecords] = useState<Rec[]>([]);
  const today = new Date().toISOString().slice(0, 10);
  const load = () => {
    void apiGet<{ rate: number; records: Rec[] }>(`/api/hrms/attendance/${studentId}`)
      .then((j) => {
        setRate(j.rate);
        setRecords(j.records);
      })
      .catch(() => {});
  };
  useEffect(load, [studentId]);
  const mark = (present: boolean) => {
    void api<Rec>("/api/hrms/attendance", {
      method: "POST",
      body: JSON.stringify({ studentId, date: today, present }),
    }).then(load);
  };
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-semibold text-ink">Attendance — {studentId}</h3>
      <p className="text-2xl font-bold text-ink">{Math.round(rate * 100)}% present</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => mark(true)}
          className="rounded-full bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-hover"
        >
          Present today
        </button>
        <button
          onClick={() => mark(false)}
          className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-ink hover:bg-canvas"
        >
          Absent today
        </button>
      </div>
      <p className="mt-3 text-xs text-muted">
        {records.length
          ? `Last: ${records[records.length - 1].date} — ${records.length} records`
          : "No records yet"}
      </p>
    </div>
  );
}
