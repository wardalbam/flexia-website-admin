import { z } from "zod";

export const vacatureSchema = z.object({
  title: z.string().min(3, "Titel moet minimaal 3 tekens bevatten"),
  subtitle: z.string().min(1, "Subtitel is verplicht"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten"),
  vacatureNumber: z.number().int().positive("Vacaturenummer moet positief zijn"),
  description: z.string().min(10, "Beschrijving moet minimaal 10 tekens bevatten"),
  longDescription: z.string().min(50, "Uitgebreide beschrijving moet minimaal 50 tekens bevatten"),
  seoContent: z.string().min(50, "SEO content moet minimaal 50 tekens bevatten"),
  requirements: z.array(z.string().min(1)).min(1, "Minimaal 1 vereiste"),
  benefits: z.array(z.string().min(1)).min(1, "Minimaal 1 voordeel"),
  category: z.enum(["CATERING", "SPOELKEUKEN", "KEUKENHULP", "BEDIENING"]),
  imageKey: z.enum(["catering", "chef", "bediening"]),
  employmentType: z.array(z.string()).min(1, "Minimaal 1 dienstverband type"),
  location: z.string().min(1, "Locatie is verplicht"),
  salary: z.number().positive("Salaris moet positief zijn"),
  isActive: z.boolean(),
});

export const applicationSchema = z.object({
  firstName: z.string().min(1, "Voornaam is verplicht"),
  lastName: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  phone: z.string().min(6, "Telefoonnummer is te kort"),
  birthDate: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().optional(),
  experience: z.string().optional(),
  selectedVacatures: z.array(z.string()).min(1, "Selecteer minimaal 1 vacature"),
  availability: z.array(z.string()).min(1, "Selecteer minimaal 1 dag"),
  source: z.string().optional(),
  vacatureId: z.string().optional(),
});

export type VacatureFormData = z.infer<typeof vacatureSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
