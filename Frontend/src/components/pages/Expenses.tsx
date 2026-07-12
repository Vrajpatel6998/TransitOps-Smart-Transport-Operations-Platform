import React, { useState } from 'react';
import { useGetData } from '../../hooks/useGetData';
import { apiUrls } from '../../utils/api/apiUrl';
import { Expense } from '../../utils/types';
import { useGlobalState } from '../../store';
import { useGetDropdowns } from '../../hooks/useGetDropdowns';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../Tables/StatusBadge';
import { Plus, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../utils/api/apiClient';

export function Expenses() {
  const { data: expenses, loading, error, refresh } = useGetData<Expense[]>(apiUrls.expenses);
  const { vehicles, loading: loadingDropdowns } = useGetDropdowns();
  const { user } = useGlobalState();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [type, setType] = useState('Toll');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditable = user?.role === 'Admin' || user?.role === 'FleetManager' || user?.role === 'FinancialAnalyst';

  const openCreateModal = () => {
    setEditingExpense(null);
    setVehicleId(vehicles.length > 0 ? vehicles[0].id.toString() : '');
    setType('Toll');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('active');
    setFormError(null);
    setModalTitle('Record Operational Expense');
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setVehicleId(expense.vehicleId.toString());
    setType(expense.type);
    setAmount(expense.amount.toString());
    setDate(expense.date);
    setStatus(expense.status);
    setFormError(null);
    setModalTitle(`Edit Expense Record #${expense.id}`);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end Validations
    if (!vehicleId || !type || !amount || !date) {
      setFormError('All required fields must be filled');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Expense amount must be a positive number greater than 0');
      return;
    }
    if (isNaN(Date.parse(date))) {
      setFormError('Please provide a valid transaction date');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        vehicleId: Number(vehicleId),
        type,
        amount: Number(amount),
        date,
        status,
      };

      if (editingExpense) {
        await apiClient.put(`${apiUrls.expenses}/${editingExpense.id}`, payload);
      } else {
        await apiClient.post(apiUrls.expenses, payload);
      }

      setIsModalOpen(false);
      refresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save expense log');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <span>Error loading expenses: {error}</span>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-sm">
        <p className="text-sm text-slate-400">Record and review toll fees, insurance, permits, and other vehicle operational costs.</p>
        
        <div className="flex gap-3">
          <button 
            onClick={refresh}
            className="p-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 hover:text-slate-100 transition-colors text-slate-400"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          {isEditable && (
            <button 
              onClick={openCreateModal}
              disabled={vehicles.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6">Expense Type</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Transaction Date</th>
                <th className="py-4 px-6">Status</th>
                {isEditable && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
              {expenses && expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-400">#{expense.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-100">
                      {expense.vehicle ? `${expense.vehicle.registrationNumber} (${expense.vehicle.nameModel})` : `Vehicle #${expense.vehicleId}`}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 rounded bg-slate-800 text-xs font-medium border border-slate-700 text-slate-300">
                        {expense.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-rose-400 font-semibold">${Number(expense.amount).toLocaleString()}</td>
                    <td className="py-4 px-6">{expense.date}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={expense.status} />
                    </td>
                    {isEditable && (
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openEditModal(expense)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors inline-flex"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isEditable ? 7 : 6} className="py-8 text-center text-slate-500">
                    No expense records found.
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Vehicle</label>
            <select 
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} - {v.nameModel}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Expense Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Toll">Toll Fee</option>
                <option value="Insurance">Insurance</option>
                <option value="Permit">Permit</option>
                <option value="Fine">Traffic Fine</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Amount (USD)</label>
              <input 
                type="number" 
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="45"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
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
