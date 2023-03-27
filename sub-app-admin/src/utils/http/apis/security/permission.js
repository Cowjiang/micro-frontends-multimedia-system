import axios from "../../request";
import qs from 'qs'

export const getPermissions = (pageNumber, pageSize, keyWords) => {
    return axios({
        url: "/service/admin/user/permissions",
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

export const getPermission = (id) => {
    return axios({
        url: `/service/admin/user/permission/${id}`,
        method: "get",
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const addPermission = (data) => {
    return axios({
        url: "/service/admin/user/permission",
        method: "post",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const updatePermission = (data) => {
    return axios({
        url: "/service/admin/user/permission",
        method: "PUT",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const deletePermission = (id) => {
    return axios({
        url: "/service/admin/user/permission",
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

export const getPathByPermissionId = (permissionId) => {
    return axios({
        url: `/service/admin/user/permission/${permissionId}/request-path`,
        data: {
            pageSize: -1
        },
        method: "get",
        config: {
            timeout: 10000,
            loadingTarget: 'body'
        }
    })
}

export const setRequestPathPermission = (permissionId, requestPathId) => {
    return axios({
        url: `/service/admin/user/request-path/${requestPathId}/permission/${permissionId}`,
        method: "POST",
        config: {
            timeout: 10000,
        }
    })
}

export const deleteRequestPathPermission = (permissionId, requestPathId) => {
    return axios({
        url: `/service/admin/user/request-path/${requestPathId}/permission/${permissionId}`,
        method: "DELETE",
        config: {
            timeout: 10000,
        }
    })
}


