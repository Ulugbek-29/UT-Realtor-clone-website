import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Category = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // last element
        setLastFetchedListing(lastVisible);

        const fetchedListings = [];

        querySnap.forEach((doc) => {
          return fetchedListings.push({ id: doc.id, data: doc.data() });
        });

        setListings(fetchedListings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Could not fetch the Listings !");
      }
    }

    fetchListings();
  }, [params.categoryName]);

  async function fetchMoreListings() {
    try {
      setLoading(true);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]; // last element
      setLastFetchedListing(lastVisible);

      const fetchedListings = [];

      querySnap.forEach((doc) => {
        return fetchedListings.push({ id: doc.id, data: doc.data() });
      });

      toast.success(
        `Currently, There are no more places for ${params.categoryName} !`
      );
      setListings((prevState) => [...prevState, ...fetchedListings]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Could not fetch the Listings !");
    }
  }

  return (
    <main className="max-w-7xl mx-auto mt-8 mb-8 px-3">
      <h1 className="text-3xl text-center font-bold tracking-wider mb-6">
        {`Places for ${params.categoryName}`}
      </h1>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingItem
              key={listing.id}
              id={listing.id}
              listing={listing.data}
            />
          ))}
        </ul>
      ) : (
        <p className="text-xl text-center font-semibold mt-8">
          {`Currently there are no places for ${params.categoryName} !`}
        </p>
      )}

      {lastFetchedListing && (
        <div className="flex justify-center items-center">
          <button
            onClick={fetchMoreListings}
            className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 hover:border-slate-600 rounded transition duration-200 ease-out text-xl mt-6"
          >
            Load more
          </button>
        </div>
      )}
    </main>
  );
};

export default Category;
