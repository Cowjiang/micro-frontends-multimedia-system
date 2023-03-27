import axios from "../../request";
import qs from 'qs'
//get
export const getRequestPaths = (pageNumber, pageSize, keyWords, groupId = null) => {
    return axios({
        url: "/service/admin/user/request-paths",
        method: "get",
        data: {
            pageNumber,
            pageSize,
            keyWords,
            groupId
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const addRequestPaths = (data) => {
    return axios({
        url: "/service/admin/user/request-path",
        method: "post",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


//get
export const getRequestPath = (id) => {
    return axios({
        url: `/service/admin/user/request-path/${id}`,
        method: "get",
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const updateRequestPaths = (data) => {
    return axios({
        url: "/service/admin/user/request-path",
        method: "put",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const deleteRequestPath = (id) => {
    return axios({
        url: "/service/admin/user/request-path",
        method: "DELETE",
        data: {
            id
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


//get
export const getRequestPathGroups = () => {
    return axios({
        url: `/service/admin/user/request-path/groups`,
        method: "get",
        config: {
            timeout: 10000,
            showLoading: false

        }
    })
}


export const addRequestPathGroup = (groupName) => {
    return axios({
        url: "/service/admin/user/request-path/group",
        method: "post",
        data: {
            groupName
        },
        config: {
            timeout: 10000,
            loadingTarget: 'body'
        }
    })
}