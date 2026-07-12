const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiUrls = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    signup: `${BASE_URL}/auth/signup`,
    profile: `${BASE_URL}/auth/profile`,
  },
  roles: `${BASE_URL}/roles`,
  users: `${BASE_URL}/users`,
  vehicles: `${BASE_URL}/vehicles`,
  drivers: `${BASE_URL}/drivers`,
  maintenance: `${BASE_URL}/maintenance`,
  fuelLogs: `${BASE_URL}/fuel-logs`,
  expenses: `${BASE_URL}/expenses`,
  dashboardKPIs: `${BASE_URL}/dashboard/kpis`,
};
