import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClients, deleteClient } from '../../api/clients';
import PageHeader from '../../components/PageHeader';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this client?')) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="p-8">
      <PageHeader title="Clients" actionLabel="+ New Client" actionTo="/clients/new" />

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">No clients yet.</td>
                </tr>
              )}
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.contact || '—'}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-3">
                    <Link to={`/clients/${client.id}/edit`} className="text-indigo-600 hover:text-indigo-800">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
