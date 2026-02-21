"use client";

import { useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusLabels, getStatusBadgeClasses } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Search, X } from "lucide-react";

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", "20");
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const { data, isLoading } = useSWR(`/api/applications?${params.toString()}`);

  const applications = data?.applications || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };
  const hasFilters = !!status || !!search;

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Sollicitaties</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pagination.total} sollicitatie{pagination.total !== 1 ? "s" : ""} gevonden
          {pagination.totalPages > 1 && ` — Pagina ${pagination.page} van ${pagination.totalPages}`}
        </p>
      </div>

      {/* Filter Section */}
      <Card className="shadow-layered border-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam of email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-10 rounded-xl"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px] h-10 rounded-xl">
                <SelectValue placeholder="Alle statussen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(""); setStatus(""); setPage(1); }}
                className="h-10 rounded-xl gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 pt-3 flex-wrap">
              {status && (
                <Badge
                  className="bg-purple-500/10 text-purple-700 border-purple-500/20 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
                  onClick={() => setStatus("")}
                >
                  {statusLabels[status] || status}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {search && (
                <Badge
                  className="bg-blue-500/10 text-blue-700 border-blue-500/20 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
                  onClick={() => setSearch("")}
                >
                  &ldquo;{search}&rdquo;
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-sm" />
          ))
        ) : applications.length === 0 ? (
          <Card className="shadow-layered border-0">
            <CardContent className="py-12 text-center text-muted-foreground">
              Geen sollicitaties gevonden.
            </CardContent>
          </Card>
        ) : (
          applications.map((app: any, i: number) => (
            <Card key={app.id} className={cn("shadow-layered border-0 hover-lift group", `animate-fade-in stagger-${Math.min(i + 1, 6)}`)}>
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-3 min-w-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary text-sm font-bold">{app.firstName[0]}{app.lastName[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm tracking-tight">
                      <Link href={`/applications/${app.id}`} className="hover:text-primary transition-colors">
                        {app.firstName} {app.lastName}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {app.email} &middot; {app.phone}
                    </p>
                    {app.vacature && (
                      <p className="text-xs mt-0.5">
                        <Link href={`/vacatures/${app.vacature.slug || app.vacatureId}`} className="text-primary hover:underline font-semibold">
                          {app.vacature.title}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={cn("font-bold text-xs", getStatusBadgeClasses(app.status))}>
                    {statusLabels[app.status] || app.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("nl-NL")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              className="rounded-full"
            >
              Vorige
            </Button>
          )}
          <span className="flex items-center text-sm text-muted-foreground px-3">
            {page} / {pagination.totalPages}
          </span>
          {page < pagination.totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              className="rounded-full"
            >
              Volgende
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
