import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { readPrivateDocument } from '@/lib/storage';

// Serves private application documents to authenticated staff only.
// Never exposes documents through public URLs.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: session.sub }, select: { isActive: true, role: true },
  });
  if (!user?.isActive) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const doc = await prisma.applicationDocument.findUnique({
    where: { id }, include: { application: { select: { assignedToId: true } } },
  });
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (user.role === 'AGENT' && doc.application.assignedToId !== session.sub) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const buffer = await readPrivateDocument(doc.storedPath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': doc.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.fileName)}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File unavailable' }, { status: 404 });
  }
}
