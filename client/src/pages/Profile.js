import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        fetch('http://localhost:5000/profile', {
            method: 'GET',
            credentials: 'include', // Important to send cookies with the request
        }).then((response) => response.json()).then((data) => {
            if (data.profile) {
                setProfile(data.profile);
            }
            else if (data.message) {
                setError(data.message);
            }
        }).catch((err) => {
            setError("Error fetching profile.");

        });
    }, []);
return (
    <div className="container">
            <h1>This is the profile page</h1>
            {error ? (
                <p className="text-danger">{error}</p>
            ) : (
                profile && (
                    <div>
                        <p><strong>First Name:</strong> {profile.first_name}</p>
                        <p><strong>Last Name:</strong> {profile.last_name}</p>
                        {/* Add any other profile fields you want to display */}
                    </div>
                )
            )}
                    </div>
        
    );
};

export default Profile;
