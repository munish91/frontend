import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from './tasksSlice';
import CreateUpdateTaskForm from './CreateUpdateTaskForm';

const TABS = ['Planning', 'Alerts', 'Task', 'Allowance'];

export default function TasksView() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.tasks);
  const [activeTab, setActiveTab] = useState('Task');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    dispatch(fetchTasks({ tab: activeTab, search: '' }));
  }, [dispatch, activeTab]);

  const onCreate = async (data) => {
    await dispatch(createTask(data));
    await dispatch(fetchTasks({ tab: activeTab, search: searchName.trim() }));
    setShowForm(false);
  };

  const onUpdate = async (data) => {
    await dispatch(updateTask(data));
    await dispatch(fetchTasks({ tab: activeTab, search: searchName.trim() }));
    setEditing(null);
    setShowForm(false);
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    await dispatch(deleteTask(id));
    await dispatch(fetchTasks({ tab: activeTab, search: searchName.trim() }));
  };

  const rows = list;

  function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button type="button" key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1 rounded ${activeTab===t? 'bg-blue-600 text-white':'bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
          
          {status === 'loading' && list.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 ml-4">
              <svg className="h-4 w-4 animate-spin mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Refreshing...
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input placeholder="Search by name" value={searchName} onChange={(e)=>setSearchName(e.target.value)} className="border p-1 rounded" />
          <button type="button" onClick={() => dispatch(fetchTasks({ tab: activeTab, search: searchName.trim() }))} className="bg-gray-300 px-3 py-1 rounded">Search</button>
          <button type="button" onClick={() => { setSearchName(''); dispatch(fetchTasks({ tab: activeTab, search: '' })); }} className="bg-gray-200 px-3 py-1 rounded">Clear</button>
          <div className="ml-auto">
            <button type="button" onClick={() => { setShowForm(true); setEditing(null); }} className="bg-blue-600 text-white px-3 py-1 rounded">Create</button>
          </div>
        </div>
      </div>

      {showForm && (
        <CreateUpdateTaskForm
          initial={editing || { tab: activeTab }}
          onSubmit={editing ? onUpdate : onCreate}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="bg-white rounded shadow p-3">
        <h3 className="font-semibold mb-2">{activeTab} - Tasks</h3>
        {status === 'failed' && <p className="text-red-600">Error: {error}</p>}
        
        {status === 'loading' && list.length === 0 && (
          <p>Loading...</p>
        )}
        <div className="mb-2" />

        <table className="w-full table-auto transition-opacity duration-150" style={{ opacity: status === 'loading' && list.length > 0 ? 0.9 : 1 }}>
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">End Time</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.name}</td>
                <td className="p-2">{formatDate(t.endTime)}</td>
                <td className="p-2">{formatDate(t.startTime)}</td>
                <td className="p-2">{t.owner}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setEditing(t); setShowForm(true); }} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                    <button type="button" onClick={() => onDelete(t.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
