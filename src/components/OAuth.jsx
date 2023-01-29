import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  return (
    <button className="flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 uppercase font-medium hover:bg-red-700 active:bg-red-800 rounded tracking-wide shadow-md hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out">
      <FcGoogle className="mr-2 bg-white rounded-full text-xl" /> Continue with
      Google
    </button>
  );
};

export default OAuth;
