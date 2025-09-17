import { useEffect } from 'react';

function RedirectToChatbot() {
  useEffect(() => {
    window.location.href = 'http://localhost:5000/';
  }, []);

  return null;
}

export default RedirectToChatbot;