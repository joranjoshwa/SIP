import { redirect } from "next/navigation";
import { Role } from "@/src/types/user";
import { Role as UserRole } from "@/src/enums/role";
import { extractRoleFromToken } from "@/src/utils/token";
import UserDashboardHome from "@/src/components/ui/UserDashboardHome";
import RootDashboardHome from "@/src/components/ui/RootDashboardHome";
import { cookies } from "next/headers";

async function getRoleFromCookies(): Promise<Role | null> {
    const token = (await cookies()).get("token")?.value;
    const role = extractRoleFromToken(token) as Role;
    if (UserRole[role]) return UserRole[role];
    return null;
}

export default async () => {
    const role = await getRoleFromCookies();

    return role === UserRole.ROOT ? <RootDashboardHome /> : <UserDashboardHome />;
}
