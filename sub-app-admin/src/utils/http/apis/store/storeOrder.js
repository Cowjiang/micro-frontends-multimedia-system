import axios from "../../request";
import qs from 'qs'

export const getStoreOrder = (pageNumber, pageSize, storeId) =>
    axios({
        url: "/service/admin/store/order/",
        method: "get",
        data: {
            pageNumber, pageSize, storeId
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })

export const refunds = (storeId) => axios({
    url: `/service/admin/store/order/${storeId}/refunds`,
    method: "PUT",
    config: {
        timeout: 10000,
        loadingTarget: "#panel"
    }
})




