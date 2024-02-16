import React, { useEffect, useState } from "react";
import CustomerSupportPage from "../components/CustomerSupportPage/CustomerSupportPage";
import { FilterItem } from "../components/FilterItem";
import FilterSearch from "../components/FilterSearch";
import { DestoryAuth, GetAuthData, getSupportList } from "../lib/store";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination/Pagination";
import Layout from "../components/Layout/Layout";
import { useManufacturer } from "../api/useManufacturer";
import { useRetailersData } from "../api/useRetailersData";
import AppLayout from "../components/AppLayout";

let PageSize = 10;
const CustomerSupport = () => {
  const [supportList, setSupportList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState(null);
  const [retailerFilter, setRetailerFilter] = useState(null);
  const { data: manufacturers } = useManufacturer();
  const { data: retailerData } = useRetailersData();
  useEffect(() => {
    GetAuthData()
      .then((user) => {
        if (user) {
          getSupportList({ user })
            .then((supports) => {
              if (supports) {
                setSupportList(supports);
              }
              setLoaded(true);
            })
            .catch((error) => {
              console.error({ error });
            });
        } else {
          DestoryAuth()
            .then((res) => {
              console.log({ res });
            })
            .catch((err1) => {
              console.error({ err1 });
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return(    <AppLayout>
    <div className="row d-flex flex-column justify-content-around align-items-center lg:min-h-[300px] xl:min-h-[400px]">
      <div className="col-4">
        <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">
          Coming Soon...
        </p>
      </div>
    </div>
  </AppLayout>)
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="Retailer"
            name="Retailer"
            value={retailerFilter}
            options={retailerData?.data?.map((retailer) => ({
              label: retailer.Name,
              value: retailer.Id,
            }))}
            onChange={(value) => setRetailerFilter(value)}
          />
          <FilterItem
            minWidth="220px"
            label="Manufacturer"
            name="Manufacturer"
            value={manufacturerFilter}
            options={manufacturers?.data?.map((manufacturer) => ({
              label: manufacturer.Name,
              value: manufacturer.Id,
            }))}
            onChange={(value) => setManufacturerFilter(value)}
          />
          <FilterSearch
            onChange={(e) => setSearchBy(e.target.value)}
            value={searchBy}
            placeholder={"Search by case number"}
            minWidth="201px"
          />

          <button
            className="border px-2.5 py-1 leading-tight"
            onClick={() => {
              setManufacturerFilter(null);
              setRetailerFilter(null);
              setSearchBy("");
            }}
          >
            CLEAR ALL
          </button>
        </>
      }
    >
      <>
        {!loaded ? (
          <Loading />
        ) : (
          <CustomerSupportPage
            data={supportList}
            currentPage={currentPage}
            PageSize={PageSize}
            manufacturerFilter={manufacturerFilter}
            searchBy={searchBy}
            retailerFilter={retailerFilter}
          />
        )}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={supportList?.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
        {/* <OrderStatusFormSection /> */}
      </>
    </AppLayout>
  );
};

export default CustomerSupport;
