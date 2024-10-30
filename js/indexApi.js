import { cookieRoute, classRoute, postRoute} from "../mainApi.js";

export const cookieCheckApi = `${cookieRoute}/check`
export const readByAdminApi = `${classRoute}/readByAdmin`
export const readByTrAndGuardianApi = `${classRoute}/readByTeacherAndGuardian`

export const getPostsApi = `${postRoute}/getPosts`;