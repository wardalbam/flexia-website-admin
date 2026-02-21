"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Check, X } from "lucide-react";
import { mutate } from "swr";

type Props = {
  id: string | number;
  field: string;
  value?: string;
  placeholder?: string;
  onSaved?: (newValue: string) => void;
  multiline?: boolean;
  rows?: number;
};

export default function InlineFieldEditor({ id, field, value = "", placeholder = "", onSaved, multiline = false, rows = 4 }: Props) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setInput(value);
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setInput(value);
    setError(null);
    setEditing(false);
  };

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      // For fields that are stored as arrays (like employmentType) send as array
      const body: any = {};
      if (field === "employmentType") {
        // allow comma separated list
        const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
        body[field] = parts;
      } else if (field === "salary") {
        // coerce numeric values
        const num = Number(input);
        if (Number.isNaN(num)) throw new Error("Ongeldig nummer");
        body[field] = num;
      } else {
        body[field] = input;
      }

      const res = await fetch(`/api/vacatures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Update failed");
      }

      const json = await res.json().catch(() => null);
      setEditing(false);
      if (onSaved) onSaved(input);

      // Revalidate the vacancy detail and list caches so UI updates everywhere
      const key = `/api/vacatures/${id}`;
      if (json) {
        // update cache with returned payload (avoid extra round-trip)
        // second arg false => do not revalidate after setting
        // @ts-ignore - allow mutate with any
        mutate(key, json, false);
      } else {
        mutate(key);
      }
      // also refresh list cache
      mutate(`/api/vacatures`);

      return json;
    } catch (err: any) {
      setError(err?.message || "Kon niet opslaan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      {!editing ? (
        <>
          <span className="text-sm text-muted-foreground">{value || placeholder || "—"}</span>
          <button type="button" onClick={startEdit} className="ml-1 text-muted-foreground hover:text-foreground">
            <Edit className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {multiline ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={rows}
              className="px-2 py-1 text-sm rounded border border-border w-full max-w-full"
              placeholder={placeholder}
            />
          ) : (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-2 py-1 text-sm rounded border border-border"
              placeholder={placeholder}
            />
          )}
          <Button size="sm" onClick={save} disabled={loading} className="gap-2">
            <Check className="h-4 w-4" />
          </Button>
          <button onClick={cancel} className="text-muted-foreground hover:text-foreground p-1">
            <X className="h-4 w-4" />
          </button>
          {error && <div className="text-xs text-destructive ml-2">{error}</div>}
        </div>
      )}
    </div>
  );
}
