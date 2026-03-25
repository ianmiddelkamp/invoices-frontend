import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getProjects } from '../../api/projects';
import { createTimeEntry, updateTimeEntry, getTimeEntries } from '../../api/timeEntries';
import PageHeader from '../../components/PageHeader';

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { project_id: '', date: today(), hours: '', description: '' };

export default function TimesheetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    ...EMPTY,
    project_id: location.state?.projectId || '',
  });
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProjects()
      .then((ps) => {
        setProjects(ps);
        if (!isEdit && !form.project_id && ps.length > 0) {
          setForm((prev) => ({ ...prev, project_id: String(ps[0].id) }));
        }
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEdit || !form.project_id) return;
    // Load the specific entry by fetching the project's entries and finding it
    getTimeEntries(form.project_id)
      .then((entries) => {
        const entry = entries.find((e) => String(e.id) === String(id));
        if (entry) {
          setForm({
            project_id: String(form.project_id),
            date: entry.date,
            hours: entry.hours,
            description: entry.description || '',
          });
        }
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, form.project_id]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { project_id, ...entryData } = form;
    try {
      if (isEdit) {
        await updateTimeEntry(project_id, id, entryData);
      } else {
        await createTimeEntry(project_id, entryData);
      }
      navigate('/timesheets');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <PageHeader title={isEdit ? 'Edit Time Entry' : 'Log Time'} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
          <select
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{p.client ? ` — ${p.client.name}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hours *</label>
          <input
            type="number"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            required
            min="0.25"
            max="24"
            step="0.25"
            placeholder="e.g. 2.5"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="What did you work on?"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Log Time'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/timesheets')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
