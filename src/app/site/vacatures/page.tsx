import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function VacaturesPage() {
  const vacatures = await prisma.vacature.findMany({
    where: { isActive: true },
    orderBy: { vacatureNumber: "asc" },
    select: { id: true, title: true, slug: true, location: true, vacatureNumber: true, _count: { select: { applications: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vacatures</h2>
        <p className="text-sm text-muted-foreground">{vacatures.length} openstaande vacatures</p>
      </div>

      <div className="grid gap-3">
        {vacatures.map((v: any) => (
          <Link key={v.id} href={`/site/vacatures/${v.id}/apply`} className="p-4 border rounded hover:shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.location}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>#{v.vacatureNumber}</div>
                <div>{v._count?.applications ?? 0} sollicitaties</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
