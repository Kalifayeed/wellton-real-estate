export default function MapEmbed({ address, mapEmbedUrl }: { address: string; mapEmbedUrl?: string | null }) {
  const src =
    mapEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="overflow-hidden rounded-card border border-stone-200">
      <iframe
        title={`Map of ${address}`}
        src={src}
        className="h-[360px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
