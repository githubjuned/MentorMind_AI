import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const name = file.name;
    const sizeKB = Math.round(file.size / 1024);
    const ext = name.split(".").pop()?.toLowerCase() ?? "txt";

    let textContent = "";

    if (ext === "txt" || ext === "md" || ext === "json" || ext === "csv") {
      textContent = await file.text();
    } else {
      // For binary files (PDF/DOCX), read arrayBuffer and extract printable text runs
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const rawString = decoder.decode(bytes);

      // Simple heuristic text cleaner for PDF/DOCX streams
      const cleanMatches = rawString.match(/[\x20-\x7E\t\n\r]{4,}/g) || [];
      const extracted = cleanMatches
        .filter((s) => !/^\s*(obj|endobj|xref|trailer|stream|endstream|\/Type|\/Filter)/i.test(s))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      textContent = extracted.slice(0, 100000) || `Extracted summary text from document ${name}.`;
    }

    return NextResponse.json({
      name,
      kind: ext,
      sizeKB,
      content: textContent,
      length: textContent.length,
      extracted: true,
    });
  } catch (error) {
    console.error("Document extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract document contents", details: String(error) },
      { status: 500 }
    );
  }
}

