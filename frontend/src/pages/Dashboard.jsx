import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import taskService from '../services/taskService';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await taskService.getTasks(params);
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await taskService.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted successfully');
        fetchTasks();
        fetchStats();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
    fetchTasks();
    fetchStats();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Dashboard</h2>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-value">{stats.pending}</div>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <div className="stat-value">{stats['in-progress']}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="tasks-header-combined">
        <div className="tasks-header-top">
          <h2>My Tasks</h2>
          <button className="btn btn-success" onClick={handleCreate}>
            Create Task
          </button>
        </div>
        
        <div className="tasks-filters">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className={`badge badge-${task.status}`}>
                  {task.status}
                </span>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="badge">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="task-actions">
                <button className="btn-edit" onClick={() => handleEdit(task)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
