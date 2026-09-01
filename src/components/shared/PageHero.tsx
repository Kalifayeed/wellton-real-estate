interface Props {
  kicker: string;
  title: string;
  description?: string;
  tone?: 'brand' | 'gold' | 'stone' | 'light';
}

export default function PageHero({ kicker, title, description, tone = 'light' }: Props) {
  const toneClasses = {
    brand: 'bg-brand-950 text-white',
    gold: 'bg-gold-600 text-white',
    stone: 'bg-stone-900 text-white',
    light: 'bg-stone-100 text-stone-900',
  }[tone];

  const kickerClass = tone === 'light' ? 'heading-kicker' : 'heading-kicker !text-brand-300';
  const textClass = tone === 'light' ? 'text-stone-900' : 'text-white';
  const descClass = tone === 'light' ? 'text-stone-600' : 'text-white/80';

  return (
    <section className={`border-b border-stone-200 py-12 sm:py-16 ${toneClasses}`}>
      <div className="page-container">
        <p className={kickerClass}>{kicker}</p>
        <h1 className={`max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-4xl ${textClass}`}>{title}</h1>
        {description && <p className={`mt-4 max-w-2xl text-lg ${descClass}`}>{description}</p>}
      </div>
    </section>
  );
}
