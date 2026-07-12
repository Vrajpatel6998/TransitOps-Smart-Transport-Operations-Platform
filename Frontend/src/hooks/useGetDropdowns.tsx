import { useGetData } from './useGetData';
import { apiUrls } from '../utils/api/apiUrl';
import { Vehicle, Role } from '../utils/types';

export function useGetDropdowns() {
  const { data: vehicles, loading: loadingVehicles } = useGetData<Vehicle[]>(apiUrls.vehicles);
  const { data: roles, loading: loadingRoles } = useGetData<Role[]>(apiUrls.roles);

  const activeVehicles = vehicles?.filter(v => v.status === 'active') || [];
  const activeRoles = roles?.filter(r => r.status === 'active') || [];

  return {
    vehicles: activeVehicles,
    roles: activeRoles,
    loading: loadingVehicles || loadingRoles
  };
}
