import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile === '9876543210') {
      navigate('/chatbot');
    } else {
      const user = localStorage.getItem(mobile);
      if (user) {
        navigate('/chatbot');
      } else {
        navigate('/register');
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    form: {
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      borderTop: '5px solid #388e3c'
    },
    title: {
      textAlign: 'center',
      color: '#2e7d32',
      fontSize: '28px',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#1976d2'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#388e3c',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    buttonHover: {
      backgroundColor: '#1565c0'
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Nabha Hospital Login</h2>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2e7d32'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#388e3c'}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;