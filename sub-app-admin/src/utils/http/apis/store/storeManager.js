import axios from "../../request";
import qs from 'qs'

export const getStore = (pageNumber, pageSize, keywords = "") => {
    return axios({
        url: "/service/admin/store/search",
        method: "post",
        data: {
            pageNumber, pageSize, keywords
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const putStore = (data) => axios({
    url: "/service/admin/store/",
    method: "put",
    data,
    config: {
        timeout: 10000,
        loadingTarget: "#panel"
    }
})


