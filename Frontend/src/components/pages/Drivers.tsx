import React, { useState } from 'react';
import { useGetData } from '../../hooks/useGetData';
import { apiUrls } from '../../utils/api/apiUrl';
import { Driver } from '../../utils/types';
import { useGlobalState } from '../../store';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../Tables/StatusBadge';
import { Plus, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../utils/api/apiClient';

export function Drivers() {
  const { data: drivers, loading, error, refresh } = useGetData<Driver[]>(apiUrls.drivers);
  const { user } = useGlobalState();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [safetyScore, setSafetyScore] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditable = user?.role === 'Admin' || user?.role === 'FleetManager' || user?.role === 'SafetyOfficer';

  const openCreateModal = () => {
    setEditingDriver(null);
    setName('');
    setLicenseNumber('');
    setLicenseCategory('');
    setLicenseExpiryDate('');
    setContactNumber('');
    setSafetyScore('100');
    setStatus('active');
    setFormError(null);
    setModalTitle('Register New Driver');
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setLicenseNumber(driver.licenseNumber);
    setLicenseCategory(driver.licenseCategory);
    setLicenseExpiryDate(driver.licenseExpiryDate);
    setContactNumber(driver.contactNumber);
    setSafetyScore(driver.safetyScore.toString());
    setStatus(driver.status);
    setFormError(null);
    setModalTitle(`Edit Driver: ${driver.name}`);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end Validations
    if (!name.trim() || !licenseNumber.trim() || !licenseCategory.trim() || !licenseExpiryDate || !contactNumber || safetyScore === '') {
      setFormError('All required fields must be filled');
      return;
    }
    if (isNaN(Number(safetyScore)) || Number(safetyScore) < 0 || Number(safetyScore) > 100) {
      setFormError('Safety score must be a number between 0 and 100');
      return;
    }
    if (isNaN(Date.parse(licenseExpiryDate))) {
      setFormError('Please provide a valid license expiry date');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate,
        contactNumber,
        safetyScore: Number(safetyScore),
        status,
      };

      if (editingDriver) {
        await apiClient.put(`${apiUrls.drivers}/${editingDriver.id}`, payload);
      } else {
        await apiClient.post(apiUrls.drivers, payload);
      }

      setIsModalOpen(false);
      refresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save driver');
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
          <span>Error loading drivers: {error}</span>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-sm">
        <p className="text-sm text-slate-400">View driver registrations, contact details, licensing info, and safety scores.</p>
        
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          )}
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">License Code</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Expiry</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Safety Score</th>
                <th className="py-4 px-6">Status</th>
                {isEditable && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
              {drivers && drivers.length > 0 ? (
                drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-100">{driver.name}</td>
                    <td className="py-4 px-6">{driver.licenseNumber}</td>
                    <td className="py-4 px-6">{driver.licenseCategory}</td>
                    <td className="py-4 px-6">{driver.licenseExpiryDate}</td>
                    <td className="py-4 px-6">{driver.contactNumber}</td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${
                        driver.safetyScore >= 90 ? 'text-emerald-400' : driver.safetyScore >= 75 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {driver.safetyScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={driver.status} />
                    </td>
                    {isEditable && (
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openEditModal(driver)}
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
                  <td colSpan={isEditable ? 8 : 7} className="py-8 text-center text-slate-500">
                    No drivers registered.
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Driver Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="Alex Rivera"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">License Number</label>
              <input 
                type="text" 
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="DL-9948271"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">License Category</label>
              <input 
                type="text" 
                required
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="Class A CDL"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">License Expiry Date</label>
              <input 
                type="date" 
                required
                value={licenseExpiryDate}
                onChange={(e) => setLicenseExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact Number</label>
              <input 
                type="text" 
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="+1 (555) 019-2831"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Safety Score (0-100)</label>
              <input 
                type="number" 
                required
                value={safetyScore}
                onChange={(e) => setSafetyScore(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="94"
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
