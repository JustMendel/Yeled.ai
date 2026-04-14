"use client";

import { FormEvent, useEffect, useState } from "react";

type Dashboard = {
  planningCount: number;
  insightCount: number;
  teamSize: number;
};

type HistoryData = {
  planning: Array<{ id: string; createdAt: string; outputText: string }>;
  insights: Array<{ id: string; createdAt: string; outputText: string }>;
};

type Settings = {
  tone: string;
  terminology: string;
  jewishOrientation: string;
  languageStyle: string;
  messTolerance: string;
  outputDetail: string;
};

const defaultSettings: Settings = {
  tone: "supportive",
  terminology: "Shabbos",
  jewishOrientation: "general",
  languageStyle: "warm",
  messTolerance: "medium",
  outputDetail: "standard"
};

export default function HomePage() {
  const [userEmail, setUserEmail] = useState("manager@demo.local");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [planningOutput, setPlanningOutput] = useState("");
  const [insightOutput, setInsightOutput] = useState("");

  const [planningForm, setPlanningForm] = useState({
    ageGroup: "3-4",
    duration: "25 minutes",
    location: "indoor",
    energyLevel: "medium",
    materials: "paper, crayons, sensory tray",
    jewishThemeType: "Parsha",
    topic: "Noach",
    activityType: "sensory play"
  });

  const [insightForm, setInsightForm] = useState({
    childName: "Yael",
    age: "4",
    observations: "Yael helped peers during tidy-up and used new vocabulary in circle time.",
    developmentFocus: "social-emotional",
    concernLevel: "low",
    tone: "warm",
    jewishFraming: true
  });

  async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-demo-user": userEmail,
        ...(options?.headers ?? {})
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Request failed");
    return data;
  }

  async function refresh() {
    const [dash, hist, loadedSettings] = await Promise.all([
      api<Dashboard>("/api/dashboard"),
      api<HistoryData>("/api/history"),
      api<Settings>("/api/settings")
    ]);
    setDashboard(dash);
    setHistory(hist);
    if (loadedSettings) setSettings(loadedSettings);
  }

  useEffect(() => {
    refresh().catch((error) => console.error(error));
  }, [userEmail]);

  async function submitPlanning(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await api<{ output: string }>("/api/planning", {
      method: "POST",
      body: JSON.stringify(planningForm)
    });
    setPlanningOutput(data.output);
    refresh().catch((error) => console.error(error));
  }

  async function submitInsights(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await api<{ output: string }>("/api/insights", {
      method: "POST",
      body: JSON.stringify(insightForm)
    });
    setInsightOutput(data.output);
    refresh().catch((error) => console.error(error));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await api<Settings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings)
    });
    refresh().catch((error) => console.error(error));
  }

  return (
    <main className="container grid" style={{ gap: 20 }}>
      <section className="card">
        <h1>Yeled.ai MVP</h1>
        <p className="small">Demo login: manager can edit settings and invite users. Staff can generate content only.</p>
        <label className="small">Current user email</label>
        <select value={userEmail} onChange={(e) => setUserEmail(e.target.value)}>
          <option value="manager@demo.local">manager@demo.local</option>
          <option value="staff@demo.local">staff@demo.local</option>
        </select>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <h3>Dashboard</h3>
          <p>Planning outputs: {dashboard?.planningCount ?? 0}</p>
          <p>Parent insights: {dashboard?.insightCount ?? 0}</p>
          <p>Team size: {dashboard?.teamSize ?? 0}</p>
        </div>

        <form className="card" onSubmit={saveSettings}>
          <h3>Nursery settings</h3>
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <label className="small">{key}</label>
              <input
                value={value}
                onChange={(e) => setSettings((current) => ({ ...current, [key]: e.target.value }))}
              />
            </div>
          ))}
          <button type="submit">Save settings (manager)</button>
        </form>
      </section>

      <section className="grid grid-2">
        <form className="card" onSubmit={submitPlanning}>
          <h2>Planning module</h2>
          {Object.entries(planningForm).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <label className="small">{key}</label>
              <input
                value={value}
                onChange={(e) => setPlanningForm((current) => ({ ...current, [key]: e.target.value }))}
              />
            </div>
          ))}
          <button type="submit">Generate planning</button>
          {planningOutput && <pre>{planningOutput}</pre>}
        </form>

        <form className="card" onSubmit={submitInsights}>
          <h2>Parent insights</h2>
          {Object.entries(insightForm).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <label className="small">{key}</label>
              {typeof value === "boolean" ? (
                <select
                  value={value ? "true" : "false"}
                  onChange={(e) =>
                    setInsightForm((current) => ({
                      ...current,
                      [key]: e.target.value === "true"
                    }))
                  }
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : key === "observations" ? (
                <textarea
                  value={value}
                  onChange={(e) => setInsightForm((current) => ({ ...current, [key]: e.target.value }))}
                />
              ) : (
                <input
                  value={value}
                  onChange={(e) => setInsightForm((current) => ({ ...current, [key]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <button type="submit">Generate insight</button>
          {insightOutput && <pre>{insightOutput}</pre>}
        </form>
      </section>

      <section className="card">
        <h2>Generation history</h2>
        <div className="grid grid-2">
          <div>
            <h4>Planning</h4>
            {(history?.planning ?? []).slice(0, 5).map((item) => (
              <pre key={item.id}>{item.outputText}</pre>
            ))}
          </div>
          <div>
            <h4>Insights</h4>
            {(history?.insights ?? []).slice(0, 5).map((item) => (
              <pre key={item.id}>{item.outputText}</pre>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
