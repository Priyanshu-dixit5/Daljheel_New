import { Link } from 'react-router-dom';

export default function SaffronCTA() {
  return (
    <section className="bg-purple py-8 lg:py-12">
      <div className="page-wrap">
        <Link to="/product/daljheel-saffron" className="block overflow-hidden rounded-lg gold-border">
          <img
            src="/images/banner-saffron.png"
            alt="Daljheel Saffron — shop now, ₹299"
            className="h-auto w-full object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
