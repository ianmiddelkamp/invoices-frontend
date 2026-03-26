import { useRef, useState } from 'react';
import { parseSow } from '../api/sowImport';
import { createTaskGroup, createTask } from '../api/tasks';

export default function SowImport({ projectId, onImported }) {
  const [open, setOpen] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(null); // parsed groups before commit
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setParsing(true);
    setError(null);
    setPreview(null);
    try {
      const groups = await parseSow(projectId, file);
      setPreview(groups);
    } catch (e) {
      setError(e.message);
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeGroup(idx) {
    setPreview((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeTask(groupIdx, taskIdx) {
    setPreview((prev) =>
      prev.map((g, i) =>
        i === groupIdx ? { ...g, tasks: g.tasks.filter((_, j) => j !== taskIdx) } : g
      )
    );
  }

  function updateGroupTitle(idx, title) {
    setPreview((prev) => prev.map((g, i) => (i === idx ? { ...g, title } : g)));
  }

  function updateTaskTitle(groupIdx, taskIdx, title) {
    setPreview((prev) =>
      prev.map((g, i) =>
        i === groupIdx
          ? { ...g, tasks: g.tasks.map((t, j) => (j === taskIdx ? { ...t, title } : t)) }
          : g
      )
    );
  }

  async function handleImport() {
    if (!preview?.length) return;
    setImporting(true);
    setError(null);
    try {
      for (const group of preview) {
        const created = await createTaskGroup(projectId, { title: group.title });
        for (const task of group.tasks) {
          await createTask(projectId, created.id, { title: task.title });
        }
      }
      setPreview(null);
      setOpen(false);
      onImported?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setImporting(false);
    }
  }

  function handleCancel() {
    setPreview(null);
    setError(null);
    setOpen(false);
  }

  return (
    <div className="mt-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          + Import from SOW
        </button>
      ) : (
        <div className="border border-indigo-200 rounded-lg bg-indigo-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">Import from Statement of Work</h4>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
          )}

          {!preview && !parsing && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Upload a <strong>.md</strong>, <strong>.txt</strong>, or <strong>.docx</strong> file.
                Claude will extract task groups and tasks — you can review before importing.
              </p>
              <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 rounded-lg px-6 py-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-100 transition-colors"
              >
                <p className="text-sm text-indigo-600 font-medium">Click to choose file</p>
                <p className="text-xs text-gray-400 mt-1">.md · .txt · .docx</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".md,.txt,.docx"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {parsing && (
            <div className="text-center py-8">
              <p className="text-sm text-indigo-700 font-medium">Analysing document…</p>
              <p className="text-xs text-gray-400 mt-1">Claude is parsing your SOW</p>
            </div>
          )}

          {preview && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Review and edit before importing. Remove anything you don't need.
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {preview.map((group, gi) => (
                  <div key={gi} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        value={group.title}
                        onChange={(e) => updateGroupTitle(gi, e.target.value)}
                        className="flex-1 font-semibold text-sm border-b border-gray-200 outline-none focus:border-indigo-400 bg-transparent py-0.5"
                      />
                      <button
                        onClick={() => removeGroup(gi)}
                        className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
                      >
                        Remove group
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {group.tasks.map((task, ti) => (
                        <li key={ti} className="flex items-center gap-2">
                          <span className="text-gray-300 text-xs">—</span>
                          <input
                            value={task.title}
                            onChange={(e) => updateTaskTitle(gi, ti, e.target.value)}
                            className="flex-1 text-sm border-b border-gray-100 outline-none focus:border-indigo-400 bg-transparent py-0.5"
                          />
                          <button
                            onClick={() => removeTask(gi, ti)}
                            className="text-red-300 hover:text-red-500 text-xs flex-shrink-0"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleImport}
                  disabled={importing || !preview.length}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {importing ? 'Importing…' : `Import ${preview.length} group${preview.length !== 1 ? 's' : ''}`}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Choose different file
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
