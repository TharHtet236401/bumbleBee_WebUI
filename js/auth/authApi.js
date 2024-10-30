import {authRoute, cookieRoute, schoolRoute} from "../mainApi.js";

const registerApi = `${authRoute}/web/register`
const loginApi = `${authRoute}/login`
const pwdResetApi = `${authRoute}/passwordReset`
const changePwdApi = `${authRoute}/changePassword`
const logOutApi = `${authRoute}/logout`

const cookieCheckApi = `${cookieRoute}/check`

const createSchoolApi = `${schoolRoute}/create`;

export { registerApi, loginApi, logOutApi, cookieCheckApi, createSchoolApi}