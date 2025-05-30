
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import TaskList from './tasks/TaskList';
import TaskForm from './tasks/TaskForm';
import UserList from './users/UserList';
import UserForm from './users/UserForm';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id/edit" element={<TaskForm />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
