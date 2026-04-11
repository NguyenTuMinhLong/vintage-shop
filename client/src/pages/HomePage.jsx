import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "French Workwear Jacket",
    price: "$168",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Selvedge Carpenter Pant",
    price: "$142",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Soft Tailored Coat",
    price: "$214",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  },
];

const collectionNotes = [
  "Rare denim",
  "Military tailoring",
  "Quiet leather",
  "Japanese basics",
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-14 md:space-y-24">
      <section className="grid gap-8 border-b border-[var(--line)] pb-10 lg:grid-cols-[120px_minmax(0,1fr)_260px] lg:items-start">
        <div className="hidden lg:flex lg:min-h-[42rem] lg:flex-col lg:justify-between">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Front Page
          </p>
          <p
            className="vertical-writing text-[2.75rem] uppercase tracking-[0.28em] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Vintage
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
              Curated archive. Daily arrivals.
            </p>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
              Since 2026
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_320px]">
            <div className="space-y-8">
              <h1
                className="max-w-5xl text-[clamp(3.8rem,9vw,8.25rem)] uppercase leading-[0.88] tracking-[0.02em] text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Quiet luxury for the well-worn wardrobe.
              </h1>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center border border-[var(--ink)] px-6 py-3 text-[11px] uppercase tracking-[0.28em] transition hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                >
                  Browse Inventory
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center border border-[var(--line-strong)] px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  Join Waitlist
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 border-l border-[var(--line)] pl-0 xl:pl-8">
              <p className="max-w-xs text-sm leading-7 text-[var(--muted)]">
                A vintage inventory storefront shaped like an editorial
                catalog. Discover tailored outerwear, washed denim, and soft
                utility pieces in an interface that feels more like a lookbook
                than a dashboard.
              </p>

              <div className="grid gap-3 border-t border-[var(--line)] pt-5 text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
                {collectionNotes.map((note) => (
                  <div key={note} className="flex items-center justify-between">
                    <span>{note}</span>
                    <span>01</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
                alt="Editorial vintage fashion hero"
                className="h-[31rem] w-full object-cover object-center md:h-[42rem]"
              />
            </div>

            <div className="grid gap-5">
              <div className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
                  alt="Close-up product styling"
                  className="h-60 w-full object-cover md:h-[18rem]"
                />
              </div>

              <div className="flex flex-col justify-between border border-[var(--line)] bg-[var(--paper)] p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
                    Current edit
                  </p>
                  <p
                    className="mt-3 text-3xl leading-tight text-[var(--ink)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Washed neutrals, work jackets, and lived-in denim.
                  </p>
                </div>

                <p className="mt-8 text-sm leading-7 text-[var(--muted)]">
                  Designed to echo the calm, image-led rhythm of a premium
                  fashion homepage while still pointing users into your product
                  catalog.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-t border-[var(--line)] pt-5 md:grid-cols-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
                New arrivals
              </p>
              <p
                className="mt-2 text-2xl text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                24 curated pieces
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
                Material focus
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Cotton twill, brushed wool, cracked leather, and hand-faded
                indigo.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
                Visual direction
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Clean borders, oversized typography, warm paper tones, and a
                magazine-style layout.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:min-h-[42rem] lg:flex-col lg:justify-between lg:pl-6">
          <p className="text-right text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Inventory Studio
          </p>
          <p
            className="self-end text-[2.75rem] uppercase tracking-[0.28em] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            01
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-end justify-between gap-6 border-b border-[var(--line)] pb-4">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
              Featured products
            </p>
            <h2
              className="text-3xl text-[var(--ink)] md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Selected Pieces
            </h2>
          </div>

          <Link
            to="/products"
            className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((item) => (
            <article key={item.id} className="group space-y-4">
              <div className="overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-[4/5] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3
                    className="text-xl text-[var(--ink)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.price}</p>
                </div>

                <button className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] transition hover:text-[var(--ink)]">
                  View
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-[var(--line)] pt-10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Studio note
          </p>
          <h1
            className="max-w-2xl text-4xl leading-tight text-[var(--ink)] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A homepage direction modeled after Front Office’s first-screen
            language, adapted to your vintage inventory brand.
          </h1>
        </div>

        <div className="flex flex-col justify-end gap-5">
          <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
            The redesign leans into the same qualities that make the reference
            page feel premium: restrained color, strong serif headlines,
            asymmetrical image blocks, and understated navigation.
          </p>
          <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
            I kept the downstream routes in place, so this is still your
            working React storefront, just with a much more fashion-editorial
            landing experience.
          </p>
        </div>
      </section>
    </div>
  );
}
