// src/utils/auth.js

export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }
  
  export function getRole() {
    return localStorage.getItem('role');
  }
  
  export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
  