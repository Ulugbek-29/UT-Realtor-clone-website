import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FcHome } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  function onLogout() {
    // The user will be logged out & navigated to the home page!
    auth.signOut();
    navigate("/");
  }

  function onChangeHandler(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmitHandler() {
    try {
      if (auth.currentUser.displayName !== name) {
        // update the display name in the Firebase Authentication:
        await updateProfile(auth.currentUser, { displayName: name });

        // Then update the user's name in the Firebase Firestore DB:
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name: name });

        toast.success("Profile details updated successfully !");
      }
    } catch (error) {
      toast.error("Could not update the profile details !");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() });
      });

      setListings(listings);
      setLoading(false);
    }

    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="max-w-7xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-4xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full mt-6 px-3 md:w-[50%]">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChangeHandler}
              className={`w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between items-center whitespace-nowrap mb-6">
              <p>
                Do you want to change your name?{" "}
                <span
                  onClick={() => {
                    changeDetail && onSubmitHandler(); // onSubmitHandler is called only if changeDetail = true
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer mr-2"
                >
                  {changeDetail ? "Apply change." : "Edit."}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign out.
              </p>
            </div>
          </form>

          <button
            type="button"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-2xl bg-red-200 rounded-full p-1 border-2" />
              Sell or Rent your home
            </Link>
          </button>
        </div>
      </section>

      {!loading && listings.length > 0 && (
        <div className="max-w-7xl px-3 mt-12 mx-auto">
          <h2 className="text-4xl text-center font-semibold">My Listings</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-8 mb-6">
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Profile;
