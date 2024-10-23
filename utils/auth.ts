export const logout = () => {
    // Clear user data (e.g., tokens, user info)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    document.cookie = 'token=; Max-Age=0'; // Clear token cookie if used
  
    // Redirect to sign-in page
    window.location.href = '/signIn';
  };

  