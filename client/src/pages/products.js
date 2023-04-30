import { useEffect, useState } from "react";
import { api } from "../components/api";
import AddProduct from "../components/popups/AddProduct";
import EditProduct from "../components/popups/EditProduct";

import { FaPlus } from "react-icons/fa";
import Table from "../components/Table";
import PopUp from "../components/popups/PopUp";
import { useAuthContext } from "../hooks/useAuthContext";

const HeadersList = [
  { displayName: "المنتج", dbName: "product_name" },
  { displayName: "الشرح", dbName: "description" },
];

const ProductsPage = () => {
  const { user } = useAuthContext();

  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState(false);
  const [selectedProduct, setlectProduct] = useState("");

  let getData = async () => {
    const response = await api.get("/api/products", {
      headers: {
        Authorization: `Basic ${user.token}`,
      },
    });
    setProducts(response.data);
  };

  useEffect(() => {
    getData();
  }, []);
  function closePopup() {
    setPopup(false);
    setlectProduct("");
  }
  function openPopup() {
    setPopup(true);
  }
  function handelRowClick(selectedRow) {
    setlectProduct(selectedRow);
  }

  return (
    <>
      <PopUp popUp={popup}>
        <AddProduct closePopup={closePopup} />
      </PopUp>
      <PopUp popUp={selectedProduct}>
        <EditProduct closePopup={closePopup} product={selectedProduct} />
      </PopUp>

      <div className="lecturepage w-full px-6 py-4 h-screen">
        {/*----- TITLE -----*/}
        <h1 className="text-5xl text-center ml-auto px-6 py-4 mb-6 noselect">
          منتجات المكتبة
        </h1>
        {/*----- container -----*/}
        <div className="container flex gap-2">
          <Table
            Headers={HeadersList}
            infos={products}
            onRowClick={handelRowClick}
          />
          <div>
            <div
              className=" w-56 h-56 bg-white rounded-lg flex items-center justify-center cursor-pointer"
              onClick={openPopup}
            >
              <FaPlus className="text-gray-400 text-7xl" />
            </div>
            <div className=" w-56 h-56 bg-white mt-2 rounded-lg"></div>
            <div className=" w-56 h-36 bg-white mt-2 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
