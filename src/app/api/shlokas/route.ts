import { NextRequest, NextResponse } from "next/server";
import shlokaData from "@/data/shlokas.json";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  let filteredShlokas = shlokaData.shlokas;

  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredShlokas = filteredShlokas.filter(
      (shloka) =>
        shloka.transliteration.toLowerCase().includes(lowerSearch) ||
        shloka.sanskrit.includes(search) ||
        shloka.names.some(
          (name) =>
            name.transliteration.toLowerCase().includes(lowerSearch) ||
            name.meaning.toLowerCase().includes(lowerSearch) ||
            name.sanskrit.includes(search)
        )
    );
  }

  const total = filteredShlokas.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedShlokas = filteredShlokas.slice(start, start + limit);

  return NextResponse.json({
    metadata: shlokaData.metadata,
    shlokas: paginatedShlokas,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}
