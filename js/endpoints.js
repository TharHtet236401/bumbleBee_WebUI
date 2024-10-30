const mainApi = "http://127.0.0.1:3000"

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

const cookieCheckApi = `${cookieRoute}/check`

//Auth 
const registerApi = `${authRoute}/web/register`
const loginApi = `${authRoute}/login`
const pwdResetApi = `${authRoute}/passwordReset`
const changePwdApi = `${authRoute}/changePassword`
const logOutApi = `${authRoute}/logout`

//Class Related functions
const createClassApi = `${classRoute}/create`
const deleteClassApi = `${classRoute}/delete`
const editClassApi = `${classRoute}/edit`
const allClassesApi = `${classRoute}/allClasses`
const readByAdminApi = `${classRoute}/readByAdmin`
const readByTrAndGuardianApi = `${classRoute}/readByTeacherAndGuardian`
const gradeNamesApi = `${classRoute}/gradeNames`
const classNamesApi = `${classRoute}/classNames`
const classNamesByTeacherNewApi = (gradeName) =>  `${classRoute}/classNamesByTeacherNew/${gradeName}`;
const gradeNamesByTeacherApi = `${classRoute}/gradeNamesByTeacher`;
const classNamesByTeacherApi = `${classRoute}/classNamesByTeacher`;
const getClassByIdApi = (classId) => `${classRoute}/classById/${classId}`;

//Image Related functions
const uploadProfilePicture = `${userRoute}/upload-profile-picture`;
const uploadProfilePictureSimple = `${userRoute}/upload-profile-picture-simple`;

//Leave Request functions
const createLeaveRequestApi = `${leaveRequestRoute}/create`;
const readLeaveRequestByClassApi = (classId) => `${leaveRequestRoute}/readByClass/${classId}`;
const readAllLeaveRequestsApi = `${leaveRequestRoute}/readAllReq`;
const editLeaveRequestApi = `${leaveRequestRoute}/edit`;
const deleteLeaveRequestApi = `${leaveRequestRoute}/delete`;
const respondLeaveRequestApi = `${leaveRequestRoute}/respond`;
const getLeaveReasonsApi = `${leaveRequestRoute}/reasons`;

//Post Api
const createPostApi = `${postRoute}/create`;
const createPostWithProgressApi = `${postRoute}/createWithProgress`;
const getPostsApi = `${postRoute}/getPosts`;
const getFeedsApi = `${postRoute}/getFeeds`;
const getAnnouncementsApi = `${postRoute}/getAnnouncements`;
const editPostApi = (postId) => `${postRoute}/edit/${postId}`;
const deletePostApi = (postId) => `${postRoute}/delete/${postId}`;
const filterFeedsApi = `${postRoute}/filterFeeds`;

//Request Api
const joinClassApi = `${requestRoute}/create`;
const readTeacherRequestsApi = `${requestRoute}/readTeacherRequests`;
const readGuardianRequestsApi = `${requestRoute}/readGuardianRequests`;
const respondTeacherReqApi = `${requestRoute}/respondTeacherReq`;
const respondGuardianReqApi = `${requestRoute}/respondGuardianReq`;

//School Api
const createSchoolApi = `${schoolRoute}/create`;
const editSchoolApi = `${schoolRoute}/edit`;
const getSchoolApi = `${schoolRoute}/getSchool`;
const deleteSchoolApi = `${schoolRoute}/delete`;

//Student Api
const addNewStudentToClassApi = (classId) => `${studentRoute}/add/${classId}`;
const getStudentsByClassApi = (classId) => `${studentRoute}/get/${classId}`;
const getStudentsByClassCodeApi = (classCode) => `${studentRoute}/getByClassCode/${classCode}`;
const getStudentInfoApi = (studentId) => `${studentRoute}/getStudentInfo/${studentId}`;
const getStudentByParentApi = `${studentRoute}/getStudentByParent`;
const editStudentApi = (studentId) => `${studentRoute}/edit/${studentId}`;
const deleteStudentApi = (studentId) => `${studentRoute}/delete/${studentId}`;

// New version routes
const checkStudentExistsApi = `${studentRoute}/checkStudentExists`;
const addStudentToMultipleClassApi = (classId) => `${studentRoute}/addStudentToMultipleClass/${classId}`;

//User Api
const updateUserInfoApi = `${userRoute}/update`;
const deleteUserApi = (userId) => `${userRoute}/delete/${userId}`;
const getAllUsersApi = `${userRoute}/all`;
const getUserByIdApi = (userId) => `${userRoute}/${userId}`;
