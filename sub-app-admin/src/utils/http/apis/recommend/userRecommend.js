import axios from "../../request";

//get
export const getAllSchoolUserRecommend = (pageNumber, pageSize, keyWords, schoolName) => {
    return axios({
        url: "/service/admin/school/user/recommend",
        method: "get",
        data: {
            pageNumber, pageSize, keyWords, schoolName
        },
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}
//post
export const updateSchoolRecommend = (data) => {
    return axios({
        url: "/service/admin/school/user/recommend",
        method: "put",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}
export const deleteSchoolRecommend = (id) => {
    return axios({
        url: `/service/admin/school/user/recommend/${id}`,
        method: "delete",
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}


export const addSchoolRecommend = (data) => {
    return axios({
        url: `/service/admin/school/user/recommend`,
        method: "POST",
        data,
        config: {
            timeout: 10000,
            loadingTarget: "#panel"
        }
    })
}