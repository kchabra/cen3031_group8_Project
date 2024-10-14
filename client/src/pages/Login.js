import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <h1 className="bg-success text-white text-center p-5">
                <h1>LOGIN</h1>
            </h1>


            <form>
                <label htmlFor="Uname">Username: </label>
                <input type="text" id="Uname" name="Uname"/>
                <label htmlFor="Pass">Password: </label>
                <input type="text" id="Pass" name="Pass"/>
            </form>
        </div>
    );
};

export default Login;