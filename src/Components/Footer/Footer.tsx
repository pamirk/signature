import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      Developed by&nbsp; <em> PK </em>
    </footer>
  );
}

export default Footer;
