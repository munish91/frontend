import React, { useState, useEffect } from 'react';

function toLocalInputDate(value) {
  if (value == null) return '';
  try {
    let v = value;
    if (typeof v === 'string' && /^\d+$/.test(v)) v = Number(v);
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
  } catch (e) {
    return '';
  }
}

export default function CreateUpdateTaskForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || '');
  const [startTime, setStartTime] = useState(toLocalInputDate(initial.startTime));
  const [endTime, setEndTime] = useState(toLocalInputDate(initial.endTime));
  const [owner, setOwner] = useState(initial.owner || '');
  const [tab, setTab] = useState(initial.tab || 'Task');

  useEffect(() => {
    setName(initial.name || '');
    setStartTime(toLocalInputDate(initial.startTime));
    setEndTime(toLocalInputDate(initial.endTime));
    setOwner(initial.owner || '');
    setTab(initial.tab || 'Task');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = initial.id || initial._id;

    onSubmit({
      id,
      name,
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      owner,
      tab,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input type="datetime-local" placeholder="Start" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />
        <input type="datetime-local" placeholder="End" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} className="border p-2 rounded col-span-2" />
        <select value={tab} onChange={(e) => setTab(e.target.value)} className="border p-2 rounded">
          <option>Planning</option>
          <option>Alerts</option>
          <option>Task</option>
          <option>Allowance</option>
        </select>
      </div>
      <div className="mt-2 flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
}
