export const tokenStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    // Aggressively clear localStorage to prevent any leakage
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');

    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    // Fallback to sessionStorage
    return sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    // Aggressively clear localStorage to prevent any leakage
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');

    // Set secure cookie
    document.cookie = `${key}=${value}; path=/; SameSite=Strict; Secure`;
    sessionStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    // Aggressively clear localStorage to prevent any leakage
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');

    // Clear cookie
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict; Secure`;
    sessionStorage.removeItem(key);
  }
};
