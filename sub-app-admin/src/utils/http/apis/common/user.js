import axios from "../../request";
import qs from 'qs'

//post
export const login = (data) => {
    return axios({
        url: "/service/login",
        method: "post",
        data:qs.stringify(data),
        config: {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            timeout: 10000
        }
    })
}