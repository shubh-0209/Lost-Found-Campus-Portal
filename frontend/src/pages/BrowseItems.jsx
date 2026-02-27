import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import "../Browse.css";



const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({
    currentPage: 1,
    totalPages: 1
  });


  useEffect(() => {
    fetchItems();
  }, [filters, search, pageData.currentPage]);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        search,
        page: pageData.currentPage,
        ...filters
      });

      const res = await fetch(
        `http://localhost:5000/api/items?${queryParams}`
      );

      const data = await res.json();

      setItems(data.items);
      setPageData({
        currentPage: data.currentPage,
        totalPages: data.totalPages
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="browse-container">
        <h2 className="page-title">Browse Lost & Found Items</h2>

        <SearchBar setSearch={setSearch} />

        <div className="layout">
          <FilterSidebar setFilters={setFilters} />

          <div className="items-section">
            {loading ? (
              <Loader />
            ) : items.length === 0 ? (
              <p className="no-items">No items found.</p>
            ) : (
              <div className="grid">
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}

<Pagination
  pageData={pageData}
  setPageData={setPageData}
/>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BrowseItems;

