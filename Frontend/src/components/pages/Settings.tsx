import React, { useState } from 'react';
import { useGetData } from '../../hooks/useGetData';
import { apiUrls } from '../../utils/api/apiUrl';
import { User, Role } from '../../utils/types';
import { useGlobalState } from '../../store';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../Tables/StatusBadge';
import { Plus, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../utils/api/apiClient';

export function Settings() {
  const { data: users, loading, error, refresh } = useGetData<User[]>(apiUrls.users);
  const { data: roles, loading: loadingRoles } = useGetData<Role[]>(apiUrls.roles);
  const { user: currentUser } = useGlobalState();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRoleId(roles && roles.length > 0 ? roles[0].id.toString() : '');
    setStatus('active');
    setFormError(null);
    setModalTitle('Register New System User');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRoleId(user.roleId?.toString() || '');
    setStatus(user.status);
    setFormError(null);
    setModalTitle(`Edit User: ${user.name}`);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end Validations
    if (!name.trim() || !email.trim() || (!editingUser && !password)) {
      setFormError('All required fields must be filled');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }
    if (!editingUser && password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    if (!roleId) {
      setFormError('Role must be selected');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        // UPDATE
        const payload: any = {
          name,
          email,
          roleId: Number(roleId),
          status,
        };
        await apiClient.put(`${apiUrls.users}/${editingUser.id}`, payload);
      } else {
        // SIGNUP
        const payload = {
          name,
          email,
          password,
          roleId: Number(roleId),
          status,
        };
        await apiClient.post(apiUrls.auth.signup, payload);
      }

      setIsModalOpen(false);
      refresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save user account');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingRoles) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading user management config: {error}</span>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-sm">
        <p className="text-sm text-slate-400">View registered users, roles, account status, and control system access permissions.</p>
        
        <div className="flex gap-3">
          <button 
            onClick={refresh}
            className="p-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors text-slate-400"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add System User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">System Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-400">#{u.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-100">{u.name} {u.id === currentUser?.id && '(You)'}</td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-semibold text-teal-400 border border-teal-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors inline-flex"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No system users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">User Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="user@transitops.com"
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="••••••"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Role Type</label>
              <select 
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {roles && roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
