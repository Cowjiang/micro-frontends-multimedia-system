import axios from "../../request";

export const addAd = (data) => {
    return axios({
        url: "/service/admin/AD",
        method: "post",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const updateAd = (id, data) => {
    return axios({
        url: `/service/admin/AD/${id}`,
        method: "put",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const getAllAd = (pageSize, pageNumber) => {
    return axios({
        url: "/service/admin/AD",
        method: "get",
        data: {
            pageSize,
            pageNumber
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}