import axios from "../../request";

//get
export const getSearchSchool = (keywords, limit) => {
    return axios({
        url: "/service/school",
        method: "get",
        data: {
            keywords,
            limit
        },
        config: {
            timeout: 10000,
            showLoading: false
        }
    })
}
//post
export const mokePost = (data) => {
    return axios({
        url: "/service/xxxx",
        method: "post",
        data,
        config: {
            headers: {
                'Request-Type': 'wechat'
            },
            timeout: 10000
        }
    })
}