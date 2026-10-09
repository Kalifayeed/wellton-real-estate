// Leave room for multipart framing below the host's 4.5 MB request limit.
export const MAX_FORM_BYTES = 4_000_000;

export function uploadFormError(data: FormData): string | null {
  let size = 0;
  for (const value of data.values()) {
    size += typeof value === 'string' ? new TextEncoder().encode(value).byteLength : value.size;
  }
  return size > MAX_FORM_BYTES
    ? 'The combined files and form details must be under 4 MB. Please choose fewer or smaller files.'
    : null;
}
