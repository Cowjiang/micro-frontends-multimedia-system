import axios from "../../request";

//get
export const getUser = (pageNumber, pageSize, account) => {
    return axios({
        url: "/service/admin/user",
        method: "get",
        data: {
            pageNumber,
            pageSize,
            account
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}

// 获取用户角色
export const getUserUserRoles = (userId) => {
    return axios({
        url: `/service/admin/user/${userId}/user/roles`,
        method: "GET",
        config: {
            timeout: 10000,
            loadingTarget: "#drawer"
        }
    })
}
// 为用户添加角色
export const addUserUserRole = (userId, roleId) => {
    return axios({
        url: `/service/admin/user/${userId}/user/role/${roleId}`,
        method: "POST",
        config: {
            timeout: 10000,
            loadingTarget: "#drawer"
        }
    })
}
export const deleteUserUserRole = (userId, roleId) => {
    return axios({
        url: `/service/admin/user/${userId}/user/role/${roleId}`,
        method: "DELETE",
        config: {
            timeout: 10000,
            loadingTarget: "#drawer"
        }
    })
}


export const updateUser = (id, user) => {
    return axios({
        url: `/service/admin/user/${id}`,
        method: "PUT",
        data: user,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const getSearchUser = (username, pageNumber = 1, pageSize = 8) => {
    return axios({
        url: `/service/user/search`,
        method: "GET",
        data: {
            username, pageNumber, pageSize
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}




