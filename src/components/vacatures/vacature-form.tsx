"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Save, Archive, ArchiveRestore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  isActive: boolean;
};

type VacatureData = {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  vacatureNumber: number;
  description: string;
  longDescription: string;
  seoContent: string;
  requirements: string[];
  benefits: string[];
  categoryId: string | null;
  companyName?: string;
  imageKey: string;
  employmentType: string[];
  city: string;
  location: string;
  salary: number;
  isActive: boolean;
  archived?: boolean;
};

const defaultData: VacatureData = {
  title: "",
  subtitle: "",
  slug: "",
  vacatureNumber: 0,
  description: "",
  longDescription: "",
  seoContent: "",
  requirements: [""],
  benefits: [""],
  categoryId: null,
  companyName: "Flexia",
  imageKey: "catering",
  employmentType: ["FULL_TIME"],
  city: "Den Haag",
  location: "",
  salary: 17.0,
  isActive: true,
};

export function VacatureForm({ initialData }: { initialData?: VacatureData }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<VacatureData>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const isEditing = !!initialData?.id;
  const isArchived = initialData?.archived === true;
  const userRole = (session?.user as any)?.role;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const handleArrayAdd = (field: "requirements" | "benefits") => {
    setData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleArrayRemove = (field: "requirements" | "benefits", index: number) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (field: "requirements" | "benefits", index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const toggleEmploymentType = (type: string) => {
    setData((prev) => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter((t) => t !== type)
        : [...prev.employmentType, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing ? `/api/vacatures/${initialData!.id}` : "/api/vacatures";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Er is iets misgegaan");
      }

      toast.success(isEditing ? "Vacature bijgewerkt" : "Vacature aangemaakt");
      router.push("/vacatures");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Er is iets misgegaan");
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!isEditing || !initialData?.id) return;

    const confirmMessage = isArchived
      ? "Weet je zeker dat je deze vacature wilt terughalen uit het archief?"
      : "Weet je zeker dat je deze vacature wilt archiveren? Gearchiveerde vacatures zijn niet zichtbaar voor sollicitanten.";

    if (!confirm(confirmMessage)) return;

    setArchiving(true);
    try {
      const res = await fetch(`/api/vacatures/${initialData.id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !isArchived }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Er is iets misgegaan");
      }

      toast.success(isArchived ? "Vacature teruggehaald uit archief" : "Vacature gearchiveerd");
      router.push("/vacatures");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Er is iets misgegaan");
    } finally {
      setArchiving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basis Informatie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={data.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Catering Medewerker - Den Haag"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitel</Label>
              <Input
                value={data.subtitle}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                placeholder="Evenementen & Feesten"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
                placeholder="catering-den-haag-1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Vacaturenummer</Label>
              <Input
                type="number"
                value={data.vacatureNumber || ""}
                onChange={(e) => setData({ ...data, vacatureNumber: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Korte Beschrijving</Label>
            <Textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={2}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Uitgebreide Beschrijving</Label>
            <Textarea
              value={data.longDescription}
              onChange={(e) => setData({ ...data, longDescription: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>SEO Content</Label>
            <Textarea
              value={data.seoContent}
              onChange={(e) => setData({ ...data, seoContent: e.target.value })}
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Requirements & Benefits */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vereisten</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => handleArrayAdd("requirements")}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleArrayChange("requirements", i, e.target.value)}
                  placeholder="Vereiste..."
                />
                {data.requirements.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleArrayRemove("requirements", i)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Voordelen</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => handleArrayAdd("benefits")}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.benefits.map((ben, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={ben}
                  onChange={(e) => handleArrayChange("benefits", i, e.target.value)}
                  placeholder="Voordeel..."
                />
                {data.benefits.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleArrayRemove("benefits", i)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Categorie</Label>
              <Select
                value={data.categoryId || ""}
                onValueChange={(v) => setData({ ...data, categoryId: v })}
                disabled={loadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCategories ? "Laden..." : "Selecteer categorie"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.isActive).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Afbeelding</Label>
              <Select value={data.imageKey} onValueChange={(v) => setData({ ...data, imageKey: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="catering">Catering</SelectItem>
                  <SelectItem value="chef">Chef / Keuken</SelectItem>
                  <SelectItem value="bediening">Bediening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stad</Label>
              <Select value={data.city} onValueChange={(v) => setData({ ...data, city: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Den Haag">Den Haag</SelectItem>
                  <SelectItem value="Leiden">Leiden</SelectItem>
                  <SelectItem value="Rotterdam">Rotterdam</SelectItem>
                  <SelectItem value="Amsterdam">Amsterdam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Locatie (optioneel)</Label>
            <Input
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              placeholder="Bijv. Binckhorstlaan 36, Den Haag"
            />
          </div>
          <div className="space-y-2">
            <Label>Bedrijfsnaam (optioneel)</Label>
            <Input
              value={data.companyName || "Flexia"}
              onChange={(e) => setData({ ...data, companyName: e.target.value })}
              placeholder="Flexia"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Salaris (per uur)</Label>
              <Input
                type="number"
                step="0.01"
                value={data.salary}
                onChange={(e) => setData({ ...data, salary: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dienstverband</Label>
              <div className="flex gap-2 pt-1">
                {["FULL_TIME", "PART_TIME"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={data.employmentType.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleEmploymentType(type)}
                  >
                    {type === "FULL_TIME" ? "Fulltime" : "Parttime"}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  checked={data.isActive}
                  onCheckedChange={(checked) => setData({ ...data, isActive: checked })}
                />
                <span className="text-sm">{data.isActive ? "Actief" : "Inactief"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <div className="mt-3 sm:mt-0">
          {isEditing && (
            <Button
              type="button"
              variant={isArchived ? "default" : "outline"}
              onClick={handleArchiveToggle}
              disabled={archiving}
              className={`${isArchived ? "" : "text-orange-600 hover:text-orange-700"} w-full sm:w-auto`}
            >
              {isArchived ? (
                <>
                  <ArchiveRestore className="h-4 w-4 mr-2" />
                  {archiving ? "Terughalen..." : "Terughalen uit Archief"}
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-2" />
                  {archiving ? "Archiveren..." : "Archiveren"}
                </>
              )}
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto rounded-full">
            Annuleren
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto rounded-full font-semibold">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Opslaan..." : isEditing ? "Bijwerken" : "Aanmaken"}
          </Button>
        </div>
      </div>
    </form>
  );
}
