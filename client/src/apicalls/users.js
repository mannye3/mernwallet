const {axiosInstance} = require(".");


export const LoginUser = async(payload) => {
    try {
        const {data} = await axiosInstance.post("http://localhost:5000/api/auth/login", payload);
        return data;
    } catch (error) {
       return error.response.data
    }
}




export const RegisterUser = async(payload) => {
    try {
        const {data} = await axiosInstance.post("http://localhost:5000/api/auth/register", payload);
        return data;
    } catch (error) {
       return error.response.data
    }
}





export const GetUserInfo = async() => {
    try {
        const {data} = await axiosInstance.get("http://localhost:5000/api/auth/check-auth");
        return data;
    } catch (error) {
       return error.response.data
    }
}
