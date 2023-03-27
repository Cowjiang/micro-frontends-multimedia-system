import axios from "../../request";

//get
export const getStorePrinter = (pageNumber, pageSize, keyWords, storeId) =>
    axios({
        url: "/service/admin/store/printer",
        method: "get",
        data: {
            pageNumber, pageSize, keyWords, storeId
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
//post
export const addStorePrinter = (storeId, data) => {
    return axios({
        url: `/service/admin/store/${storeId}/printer`,
        method: "post",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const delStorePrinter = (printerId) => {
    return axios({
        url: `/service/admin/store/printer/${printerId}`,
        method: "DELETE",
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const getStorePrinterStatus = (printerId) => {
    return axios({
        url: `/service/store/printer/${printerId}/status`,
        method: "GET",
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


