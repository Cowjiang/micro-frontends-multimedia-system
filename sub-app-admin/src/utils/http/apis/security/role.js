import axios from "../../request";

//get
export const getRoles = (pageNumber, pageSize, keyWords) => {
    return axios({
        url: "/service/admin/user/roles",
        method: "get",
        data: {
            pageNumber,
            pageSize,
            keyWords
        },
        config: {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const addRole = (data) => {
    return axios({
        url: "/service/admin/user/role",
        method: "post",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const updateRole = (data) => {
    return axios({
        url: "/service/admin/user/role",
        method: "put",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const getRole = (id) => {
    return axios({
        url: `/service/admin/user/role/${id}`,
        method: "get",

        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}
export const deleteRole = (id) => {
    return axios({
        url: `/service/admin/user/role`,
        method: "delete",
        data: {
            id
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const getRolePermissions = (id) => {
    return axios({
        url: `/service/admin/user/role/${id}/permissions`,
        method: "get",
        data: {
            pageNumber: 1,
            pageSize: -1
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

export const addRolePermissions = (id, permissionId) => {
    return axios({
        url: `/service/admin/user/role/${id}/permissions/${permissionId}`,
        method: "post",
        data: {
            pageNumber: 1,
            pageSize: -1
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const delRolePermissions = (id, permissionId) => {
    return axios({
        url: `/service/admin/user/role/${id}/permissions/${permissionId}`,
        method: "delete",
        data: {
            pageNumber: 1,
            pageSize: -1
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

