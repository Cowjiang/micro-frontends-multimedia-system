import axios from "../request";

//get
export const mokeGet = (data) => {
    return axios({
        url: "/service/xxxx",
        method: "get",
        data,
        config: {
            headers: {
                'Request-Type': 'wechat'
            },
            timeout: 10000
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