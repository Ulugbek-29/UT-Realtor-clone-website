import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();

  async function onGoogleClickHandler() {
    try {
      // User Authorization with GOOGLE ACCOUNT Step:
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Checking if the authorized user already exists in the FIRESTORE Database:
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If the authorized user is not found (not stored before already) in the Database, then we can store this user (as a new user) into the Database:
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      // After the authorized user stored into the DB successfully, we will navigate the user to the HOME PAGE:
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with google !");
    }
  }
  return (
    <button
      type="button"
      onClick={onGoogleClickHandler}
      className="flex items-center justify-center w-full bg-red-600 text-white px-7 py-3 uppercase font-medium hover:bg-red-700 active:bg-red-800 rounded tracking-wide shadow-md hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out"
    >
      <FcGoogle className="mr-2 bg-white rounded-full text-xl" /> Continue with
      Google
    </button>
  );
};

export default OAuth;
