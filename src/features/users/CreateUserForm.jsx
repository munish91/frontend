import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from './usersSlice';

export default function CreateUserForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    await dispatch(createUser({ name, email }));
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded flex-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
    </form>
  );
}
