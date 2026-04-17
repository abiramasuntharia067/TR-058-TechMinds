import { useState, useEffect } from "react";
import { fetchWasteAnalyses, type WasteAnalysis } from "../lib/supabase";

interface HistoryProps {
  onBack: () => void;
}

export default function History({ onBack }: HistoryProps) {
  const [analyses, setAnalyses] = useState<WasteAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWasteAnalyses()
      .then(setAnalyses)
      .catch(err => setError(err.message || "Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Analysis History</h2>
        <button onClick={onBack}>Back to App</button>
      </div>

      {loading && <p>Loading records from Supabase...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && analyses.length === 0 && (
        <p>No analyses saved yet. Complete an analysis and click "Save to Database".</p>
      )}

      {analyses.map((item, idx) => (
        <div key={item.id || idx} style={{ border: "1px solid #ccc", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
          <h3>{item.waste_type} — {item.weight_kg} kg</h3>
          <p style={{ color: "#666", fontSize: 14 }}>{formatDate(item.created_at)}</p>
          <p><strong>Best Method:</strong> {item.best_method}</p>
          <p><strong>Energy:</strong> {item.energy_output_kwh?.toFixed(1)} kWh &nbsp;|&nbsp;
             <strong>Revenue:</strong> ₹{item.estimated_revenue_inr?.toLocaleString("en-IN", { maximumFractionDigits: 0 })} &nbsp;|&nbsp;
             <strong>CO₂ Saved:</strong> {item.co2_saved_kg?.toFixed(1)} kg</p>
          {item.is_verified !== null && (
            <p style={{ color: item.is_verified ? "green" : "orange" }}>
              {item.is_verified ? "Image Verified" : "Image Not Verified"}
              {item.verification_confidence ? ` · ${item.verification_confidence}% confidence` : ""}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

