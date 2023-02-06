import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ListingItem = ({ id, listing, onEdit, onDelete }) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-200 ease-in-out m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[250px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt=""
        />

        <Moment
          className="absolute top-3 left-3 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>

        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-gray-600 truncate">
              {listing.address}
            </p>
          </div>

          <p className="font-semibold text-xl truncate">{listing.name}</p>

          <p className="text-[#457b9d] mt-1 font-semibold text-lg">
            ${" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="flex items-center mt-[10px] space-x-3">
            <p className="font-bold text-sm">
              {Number(listing.bedrooms) > 1
                ? `${listing.bedrooms} Beds`
                : "1 Bed"}
            </p>

            <p className="font-bold text-sm">
              {Number(listing.bathrooms) > 1
                ? `${listing.bathrooms} Baths`
                : "1 Bath"}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        />
      )}

      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-8 h-4 cursor-pointer "
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};

export default ListingItem;
