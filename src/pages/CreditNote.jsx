import React, { useState, useEffect } from 'react';
// import TopNav from "../components/All Headers/topNav/TopNav";
// import LogoHeader from "../components/All Headers/logoHeader/LogoHeader";
// import Header from "../components/All Headers/header/Header";
// import MobileHeader from "../components/All Headers/mobileHeader/MobileHeader";
import Style from "../pages/CreditNote.module.css";
import Loading from "../components/Loading";
import AppLayout from '../components/AppLayout';
import { FilterItem } from '../components/FilterItem';
import { GetAuthData, getRetailerBrandsNew, getCreditNotesList } from "../lib/store"


const CreditNote = () => {
    let img = 'assets/default-image.png'
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadedManufacture, setIsLoadedManufacture] = useState(false)
    const [manufacturerFilter, setManufacturerFilter] = useState()
    const [data, setData] = useState([])
    const [brand, setBrand] = useState({})
    
    useEffect(() => {
        setIsLoadedManufacture(true)
        GetAuthData().then((user) => {
            setUserData(user)

            const raw = {
                accountId : user?.data?.accountId, 
                key : user?.data?.x_access_token
              }

              getRetailerBrandsNew(raw).then( async (data) => {
                const result = await data
                console.log({result})
                setBrand(result)
                setIsLoadedManufacture(false)
              })
              .catch((err) => {
                console.log({ err: err.message })
              })
        }).catch((e) => {
            console.log({ e: e.message })
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        GetAuthData().then((user) => {
            getCreditNotesList(user?.data?.x_access_token, user?.data?.accountId, manufacturerFilter).then((data) => {
                setData(data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log({ err: err.message })
                setIsLoading(false)
            })
        }).catch((e) => {
            console.log({ e: e.message })
            setIsLoading(false)
        })
    }, [manufacturerFilter])

    const btnHandler = ({ manufacturerId }) => {
        console.log({manufacturerId})
        setIsLoadedManufacture(false)
        setManufacturerFilter(manufacturerId)
    }

    console.log({brand})

    return (
        <AppLayout
            filterNodes={
                <>
                    <FilterItem
                        minWidth="220px"
                        label="Manufacturer"
                        name="Manufacturer"
                        value={manufacturerFilter}
                        options={
                            brand && brand.length > 0
                                ? brand.map((manufacturer) => ({
                                    label: manufacturer.Name,
                                    value: manufacturer.Id,
                                }))
                                : []
                        }
                        onChange={(value) => btnHandler({ manufacturerId: value })}
                    />

                </>
            }
        >
            <div className="container p-0 ">
                <div className="row p-0 m-0 d-flex flex-column justify-content-around align-items-center col-12">
                    <hr className="hrBgColor"></hr>
                    <div className={Style.productDeatils}>
                        <div className={Style.titleAndFilter}>
                            <div>
                                <h3>Transactions</h3>
                            </div>
                        </div>
                        
                        {
                            !isLoading ? (
                                data.length > 0 ? (
                                    data.map((item) => (
                                        <div className={Style.productdata} key={item.id}>
                                            <div className={Style.productDataDeatils}>
                                                <div className={item?.ManufacturerLogo ? Style.ProductImg : Style.DefaultProductImg}>
                                                    <img src={item?.ManufacturerLogo ?? img} alt='img' />
                                                </div>
                                                <div className={Style.productTitle}>
                                                    <h3>
                                                        {item.Manufacturer}
                                                        {/* | <span>{item.productDescription}</span> */}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className={Style.pricDeatils}>
                                                <div className={Style.priceAndDate}>
                                                    {item.Status__c === 'Issued' ? (
                                                        <p className={Style.plusPrice}>
                                                            +${item.Wallet_Amount__c}
                                                        </p>
                                                    ) : (
                                                        <p className={Style.minusPrice}>
                                                            -${item.Wallet_Amount__c}
                                                        </p>
                                                    )}
                                                    <small>{new Date(item.CreatedDate).toLocaleString()}</small>
                                                </div>
                                                <div className={Style.viewBtn}>
                                                    {/* <button>View Now</button> */}
                                                </div>
                                            </div>
                                            <hr className="hrBgColor"></hr>
                                        </div>
                                    ))
                                ) : (
                                    <div className={Style.noDataFound}>
                                        <h5>No Data Found</h5>
                                    </div>
                                )
                            ) : (
                                <Loading height={"70vh"} />
                            )
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreditNote;
