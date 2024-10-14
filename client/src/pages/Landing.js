// home page
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex-grow-1">
      <header className="bg-primary text-white text-center p-5">
        <h1 className="display-4 mb-3">Welcome to Budget Buddy: Time to Save Big</h1>
        <p className="lead">
          Track your spending, set budgets, and achieve your financial goals with Budget Buddy.
          Categorize your spending, generate reports, and visualize your spending with our powerful tool. 
          It's time to save big with Budget Buddy.
        </p>
      </header>
      <main className="flex-grow-1 d-flex justify-content-center align-items-center my-4">
        <div className="text-center">
          <div className="mb-3">
            <Link to="/about" className="btn btn-info btn-lg px-4">About Us</Link>
          </div>
          <div className="mb-3">
                <Link to="/login" className="btn btn-success btn-lg px-4">Login</Link>
        </div>
          <div>
            <Link to="/signup" className="btn btn-primary btn-lg px-4">Create an Account</Link>
          </div>
        </div>
      </main>
      </div>
  );
};

export default Landing;
