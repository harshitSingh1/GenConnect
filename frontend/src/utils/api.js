// frontend/src/utils/api.js
export const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:8080';
  }
  return process.env.REACT_APP_API_URL || 'https://genconnect-server.vercel.app';
};