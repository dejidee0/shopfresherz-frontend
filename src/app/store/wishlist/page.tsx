import { Button } from "@/components/ui/Button";
import { ColumnDef, DataTable } from "@/components/ui/DataTable";
import { IoCartOutline } from "react-icons/io5";
import { MdImportantDevices, MdOutlineCancel } from "react-icons/md";

interface WishListItemProps {
  id: string;
  name: string;
  price: string;
  discountedPrice: string;
  imageUrl: string;
  stockStatus: string;
}

const WISHLIST_COLUMNS: ColumnDef<WishListItemProps>[] = [
  {
    key: "name",
    header: "PRODUCTS",
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.imageUrl ? (
          <img src={row.imageUrl} alt="product-image" />
        ) : (
          <MdImportantDevices className="text-4xl text-text-muted" />
        )}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">{row.name}</p>
        </div>
      </div>
    ),
  },
  {
    key: "price",
    header: "PRICE",
    render: (row) => (
      <div className="flex">
        {row.discountedPrice ? (
          <div className="flex gap-2 items-center">
            <p className="text-text-muted line-through">{row.discountedPrice} </p><p className="font-semibold">{row.price}</p>
          </div>
        ) : (
          <p>{row.price}</p>
        )}
      </div>
    ),
  },
  {
    key: "stockStatus",
    header: "STOCK STATUS",
    render: (row) => (
      <div>
        {row.stockStatus === "in-stock" ? (
          <p className="text-green-600 font-semibold text-sm">IN STOCK</p>
        ) : row.stockStatus === "out-of-stock" ? (
          <p className="text-danger font-semibold text-sm">OUT OF STOCK</p>
        ) : (
          ""
        )}
      </div>
    ),
  },
  {
    key: "actions",
    header: "ACTIONS",
    render: (row) => (
      <div className="flex gap-3 items-center">
        <Button className="flex gap-2 items-center">
          ADD TO CART <IoCartOutline className="text-xl "/>
        </Button>
        <button>
          <MdOutlineCancel className="text-text-muted text-2xl hover:text-danger cursor-pointer"/>
        </button>
      </div>
    ),
  },
];

const wishlistItems = [
  {
    id: "1",
    name: "Bose Sport Earbuds - Wireless Earphones - Bluetooth In Ear Headphones for Workouts and Running, Triple Black",
    price: "₦30,000",
    discountedPrice: "₦20,000",
    imageUrl: "",
    stockStatus: "in-stock",
  },
  {
    id: "2",
    name: "Simple Mobile 5G LTE Galexy 12 Mini 512GB Gaming Phone",
    price: "₦50,000",
    discountedPrice: "₦30,000",
    imageUrl: "",
    stockStatus: "out-of-stock",
  },
  {
    id: "3",
    name: "Portable Wshing Machine, 11lbs capacity Model 18NMFIAM",
    price: "₦30,000",
    discountedPrice: "",
    imageUrl: "",
    stockStatus: "in-stock",
  },
];

const WhishlistPage = () => {
  return (
    <div className="flex flex-col p-2 md:p-6 lg:p-6">
      <DataTable title="Wishlist" data={wishlistItems} columns={WISHLIST_COLUMNS} rowKey="name"
        emptyMessage="No items in wishlist."/>
    </div>
  );
};

export default WhishlistPage;
