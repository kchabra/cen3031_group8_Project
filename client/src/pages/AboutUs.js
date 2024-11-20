/*import 'bootstrap/dist/css/bootstrap.min.css';

const AboutUs = () => {
    return (
        <h1>This is the about page.</h1>
    );
};

export default AboutUs;*/

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const AboutUs = () => {
    return (
        <div className="container text-center mt-5">
            <h1>This is the About Us page.</h1>
            <p>Welcome to Budget Buddy, your go-to solution for managing your expenses!</p>
            {/* Navigation Link to Expense Chart */}
            <Link to="/expense-chart">
                <button className="btn btn-primary mt-3">View Expense Chart</button>
            </Link>
        </div>
    );
};

export default AboutUs;