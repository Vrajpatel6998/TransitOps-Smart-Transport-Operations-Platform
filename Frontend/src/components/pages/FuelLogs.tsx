import React, { useState } from 'react';
import { useGetData } from '../../hooks/useGetData';
import { apiUrls } from '../../utils/api/apiUrl';
import { FuelLog } from '../../utils/types';
import { useGlobalState } from '../../store';
import { useGetDropdowns } from '../../hooks/useGetDropdowns';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../Tables/StatusBadge';
import { Plus, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../utils/api/apiClient';

export function FuelLogs() {
  const { data: logs, loading, error, refresh } = useGetData<FuelLog[]>(apiUrls.fuelLogs);
  const { vehicles, loading: loadingDropdowns } = useGetDropdowns();
  const { user } = useGlobalState();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditable = user?.role === 'Admin' || user?.role === 'FleetManager' || user?.role === 'Driver' || user?.role === 'FinancialAnalyst';

  const openCreateModal = () => {
    setEditingLog(null);
    setVehicleId(vehicles.length > 0 ? vehicles[0].id.toString() : '');
    setLiters('');
    setCost('');
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('active');
    setFormError(null);
    setModalTitle('Log Fuel Transaction');
    setIsModalOpen(true);
  };

  const openEditModal = (log: FuelLog) => {
    setEditingLog(log);
    setVehicleId(log.vehicleId.toString());
    setLiters(log.liters.toString());
    setCost(log.cost.toString());
    setDate(log.date);
    setStatus(log.status);
    setFormError(null);
    setModalTitle(`Edit Fuel Log #${log.id}`);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end Validations
    if (!vehicleId || !liters || !cost || !date) {
      setFormError('All required fields must be filled');
      return;
    }
    if (isNaN(Number(liters)) || Number(liters) <= 0) {
      setFormError('Fuel liters must be a positive number greater than 0');
      return;
    }
    if (isNaN(Number(cost)) || Number(cost) <= 0) {
      setFormError('Cost must be a positive number greater than 0');
      return;
    }
    if (isNaN(Date.parse(date))) {
      setFormError('Please provide a valid date');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        vehicleId: Number(vehicleId),
        liters: Number(liters),
        cost: Number(cost),
        date,
        status,
      };

      if (editingLog) {
        await apiClient.put(`${apiUrls.fuelLogs}/${editingLog.id}`, payload);
      } else {
        await apiClient.post(apiUrls.fuelLogs, payload);
      }

      setIsModalOpen(false);
      refresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save fuel log');
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
          <span>Error loading fuel logs: {error}</span>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-sm">
        <p className="text-sm text-slate-400">Record and review fuel fill-ups, liters filled, fuel cost, and statuses.</p>
        
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
              <span>Record Fuel Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Fuel logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6">Fuel Volume (Liters)</th>
                <th className="py-4 px-6">Cost</th>
                <th className="py-4 px-6">Refuel Date</th>
                <th className="py-4 px-6">Status</th>
                {isEditable && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-400">#{log.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-100">
                      {log.vehicle ? `${log.vehicle.registrationNumber} (${log.vehicle.nameModel})` : `Vehicle #${log.vehicleId}`}
                    </td>
                    <td className="py-4 px-6 font-medium">{Number(log.liters).toLocaleString()} L</td>
                    <td className="py-4 px-6 text-emerald-400 font-semibold">${Number(log.cost).toLocaleString()}</td>
                    <td className="py-4 px-6">{log.date}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={log.status} />
                    </td>
                    {isEditable && (
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openEditModal(log)}
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
                    No fuel logs found.
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
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Volume (Liters)</label>
              <input 
                type="number" 
                required
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Transaction Cost (USD)</label>
              <input 
                type="number" 
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="450"
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
