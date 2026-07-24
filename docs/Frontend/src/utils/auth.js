import {jwtDecode} from 'jwt-decode';

export function getToken() {
  return localStorage.getItem("token");
}


export function setToken(token) {
    // implement your logic to set the token
    localStorage.setItem("token", token);
}

export function logout() {
    // implement your logic to remove the token
    localStorage.removeItem("token");
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // seconds

    if (decoded.exp && decoded.exp > currentTime) {
      return { token, user: decoded };
    } else {
      // Token is expired
      console.log('Token expired');
      logout();
      return null;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    logout();
    return null;
  }
}
