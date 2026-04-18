import { NextRequest, NextResponse } from "next/server";
import shlokaData from "@/data/shlokas.json";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shlokaId = parseInt(id, 10);
  const shloka = shlokaData.shlokas.find((s) => s.id === shlokaId);

  if (!shloka) {
    return NextResponse.json({ error: "Shloka not found" }, { status: 404 });
  }

  const currentIndex = shlokaData.shlokas.findIndex((s) => s.id === shlokaId);
  const prevShloka = currentIndex > 0 ? shlokaData.shlokas[currentIndex - 1] : null;
  const nextShloka =
    currentIndex < shlokaData.shlokas.length - 1
      ? shlokaData.shlokas[currentIndex + 1]
      : null;

  return NextResponse.json({
    shloka,
    navigation: {
      prev: prevShloka ? { id: prevShloka.id, number: prevShloka.number } : null,
      next: nextShloka ? { id: nextShloka.id, number: nextShloka.number } : null,
      current: currentIndex + 1,
      total: shlokaData.shlokas.length,
    },
  });
}
