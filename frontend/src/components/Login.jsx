import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const Login = () => {
  const { login, authenticated, user, logout } = usePrivy();
  const [storedUser, setStoredUser] = useState(null);

  // Function to handle user login
  const handleLogin = async () => {
    try {
      await login(); // Opens the popup with multiple login methods
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Store user info in localStorage after login
  const handleUserData = async () => {
    if (authenticated && user) {
      const userInfo = {
        name: user.google?.name,
        email: user.google?.email,
        walletAddress: user.wallet?.address,
        recycledItems: [], // If you have any recycled items to send, add them here
        rewardsEarned: 0, // Default value if no rewards are provided
      };

      console.log('User Info:', userInfo);

      // Store the user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      // Set the stored user info to state
      setStoredUser(userInfo);
    }
  };

  // Load user info from localStorage if available
  const loadUserFromStorage = () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setStoredUser(JSON.parse(storedUserInfo));
    }
  };

  // Trigger handleUserData when the user logs in
  useEffect(() => {
    if (authenticated) {
      handleUserData();
    } else {
      loadUserFromStorage();
    }
  }, [authenticated]);

  // Function to handle logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo'); // Remove user info from localStorage on logout
    setStoredUser(null); // Clear the stored user info in state
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login to Your App</h1>
      {storedUser ? (
        <>
          <button onClick={handleLogout} style={styles.button}>
            Log Out
          </button>
        </>
      ) : (
        <button onClick={handleLogin} style={styles.button}>
          Log In
        </button>
      )}
    </div>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#676FFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Login;