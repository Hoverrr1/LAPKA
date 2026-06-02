import { AnimatePresence, motion } from 'framer-motion';
import {
  FaBoxOpen,
  FaCreditCard,
  FaMapMarkerAlt,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import { translateProductText } from '../config/productTranslations';

const statusLabels = {
  pending: 'Очікує обробки',
  processing: 'В обробці',
  shipped: 'Відправлено',
  delivered: 'Доставлено',
  cancelled: 'Скасовано',
};

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-violet-100 text-violet-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const paymentLabels = {
  credit_card: 'Банківська картка',
  mastercard: 'Mastercard',
  paypal: 'PayPal',
  cash_on_delivery: 'Оплата при отриманні',
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-700">{value || 'Не вказано'}</p>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft sm:p-5">
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-primary"><Icon /></span>
      <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-slate-700">{title}</h3>
    </div>
    {children}
  </section>
);

const OrderDetailsModal = ({ order, onClose }) => {
  const shipping = order?.shippingAddress || {};
  const items = order?.orderItems || order?.items || [];
  const phone = shipping.phone || order?.phone || order?.user?.phone;

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/80 bg-slate-50 p-4 shadow-2xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Деталі замовлення</p>
                  <h2 className="mt-2 break-all text-xl font-extrabold text-slate-900 sm:text-2xl">#{order._id}</h2>
                  <p className="mt-2 text-sm text-slate-500">Створено: {new Date(order.createdAt).toLocaleString('uk-UA')}</p>
                </div>
                <button onClick={onClose} className="rounded-full bg-white p-3 text-slate-500 shadow-soft transition hover:bg-slate-100 hover:text-slate-900" aria-label="Закрити"><FaTimes /></button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Section icon={FaUser} title="Інформація про клієнта">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Ім'я" value={order.user?.name} />
                    <InfoRow label="Email" value={order.user?.email} />
                    <InfoRow label="Телефон" value={phone} />
                  </div>
                </Section>

                <Section icon={FaMapMarkerAlt} title="Доставка">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Адреса" value={shipping.address} />
                    <InfoRow label="Місто" value={shipping.city} />
                    <InfoRow label="Поштовий індекс" value={shipping.postalCode} />
                    <InfoRow label="Країна" value={shipping.country} />
                  </div>
                </Section>

                <Section icon={FaCreditCard} title="Оплата">
                  <InfoRow label="Спосіб оплати" value={paymentLabels[order.paymentMethod] || order.paymentMethod} />
                </Section>

                <Section icon={FaBoxOpen} title="Статус">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[order.status] || 'bg-slate-100 text-slate-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </Section>
              </div>

              <section className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
                <div className="border-b border-slate-100 p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.12em] text-slate-700">Замовлені товари</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item._id || item.product?._id || item.name} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={item.image || item.product?.image || '/placeholder-pet.svg'} alt="" className="h-14 w-14 flex-none rounded-xl bg-emerald-50 object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">{translateProductText(item.name || item.product?.name || 'Товар')}</p>
                          <p className="mt-1 text-xs text-slate-400">Кількість: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-slate-700">{Number(item.price).toFixed(2)} ₴ / шт.</p>
                        <p className="mt-1 text-sm font-extrabold text-primary">{(Number(item.price) * Number(item.quantity)).toFixed(2)} ₴</p>
                      </div>
                    </div>
                  ))}
                  {!items.length && <p className="p-5 text-sm text-slate-400">Товари не знайдено.</p>}
                </div>
              </section>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-white shadow-medium">
                <span className="text-sm font-bold uppercase tracking-[0.12em]">Загальна сума</span>
                <span className="text-2xl font-extrabold">{Number(order.total).toFixed(2)} ₴</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
