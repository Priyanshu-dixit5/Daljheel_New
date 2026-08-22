import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <article className="bg-cream-light py-12 lg:py-16">
      <div className="page-wrap max-w-3xl">
        <p className="text-sm text-ink-muted">
          <Link to="/" className="hover:text-gold">Home</Link>
          {' / '}
          Privacy Policy
        </p>
        <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">Privacy Policy</h1>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-muted">
          <p>
            Daljheel Foodmart values the trust of our customers and is committed to protecting their
            privacy. This Privacy Policy explains how we collect, use, and safeguard your personal
            information when you visit our website or purchase our products.
          </p>
          <p>
            When you interact with Daljheel Foodmart, we may collect details such as your name, email
            address, phone number, billing/shipping address, and payment information. This data is used
            solely to process your orders, ensure timely delivery, provide customer support, and enhance
            your overall shopping experience.
          </p>
          <p>
            We may also collect non-personal information like browser type, device details, and website
            usage patterns to improve our website performance and user experience. Daljheel Foodmart
            never sells, rents, or shares your personal information with third parties, except when
            required for payment processing, shipping, or legal compliance.
          </p>
          <p>
            All sensitive information is encrypted and secured with industry-standard measures to prevent
            unauthorized access. However, please note that no online transmission or storage system is
            100% secure.
          </p>
          <p>
            By using our website, you consent to our data practices as outlined in this Privacy Policy.
            Daljheel Foodmart reserves the right to update or modify this policy at any time, and we
            encourage customers to review it periodically.
          </p>
          <p>
            Your trust matters to us, and we are dedicated to keeping your information safe.
          </p>
        </div>
      </div>
    </article>
  );
}
