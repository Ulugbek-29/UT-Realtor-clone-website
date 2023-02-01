import { useState } from "react";

const CreateListing = () => {
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
  } = formData;

  function onChangeHandler() {}

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form>
        <p className="text-lg mt-6 mb-2 font-semibold">Sell / Rent</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChangeHandler}
            className={`px-7 py-3 font-medium text-sm tracking-wider uppercase shadow-md rounded hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "sale"
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
              type === "rent"
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
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
