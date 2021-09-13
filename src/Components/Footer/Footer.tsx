import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      © {currentYear} Signaturely |
      <a href="https://signaturely.com/terms/" target="_blank" rel="noopener noreferrer">
        Terms and Conditions
      </a>
    </footer>
  );
}

export default Footer;
