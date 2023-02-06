import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { serverTimestamp, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing !");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        const { imgUrls, geolocation, timestamp, userRef, ...rest } =
          docSnap.data();

        setFormData({
          ...rest,
          latitude: geolocation.lat,
          longitude: geolocation.lng,
        });

        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist !");
      }
    }

    fetchListing();
  }, [params.listingId, navigate]);

  function onChangeHandler(e) {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    // For Images:
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // For Booleans/ Text /Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmitHandler(e) {
    e.preventDefault();
    setLoading(true);

    if (+discountedPrice >= +regularPrice) {
      // plus converts string value to number
      // (input elements give values as string type )
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price !");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed to be uploaded !");
      return;
    }

    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      // This if block does NOT work in our case, because we didn't enable GOOGLE's Geocode API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address !");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images could not be uploaded !");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    // Before storing form Data into the Database, we need to delete some props:
    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // UPDATING the form data in the Database:
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing updated successfully !");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
      <form onSubmit={onSubmitHandler}>
        <p className="text-lg mt-6 mb-2 font-semibold">Sell / Rent</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-700 text-white"
            }`}
          >
            sell
          </button>

          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-700 text-white"
            }`}
          >
            rent
          </button>
        </div>

        <p className="text-lg mt-6 mb-2 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          value={name}
          onChange={onChangeHandler}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-out focus:border-slate-600 mb-6"
        />

        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg mb-2 font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              min="1"
              max="50"
              required
              onChange={onChangeHandler}
              className="px-4 w-full py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
            />
          </div>

          <div>
            <p className="text-lg mb-2 font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              min="1"
              max="50"
              required
              onChange={onChangeHandler}
              className="px-4 w-full py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
            />
          </div>
        </div>

        <p className="text-lg mt-6 mb-2 font-semibold">Parking spot</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            yes
          </button>

          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            no
          </button>
        </div>

        <p className="text-lg mt-6 mb-2 font-semibold">Furnished</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            yes
          </button>

          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            no
          </button>
        </div>

        <p className="text-lg mt-6 mb-2 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          placeholder="Address"
          required
          value={address}
          onChange={onChangeHandler}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-out focus:border-slate-600 mb-6"
        />

        {!geolocationEnabled && (
          <div className="mb-6 flex space-x-6 items-center">
            <div>
              <p className="text-lg mb-2 font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChangeHandler}
                min="-90"
                max="90"
                required
                className="px-4 w-full py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
              />
            </div>
            <div>
              <p className="text-lg mb-2 font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChangeHandler}
                min="-180"
                max="180"
                required
                className="px-4 w-full py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
              />
            </div>
          </div>
        )}

        <p className="text-lg mb-2 font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          placeholder="Description"
          required
          value={description}
          onChange={onChangeHandler}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-out focus:border-slate-600 mb-6"
        />

        <p className="text-lg mb-2 font-semibold">Offer</p>
        <div className="flex space-x-6 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            yes
          </button>

          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}
          >
            no
          </button>
        </div>

        <div>
          <p className="text-lg mb-2 font-semibold">Regular price</p>
          <div className="flex justify-between items-center mb-6 space-x-6">
            <input
              type="number"
              id="regularPrice"
              value={regularPrice}
              min="50"
              max="40000000"
              onChange={onChangeHandler}
              required
              className="px-2 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
            />
            {type === "rent" && (
              <p className="text-lg w-full whitespace-nowrap">$ / month</p>
            )}
          </div>
        </div>

        {offer && (
          <div>
            <p className="text-lg mb-2 font-semibold">Discounted price</p>
            <div className="flex justify-between items-center mb-6 space-x-6">
              <input
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                min="50"
                max="40000000"
                onChange={onChangeHandler}
                required={offer}
                className="px-2 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <p className="text-lg w-full whitespace-nowrap">$ / month</p>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600 mb-1">
            The first image will be the cover (max 6 allowed)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChangeHandler}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600"
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium uppercase rounded tracking-wide shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 transition duration-200 ease-in-out"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
};

export default EditListing;
