import React, { useState, useEffect } from 'react';

export default function OpsDashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, blocked: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('creative');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`),
        fetch(`${API_URL}/api/stats`)
      ]);

      if (!tasksRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');

      const tasksData = await tasksRes.json();
      const statsData = await statsRes.json();

      setTasks(tasksData.tasks);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': '#10b981',
      'Planning': '#6366f1',
      'In Review': '#f59e0b',
      'Blocked': '#ef4444',
      'Completed': '#10b981'
    };
    return colors[status] || '#888';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Loading your Notion data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>
        Error: {error}. Make sure your API key and database ID are correct.
      </div>
    );
  }

  return (
    <div style={{ padding: '0', background: 'var(--color-background-tertiary)', minHeight: '100vh', display: 'flex' }}>
      <div style={{ width: '220px', background: 'var(--color-background-primary)', borderRight: '0.5px solid var(--color-border-tertiary)', padding: '1.5rem 1rem', position: 'sticky', top: 0, height: '100vh' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '500', margin
