import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;

  function onChangeHandler(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <section>
      <h1 className="text-4xl text-center mt-10 font-bold">Sign Up</h1>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center flex-wrap items-center px-5 py-16">
          <div className="md:w-[75%] lg:w-[50%] mb-12 md:mb-6">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80"
              alt="home key image"
              className="w-full rounded-2xl"
            />
          </div>

          <div className="w-full md:w-[74%] lg:w-[40%] lg:ml-16">
            <form>
              <input
                className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type="text"
                id="name"
                value={name}
                placeholder="Full Name"
                onChange={onChangeHandler}
              />

              <input
                className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type="email"
                id="email"
                value={email}
                placeholder="Email Address"
                onChange={onChangeHandler}
              />

              <div className="relative mb-6">
                <input
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={onChangeHandler}
                />

                {showPassword ? (
                  <AiFillEyeInvisible
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                ) : (
                  <AiFillEye
                    className="absolute right-3 top-3 text-xl cursor-pointer"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                )}
              </div>

              <div className="grid justify-center align-center text-center md:flex md:justify-between whitespace-nowrap text-lg mb-6">
                <p className="mb-2 md:mb-0">
                  Have already an account?{" "}
                  <Link
                    to="/sign-in"
                    className="text-red-500 hover:text-red-600 transition duration-200 ease-in-out"
                  >
                    Sign in.
                  </Link>
                </p>
                <p>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-7 py-3 font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 transition duration-200 ease-in-out tracking-wider"
              >
                Sign up
              </button>

              <div className="flex my-6 before:border-t before:flex-1 items-center before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                <p className="text-center font-semibold mx-4 text-lg">OR</p>
              </div>

              <OAuth />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
