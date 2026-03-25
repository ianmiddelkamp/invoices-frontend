import { useEffect, useState } from 'react';
import { getProjects } from '../../api/projects';
import { useTimer } from '../../context/TimerContext';
import { formatElapsed } from '../../utils/dates';

export default function TimerPage() {
  const { session, elapsed, projectId, description, loading, setProjectId, changeDescription, start, stop, cancel } = useTimer();
  const [projects, setProjects] = useState([]);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects().then(setProjects).catch((e) => setError(e.message));
  }, []);

  async function handleStart() {
    if (!projectId) return;
    try {
      await start(projectId);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleStop() {
    try {
      await stop(projectId, description);
      setStopping(false);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCancel() {
    if (!window.confirm('Discard this session without saving a time entry?')) return;
    try {
      await cancel();
      setStopping(false);
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Timer</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-8 space-y-6">

        {/* Clock display */}
        <div className="text-center">
          <p className="text-6xl font-mono font-semibold text-gray-800 tracking-widest">
            {formatElapsed(elapsed)}
          </p>
          {session && (
            <p className="mt-2 text-sm text-gray-500">
              {session.project?.name}{session.project?.client ? ` — ${session.project.client.name}` : ''}
            </p>
          )}
        </div>

        {/* Project picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={!!session && !stopping}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}{p.client ? ` — ${p.client.name}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        {(session || stopping) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What are you working on?
            </label>
            <textarea
              value={description}
              onChange={(e) => changeDescription(e.target.value)}
              placeholder="Describe the work…"
              rows={8}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {session && !stopping && (
              <p className="text-xs text-gray-400 mt-1">Saved automatically as you type</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!session && (
            <button
              onClick={handleStart}
              disabled={!projectId}
              className="flex-1 bg-indigo-600 text-white font-medium rounded-md px-4 py-2.5 hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              Start timer
            </button>
          )}

          {session && !stopping && (
            <button
              onClick={() => setStopping(true)}
              className="flex-1 bg-red-600 text-white font-medium rounded-md px-4 py-2.5 hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          )}

          {session && stopping && (
            <>
              <button
                onClick={handleStop}
                className="flex-1 bg-green-600 text-white font-medium rounded-md px-4 py-2.5 hover:bg-green-700 transition-colors"
              >
                Save time entry
              </button>
              <button
                onClick={() => setStopping(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Keep running
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-700"
              >
                Discard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
