import test from 'node:test';
import assert from 'node:assert/strict';
import { savePublicImage, savePrivateDocument, readPrivateDocument } from '../src/lib/storage';
import { uploadFormError } from '../src/lib/upload-limits';

test('cloud media stays public, documents stay private, and missing cloud config fails closed', async () => {
  const oldEnv = { ...process.env };
  const oldFetch = globalThis.fetch;
  const requests: { url: string; init?: RequestInit }[] = [];
  process.env.SUPABASE_URL = 'https://test-project.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-not-a-real-key';
  delete process.env.SUPABASE_PUBLIC_BUCKET;
  delete process.env.SUPABASE_PRIVATE_BUCKET;
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init });
    return new Response(init?.method === 'POST' ? '{}' : 'private document', { status: 200 });
  };
  try {
    const photo = new File(['image bytes'], 'photo.jpg', { type: 'image/jpeg' });
    const media = await savePublicImage(photo);
    assert.match(media.url, /^https:\/\/test-project\.supabase\.co\/storage\/v1\/object\/public\/wellton-media\/properties\//);
    assert.equal(requests[0].init?.method, 'POST');
    const doc = await savePrivateDocument(new File(['pdf'], 'id.pdf', { type: 'application/pdf' }), 'application-123');
    assert.match(doc.storedPath, /^supabase:documents\/application-123-/);
    assert.match(requests[1].url, /\/object\/wellton-documents\/documents\//);
    assert.equal((await readPrivateDocument(doc.storedPath)).toString(), 'private document');
    assert.match(requests[2].url, /\/object\/authenticated\/wellton-documents\/documents\//);
    assert.equal(requests[2].init?.cache, 'no-store');
    const before = requests.length;
    await assert.rejects(readPrivateDocument('supabase:documents/../secret'), /Invalid document path/);
    await assert.rejects(savePublicImage(new File(['<script>'], 'bad.svg', { type: 'image/svg+xml' })), /Unsupported image/);
    assert.equal(requests.length, before);
    globalThis.fetch = async () => new Response('', { status: 403 });
    await assert.rejects(savePublicImage(photo), /Upload failed \(403\)/);
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.VERCEL = '1';
    await assert.rejects(savePublicImage(photo), /Persistent storage is not configured/);
  } finally {
    globalThis.fetch = oldFetch;
    for (const key of Object.keys(process.env)) if (!(key in oldEnv)) delete process.env[key];
    Object.assign(process.env, oldEnv);
  }
});

test('upload budget includes all files and UTF-8 text together', () => {
  const data = new FormData();
  data.append('photo', new File([new Uint8Array(2_000_000)], 'a.jpg'));
  assert.equal(uploadFormError(data), null);
  data.append('photo', new File([new Uint8Array(2_000_000)], 'b.jpg'));
  assert.equal(uploadFormError(data), null);
  data.append('description', 'é');
  assert.match(uploadFormError(data) || '', /under 4 MB/);
});
