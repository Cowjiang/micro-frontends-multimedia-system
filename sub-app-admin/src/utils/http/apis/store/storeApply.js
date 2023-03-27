import axios from "../../request";
import qs from 'qs'

export const getStoreArchives = (pageNumber, pageSize, keyWords) => {
    return axios({
        url: "/service/admin/store/archives",
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

export const postStoreArchives=(archivesId)=>axios({
    url:`/service/admin/store/archives/${archivesId}/store`,
    method:"POST",
    config: {
        timeout: 10000,
        loadingTarget: "#panel"
    }
})


