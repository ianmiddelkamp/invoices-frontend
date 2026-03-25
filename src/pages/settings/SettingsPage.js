import { useEffect, useState } from 'react';
import { getBusinessProfile, updateBusinessProfile } from '../../api/businessProfile';

const EMPTY = {
  name: '', email: '', phone: '',
  address1: '', address2: '', city: '', state: '', postcode: '', country: '',
  hst_number: '',
};

function Field({ label, name, value, onChange, type = 'text', placeholder, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBusinessProfile()
      .then((p) => setForm({
        name:       p.name       ?? '',
        email:      p.email      ?? '',
        phone:      p.phone      ?? '',
        address1:   p.address1   ?? '',
        address2:   p.address2   ?? '',
        city:       p.city       ?? '',
        state:      p.state      ?? '',
        postcode:   p.postcode   ?? '',
        country:    p.country    ?? '',
        hst_number: p.hst_number ?? '',
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateBusinessProfile(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Business Settings</h2>
        <p className="text-sm text-gray-500 mt-1">This information appears on your invoices.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">Settings saved.</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">

        {/* Business info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Business</h3>
          <div className="space-y-4">
            <Field label="Business Name" name="name" value={form.name} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} type="tel" />
            </div>
            <Field
              label="HST Number"
              name="hst_number"
              value={form.hst_number}
              onChange={handleChange}
              placeholder="e.g. 123456789 RT0001"
              hint="Optional — printed on invoices when provided."
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Address</h3>
          <div className="space-y-3">
            <Field label="Street Address" name="address1" value={form.address1} onChange={handleChange} />
            <Field label="Address Line 2" name="address2" value={form.address2} onChange={handleChange} placeholder="Suite, unit, etc." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" name="city" value={form.city} onChange={handleChange} />
              <Field label="Province / State" name="state" value={form.state} onChange={handleChange} />
              <Field label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} />
              <Field label="Country" name="country" value={form.country} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
