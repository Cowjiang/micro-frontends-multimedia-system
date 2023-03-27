import axios from "../../request";
import qs from 'qs'

export const getStoreCoupon = (pageNumber, pageSize, storeId, keyWords = "") =>
    axios({
        url: `/service/admin/store/${storeId}/coupon`,
        method: "get",
        data: {
            pageNumber, pageSize, keyWords
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })

export const postCoupon = (storeId, data) => axios({
    url: `/service/admin/store/${storeId}/coupon`,
    method: "POST",
    data,
    config: {
        timeout: 10000,
        loadingTarget: "#panel"
    }
})

export const deleteCoupon = (storeId, couponId) => axios({
    url: `/service/admin/store/${storeId}/coupon/${couponId}`,
    method: "DELETE",
    config: {
        timeout: 10000,
        loadingTarget: "#panel"
    }
})




