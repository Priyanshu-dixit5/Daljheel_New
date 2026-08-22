import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <article className="bg-cream-light py-12 lg:py-16">
      <div className="page-wrap max-w-3xl">
        <p className="text-sm text-ink-muted">
          <Link to="/" className="hover:text-gold">Home</Link>
          {' / '}
          Terms & Condition
        </p>
        <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">Terms & Conditions</h1>
        <p className="mt-2 text-ink-muted">Use of Our Website and Services</p>

        <div className="prose-legal mt-8 space-y-6 text-[15px] leading-relaxed text-ink-muted">
          <p>
            Welcome to Daljheel Foodmart. By accessing and using our website, you agree to comply with
            the following Terms & Conditions. Please read them carefully before making any purchase.
          </p>

          <section>
            <h2 className="font-display text-xl text-ink">General Use</h2>
            <p className="mt-2">
              Daljheel Foodmart provides this website to offer high-quality food and wellness products.
              By using our services, you confirm that you are at least 18 years old or have parental
              guidance to make purchases.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Product Information</h2>
            <p className="mt-2">
              We strive to provide accurate product details, descriptions, and images. However, minor
              variations in color, size, or packaging may occur. Daljheel Foodmart reserves the right to
              update or discontinue products without prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Orders & Payments</h2>
            <p className="mt-2">
              All orders are subject to acceptance and availability. Payments must be made through
              secure payment gateways. Daljheel Foodmart is not responsible for delays or errors caused
              by third-party payment processors.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Shipping & Delivery</h2>
            <p className="mt-2">
              We aim to deliver orders promptly. However, delivery times may vary due to location,
              courier services, or unforeseen circumstances. Daljheel Foodmart is not liable for delays
              beyond our control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Returns & Refunds</h2>
            <p className="mt-2">
              Returns and refunds are processed as per our Return Policy. Products once opened or used
              may not be eligible for return.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Limitation of Liability</h2>
            <p className="mt-2">
              Daljheel Foodmart is not responsible for damages, losses, or issues arising from the use of
              our website or products, except as required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Changes to Terms</h2>
            <p className="mt-2">
              We may update these Terms & Conditions at any time. Continued use of our website means you
              agree to the latest version.
            </p>
          </section>

          <p>
            By shopping with Daljheel Foodmart, you accept these terms and agree to follow them.
          </p>
        </div>
      </div>
    </article>
  );
}
