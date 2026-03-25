import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice, updateInvoice, downloadPdfUrl, regeneratePdf, sendInvoice } from '../../api/invoices';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent:    'bg-blue-100 text-blue-800',
  paid:    'bg-green-100 text-green-800',
};

const STATUS_TRANSITIONS = {
  pending: { label: 'Mark as Sent', next: 'sent' },
  sent:    { label: 'Mark as Paid', next: 'paid' },
  paid:    null,
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getInvoice(id)
      .then(setInvoice)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSendInvoice() {
    if (!window.confirm(`Send invoice to ${invoice.client?.email1}?`)) return;
    setSending(true);
    try {
      const res = await sendInvoice(id);
      alert(res.message);
    } catch (e) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleRegeneratePdf() {
    if (!window.confirm('Regenerate the PDF? This will overwrite the existing file.')) return;
    setRegenerating(true);
    try {
      await regeneratePdf(id);
      // Force browser to re-fetch the PDF by navigating to it
      window.open(downloadPdfUrl(id), '_blank');
    } catch (e) {
      alert(e.message);
    } finally {
      setRegenerating(false);
    }
  }

  async function handleStatusUpdate() {
    const transition = STATUS_TRANSITIONS[invoice.status];
    if (!transition) return;
    try {
      const updated = await updateInvoice(id, { status: transition.next });
      setInvoice(updated);
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (error)   return <div className="p-8 text-red-600">{error}</div>;
  if (!invoice) return null;

  const transition = STATUS_TRANSITIONS[invoice.status];

  return (
    <div className="p-8 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invoices')} className="text-sm text-gray-500 hover:text-gray-700">
            ← Invoices
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">{invoice.number}</h2>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[invoice.status]}`}>
            {invoice.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {transition && (
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              {transition.label}
            </button>
          )}
          <button
            onClick={handleSendInvoice}
            disabled={sending}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {sending ? 'Sending…' : 'Send Invoice'}
          </button>
          <a
            href={downloadPdfUrl(invoice.id)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Download PDF
          </a>
          <button
            onClick={handleRegeneratePdf}
            disabled={regenerating}
            className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {regenerating ? 'Regenerating…' : 'Regenerate PDF'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Invoice header */}
        <div className="p-6 border-b border-gray-200 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Client</p>
            <p className="font-medium text-gray-900">{invoice.client?.name}</p>
            {invoice.client?.contact_name && <p className="text-sm text-gray-500">{invoice.client.contact_name}</p>}
            {invoice.client?.email1 && <p className="text-sm text-gray-500">{invoice.client.email1}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Period</p>
            <p className="text-sm text-gray-700">
              {invoice.start_date && invoice.end_date
                ? `${invoice.start_date} – ${invoice.end_date}`
                : '—'}
            </p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1">Issued</p>
            <p className="text-sm text-gray-700">{invoice.created_at?.slice(0, 10)}</p>
          </div>
        </div>

        {/* Line items */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.invoice_line_items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-500">{item.time_entry?.date}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{item.time_entry?.project?.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{item.description || '—'}</td>
                <td className="px-6 py-3 text-sm text-gray-900 text-right">{parseFloat(item.hours).toFixed(2)}</td>
                <td className="px-6 py-3 text-sm text-gray-900 text-right">${parseFloat(item.rate).toFixed(2)}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">${parseFloat(item.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide mr-8">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${parseFloat(invoice.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
