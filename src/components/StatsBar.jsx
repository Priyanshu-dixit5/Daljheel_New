const stats = [
  { number: '01', title: '100% Pure', subtitle: 'Handpicked saffron' },
  { number: '02', title: 'Worldwide', subtitle: 'Domestic & international shipping' },
  { number: '03', title: '7 day', subtitle: 'Money return promise' },
];

export default function StatsBar() {
  return (
    <section className="border-y border-[#e1d9cd] bg-[#fffdf8] py-6 sm:py-9">
      <div className="page-wrap grid grid-cols-1 gap-0 divide-y divide-[#e1d9cd] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {stats.map((stat, i) => (
          <div
            key={stat.number}
            className={`px-3 py-3 text-center sm:px-4 sm:py-2 lg:px-8 ${
              ''
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
