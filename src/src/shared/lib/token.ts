export const getToken = () => localStorage.getItem('token') || undefined;
export const setToken = (val: string) => localStorage.setItem('token', val);
