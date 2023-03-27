import axios from "../../request";
import qs from 'qs'

export const getDynamics = (pageNumber, pageSize, keyWords) => {
    return axios({
        url: "/service/admin/dynamic/news",
        method: "get",
        data: {
            pageNumber, pageSize, keyWords
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const putDynamic = (data) => {
    return axios({
        url: "/service/admin/dynamic/",
        method:"PUT",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }

    })
}


