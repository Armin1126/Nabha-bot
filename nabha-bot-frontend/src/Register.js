import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    weight: '',
    height: '',
    gender: '',
    mobile: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(formData.mobile, JSON.stringify(formData));
    navigate('/chatbot');
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    form: {
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px',
      borderTop: '5px solid #388e3c'
    },
    title: {
      textAlign: 'center',
      color: '#388e3c',
      fontSize: '28px',
      marginBottom: '20px',
      fontWeight: 'bold'
    },
    instructionsBox: {
      backgroundColor: '#f1f8e9',
      border: '2px solid #388e3c',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '25px',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#2e7d32'
    },
    punjabiText: {
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '18px'
    },
    englishText: {
      fontStyle: 'italic',
      color: '#388e3c'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.3s',
      backgroundColor: 'white',
      boxSizing: 'border-box'
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
      backgroundColor: '#2e7d32'
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Patient Registration</h2>
        <div style={styles.instructionsBox}>
          <div style={styles.punjabiText}>
            ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਈ ਨਿਰਦੇਸ਼:
          </div>
          <div style={styles.englishText}>
            Patient Registration Instructions:
          </div>
          <br />
          <strong>ਪੰਜਾਬੀ / Punjabi:</strong><br />
          1. ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਭਰੋ (ਉਦਾਹਰਣ: ਰਾਮ ਸਿੰਘ)<br />
          2. ਆਪਣੀ ਉਮਰ ਸਾਲਾਂ ਵਿੱਚ ਭਰੋ (ਉਦਾਹਰਣ: 25)<br />
          3. ਜਨਮ ਮਿਤੀ ਚੁਣੋ (ਤਾਰੀਖ, ਮਹੀਨਾ, ਸਾਲ)<br />
          4. ਆਪਣਾ ਵਜ਼ਨ ਕਿਲੋਗ੍ਰਾਮ ਵਿੱਚ ਭਰੋ (ਉਦਾਹਰਣ: 70)<br />
          5. ਆਪਣਾ ਕੱਦ ਸੈਂਟੀਮੀਟਰ ਵਿੱਚ ਭਰੋ (ਉਦਾਹਰਣ: 175)<br />
          6. ਆਪਣਾ ਲਿੰਗ ਚੁਣੋ (ਮਰਦ, ਔਰਤ, ਜਾਂ ਹੋਰ)<br />
          7. ਆਪਣਾ ਮੋਬਾਇਲ ਨੰਬਰ ਭਰੋ (10 ਅੰਕਾਂ)<br />
          8. ਸਾਰੀ ਜਾਣਕਾਰੀ ਭਰਨ ਤੋਂ ਬਾਅਦ 'ਰਜਿਸਟਰ ਪੇਸ਼ੰਟ' ਬਟਨ ਦਬਾਓ<br />
          <br />
          <strong>ਅੰਗ੍ਰੇਜ਼ੀ / English:</strong><br />
          1. Enter your full name (Example: Ram Singh)<br />
          2. Enter your age in years (Example: 25)<br />
          3. Select your date of birth (date, month, year)<br />
          4. Enter your weight in kilograms (Example: 70)<br />
          5. Enter your height in centimeters (Example: 175)<br />
          6. Select your gender (Male, Female, or Other)<br />
          7. Enter your mobile number (10 digits)<br />
          8. After filling all information, click 'Register Patient' button
        </div>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        />
        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        />
        <input
          name="weight"
          type="number"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        />
        <input
          name="height"
          type="number"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={styles.select}
          onFocus={(e) => e.target.style.borderColor = '#388e3c'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="mobile"
          type="text"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
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
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default Register;