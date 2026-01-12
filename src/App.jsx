import React from 'react';
import TasksView from './features/tasks/TasksView';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Fullstack GraphQL App</h1>
            <TasksView />
            <hr className="my-4" />
      </div>
    </div>
  );
}
