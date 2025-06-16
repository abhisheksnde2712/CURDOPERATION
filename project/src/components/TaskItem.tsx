import React, { useState } from 'react';
import { Task } from '../types/Task';
import { Check, X, Edit2, Save, Trash2, Calendar, FileText } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Pick<Task, 'name' | 'description' | 'completed'>>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, loading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleSave = async () => {
    if (!editName.trim()) return;
    
    try {
      await onUpdate(task.id, {
        name: editName.trim(),
        description: editDescription.trim()
      });
      setIsEditing(false);
    } catch (error) {
      // Reset to original values on error
      setEditName(task.name);
      setEditDescription(task.description);
    }
  };

  const handleCancel = () => {
    setEditName(task.name);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const toggleComplete = async () => {
    try {
      await onUpdate(task.id, { completed: !task.completed });
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        // Error handling is done in parent component
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!editName.trim() || loading}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 flex-1">
              <button
                onClick={toggleComplete}
                disabled={loading}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              
              <div className="flex-1">
                <h3 className={`font-semibold text-lg text-gray-800 mb-2 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.name}
                </h3>
                
                {task.description && (
                  <div className="flex items-start gap-2 mb-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className={`text-gray-600 text-sm leading-relaxed ${
                      task.completed ? 'line-through text-gray-400' : ''
                    }`}>
                      {task.description}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Created {formatDate(task.createdAt)}</span>
                  {task.updatedAt && (
                    <span>• Updated {formatDate(task.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className={`h-1 rounded-full ${
            task.completed ? 'bg-green-200' : 'bg-blue-200'
          }`}>
            <div className={`h-full rounded-full transition-all duration-500 ${
              task.completed ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'
            }`} />
          </div>
        </>
      )}
    </div>
  );
};