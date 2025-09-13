
import { NextResponse } from "next/server";
import { mockUsers, mockPosts } from "@/app/api/mock";

export async function GET(request, { params }) {
  const id = params.id;
  const user = mockUsers.find((user) => user.username === id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const posts = mockPosts.filter((post) => post.userId === id);

  return NextResponse.json({ user: { ...user, type: user.constructor.name.toLowerCase() }, posts });
}
