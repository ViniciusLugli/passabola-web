
import { NextResponse } from "next/server";
import { mockUsers } from "@/app/api/mock";

export async function GET() {
  const usersWithType = mockUsers.map(user => ({ ...user, type: user.constructor.name.toLowerCase() }));
  return NextResponse.json(usersWithType);
}
