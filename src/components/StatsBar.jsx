const stats = [
  { number: '01', title: '100% Pure', subtitle: 'Handpicked saffron' },
  { number: '02', title: '50+ years', subtitle: 'A family legacy' },
  { number: '03', title: 'Worldwide', subtitle: 'Domestic & international shipping' },
  { number: '04', title: '7 day', subtitle: 'Money return promise' },
];

export default function StatsBar() {
  return (
    <section className="border-y border-[#e1d9cd] bg-[#fffdf8] py-6 sm:py-9">
      <div className="page-wrap grid grid-cols-2 gap-0 divide-x divide-[#e1d9cd] lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.number}
            className={`px-3 py-3 text-center sm:px-4 sm:py-2 lg:px-8 ${
              i >= 2 ? 'border-t border-[#e1d9cd] lg:border-t-0' : ''
            }`}
          >
            <span className="text-xs font-semibold text-[#a6553b]">{stat.number}</span>
            <h3 className="mt-0.5 font-display text-base text-[#292d28] sm:mt-1 sm:text-lg">{stat.title}</h3>
            <p className="mt-0.5 text-[11px] leading-tight text-ink-muted sm:text-xs">{stat.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
