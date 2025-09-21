const handleLogin = async (name, grade) => {
  console.log('Login attempt:', { name, grade });
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, grade }),
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('Login successful:', userData);
      setUserData(userData);
      setCurrentPage('dashboard');
    } else {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      alert('Login failed: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Network error. Please make sure the backend server is running on port 5001.');
  }
};