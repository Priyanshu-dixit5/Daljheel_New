import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OrderConfirm() {
  const { orderCode } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${orderCode}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setOrder);
  }, [orderCode]);

  return (
    <section className="page-wrap py-16 text-center">
      <p className="section-label mb-3">Thank you</p>
      <h1 className="section-heading mb-4">Order {orderCode}</h1>
      <p className="mx-auto max-w-md text-ink-muted">
        Your order has been created. WhatsApp should have opened with the order message.
        Delivery will be confirmed on WhatsApp.
      </p>
      {order && (
        <div className="mx-auto mt-6 max-w-sm border border-gold/25 bg-white p-5 text-left text-sm">
          <p className="flex justify-between text-ink">
            <span>Status</span>
            <span className="font-medium">{order.status}</span>
          </p>
          <p className="mt-2 flex justify-between text-ink">
            <span>Total</span>
            <span className="font-medium">₹{order.total}</span>
          </p>
          {order.paymentLabel && (
            <p className="mt-2 flex justify-between text-ink-muted">
              <span>Payment</span>
              <span>{order.paymentLabel}</span>
            </p>
          )}
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
        {isAuthenticated && (
          <Link to={`/account/orders/${orderCode}`} className="btn-outline">
            View in My Orders
          </Link>
        )}
      </div>
    </section>
  );
}
