import React, { useState } from 'react';
import { useGetData } from '../../hooks/useGetData';
import { apiUrls } from '../../utils/api/apiUrl';
import { Vehicle } from '../../utils/types';
import { useGlobalState } from '../../store';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../Tables/StatusBadge';
import { Plus, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../utils/api/apiClient';

export function Vehicles() {
  const { data: vehicles, loading, error, refresh } = useGetData<Vehicle[]>(apiUrls.vehicles);
  const { user } = useGlobalState();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [regNumber, setRegNumber] = useState('');
  const [nameModel, setNameModel] = useState('');
  const [type, setType] = useState('');
  const [maxLoad, setMaxLoad] = useState('');
  const [odometer, setOdometer] = useState('');
  const [acqCost, setAcqCost] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditable = user?.role === 'Admin' || user?.role === 'FleetManager';

  const openCreateModal = () => {
    setEditingVehicle(null);
    setRegNumber('');
    setNameModel('');
    setType('');
    setMaxLoad('');
    setOdometer('');
    setAcqCost('');
    setRegion('');
    setStatus('active');
    setFormError(null);
    setModalTitle('Add New Vehicle');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setRegNumber(vehicle.registrationNumber);
    setNameModel(vehicle.nameModel);
    setType(vehicle.type);
    setMaxLoad(vehicle.maxLoadCapacity.toString());
    setOdometer(vehicle.odometer.toString());
    setAcqCost(vehicle.acquisitionCost.toString());
    setRegion(vehicle.region || '');
    setStatus(vehicle.status);
    setFormError(null);
    setModalTitle(`Edit Vehicle: ${vehicle.registrationNumber}`);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Front-end Validations
    if (!regNumber.trim() || !nameModel.trim() || !type.trim() || !maxLoad || !odometer || !acqCost) {
      setFormError('All required fields must be filled');
      return;
    }
    if (isNaN(Number(maxLoad)) || Number(maxLoad) < 0) {
      setFormError('Maximum load capacity must be a positive number');
      return;
    }
    if (isNaN(Number(odometer)) || Number(odometer) < 0) {
      setFormError('Odometer reading must be a positive number');
      return;
    }
    if (isNaN(Number(acqCost)) || Number(acqCost) < 0) {
      setFormError('Acquisition cost must be a positive number');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        registrationNumber: regNumber,
        nameModel,
        type,
        maxLoadCapacity: Number(maxLoad),
        odometer: Number(odometer),
        acquisitionCost: Number(acqCost),
        region,
        status,
      };

      if (editingVehicle) {
        // UPDATE
        await apiClient.put(`${apiUrls.vehicles}/${editingVehicle.id}`, payload);
      } else {
        // CREATE
        await apiClient.post(apiUrls.vehicles, payload);
      }

      setIsModalOpen(false);
      refresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save vehicle');
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
          <span>Error loading vehicles: {error}</span>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-sm">
        <p className="text-sm text-slate-400">Manage your transport fleet details, operational statuses, and specifications.</p>
        
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
              <span>Add Vehicle</span>
            </button>
          )}
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Reg Number</th>
                <th className="py-4 px-6">Model</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Capacity (kg)</th>
                <th className="py-4 px-6">Odometer (km)</th>
                <th className="py-4 px-6">Cost</th>
                <th className="py-4 px-6">Region</th>
                <th className="py-4 px-6">Status</th>
                {isEditable && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
              {vehicles && vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-100">{vehicle.registrationNumber}</td>
                    <td className="py-4 px-6">{vehicle.nameModel}</td>
                    <td className="py-4 px-6">{vehicle.type}</td>
                    <td className="py-4 px-6">{Number(vehicle.maxLoadCapacity).toLocaleString()}</td>
                    <td className="py-4 px-6">{Number(vehicle.odometer).toLocaleString()}</td>
                    <td className="py-4 px-6">${Number(vehicle.acquisitionCost).toLocaleString()}</td>
                    <td className="py-4 px-6">{vehicle.region || '—'}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    {isEditable && (
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openEditModal(vehicle)}
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
                  <td colSpan={isEditable ? 9 : 8} className="py-8 text-center text-slate-500">
                    No vehicles found.
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Registration Number</label>
            <input 
              type="text" 
              required
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="CA-992-FL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Model Name</label>
              <input 
                type="text" 
                required
                value={nameModel}
                onChange={(e) => setNameModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="Freightliner M2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Vehicle Type</label>
              <input 
                type="text" 
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="Heavy Truck"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Max Load (kg)</label>
              <input 
                type="number" 
                required
                value={maxLoad}
                onChange={(e) => setMaxLoad(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="12000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Odometer (km)</label>
              <input 
                type="number" 
                required
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="145200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cost (USD)</label>
              <input 
                type="number" 
                required
                value={acqCost}
                onChange={(e) => setAcqCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="85000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Operating Region</label>
              <input 
                type="text" 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="West Coast"
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
