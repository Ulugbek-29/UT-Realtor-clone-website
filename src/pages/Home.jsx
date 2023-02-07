import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeSlider from "../components/HomeSlider";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";

const Home = () => {
  // 1. Fetch Listings Data from Firebase DB where OFFER == true:
  const [offerListings, setOfferListings] = useState(null);

  useEffect(() => {
    async function fetchOfferListings() {
      try {
        // Get Reference for the collection:
        const listingsRef = collection(db, "listings");
        // Create the query:
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // Execute the query (Fetch Data):
        const querySnap = await getDocs(q);

        const fetchedListings = [];

        querySnap.forEach((doc) => {
          fetchedListings.push({ id: doc.id, data: doc.data() });
        });

        setOfferListings(fetchedListings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  }, []);

  // 2. Fetch Listings Data from Firebase DB where TYPE == "rent":
  const [rentListings, setRentListings] = useState(null);

  useEffect(() => {
    async function fetchRentListings() {
      try {
        // Get Reference for the collection:
        const listingsRef = collection(db, "listings");
        // Create the query:
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // Execute the query (Fetch Data):
        const querySnap = await getDocs(q);

        const fetchedListings = [];

        querySnap.forEach((doc) => {
          fetchedListings.push({ id: doc.id, data: doc.data() });
        });

        setRentListings(fetchedListings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRentListings();
  }, []);

  // 3. Fetch Listings Data from Firebase DB where TYPE == "sale":
  const [saleListings, setSaleListings] = useState(null);

  useEffect(() => {
    async function fetchSaleListings() {
      try {
        // Get Reference for the collection:
        const listingsRef = collection(db, "listings");
        // Create the query:
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // Execute the query (Fetch Data):
        const querySnap = await getDocs(q);

        const fetchedListings = [];

        querySnap.forEach((doc) => {
          fetchedListings.push({ id: doc.id, data: doc.data() });
        });

        setSaleListings(fetchedListings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSaleListings();
  }, []);

  return (
    <div>
      <HomeSlider />

      {offerListings && offerListings.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 mb-8 px-3">
          <h2 className="text-3xl font-semibold mb-1 px-1">Recent Offers</h2>
          <Link to="/offers">
            <span className="text-blue-600 hover:text-blue-800 transition duration-200 ease-out px-1">
              Show more offers
            </span>
          </Link>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offerListings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </div>
      )}

      {rentListings && rentListings.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 mb-8 px-3">
          <h2 className="text-3xl font-semibold mb-1 px-1">Places for rent</h2>
          <Link to="/category/rent">
            <span className="text-blue-600 hover:text-blue-800 transition duration-200 ease-out px-1">
              Show more places
            </span>
          </Link>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rentListings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </div>
      )}

      {saleListings && saleListings.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8 mb-8 px-3">
          <h2 className="text-3xl font-semibold mb-1 px-1">Places for sale</h2>
          <Link to="/category/sale">
            <span className="text-blue-600 hover:text-blue-800 transition duration-200 ease-out px-1">
              Show more places
            </span>
          </Link>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saleListings.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
