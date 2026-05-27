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

  const getDepartmentColor = (dept) => {
    const colors = {
      'Creative': '#8b5cf6',
      'Operations': '#6366f1',
      'Technical': '#3b82f6',
      'Admin': '#888888'
    };
    return colors[dept] || '#888';
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
        <h2 style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 1.5rem 0' }}>YTLCC Ops</h2>
        <button onClick={() => setActiveTab('creative')} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: activeTab === 'creative' ? 'var(--color-background-secondary)' : 'transparent', border: 'none', borderLeft: activeTab === 'creative' ? '3px solid #6366f1' : 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '8px', borderRadius: '0' }}>
          Creative Ops
        </button>
        <button onClick={() => setActiveTab('work')} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: activeTab === 'work' ? 'var(--color-background-secondary)' : 'transparent', border: 'none', borderLeft: activeTab === 'work' ? '3px solid #6366f1' : 'none', cursor: 'pointer', fontSize: '13px', borderRadius: '0' }}>
          Work Ops
        </button>
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
          <button onClick={fetchData} style={{ width: '100%', padding: '8px 12px', fontSize: '12px', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '6px', cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '500', margin: '0 0 8px 0' }}>{activeTab === 'creative' ? 'Creative Ops' : 'Work Ops'}</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0' }}>Live from your Notion Command Center</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>Total Items</p>
            <p style={{ fontSize: '24px', fontWeight: '500', margin: '0' }}>{stats.total}</p>
          </div>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>In Progress</p>
            <p style={{ fontSize: '24px', fontWeight: '500', color: '#10b981', margin: '0' }}>{stats.inProgress}</p>
          </div>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>Blocked</p>
            <p style={{ fontSize: '24px', fontWeight: '500', color: '#ef4444', margin: '0' }}>{stats.blocked}</p>
          </div>
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>Completed</p>
            <p style={{ fontSize: '24px', fontWeight: '500', color: '#10b981', margin: '0' }}>{stats.completed}</p>
          </div>
        </div>

        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', margin: '0' }}>All Tasks</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-background-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                  <th style={{ padding: '12px 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Task Name</th>
                  <th style={{ padding: '12px 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '12px 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Department</th>
                  <th style={{ padding: '12px 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Assignee</th>
                  <th style={{ padding: '12px 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Due Date</th>
                  <th style={{ padding: '12px 1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.map(task => (
                    <tr key={task.id} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                      <td style={{ padding: '12px 1rem', fontWeight: '500' }}>{task.name}</td>
                      <td style={{ padding: '12px 1rem' }}>
                        <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: getStatusColor(task.status) + '22', color: getStatusColor(task.status), fontWeight: '500' }}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 1rem', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {task.department || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 1rem', fontSize: '12px' }}>{task.assignee}</td>
                      <td style={{ padding: '12px 1rem', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '6px', background: 'var(--color-background-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: task.completion + '%', background: '#10b981' }}></div>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', minWidth: '28px' }}>{task.completion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
