import 'bootstrap/dist/css/bootstrap.min.css';
const Footer = () => {
    const currentYear = new Date().getFullYear(); // For the copyright year in the footer
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p>&copy; {currentYear} Budget Buddy. All Rights Reserved.</p>
        <p>Authors: Desmond Arms, Jose Bohorquez, Krivi Chabra, and Bryan Gonzalez</p>
      </footer>
    );
};
export default Footer;