import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, UserCircle, Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";

const roleIcons = {
  SUPER_ADMIN: ShieldCheck,
  ADMIN: Shield,
  MANAGER: UserCircle,
};

const roleLabels = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
};

const roleColors = {
  SUPER_ADMIN: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  ADMIN: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  MANAGER: "bg-green-500/10 text-green-700 border-green-500/20",
};

export default async function UsersManagementPage() {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can access this page
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const currentUser = session.user;
  const isAdmin = currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN";

  return (
    <main className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Gebruikers</h1>
          <p className="text-muted-foreground mt-1">
            Beheer administrators en managers
          </p>
        </div>
        {isAdmin && (
          <Link href="/settings/users/new">
            <Button className="gap-2 font-bold rounded-full">
              <Plus className="h-4 w-4" />
              Nieuwe Gebruiker
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Super Admins
                </p>
                <p className="text-2xl font-black">
                  {users.filter((u) => u.role === "SUPER_ADMIN").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Admins</p>
                <p className="text-2xl font-black">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <UserCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Managers
                </p>
                <p className="text-2xl font-black">
                  {users.filter((u) => u.role === "MANAGER").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Rechten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Super Admin</p>
              <p className="text-sm text-muted-foreground">
                Volledige toegang tot alles
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Admin</p>
              <p className="text-sm text-muted-foreground">
                Kan gebruikers toevoegen en vacatures verwijderen
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <UserCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Manager</p>
              <p className="text-sm text-muted-foreground">
                Kan vacatures en sollicitaties beheren, maar geen gebruikers toevoegen of vacatures verwijderen
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-3">
        {users.map((user) => {
          const RoleIcon = roleIcons[user.role as keyof typeof roleIcons];
          const isCurrentUser = user.id === currentUser.id;

          return (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-muted rounded-xl">
                    <RoleIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">
                        {user.name || user.email.split("@")[0]}
                      </p>
                      {isCurrentUser && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Jij
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`font-bold ${
                      roleColors[user.role as keyof typeof roleColors]
                    }`}
                  >
                    {roleLabels[user.role as keyof typeof roleLabels]}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden md:block">
                    {new Date(user.createdAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
