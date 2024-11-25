export const mainApi = "https://tharhtetaung.xyz"
// const mainApi = "http://127.0.0.1:3000";
// export const mainWebsite = "https://159.223.127.127"
export const mainWebsite = "http://127.0.0.1:5501";


const authRoute = `${mainApi}/api/auth`;
const schoolRoute = `${mainApi}/api/school`;
const classRoute = `${mainApi}/api/class`;
const userRoute = `${mainApi}/api/user`;
const postRoute = `${mainApi}/api/posts`;
const studentRoute = `${mainApi}/api/student`;
const requestRoute = `${mainApi}/api/request`;
const testRoute = `${mainApi}/api/test`;
const leaveRequestRoute = `${mainApi}/api/leaveRequest`;
const leaveRequestTypeRoute = `${mainApi}/api/leaveRequestType`;
const imageRoute = `${mainApi}/api/image`;
const cookieRoute = `${mainApi}/api/cookie`;

//Cookie
export const cookieCheckApi = `${cookieRoute}/check`;

// Auth
export const registerApi = `${authRoute}/web/register`;
export const loginApi = `${authRoute}/login`;
export const pwdResetApi = `${authRoute}/passwordReset`;
export const changePwdApi = `${authRoute}/changePassword`;
export const logOutApi = `${authRoute}/logout`;

// Class Related functions
export const createClassApi = `${classRoute}/create`;
export const deleteClassApi = `${classRoute}/delete`;
export const editClassApi = `${classRoute}/edit`;
export const allClassesApi = `${classRoute}/allClasses`;
export const readByAdminApi = `${classRoute}/readByAdmin`;
export const readByTrAndGuardianApi = `${classRoute}/readByTeacherAndGuardian`;
export const gradeNamesApi = `${classRoute}/gradeNames`;
export const classNamesApi = `${classRoute}/classNames`;
export const classNamesByTeacherNewApi = (gradeName) => `${classRoute}/classNamesByTeacherNew/${gradeName}`;
export const gradeNamesByTeacherApi = `${classRoute}/gradeNamesByTeacher`;
export const classNamesByTeacherApi = `${classRoute}/classNamesByTeacher`;
export const getClassByIdApi = (classId) => `${classRoute}/classById/${classId}`;

// Image Related functions
export const uploadProfilePicture = `${userRoute}/upload-profile-picture`;
export const uploadProfilePictureSimple = `${userRoute}/upload-profile-picture-simple`;

// Leave Request functions
export const createLeaveRequestApi = `${leaveRequestRoute}/create`;
export const readLeaveRequestByClassApi = (classId) => `${leaveRequestRoute}/readByClass/${classId}`;
export const readAllLeaveRequestsApi = `${leaveRequestRoute}/readAllReq`;
export const editLeaveRequestApi = `${leaveRequestRoute}/edit`;
export const deleteLeaveRequestApi = `${leaveRequestRoute}/delete`;
export const respondLeaveRequestApi = `${leaveRequestRoute}/respond`;
export const getLeaveReasonsApi = `${leaveRequestRoute}/reasons`;
export const readAllClassLeaveReqApi = `${leaveRequestRoute}/readAllClassLeaveReq`

// Post Api
export const createPostApi = `${postRoute}/create`;
export const createPostWithProgressApi = `${postRoute}/createWithProgress`;
export const getPostsApi = `${postRoute}/getPosts`;
export const getFeedsApi = `${postRoute}/getFeeds`;
export const getAnnouncementsApi = `${postRoute}/getAnnouncements`;
export const editPostApi = (postId) => `${postRoute}/edit/${postId}`;
export const deletePostApi = (postId) => `${postRoute}/delete/${postId}`;
export const filterFeedsApi = `${postRoute}/filterFeeds`;

// Request Api
export const joinClassApi = `${requestRoute}/create`;
export const readTeacherRequestsApi = (currentClassId) => `${requestRoute}/readTeacherRequests?classId=${currentClassId}`;
export const readGuardianRequestsApi = (currentClassId, studentId) => `${requestRoute}/readGuardianRequests?classId=${currentClassId}&studentId=${studentId}`;
export const respondTeacherReqApi = `${requestRoute}/respondTeacherReq`;
export const respondGuardianReqApi = `${requestRoute}/respondGuardianReq`;

// School Api
export const createSchoolApi = `${schoolRoute}/create`;
export const editSchoolApi = `${schoolRoute}/edit`;
export const getSchoolApi = `${schoolRoute}/getSchool`;
export const deleteSchoolApi = `${schoolRoute}/delete`;

// Student Api
export const addNewStudentToClassApi = (classId) => `${studentRoute}/add/${classId}`;
export const getStudentsByClassApi = (classId) => `${studentRoute}/get/${classId}`;
export const getStudentsByClassCodeApi = (classCode) => `${studentRoute}/getByClassCode/${classCode}`;
export const getStudentInfoApi = (studentId) => `${studentRoute}/getStudentInfo/${studentId}`;
export const getStudentByParentApi = `${studentRoute}/getStudentByParent`;
export const editStudentApi = (studentId) => `${studentRoute}/edit/${studentId}`;
export const deleteStudentApi = (studentId) => `${studentRoute}/delete/${studentId}`;

// New version routes
export const checkStudentExistsApi = `${studentRoute}/checkStudentExists`;
export const addStudentToMultipleClassApi = (classId) => `${studentRoute}/addStudentToMultipleClass/${classId}`;

// User Api
export const updateUserInfoApi = `${userRoute}/update`;
export const deleteUserApi = (userId) => `${userRoute}/delete/${userId}`;
export const getAllUsersApi = `${userRoute}/all`;
export const getUserByIdApi = (userId) => `${userRoute}/${userId}`;
export const getUserProfileApi = `${userRoute}/profile`;
