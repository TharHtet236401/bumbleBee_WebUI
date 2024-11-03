import { checkCookie } from "../utils/cookies.js";
import * as endpoints from "./endpoints.js";
import {formatDate } from "../utils/utils.js"

const body = document.body;
const mainEl = document.querySelector("main");

const classDetailDialogBox = document.getElementById("class_detail_dialog_box");
const class_detail_dialog_clost_btn = document.getElementById(
    "class_detail_dialog_close_btn"
);

const create_class_dialog_box = document.getElementById(
    "create_class_dialog_box"
);
const create_class_dialog_close_btn = document.getElementById(
    "create_class_dialog_close_btn"
);
const leave_requests_btn = document.getElementById("leave_requests_btn")

const join_class_dialog_box = document.getElementById("join_class_dialog_box");
const join_class_dialog_close_btn = document.getElementById(
    "join_class_dialog_box"
);

const parent_join_class_dialog_box = document.getElementById(
    "parent_join_class_dialog_box"
);
const parent_join_class_dialog_close_btn = document.getElementById(
    "parent_join_class_dialog_close_btn"
);

const create_post_dialog_box = document.getElementById(
    "create_post_dialog_box"
);
const create_post_dialog_close_btn = document.getElementById(
    "create_post_dialog_close_btn"
);

const create_announcement_dialog_box = document.getElementById(
    "create_announcement_dialog_box"
);
const create_announcement_dialog_close_btn = document.getElementById(
    "create_announcement_dialog_close_btn"
);

const add_student_button = document.getElementById("add_student_button");
const add_student_dialog_box = document.getElementById(
    "add_student_dialog_box"
);
const add_student_close_dialog_box = document.getElementById(
    "add_student_dialog_close_btn"
);
const add_student_form = document.getElementById("add_student_form");

const imageInput = document.getElementById("post_image");
const documentInput = document.getElementById("post_document");

const dashboard_sidebar = document.getElementById("dashboard_sidebar");
const home_sidebar = document.getElementById("home_sidebar");
const announcement_sidebar = document.getElementById("announcement_sidebar");
const chat_sidebar = document.getElementById("chat_sidebar");
const leave_reqSideBar = document.getElementById("leave_reqSideBar")
const logout_sidebar = document.getElementById("logout_sidebar")

const sidebar_txts = document.querySelectorAll(".sidebar_txt");
const dashboard_txt = document.getElementById("dashboard_txt");
const home_txt = document.getElementById("home_txt");
const announcement_txt = document.getElementById("announcement_txt");
const leave_req_txt = document.getElementById("leave_req_txt")
const chat_txt = document.getElementById("chat_txt");

const create_class_form = document.getElementById("create_class_form");
const join_class_form = document.getElementById("join_class_form");
const create_feed_form = document.getElementById("create_feed_form");
const create_announcement_form = document.getElementById(
    "create_announcement_form"
);
const join_class_code_form = document.getElementById("join_class_code_form");
const search_student = document.getElementById("studentSearch");
const parent_join_class_form = document.getElementById(
    "parent_join_class_form"
);

const view_detail_dialog_schoolnameEl = document.getElementById(
    "view_detail_dialog_schoolname"
);
const view_detail_dialog_classnameEl = document.getElementById(
    "view_detail_dialog_classname"
);
const view_detail_dialog_classcodeEl = document.getElementById(
    "view_detail_dialog_classcode"
);
const view_detail_dialog_teacherEl = document.getElementById(
    "view_detail_dialog_teacher"
);
const view_detail_dialog_studentsEl = document.getElementById(
    "view_detail_dialog_students"
);
const view_detail_dialog_parentsEl = document.getElementById(
    "view_detail_dialog_parents"
);
const view_detail_dialog_pending_parentsEl = document.getElementById(
    "view_detail_dialog_pending_parents"
);

const teacher_request_btn = document.getElementById("teacher_request_btn");

const student_detail_dialog_box = document.getElementById("student_detail_box");
const view_detail_dialog_student_nameEl = document.getElementById(
    "view_detail_dialog_student_name"
);
const view_detail_dialog_student_dobEl = document.getElementById(
    "view_detail_dialog_student_dob"
);
const student_details_dialog_close_btnEl = document.getElementById(
    "student_details_dialog_close_btn"
);

let posts_wrapper;

let role;
let classes = [];
let requestIds = [];
let leaveRequestIds = [];
let currentClass;
let dashboardClassButton;
let posts = [];
let feeds = [];
let announcements = [];
let myChildren = []
let leaveRequests = [];
let token;
let studentIds = [];
let studentParents = [];
let pendingParents = [];
let currentclassCode;
let classCodeChildren = [];
let classApi;
let classWrapper;
let teacher_requests_modal;
let leave_requests_modal;
let classListNames = [];
let classListGrades = [];

const teacherRequests = [];
document.addEventListener("DOMContentLoaded", async () => {
    let leaveRequestData 
    const { statusCode, resData } = await checkCookie(
        endpoints.cookieCheckApi
    );
    if (statusCode != 200) {
        alert("Cookie does not exist. Redirecting to sign in page");
        window.location.href = `${endpoints.mainWebsite}/signIn.html`;
    } else if (statusCode == 200) {
        token = resData.token;
        role = resData.userData.roles[0];

    if(role == "guardian" || role == "teacher"){
        classApi = endpoints.readByTrAndGuardianApi
        teacher_request_btn.remove()
        if(role == "guardian"){
            myChildren = resData.userData.childern
            add_student_button.remove();
            leaveRequestData = await getLeaveRequests(endpoints.readAllLeaveRequestsApi, token)
            // add_student_button.style.display == "none"
        }else{
            leaveRequestData = await getLeaveRequests(endpoints.readAllClassLeaveReqApi, token)
        }
    }else{
        classApi = endpoints.readByAdminApi
        add_student_button.remove()
        leave_reqSideBar.remove()
        // add_student_button.style.display == "none"
    }
    
    const classData = await getClasses(
        classApi,
        token
    );

        if (classData.result) {
            classes = classData.result.classes;
            classListNames = classes.map((classData) => classData.className);
            classListGrades = classes.map((classData) => classData.grade);
            const classNameGradeObj = classListNames
                .map((name, index) => ({
                    className: name,
                    gradeName: classListGrades[index],
                }))
                .sort((a, b) => a.gradeName - b.gradeName);
            const classTypeSelectEl = document.getElementById("class_type");
            for (const classData of classNameGradeObj) {
                const optionEl = document.createElement("option");
                optionEl.value = `${classData.className} (${classData.gradeName})`;
                optionEl.innerText = `${classData.className} (${classData.gradeName})`;

                classTypeSelectEl.appendChild(optionEl);
            }
        }
        const postDatas = await getPosts(
            endpoints.getPostsApi,
            token
        );
        const postStatusCode = postDatas.statusCode;
        if (postStatusCode === 200) {
            posts = postDatas.resData.result.items;
            feeds = posts.filter((post) => post.contentType === "feed");
            announcements = posts.filter(
                (post) => post.contentType === "announcement"
            );
        }
    }

    
    if(leaveRequestData){
        leaveRequests = leaveRequestData.result;
    }
    
});

dashboard_sidebar.addEventListener("click", () => {
    removeAllUnderlineInSidebarTxt();
    dashboard_txt.classList.add("side_bar_active");

    if (role == "admin") {
        dashboardClassButton = "Create class";
    } else {
        dashboardClassButton = "Join class";
    }

    if (classes.length == 0) {
        mainEl.innerHTML = `
        <div class="dashboard_wrapper">
                    <div class="dashboard_header_wrapper header_wrapper">
                        <div class="school_info">
                            <div class="school_logo_wrapper"></div>
                            <p class="school_name">GUSTO</p>
                            <p class="class_name">(Apple)</p>
                        </div>
    
                        <svg
                            class="notification_icon"
                            width="26"
                            height="31"
                            viewBox="0 0 35 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.9764 37.1197C11.3965 38.5301 12.2581 39.7667 13.4334 40.6459C14.6086 41.5251 16.0348 42 17.5 42C18.9652 42 20.3914 41.5251 21.5666 40.6459C22.7419 39.7667 23.6035 38.5301 24.0236 37.1197H10.9764ZM0 35.166H35V29.305L31.1111 23.444V13.6757C31.1111 11.8798 30.7591 10.1014 30.075 8.44222C29.391 6.78301 28.3884 5.27542 27.1245 4.00551C25.8606 2.73561 24.3601 1.72827 22.7087 1.041C21.0574 0.353732 19.2874 0 17.5 0C15.7126 0 13.9426 0.353732 12.2913 1.041C10.6399 1.72827 9.1394 2.73561 7.87549 4.00551C6.61158 5.27542 5.60899 6.78301 4.92497 8.44222C4.24095 10.1014 3.88889 11.8798 3.88889 13.6757V23.444L0 29.305V35.166Z"
                                fill="#B4E0F7"
                            />
                        </svg>
                        <p id="create_class_btn" class="create_class_btn create_btn">${dashboardClassButton}</p>
                    </div>
    
                    <div class="dashboard_main_wrapper">
                        <div class="classes_wrapper">
                            <div class="dashboard_alert_wrapper">
                                <p class="dashboard_alert">No classes available to show</p>
                                <!-- <p id="create_new_class_model_opener" class="create_new_class_model_opener">Create new class</p> -->
                            </div> 
                        </div>
                    </div>
        `;
    } else if (classes.length > 0) {
        mainEl.innerHTML = `
        <div class="dashboard_wrapper">
                    <div class="dashboard_header_wrapper header_wrapper">
                        <div class="school_info">
                            <div class="school_logo_wrapper"></div>
                            <p class="school_name">GUSTO</p>
                        </div>
    
                        <svg
                            class="notification_icon"
                            width="26"
                            height="31"
                            viewBox="0 0 35 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.9764 37.1197C11.3965 38.5301 12.2581 39.7667 13.4334 40.6459C14.6086 41.5251 16.0348 42 17.5 42C18.9652 42 20.3914 41.5251 21.5666 40.6459C22.7419 39.7667 23.6035 38.5301 24.0236 37.1197H10.9764ZM0 35.166H35V29.305L31.1111 23.444V13.6757C31.1111 11.8798 30.7591 10.1014 30.075 8.44222C29.391 6.78301 28.3884 5.27542 27.1245 4.00551C25.8606 2.73561 24.3601 1.72827 22.7087 1.041C21.0574 0.353732 19.2874 0 17.5 0C15.7126 0 13.9426 0.353732 12.2913 1.041C10.6399 1.72827 9.1394 2.73561 7.87549 4.00551C6.61158 5.27542 5.60899 6.78301 4.92497 8.44222C4.24095 10.1014 3.88889 11.8798 3.88889 13.6757V23.444L0 29.305V35.166Z"
                                fill="#B4E0F7"
                            />
                        </svg>
                        <p id="create_class_btn" class="create_class_btn create_btn">${dashboardClassButton}</p>
                    </div>
    
                    <div class="dashboard_main_wrapper">
                        <div id="class_wrapper" class="classes_wrapper">
                            
                        
                        </div>
                    </div>
        `;
        classWrapper = document.getElementById("class_wrapper");
        for (const classData of classes) {
            const classHTMLEl = `
            <div class="class-left">
                <p class="class-left__classname">${classData.className}</p>
                <p class="class-left__grade">&nbsp;(${classData.grade})</p>
            </div>
            `;

            let classButton;
            classButton = `
                        <div class="class-right">
                            <p class="view_detail_btn">View details</p>
                        </div>
                `;
            // if(role == "admin"){
            //     classButton = `
            //             <div class="class-right">
            //                 <p class="view_detail_btn">View details</p>
            //             </div>
            //     `
            // }else if(role == "teacher"){
            //     classButton = `
            //             <div class="class-right">
            //                 <p class="view_detail_btn">View details</p>
            //             </div>
            //     `
            // }

            // const classHTMLEl = `
            //         <div class="class">
            //             <div class="class-left">
            //                 <p class="class-left__classname">${classData.className}</p>
            //                 <p class="class-left__grade">&nbsp;(${classData.grade})</p>
            //             </div>
            //             <div class="class-right">
            //                 <p class="view_detail_btn">View details</p>
            //             </div>
            //         </div>
            // `
            classWrapper.innerHTML += `<div class="class"> ${classHTMLEl} ${classButton} </div>`;
            // classWrapper.innerHTML += classHTMLEl;
        }
    }

    const create_class_btn = document.getElementById("create_class_btn");
    addViewDetailsFunctionality();

    class_detail_dialog_clost_btn.addEventListener("click", () => {
        classDetailDialogBox.close();
        view_detail_dialog_studentsEl.innerHTML = "";
    });

    create_class_btn.addEventListener("click", () => {
        if (role == "admin") {
            create_class_dialog_box.showModal();
        } else if (role == "teacher") {
            join_class_dialog_box.showModal();
        } else {
            parent_join_class_dialog_box.showModal();
        }
    });

    create_class_dialog_close_btn.addEventListener("click", () => {
        create_class_dialog_box.close();
    });

    join_class_dialog_close_btn.addEventListener("click", () => {
        join_class_dialog_box.close();
    });

    add_student_close_dialog_box.addEventListener("click", () => {
        add_student_dialog_box.close();
    });

    parent_join_class_dialog_close_btn.addEventListener("click", () => {
        parent_join_class_dialog_box.close();
    });
});

home_sidebar.addEventListener("click", () => {
    removeAllUnderlineInSidebarTxt();
    home_txt.classList.add("side_bar_active");
    mainEl.innerHTML = `
        <div class="post_header_wrapper header_wrapper">
                <div class="school_info">
                    <div class="school_logo_wrapper"></div>
                    <p class="school_name">GUSTO</p>
                </div>

                <svg
                    class="notification_icon"
                    width="26"
                    height="31"
                    viewBox="0 0 35 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10.9764 37.1197C11.3965 38.5301 12.2581 39.7667 13.4334 40.6459C14.6086 41.5251 16.0348 42 17.5 42C18.9652 42 20.3914 41.5251 21.5666 40.6459C22.7419 39.7667 23.6035 38.5301 24.0236 37.1197H10.9764ZM0 35.166H35V29.305L31.1111 23.444V13.6757C31.1111 11.8798 30.7591 10.1014 30.075 8.44222C29.391 6.78301 28.3884 5.27542 27.1245 4.00551C25.8606 2.73561 24.3601 1.72827 22.7087 1.041C21.0574 0.353732 19.2874 0 17.5 0C15.7126 0 13.9426 0.353732 12.2913 1.041C10.6399 1.72827 9.1394 2.73561 7.87549 4.00551C6.61158 5.27542 5.60899 6.78301 4.92497 8.44222C4.24095 10.1014 3.88889 11.8798 3.88889 13.6757V23.444L0 29.305V35.166Z"
                        fill="#B4E0F7"
                    />
                </svg>
                <p id="create_feed_btn" class="create_post_btn create_btn">Create Feed</p>
            </div>
            <div id="posts_wrapper" class="posts_wrapper">
                
            </div>
    `;
    posts_wrapper = document.getElementById("posts_wrapper");
    const create_feed_btn = document.getElementById("create_feed_btn");
    if (feeds.length > 0) {
        feeds.forEach((feed) => {
            const postHTMLEl = `
            <div class="post_card">
                    <div class="posted_by_wrapper">
                        <img src="${feed.posted_by.profilePicture}" class="profile_pic"/>
                        <div class="posted_by_info">
                            <div class="posted_by_name_role">
                                <p class="name">${feed.posted_by.userName}</p>
                                <span class="delimiter">|</span>
                                <p class="role">${feed.posted_by.roles[0]}</p>
                            </div>
                            <p class="post_type">${feed.contentType}</p>
                        </div>
                        <div class="options_wrapper">
                            <svg
                                class="more_options"
                                width="35"
                                height="7"
                                viewBox="0 0 35 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M28 3.5C28 2.57174 28.3687 1.6815 29.0251 1.02513C29.6815 0.368749 30.5717 0 31.5 0C32.4283 0 33.3185 0.368749 33.9749 1.02513C34.6313 1.6815 35 2.57174 35 3.5C35 4.42826 34.6313 5.3185 33.9749 5.97487C33.3185 6.63125 32.4283 7 31.5 7C30.5717 7 29.6815 6.63125 29.0251 5.97487C28.3687 5.3185 28 4.42826 28 3.5ZM14 3.5C14 2.57174 14.3687 1.6815 15.0251 1.02513C15.6815 0.368749 16.5717 0 17.5 0C18.4283 0 19.3185 0.368749 19.9749 1.02513C20.6313 1.6815 21 2.57174 21 3.5C21 4.42826 20.6313 5.3185 19.9749 5.97487C19.3185 6.63125 18.4283 7 17.5 7C16.5717 7 15.6815 6.63125 15.0251 5.97487C14.3687 5.3185 14 4.42826 14 3.5ZM0 3.5C0 2.57174 0.368749 1.6815 1.02513 1.02513C1.6815 0.368749 2.57174 0 3.5 0C4.42826 0 5.3185 0.368749 5.97487 1.02513C6.63125 1.6815 7 2.57174 7 3.5C7 4.42826 6.63125 5.3185 5.97487 5.97487C5.3185 6.63125 4.42826 7 3.5 7C2.57174 7 1.6815 6.63125 1.02513 5.97487C0.368749 5.3185 0 4.42826 0 3.5Z"
                                    fill="#A7A6A6"
                                />
                            </svg>
                            <div class="options_modalBox display_none">
                                <div class="edit_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21.3153 2.66749C21.4438 2.79636 21.516 2.9709 21.516 3.15287C21.516 3.33483 21.4438 3.50937 21.3153 3.63824L19.8812 5.07374L17.1312 2.32374L18.5653 0.888241C18.6943 0.759355 18.8691 0.686951 19.0514 0.686951C19.2337 0.686951 19.4085 0.759355 19.5375 0.888241L21.3153 2.66612V2.66749ZM18.9091 6.04449L16.1591 3.29449L6.79122 12.6637C6.71555 12.7394 6.65858 12.8317 6.62485 12.9332L5.51797 16.2525C5.4979 16.313 5.49505 16.3779 5.50974 16.4399C5.52443 16.502 5.55609 16.5587 5.60117 16.6038C5.64625 16.6489 5.70298 16.6805 5.76502 16.6952C5.82706 16.7099 5.89196 16.7071 5.95247 16.687L9.27172 15.5801C9.37315 15.5468 9.46542 15.4903 9.54122 15.4151L18.9091 6.04449Z"
                                            fill="#BEEBB2"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M1.375 18.5625C1.375 19.1095 1.5923 19.6341 1.97909 20.0209C2.36589 20.4077 2.89049 20.625 3.4375 20.625H18.5625C19.1095 20.625 19.6341 20.4077 20.0209 20.0209C20.4077 19.6341 20.625 19.1095 20.625 18.5625V10.3125C20.625 10.1302 20.5526 9.9553 20.4236 9.82636C20.2947 9.69743 20.1198 9.625 19.9375 9.625C19.7552 9.625 19.5803 9.69743 19.4514 9.82636C19.3224 9.9553 19.25 10.1302 19.25 10.3125V18.5625C19.25 18.7448 19.1776 18.9197 19.0486 19.0486C18.9197 19.1776 18.7448 19.25 18.5625 19.25H3.4375C3.25516 19.25 3.0803 19.1776 2.95136 19.0486C2.82243 18.9197 2.75 18.7448 2.75 18.5625V3.4375C2.75 3.25516 2.82243 3.0803 2.95136 2.95136C3.0803 2.82243 3.25516 2.75 3.4375 2.75H12.375C12.5573 2.75 12.7322 2.67757 12.8611 2.54864C12.9901 2.4197 13.0625 2.24484 13.0625 2.0625C13.0625 1.88016 12.9901 1.7053 12.8611 1.57636C12.7322 1.44743 12.5573 1.375 12.375 1.375H3.4375C2.89049 1.375 2.36589 1.5923 1.97909 1.97909C1.5923 2.36589 1.375 2.89049 1.375 3.4375V18.5625Z"
                                            fill="#BEEBB2"
                                        />
                                    </svg>
                                    <p class="edit_option">Edit</p>
                                </div>
                                <div class="delete_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.125 2.0625V3.4375H19.9375C20.1198 3.4375 20.2947 3.50993 20.4236 3.63886C20.5526 3.7678 20.625 3.94266 20.625 4.125C20.625 4.30734 20.5526 4.4822 20.4236 4.61114C20.2947 4.74007 20.1198 4.8125 19.9375 4.8125H19.1977L18.0249 19.47C17.9696 20.1591 17.6567 20.8022 17.1486 21.271C16.6405 21.7399 15.9745 22.0001 15.2831 22H6.71688C6.02552 22.0001 5.35947 21.7399 4.85138 21.271C4.34329 20.8022 4.03043 20.1591 3.97513 19.47L2.80225 4.8125H2.0625C1.88016 4.8125 1.7053 4.74007 1.57636 4.61114C1.44743 4.4822 1.375 4.30734 1.375 4.125C1.375 3.94266 1.44743 3.7678 1.57636 3.63886C1.7053 3.50993 1.88016 3.4375 2.0625 3.4375H6.875V2.0625C6.875 1.51549 7.0923 0.990886 7.47909 0.604092C7.86589 0.217298 8.39049 0 8.9375 0L13.0625 0C13.6095 0 14.1341 0.217298 14.5209 0.604092C14.9077 0.990886 15.125 1.51549 15.125 2.0625ZM8.25 2.0625V3.4375H13.75V2.0625C13.75 1.88016 13.6776 1.7053 13.5486 1.57636C13.4197 1.44743 13.2448 1.375 13.0625 1.375H8.9375C8.75516 1.375 8.5803 1.44743 8.45136 1.57636C8.32243 1.7053 8.25 1.88016 8.25 2.0625ZM6.1875 6.91487L6.875 18.6024C6.87867 18.6937 6.90053 18.7834 6.93929 18.8663C6.97806 18.9491 7.03295 19.0233 7.10076 19.0847C7.16858 19.146 7.24794 19.1932 7.33421 19.2235C7.42049 19.2538 7.51193 19.2665 7.6032 19.261C7.69447 19.2556 7.78373 19.2319 7.86576 19.1915C7.94778 19.1511 8.02092 19.0947 8.08089 19.0257C8.14087 18.9567 8.18647 18.8764 8.21504 18.7896C8.2436 18.7027 8.25455 18.611 8.24725 18.5199L7.55975 6.83237C7.55608 6.74101 7.53422 6.6513 7.49546 6.56849C7.45669 6.48568 7.4018 6.41143 7.33399 6.3501C7.26617 6.28876 7.18681 6.24157 7.10054 6.21128C7.01426 6.18099 6.92282 6.16822 6.83155 6.17371C6.74028 6.17919 6.65102 6.20283 6.56899 6.24324C6.48697 6.28364 6.41383 6.34001 6.35386 6.40902C6.29388 6.47804 6.24828 6.55833 6.21971 6.64519C6.19115 6.73205 6.1802 6.82373 6.1875 6.91487ZM15.1662 6.18887C14.9843 6.17836 14.8056 6.24052 14.6695 6.36171C14.5333 6.48289 14.4509 6.65317 14.4402 6.83513L13.7527 18.5226C13.7468 18.7019 13.8112 18.8763 13.9321 19.0088C14.0531 19.1412 14.2209 19.2212 14.4 19.2316C14.579 19.242 14.7551 19.182 14.8905 19.0645C15.0259 18.9469 15.1101 18.7811 15.125 18.6024L15.8125 6.91487C15.823 6.73292 15.7609 6.55423 15.6397 6.41809C15.5185 6.28195 15.3482 6.19951 15.1662 6.18887ZM11 6.1875C10.8177 6.1875 10.6428 6.25993 10.5139 6.38886C10.3849 6.5178 10.3125 6.69266 10.3125 6.875V18.5625C10.3125 18.7448 10.3849 18.9197 10.5139 19.0486C10.6428 19.1776 10.8177 19.25 11 19.25C11.1823 19.25 11.3572 19.1776 11.4861 19.0486C11.6151 18.9197 11.6875 18.7448 11.6875 18.5625V6.875C11.6875 6.69266 11.6151 6.5178 11.4861 6.38886C11.3572 6.25993 11.1823 6.1875 11 6.1875Z"
                                            fill="#FF6262"
                                        />
                                    </svg>
                                    <p class="delete_option">Delete</p>
                                </div>
                                <div class="report_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20.3197 0.116875C20.4136 0.179626 20.4905 0.264508 20.5437 0.364026C20.5969 0.463544 20.6249 0.574638 20.625 0.6875V11C20.625 11.1373 20.5838 11.2714 20.5069 11.3852C20.4299 11.4989 20.3207 11.5869 20.1932 11.638L20.1891 11.6394L20.1809 11.6435L20.1493 11.6559C19.9685 11.7278 19.7865 11.7966 19.6034 11.8621C19.2404 11.9927 18.7358 12.1688 18.1638 12.3434C17.0418 12.6899 15.5801 13.0625 14.4375 13.0625C13.2729 13.0625 12.309 12.6775 11.4703 12.3406L11.4318 12.3269C10.56 11.9763 9.8175 11.6875 8.9375 11.6875C7.975 11.6875 6.68525 12.0038 5.58663 12.3434C5.09481 12.4969 4.60741 12.6643 4.125 12.8453V21.3125C4.125 21.4948 4.05257 21.6697 3.92364 21.7986C3.7947 21.9276 3.61984 22 3.4375 22C3.25516 22 3.0803 21.9276 2.95136 21.7986C2.82243 21.6697 2.75 21.4948 2.75 21.3125V0.6875C2.75 0.505164 2.82243 0.330295 2.95136 0.201364C3.0803 0.0724328 3.25516 0 3.4375 0C3.61984 0 3.7947 0.0724328 3.92364 0.201364C4.05257 0.330295 4.125 0.505164 4.125 0.6875V1.07525C4.43575 0.966625 4.807 0.8415 5.21125 0.71775C6.33325 0.374 7.79625 0 8.9375 0C10.0925 0 11.033 0.380875 11.8539 0.713625L11.913 0.738375C12.7682 1.0835 13.5135 1.375 14.4375 1.375C15.4 1.375 16.6898 1.05875 17.7884 0.719125C18.4143 0.523147 19.033 0.304841 19.6433 0.064625L19.6694 0.055L19.6749 0.05225H19.6763"
                                            fill="#85BCED"
                                        />
                                    </svg>
                                    <p class="report_option">Report</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="post_details">
                        <p class="title">${feed.heading}</p>
                        <p class="body">
                            ${feed.body}
                        </p>
                        <div id="post_images_wrapper" class="post_images_wrapper">
                            
                        </div>
                        <div class="reactions_wrapper">
                            <svg
                                class="heart_button"
                                width="18"
                                height="16"
                                viewBox="0 0 24 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12 1.92727C18.6572 -4.76364 35.3016 6.94472 12 22C-11.3016 6.94618 5.34282 -4.76364 12 1.92727Z"
                                    fill="url(#paint0_radial_41_145)"
                                />
                                <defs>
                                    <radialGradient
                                        id="paint0_radial_41_145"
                                        cx="0"
                                        cy="0"
                                        r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="translate(12 11) rotate(90) scale(11 12)"
                                    >
                                        <stop stop-color="#F09595" />
                                        <stop offset="1" stop-color="#F26060" />
                                    </radialGradient>
                                </defs>
                            </svg>
                            <p class="like_count">${feed.reactions}</p>
                        </div>
                        <div id="file_wrapper" class="files_wrapper">
                            
                        </div>
                    </div>
                </div>
        `;
            posts_wrapper.insertAdjacentHTML("afterbegin", postHTMLEl);

            generatePostImages(
                feed.contentPictures,
                document.getElementById("post_images_wrapper")
            );

            generatePostFiles(feed.documents);
        });
    } else if (feeds.length === 0) {
        posts_wrapper.innerHTML =
            '<p style="color: white;">No feeds available</p>';
    }

    if (role == "guardian") {
        create_feed_btn.style.display = "none";
    }

    create_feed_btn.addEventListener("click", () => {
        create_post_dialog_box.showModal();
    });

    create_post_dialog_close_btn.addEventListener("click", () => {
        create_post_dialog_box.close();
    });

    const moreOptionsBtns = document.querySelectorAll(".more_options");
    const optionsModalBoxes = document.querySelectorAll(".options_modalBox");

    moreOptionsBtns.forEach((btn, index) => {
        if (role == "guardian") {
            btn.style.display = "none";
        }
        btn.addEventListener("click", () => {
            optionsModalBoxes[index].classList.toggle("display_none");
        });
    });
});

announcement_sidebar.addEventListener("click", () => {
    removeAllUnderlineInSidebarTxt();
    announcement_txt.classList.add("side_bar_active");
    mainEl.innerHTML = `
        <div class="post_header_wrapper header_wrapper">
                <div class="school_info">
                    <div class="school_logo_wrapper"></div>
                    <p class="school_name">GUSTO</p>
                    <p class="class_name">(apple)</p>
                </div>

                <svg
                    class="notification_icon"
                    width="26"
                    height="31"
                    viewBox="0 0 35 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10.9764 37.1197C11.3965 38.5301 12.2581 39.7667 13.4334 40.6459C14.6086 41.5251 16.0348 42 17.5 42C18.9652 42 20.3914 41.5251 21.5666 40.6459C22.7419 39.7667 23.6035 38.5301 24.0236 37.1197H10.9764ZM0 35.166H35V29.305L31.1111 23.444V13.6757C31.1111 11.8798 30.7591 10.1014 30.075 8.44222C29.391 6.78301 28.3884 5.27542 27.1245 4.00551C25.8606 2.73561 24.3601 1.72827 22.7087 1.041C21.0574 0.353732 19.2874 0 17.5 0C15.7126 0 13.9426 0.353732 12.2913 1.041C10.6399 1.72827 9.1394 2.73561 7.87549 4.00551C6.61158 5.27542 5.60899 6.78301 4.92497 8.44222C4.24095 10.1014 3.88889 11.8798 3.88889 13.6757V23.444L0 29.305V35.166Z"
                        fill="#B4E0F7"
                    />
                </svg>
                <p id="create_announcement_btn" class="create_post_btn create_btn">Create Announcement</p>
            </div>
            <div id="posts_wrapper" class="posts_wrapper">
                
            </div>
    `;
    posts_wrapper = document.getElementById("posts_wrapper");
    const create_announcement_btn = document.getElementById(
        "create_announcement_btn"
    );
    if (announcements.length > 0) {
        announcements.forEach((announcement) => {
            const postHTMLEl = `
            <div class="post_card">
                    <div class="posted_by_wrapper">
                        <img src="${announcement.posted_by.profilePicture}" class="profile_pic"/>
                        <div class="posted_by_info">
                            <div class="posted_by_name_role">
                                <p class="name">${announcement.posted_by.userName}</p>
                                <span class="delimiter">|</span>
                                <p class="role">${announcement.posted_by.roles[0]}</p>
                            </div>
                            <p class="post_type">${announcement.contentType}</p>
                        </div>
                        <div class="options_wrapper">
                            <svg
                                class="more_options"
                                width="35"
                                height="7"
                                viewBox="0 0 35 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M28 3.5C28 2.57174 28.3687 1.6815 29.0251 1.02513C29.6815 0.368749 30.5717 0 31.5 0C32.4283 0 33.3185 0.368749 33.9749 1.02513C34.6313 1.6815 35 2.57174 35 3.5C35 4.42826 34.6313 5.3185 33.9749 5.97487C33.3185 6.63125 32.4283 7 31.5 7C30.5717 7 29.6815 6.63125 29.0251 5.97487C28.3687 5.3185 28 4.42826 28 3.5ZM14 3.5C14 2.57174 14.3687 1.6815 15.0251 1.02513C15.6815 0.368749 16.5717 0 17.5 0C18.4283 0 19.3185 0.368749 19.9749 1.02513C20.6313 1.6815 21 2.57174 21 3.5C21 4.42826 20.6313 5.3185 19.9749 5.97487C19.3185 6.63125 18.4283 7 17.5 7C16.5717 7 15.6815 6.63125 15.0251 5.97487C14.3687 5.3185 14 4.42826 14 3.5ZM0 3.5C0 2.57174 0.368749 1.6815 1.02513 1.02513C1.6815 0.368749 2.57174 0 3.5 0C4.42826 0 5.3185 0.368749 5.97487 1.02513C6.63125 1.6815 7 2.57174 7 3.5C7 4.42826 6.63125 5.3185 5.97487 5.97487C5.3185 6.63125 4.42826 7 3.5 7C2.57174 7 1.6815 6.63125 1.02513 5.97487C0.368749 5.3185 0 4.42826 0 3.5Z"
                                    fill="#A7A6A6"
                                />
                            </svg>
                            <div class="options_modalBox display_none">
                                <div class="edit_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21.3153 2.66749C21.4438 2.79636 21.516 2.9709 21.516 3.15287C21.516 3.33483 21.4438 3.50937 21.3153 3.63824L19.8812 5.07374L17.1312 2.32374L18.5653 0.888241C18.6943 0.759355 18.8691 0.686951 19.0514 0.686951C19.2337 0.686951 19.4085 0.759355 19.5375 0.888241L21.3153 2.66612V2.66749ZM18.9091 6.04449L16.1591 3.29449L6.79122 12.6637C6.71555 12.7394 6.65858 12.8317 6.62485 12.9332L5.51797 16.2525C5.4979 16.313 5.49505 16.3779 5.50974 16.4399C5.52443 16.502 5.55609 16.5587 5.60117 16.6038C5.64625 16.6489 5.70298 16.6805 5.76502 16.6952C5.82706 16.7099 5.89196 16.7071 5.95247 16.687L9.27172 15.5801C9.37315 15.5468 9.46542 15.4903 9.54122 15.4151L18.9091 6.04449Z"
                                            fill="#BEEBB2"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M1.375 18.5625C1.375 19.1095 1.5923 19.6341 1.97909 20.0209C2.36589 20.4077 2.89049 20.625 3.4375 20.625H18.5625C19.1095 20.625 19.6341 20.4077 20.0209 20.0209C20.4077 19.6341 20.625 19.1095 20.625 18.5625V10.3125C20.625 10.1302 20.5526 9.9553 20.4236 9.82636C20.2947 9.69743 20.1198 9.625 19.9375 9.625C19.7552 9.625 19.5803 9.69743 19.4514 9.82636C19.3224 9.9553 19.25 10.1302 19.25 10.3125V18.5625C19.25 18.7448 19.1776 18.9197 19.0486 19.0486C18.9197 19.1776 18.7448 19.25 18.5625 19.25H3.4375C3.25516 19.25 3.0803 19.1776 2.95136 19.0486C2.82243 18.9197 2.75 18.7448 2.75 18.5625V3.4375C2.75 3.25516 2.82243 3.0803 2.95136 2.95136C3.0803 2.82243 3.25516 2.75 3.4375 2.75H12.375C12.5573 2.75 12.7322 2.67757 12.8611 2.54864C12.9901 2.4197 13.0625 2.24484 13.0625 2.0625C13.0625 1.88016 12.9901 1.7053 12.8611 1.57636C12.7322 1.44743 12.5573 1.375 12.375 1.375H3.4375C2.89049 1.375 2.36589 1.5923 1.97909 1.97909C1.5923 2.36589 1.375 2.89049 1.375 3.4375V18.5625Z"
                                            fill="#BEEBB2"
                                        />
                                    </svg>
                                    <p class="edit_option">Edit</p>
                                </div>
                                <div class="delete_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.125 2.0625V3.4375H19.9375C20.1198 3.4375 20.2947 3.50993 20.4236 3.63886C20.5526 3.7678 20.625 3.94266 20.625 4.125C20.625 4.30734 20.5526 4.4822 20.4236 4.61114C20.2947 4.74007 20.1198 4.8125 19.9375 4.8125H19.1977L18.0249 19.47C17.9696 20.1591 17.6567 20.8022 17.1486 21.271C16.6405 21.7399 15.9745 22.0001 15.2831 22H6.71688C6.02552 22.0001 5.35947 21.7399 4.85138 21.271C4.34329 20.8022 4.03043 20.1591 3.97513 19.47L2.80225 4.8125H2.0625C1.88016 4.8125 1.7053 4.74007 1.57636 4.61114C1.44743 4.4822 1.375 4.30734 1.375 4.125C1.375 3.94266 1.44743 3.7678 1.57636 3.63886C1.7053 3.50993 1.88016 3.4375 2.0625 3.4375H6.875V2.0625C6.875 1.51549 7.0923 0.990886 7.47909 0.604092C7.86589 0.217298 8.39049 0 8.9375 0L13.0625 0C13.6095 0 14.1341 0.217298 14.5209 0.604092C14.9077 0.990886 15.125 1.51549 15.125 2.0625ZM8.25 2.0625V3.4375H13.75V2.0625C13.75 1.88016 13.6776 1.7053 13.5486 1.57636C13.4197 1.44743 13.2448 1.375 13.0625 1.375H8.9375C8.75516 1.375 8.5803 1.44743 8.45136 1.57636C8.32243 1.7053 8.25 1.88016 8.25 2.0625ZM6.1875 6.91487L6.875 18.6024C6.87867 18.6937 6.90053 18.7834 6.93929 18.8663C6.97806 18.9491 7.03295 19.0233 7.10076 19.0847C7.16858 19.146 7.24794 19.1932 7.33421 19.2235C7.42049 19.2538 7.51193 19.2665 7.6032 19.261C7.69447 19.2556 7.78373 19.2319 7.86576 19.1915C7.94778 19.1511 8.02092 19.0947 8.08089 19.0257C8.14087 18.9567 8.18647 18.8764 8.21504 18.7896C8.2436 18.7027 8.25455 18.611 8.24725 18.5199L7.55975 6.83237C7.55608 6.74101 7.53422 6.6513 7.49546 6.56849C7.45669 6.48568 7.4018 6.41143 7.33399 6.3501C7.26617 6.28876 7.18681 6.24157 7.10054 6.21128C7.01426 6.18099 6.92282 6.16822 6.83155 6.17371C6.74028 6.17919 6.65102 6.20283 6.56899 6.24324C6.48697 6.28364 6.41383 6.34001 6.35386 6.40902C6.29388 6.47804 6.24828 6.55833 6.21971 6.64519C6.19115 6.73205 6.1802 6.82373 6.1875 6.91487ZM15.1662 6.18887C14.9843 6.17836 14.8056 6.24052 14.6695 6.36171C14.5333 6.48289 14.4509 6.65317 14.4402 6.83513L13.7527 18.5226C13.7468 18.7019 13.8112 18.8763 13.9321 19.0088C14.0531 19.1412 14.2209 19.2212 14.4 19.2316C14.579 19.242 14.7551 19.182 14.8905 19.0645C15.0259 18.9469 15.1101 18.7811 15.125 18.6024L15.8125 6.91487C15.823 6.73292 15.7609 6.55423 15.6397 6.41809C15.5185 6.28195 15.3482 6.19951 15.1662 6.18887ZM11 6.1875C10.8177 6.1875 10.6428 6.25993 10.5139 6.38886C10.3849 6.5178 10.3125 6.69266 10.3125 6.875V18.5625C10.3125 18.7448 10.3849 18.9197 10.5139 19.0486C10.6428 19.1776 10.8177 19.25 11 19.25C11.1823 19.25 11.3572 19.1776 11.4861 19.0486C11.6151 18.9197 11.6875 18.7448 11.6875 18.5625V6.875C11.6875 6.69266 11.6151 6.5178 11.4861 6.38886C11.3572 6.25993 11.1823 6.1875 11 6.1875Z"
                                            fill="#FF6262"
                                        />
                                    </svg>
                                    <p class="delete_option">Delete</p>
                                </div>
                                <div class="report_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20.3197 0.116875C20.4136 0.179626 20.4905 0.264508 20.5437 0.364026C20.5969 0.463544 20.6249 0.574638 20.625 0.6875V11C20.625 11.1373 20.5838 11.2714 20.5069 11.3852C20.4299 11.4989 20.3207 11.5869 20.1932 11.638L20.1891 11.6394L20.1809 11.6435L20.1493 11.6559C19.9685 11.7278 19.7865 11.7966 19.6034 11.8621C19.2404 11.9927 18.7358 12.1688 18.1638 12.3434C17.0418 12.6899 15.5801 13.0625 14.4375 13.0625C13.2729 13.0625 12.309 12.6775 11.4703 12.3406L11.4318 12.3269C10.56 11.9763 9.8175 11.6875 8.9375 11.6875C7.975 11.6875 6.68525 12.0038 5.58663 12.3434C5.09481 12.4969 4.60741 12.6643 4.125 12.8453V21.3125C4.125 21.4948 4.05257 21.6697 3.92364 21.7986C3.7947 21.9276 3.61984 22 3.4375 22C3.25516 22 3.0803 21.9276 2.95136 21.7986C2.82243 21.6697 2.75 21.4948 2.75 21.3125V0.6875C2.75 0.505164 2.82243 0.330295 2.95136 0.201364C3.0803 0.0724328 3.25516 0 3.4375 0C3.61984 0 3.7947 0.0724328 3.92364 0.201364C4.05257 0.330295 4.125 0.505164 4.125 0.6875V1.07525C4.43575 0.966625 4.807 0.8415 5.21125 0.71775C6.33325 0.374 7.79625 0 8.9375 0C10.0925 0 11.033 0.380875 11.8539 0.713625L11.913 0.738375C12.7682 1.0835 13.5135 1.375 14.4375 1.375C15.4 1.375 16.6898 1.05875 17.7884 0.719125C18.4143 0.523147 19.033 0.304841 19.6433 0.064625L19.6694 0.055L19.6749 0.05225H19.6763"
                                            fill="#85BCED"
                                        />
                                    </svg>
                                    <p class="report_option">Report</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="post_details">
                        <p class="title">${announcement.heading}</p>
                        <p class="body">
                            ${announcement.body}
                        </p>
                        <div id="post_images_wrapper" class="post_images_wrapper">
                            
                        </div>
                        <div class="reactions_wrapper">
                            <svg
                                class="heart_button"
                                width="18"
                                height="16"
                                viewBox="0 0 24 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12 1.92727C18.6572 -4.76364 35.3016 6.94472 12 22C-11.3016 6.94618 5.34282 -4.76364 12 1.92727Z"
                                    fill="url(#paint0_radial_41_145)"
                                />
                                <defs>
                                    <radialGradient
                                        id="paint0_radial_41_145"
                                        cx="0"
                                        cy="0"
                                        r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="translate(12 11) rotate(90) scale(11 12)"
                                    >
                                        <stop stop-color="#F09595" />
                                        <stop offset="1" stop-color="#F26060" />
                                    </radialGradient>
                                </defs>
                            </svg>
                            <p class="like_count">${announcement.reactions}</p>
                        </div>
                        <div id="file_wrapper" class="files_wrapper">
                            
                        </div>
                    </div>
                </div>
        `;
            posts_wrapper.insertAdjacentHTML("afterbegin", postHTMLEl);

            generatePostImages(
                announcement.contentPictures,
                document.getElementById("post_images_wrapper")
            );

            generatePostFiles(announcement.documents);
        });
    } else if (announcements.length === 0) {
        posts_wrapper.innerHTML =
            '<p style="color: white;">No announcements available</p>';
    }

    if (role == "guardian") {
        create_announcement_btn.style.display = "none";
    }

    create_announcement_btn.addEventListener("click", () => {
        create_announcement_dialog_box.showModal();
    });

    create_announcement_dialog_close_btn.addEventListener("click", () => {
        create_announcement_dialog_box.close();
    });

    const moreOptionsBtns = document.querySelectorAll(".more_options");
    const optionsModalBoxes = document.querySelectorAll(".options_modalBox");

    moreOptionsBtns.forEach((btn, index) => {
        if (role == "guardian") {
            btn.style.display = "none";
        }
        btn.addEventListener("click", () => {
            optionsModalBoxes[index].classList.toggle("display_none");
        });
    });
});

leave_reqSideBar.addEventListener("click", () => {
    removeAllUnderlineInSidebarTxt();
    leave_req_txt.classList.add("side_bar_active");
    mainEl.innerHTML = `
                    <div class="leavereq_header_wrapper header_wrapper">
                        <div class="school_info">
                            <div class="school_logo_wrapper"></div>
                            <p class="school_name">GUSTO</p>
                            <p class="class_name">(Apple)</p>
                        </div>
    
                        <svg
                            class="notification_icon"
                            width="26"
                            height="31"
                            viewBox="0 0 35 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.9764 37.1197C11.3965 38.5301 12.2581 39.7667 13.4334 40.6459C14.6086 41.5251 16.0348 42 17.5 42C18.9652 42 20.3914 41.5251 21.5666 40.6459C22.7419 39.7667 23.6035 38.5301 24.0236 37.1197H10.9764ZM0 35.166H35V29.305L31.1111 23.444V13.6757C31.1111 11.8798 30.7591 10.1014 30.075 8.44222C29.391 6.78301 28.3884 5.27542 27.1245 4.00551C25.8606 2.73561 24.3601 1.72827 22.7087 1.041C21.0574 0.353732 19.2874 0 17.5 0C15.7126 0 13.9426 0.353732 12.2913 1.041C10.6399 1.72827 9.1394 2.73561 7.87549 4.00551C6.61158 5.27542 5.60899 6.78301 4.92497 8.44222C4.24095 10.1014 3.88889 11.8798 3.88889 13.6757V23.444L0 29.305V35.166Z"
                                fill="#B4E0F7"
                            />
                        </svg>
                        <p id="create_leaveReq_btn" class="create_leaveReq_btn create_btn">Take Leave</p>
                    </div>
    
                <div id="leaveReqWrapper" class="leaveReqWrapper"></div>       

        <dialog id="take_leave_dialog_box">
            <div class="dialog_wrapper">
                <form id="enter_student_form" action=""></form>
                <form id="take_leave_form"></form>
                    <div class="input_box_wrapper"> 
                        <label for="student_input" form="enter_student_form">Student </label>
                        <select id="student_input" form="enter_student_form">
                            <option>Your children</option>
                        </select>
                    </div>
                    <button id="add_student_button" form="enter_student_form" type="submit">Search</button>

                    <div class="input_box_wrapper"> 
                        <label for="class_input" form="take_leave_form">Class </label>
                        <select id="class_input" form="take_leave_form">
                            <option>Select your children first</option>
                        </select>
                    </div>
                    <div class="input_box_wrapper"> 
                        <label for="start_date_input" form="take_leave_form">Start Date: </label>
                        <input id="start_date_input" type="date" form="take_leave_form" name="start_date_input">
                    </div>
                    <div class="input_box_wrapper"> 
                        <label for="end_date_input" form="take_leave_form">End Date: </label>
                        <input id="end_date_input" type="date" form="take_leave_form" name="end_date_input">
                    </div>
                    <div class="input_box_wrapper"> 
                        <label for="reason_input" form="take_leave_form">Reason </label>
                        <select id="reason_input" form="take_leave_form">
                            <option>Select your children first</option>
                        </select>
                    </div>
                    <div class="input_box_wrapper"> 
                        <label for="description_input" form="take_leave_form">Description</label>
                        <input id="description_input" type="text" aria-label="class code" name="description_name_input" form="take_leave_form">
                    </div>
                    <button type="submit" style="margin-left: 0" form="take_leave_form">Submit</button>
                <div class="dialog_btns">
                    <svg id="take_leave_dialog_close_btn" class="cross_btn dialog_btn" width="32" height="32" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.8968 0.938489C23.1723 0.647174 23.5035 0.414054 23.8707 0.252909C24.2378 0.0917648 24.6336 0.00586591 25.0345 0.000290072C25.4355 -0.00528577 25.8335 0.0695746 26.205 0.220446C26.5765 0.371318 26.914 0.595139 27.1976 0.87868C27.4811 1.16222 27.7049 1.49973 27.8558 1.87125C28.0067 2.24277 28.0815 2.64077 28.076 3.04172C28.0704 3.44266 27.9845 3.83843 27.8234 4.20561C27.6622 4.57279 27.4291 4.90394 27.1378 5.17949L18.3478 13.9695C18.3361 13.9811 18.3269 13.9949 18.3206 14.0101C18.3143 14.0253 18.311 14.0415 18.311 14.058C18.311 14.0744 18.3143 14.0907 18.3206 14.1059C18.3269 14.1211 18.3361 14.1349 18.3478 14.1465L27.1378 22.9365C27.4201 23.2142 27.6447 23.5451 27.7985 23.91C27.9523 24.2749 28.0324 24.6667 28.034 25.0627C28.0357 25.4587 27.9589 25.8511 27.8082 26.2173C27.6574 26.5835 27.4356 26.9163 27.1556 27.1963C26.8756 27.4764 26.5429 27.6982 26.1768 27.8491C25.8106 27.9999 25.4182 28.0768 25.0222 28.0752C24.6262 28.0737 24.2344 27.9937 23.8694 27.84C23.5045 27.6862 23.1735 27.4618 22.8958 27.1795L14.1058 18.3895C14.0942 18.3778 14.0804 18.3686 14.0652 18.3623C14.05 18.356 14.0337 18.3528 14.0173 18.3528C14.0008 18.3528 13.9845 18.356 13.9694 18.3623C13.9542 18.3686 13.9404 18.3778 13.9288 18.3895L5.13877 27.1795C4.86106 27.4618 4.53021 27.6864 4.16528 27.8402C3.80036 27.994 3.40859 28.0741 3.01257 28.0757C2.61655 28.0774 2.22412 28.0006 1.85792 27.8499C1.49172 27.6991 1.15899 27.4773 0.87893 27.1973C0.598867 26.9173 0.377013 26.5847 0.226165 26.2185C0.0753158 25.8523 -0.00154226 25.4599 2.34485e-05 25.0639C0.00158915 24.6679 0.0815478 24.2761 0.235287 23.9111C0.389027 23.5462 0.613504 23.2153 0.895771 22.9375L9.68577 14.1475C9.69741 14.1359 9.70665 14.1221 9.71295 14.1069C9.71925 14.0917 9.7225 14.0754 9.7225 14.059C9.7225 14.0425 9.71925 14.0263 9.71295 14.0111C9.70665 13.9959 9.69741 13.9821 9.68577 13.9705L0.895771 5.18049C0.340663 4.6164 0.0309415 3.85581 0.0340705 3.0644C0.0371994 2.27299 0.352926 1.51487 0.912477 0.955191C1.47203 0.395508 2.23007 0.0796027 3.02148 0.0762872C3.81289 0.0729717 4.57355 0.382514 5.13777 0.937489L13.9278 9.72749C13.9394 9.73913 13.9532 9.74837 13.9684 9.75467C13.9836 9.76097 13.9998 9.76421 14.0163 9.76421C14.0327 9.76421 14.049 9.76097 14.0642 9.75467C14.0794 9.74837 14.0932 9.73913 14.1048 9.72749L22.8968 0.938489Z" fill="#E2E2E2"/>
                    </svg>
                </div>
            </div>
        </dialog>
        `
    
    
    const leaveReqWrapper = document.getElementById("leaveReqWrapper")
    if(leaveRequests.length > 0){
        // leaveReqMsg = `
        //     <div> <h1> Testing </h1> </div>
        // `;
        // console.log("The length of the leave request would be " + leaveRequests.length)
        leaveRequests.forEach((request) => {
            let readButtonEl;

            if(!request.description){
                request.description = "none"
            }
            if(role == "teacher"){
                readButtonEl = `
                <div style="display: flex; width: 100%">
                    <div style="float: left; width: 70%"> </div>
                    <div style="float: right; width: 30%">
                        <p id="read_button" class="read_button create_btn">Read</p>
                    </div>
                </div>
                `
            }else{
                readButtonEl = ``;
            }
            const leaveReqMsg = `
            <div class="post_card">
                    <div class="posted_by_wrapper">
                        <div class="posted_by_info">
                            <div class="posted_by_name_role">
                                <p class="name">${request.classId.className} (${request.classId.grade})</p>
                                <span class="delimiter">|</span>
                                <p class="role">${request.studentId.name}</p>
                            </div>
                            <p class="post_type">${request.status} </p> 
                        </div>
                    </div>
                        
                    <div class="post_details">
                        <p class="title">Leave Date: ${formatDate(request.startDate)} -> ${formatDate(request.endDate)}</p>
                        <p class="body">
                            Request Type: ${request.reason} <br>
                            Description: ${request.description}
                        </p>
                    </div>
                    ${readButtonEl}
            </div>
        `
            leaveReqWrapper.innerHTML += leaveReqMsg
            // leaveReqWrapper.insertAdjacentHTML("afterbegin", leaveReqMsg);
    
        })
            
    }else{
        const leaveReqMsg = `<div class="dashboard_main_wrapper">
                        <div class="classes_wrapper">
                            <div class="dashboard_alert_wrapper">
                                <p class="dashboard_alert">There are no leave requests</p>
                            </div> 
                        </div>
                    </div>`
        leaveReqWrapper.insertAdjacentHTML("afterbegin", leaveReqMsg)
    }
    
    leaveRequestForm()
    let read_button = document.querySelectorAll(".read_button")
    
    read_button.forEach((eachButton, i) => {
         
        eachButton.addEventListener("click", async()=> {
            let status;
            console.log("Status blangl" + leaveRequests[i].status)
            if(leaveRequests[i].status === "read"){
                status = "unread"
            }else{
                status = "read"
            }
            console.log("the status is" + status)
            console.log("This is endpoit " + endpoints.respondLeaveRequestApi)
            console.log("leave request id " + leaveRequests[i]._id)
            console.log("Thhis is token " + token)
            const respondLeaveReqMsg = await respondLeaveRequest(endpoints.respondLeaveRequestApi, token, leaveRequests[i]._id, status)
            console.log(respondLeaveReqMsg.result)
            alert(respondLeaveReqMsg.msg)
        })
    })

})

async function respondLeaveRequest(api, token, leaveReqId, response){
            const res = await fetch(api, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    leaveReqId, response
                })
            })
    
            return( await res.json())
            
        }


function leaveRequestForm(){
    
    let selectedChild; 
    const create_leaveReq_btn = document.getElementById("create_leaveReq_btn")
    const take_leave_dialog_close_btn = document.getElementById("take_leave_dialog_close_btn")
    const take_leave_student_input = document.getElementById("student_input")
    const class_input = document.getElementById("class_input")
    const reason_input = document.getElementById("reason_input")
    const take_leave_form = document.getElementById("take_leave_form")

    if(role === "teacher"){
        create_leaveReq_btn.remove()
    }
    
    create_leaveReq_btn.addEventListener("click", ()=> {
        take_leave_dialog_box.showModal()
        console.log("My children when clicked " + JSON.stringify(myChildren))
        take_leave_student_input.innerHTML = ""
        myChildren.forEach((childData, i) => {
            take_leave_student_input.innerHTML += `<option value=${i}> ${childData.name}</option>`
        })
    })

    const enter_student_form = document.getElementById("enter_student_form")
    enter_student_form.addEventListener("submit", (e)=> {
        e.preventDefault();
        class_input.innerHTML = "";
        reason_input.innerHTML = "";
        let childIndex = e.target.student_input.value
        selectedChild = myChildren[childIndex];
        alert("testing is " + selectedChild._id)
        
        selectedChild.classes.forEach((eachClass, i) => {
            class_input.innerHTML += `<option value=${i}>${eachClass.className}</option>`
        })
        
        reason_input.innerHTML += `
            <option value="Health">Health</option>
            <option value="Personal">Personal</option>
            <option value="Others">Others</options>
        `
    })

    take_leave_form.addEventListener("submit", async(e)=> {
        e.preventDefault();
        let classIndex = e.target.class_input.value;
        let selectedClassId = selectedChild.classes[classIndex]._id
        let startDate = e.target.start_date_input.value;
        let endDate = e.target.end_date_input.value;
        let reason = e.target.reason_input.value;
        let description = e.target.description_input.value;

        const response = await createLeaveRequest(
            endpoints.createLeaveRequestApi,
            token,
            selectedChild._id,
            selectedClassId,
            startDate,
            endDate,
            reason,
            description
        )

        alert(response.msg)
        location.reload()
    })

    take_leave_dialog_close_btn.addEventListener("click", ()=> {
        take_leave_dialog_box.close()
    })
}

async function createLeaveRequest(api, token, studentId, classId, startDate, endDate, reason){
    const res = await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            studentId, classId, startDate, endDate, reason
        })
    })

    const response = await res.json();
    return response;
}


create_class_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const grade = e.target.grade.value;
    const classname = e.target.classname.value;
    create_class_form.reset();
    const res = await fetch(endpoints.createClassApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            grade,
            className: classname,
        }),
    });

    const data = await res.json();

    if (res.status === 201) {
        alert("Class created successfully");
    }
    const classHTMLEl = `
        <div class="class">
            <div class="class-left">
                <p class="class-left__classname">${data.result.className}</p>
                <p class="class-left__grade">&nbsp;(${data.result.grade})</p>
            </div>
            <div class="class-right">
                <p class="view_detail_btn">View details</p>
            </div>
        </div>
    `;

    classWrapper.insertAdjacentHTML("afterbegin", classHTMLEl);
    create_class_dialog_box.close();
    addViewDetailsFunctionality();
});

join_class_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const classCode = e.target.class_code.value;
    join_class_form.reset();
    const res = await fetch(endpoints.joinClassApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            classCode,
        }),
    });

    const data = await res.json();
    alert(`${data.msg}`);
});

join_class_code_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const classCode = e.target.class_code.value;
    currentclassCode = classCode;
    // console.log("This is class code" + classCode);
    const res = await fetch(
        endpoints.getStudentsByClassCodeApi(classCode),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        }
    );
    const studentData = await res.json();
    let childrenNames = document.getElementById("child_name_input");

    childrenNames.innerHTML = "";

    let allStudents = studentData.result;
    if (allStudents) {
        classCodeChildren = allStudents;
        childrenNames.innerHTML = `<option> Student Names </option>`;
        allStudents.forEach((childData, i) => {
            childrenNames.innerHTML += `
            <option value=${i} class="optionData"> ${childData.name}</option>
             `;
            classCodeChildren.push(childData);
            // })
        });

        childrenNames.addEventListener("change", () => {
            let i = childrenNames.value;
            child_dob_input.innerHTML = `<option> ${classCodeChildren[i].dateofBirth}</option>`;
        });
    } else {
        childrenNames.innerHTML = `<option> No Students at the moment </option>`;
    }
});

parent_join_class_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let childIndex = e.target.child_name_input.value;
    let childName = classCodeChildren[childIndex].name;
    let childDob = classCodeChildren[childIndex].dateofBirth;


    const res = await fetch(endpoints.joinClassApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            classCode: currentclassCode,
            childName: childName,
            studentDOB: childDob,
        }),
    });

    const data = await res.json();
    alert(data.msg);
});


create_feed_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const heading = e.target.heading.value;
    const body = e.target.body.value;
    const contentType = e.target.post_type.value;
    const contentPictures = e.target.images.files;
    const documents = e.target.documents.files;

    const formData = new FormData();
    if (contentType == "feed") {
        formData.append("heading", heading);
        formData.append("body", body);
        formData.append("contentType", contentType);
        for (const image of contentPictures) {
            formData.append("contentPictures", image);
        }
        for (const document of documents) {
            formData.append("documents", document);
        }
    }
    create_feed_form.reset();
    const res = await fetch(endpoints.createPostApi, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    const data = await res.json();
    const post = data.result;
    create_post_dialog_box.close();
    const postHTMLEl = `
            <div class="post_card">
                    <div class="posted_by_wrapper">
                        <img src="${post.posted_by.profilePicture}" class="profile_pic"/>
                        <div class="posted_by_info">
                            <div class="posted_by_name_role">
                                <p class="name">${post.posted_by.userName}</p>
                                <span class="delimiter">|</span>
                                <p class="role">${post.posted_by.roles[0]}</p>
                            </div>
                            <p class="post_type">${post.contentType}</p>
                        </div>
                        <div class="options_wrapper">
                            <svg
                                class="more_options"
                                width="35"
                                height="7"
                                viewBox="0 0 35 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M28 3.5C28 2.57174 28.3687 1.6815 29.0251 1.02513C29.6815 0.368749 30.5717 0 31.5 0C32.4283 0 33.3185 0.368749 33.9749 1.02513C34.6313 1.6815 35 2.57174 35 3.5C35 4.42826 34.6313 5.3185 33.9749 5.97487C33.3185 6.63125 32.4283 7 31.5 7C30.5717 7 29.6815 6.63125 29.0251 5.97487C28.3687 5.3185 28 4.42826 28 3.5ZM14 3.5C14 2.57174 14.3687 1.6815 15.0251 1.02513C15.6815 0.368749 16.5717 0 17.5 0C18.4283 0 19.3185 0.368749 19.9749 1.02513C20.6313 1.6815 21 2.57174 21 3.5C21 4.42826 20.6313 5.3185 19.9749 5.97487C19.3185 6.63125 18.4283 7 17.5 7C16.5717 7 15.6815 6.63125 15.0251 5.97487C14.3687 5.3185 14 4.42826 14 3.5ZM0 3.5C0 2.57174 0.368749 1.6815 1.02513 1.02513C1.6815 0.368749 2.57174 0 3.5 0C4.42826 0 5.3185 0.368749 5.97487 1.02513C6.63125 1.6815 7 2.57174 7 3.5C7 4.42826 6.63125 5.3185 5.97487 5.97487C5.3185 6.63125 4.42826 7 3.5 7C2.57174 7 1.6815 6.63125 1.02513 5.97487C0.368749 5.3185 0 4.42826 0 3.5Z"
                                    fill="#A7A6A6"
                                />
                            </svg>
                            <div class="options_modalBox display_none">
                                <div class="edit_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21.3153 2.66749C21.4438 2.79636 21.516 2.9709 21.516 3.15287C21.516 3.33483 21.4438 3.50937 21.3153 3.63824L19.8812 5.07374L17.1312 2.32374L18.5653 0.888241C18.6943 0.759355 18.8691 0.686951 19.0514 0.686951C19.2337 0.686951 19.4085 0.759355 19.5375 0.888241L21.3153 2.66612V2.66749ZM18.9091 6.04449L16.1591 3.29449L6.79122 12.6637C6.71555 12.7394 6.65858 12.8317 6.62485 12.9332L5.51797 16.2525C5.4979 16.313 5.49505 16.3779 5.50974 16.4399C5.52443 16.502 5.55609 16.5587 5.60117 16.6038C5.64625 16.6489 5.70298 16.6805 5.76502 16.6952C5.82706 16.7099 5.89196 16.7071 5.95247 16.687L9.27172 15.5801C9.37315 15.5468 9.46542 15.4903 9.54122 15.4151L18.9091 6.04449Z"
                                            fill="#BEEBB2"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M1.375 18.5625C1.375 19.1095 1.5923 19.6341 1.97909 20.0209C2.36589 20.4077 2.89049 20.625 3.4375 20.625H18.5625C19.1095 20.625 19.6341 20.4077 20.0209 20.0209C20.4077 19.6341 20.625 19.1095 20.625 18.5625V10.3125C20.625 10.1302 20.5526 9.9553 20.4236 9.82636C20.2947 9.69743 20.1198 9.625 19.9375 9.625C19.7552 9.625 19.5803 9.69743 19.4514 9.82636C19.3224 9.9553 19.25 10.1302 19.25 10.3125V18.5625C19.25 18.7448 19.1776 18.9197 19.0486 19.0486C18.9197 19.1776 18.7448 19.25 18.5625 19.25H3.4375C3.25516 19.25 3.0803 19.1776 2.95136 19.0486C2.82243 18.9197 2.75 18.7448 2.75 18.5625V3.4375C2.75 3.25516 2.82243 3.0803 2.95136 2.95136C3.0803 2.82243 3.25516 2.75 3.4375 2.75H12.375C12.5573 2.75 12.7322 2.67757 12.8611 2.54864C12.9901 2.4197 13.0625 2.24484 13.0625 2.0625C13.0625 1.88016 12.9901 1.7053 12.8611 1.57636C12.7322 1.44743 12.5573 1.375 12.375 1.375H3.4375C2.89049 1.375 2.36589 1.5923 1.97909 1.97909C1.5923 2.36589 1.375 2.89049 1.375 3.4375V18.5625Z"
                                            fill="#BEEBB2"
                                        />
                                    </svg>
                                    <p class="edit_option">Edit</p>
                                </div>
                                <div class="delete_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.125 2.0625V3.4375H19.9375C20.1198 3.4375 20.2947 3.50993 20.4236 3.63886C20.5526 3.7678 20.625 3.94266 20.625 4.125C20.625 4.30734 20.5526 4.4822 20.4236 4.61114C20.2947 4.74007 20.1198 4.8125 19.9375 4.8125H19.1977L18.0249 19.47C17.9696 20.1591 17.6567 20.8022 17.1486 21.271C16.6405 21.7399 15.9745 22.0001 15.2831 22H6.71688C6.02552 22.0001 5.35947 21.7399 4.85138 21.271C4.34329 20.8022 4.03043 20.1591 3.97513 19.47L2.80225 4.8125H2.0625C1.88016 4.8125 1.7053 4.74007 1.57636 4.61114C1.44743 4.4822 1.375 4.30734 1.375 4.125C1.375 3.94266 1.44743 3.7678 1.57636 3.63886C1.7053 3.50993 1.88016 3.4375 2.0625 3.4375H6.875V2.0625C6.875 1.51549 7.0923 0.990886 7.47909 0.604092C7.86589 0.217298 8.39049 0 8.9375 0L13.0625 0C13.6095 0 14.1341 0.217298 14.5209 0.604092C14.9077 0.990886 15.125 1.51549 15.125 2.0625ZM8.25 2.0625V3.4375H13.75V2.0625C13.75 1.88016 13.6776 1.7053 13.5486 1.57636C13.4197 1.44743 13.2448 1.375 13.0625 1.375H8.9375C8.75516 1.375 8.5803 1.44743 8.45136 1.57636C8.32243 1.7053 8.25 1.88016 8.25 2.0625ZM6.1875 6.91487L6.875 18.6024C6.87867 18.6937 6.90053 18.7834 6.93929 18.8663C6.97806 18.9491 7.03295 19.0233 7.10076 19.0847C7.16858 19.146 7.24794 19.1932 7.33421 19.2235C7.42049 19.2538 7.51193 19.2665 7.6032 19.261C7.69447 19.2556 7.78373 19.2319 7.86576 19.1915C7.94778 19.1511 8.02092 19.0947 8.08089 19.0257C8.14087 18.9567 8.18647 18.8764 8.21504 18.7896C8.2436 18.7027 8.25455 18.611 8.24725 18.5199L7.55975 6.83237C7.55608 6.74101 7.53422 6.6513 7.49546 6.56849C7.45669 6.48568 7.4018 6.41143 7.33399 6.3501C7.26617 6.28876 7.18681 6.24157 7.10054 6.21128C7.01426 6.18099 6.92282 6.16822 6.83155 6.17371C6.74028 6.17919 6.65102 6.20283 6.56899 6.24324C6.48697 6.28364 6.41383 6.34001 6.35386 6.40902C6.29388 6.47804 6.24828 6.55833 6.21971 6.64519C6.19115 6.73205 6.1802 6.82373 6.1875 6.91487ZM15.1662 6.18887C14.9843 6.17836 14.8056 6.24052 14.6695 6.36171C14.5333 6.48289 14.4509 6.65317 14.4402 6.83513L13.7527 18.5226C13.7468 18.7019 13.8112 18.8763 13.9321 19.0088C14.0531 19.1412 14.2209 19.2212 14.4 19.2316C14.579 19.242 14.7551 19.182 14.8905 19.0645C15.0259 18.9469 15.1101 18.7811 15.125 18.6024L15.8125 6.91487C15.823 6.73292 15.7609 6.55423 15.6397 6.41809C15.5185 6.28195 15.3482 6.19951 15.1662 6.18887ZM11 6.1875C10.8177 6.1875 10.6428 6.25993 10.5139 6.38886C10.3849 6.5178 10.3125 6.69266 10.3125 6.875V18.5625C10.3125 18.7448 10.3849 18.9197 10.5139 19.0486C10.6428 19.1776 10.8177 19.25 11 19.25C11.1823 19.25 11.3572 19.1776 11.4861 19.0486C11.6151 18.9197 11.6875 18.7448 11.6875 18.5625V6.875C11.6875 6.69266 11.6151 6.5178 11.4861 6.38886C11.3572 6.25993 11.1823 6.1875 11 6.1875Z"
                                            fill="#FF6262"
                                        />
                                    </svg>
                                    <p class="delete_option">Delete</p>
                                </div>
                                <div class="report_option_box option_box">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20.3197 0.116875C20.4136 0.179626 20.4905 0.264508 20.5437 0.364026C20.5969 0.463544 20.6249 0.574638 20.625 0.6875V11C20.625 11.1373 20.5838 11.2714 20.5069 11.3852C20.4299 11.4989 20.3207 11.5869 20.1932 11.638L20.1891 11.6394L20.1809 11.6435L20.1493 11.6559C19.9685 11.7278 19.7865 11.7966 19.6034 11.8621C19.2404 11.9927 18.7358 12.1688 18.1638 12.3434C17.0418 12.6899 15.5801 13.0625 14.4375 13.0625C13.2729 13.0625 12.309 12.6775 11.4703 12.3406L11.4318 12.3269C10.56 11.9763 9.8175 11.6875 8.9375 11.6875C7.975 11.6875 6.68525 12.0038 5.58663 12.3434C5.09481 12.4969 4.60741 12.6643 4.125 12.8453V21.3125C4.125 21.4948 4.05257 21.6697 3.92364 21.7986C3.7947 21.9276 3.61984 22 3.4375 22C3.25516 22 3.0803 21.9276 2.95136 21.7986C2.82243 21.6697 2.75 21.4948 2.75 21.3125V0.6875C2.75 0.505164 2.82243 0.330295 2.95136 0.201364C3.0803 0.0724328 3.25516 0 3.4375 0C3.61984 0 3.7947 0.0724328 3.92364 0.201364C4.05257 0.330295 4.125 0.505164 4.125 0.6875V1.07525C4.43575 0.966625 4.807 0.8415 5.21125 0.71775C6.33325 0.374 7.79625 0 8.9375 0C10.0925 0 11.033 0.380875 11.8539 0.713625L11.913 0.738375C12.7682 1.0835 13.5135 1.375 14.4375 1.375C15.4 1.375 16.6898 1.05875 17.7884 0.719125C18.4143 0.523147 19.033 0.304841 19.6433 0.064625L19.6694 0.055L19.6749 0.05225H19.6763"
                                            fill="#85BCED"
                                        />
                                    </svg>
                                    <p class="report_option">Report</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="post_details">
                        <p class="title">${post.heading}</p>
                        <p class="body">
                            ${post.body}
                        </p>
                        <div id="post_images_wrapper" class="post_images_wrapper">
                            
                        </div>
                        <div class="reactions_wrapper">
                            <svg
                                class="heart_button"
                                width="18"
                                height="16"
                                viewBox="0 0 24 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12 1.92727C18.6572 -4.76364 35.3016 6.94472 12 22C-11.3016 6.94618 5.34282 -4.76364 12 1.92727Z"
                                    fill="url(#paint0_radial_41_145)"
                                />
                                <defs>
                                    <radialGradient
                                        id="paint0_radial_41_145"
                                        cx="0"
                                        cy="0"
                                        r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="translate(12 11) rotate(90) scale(11 12)"
                                    >
                                        <stop stop-color="#F09595" />
                                        <stop offset="1" stop-color="#F26060" />
                                    </radialGradient>
                                </defs>
                            </svg>
                            <p class="like_count">${post.reactions}</p>
                        </div>
                        <div id="file_wrapper" class="files_wrapper">
                            
                        </div>
                    </div>
                </div>
        `;
    posts_wrapper.insertAdjacentHTML("afterbegin", postHTMLEl);

    generatePostImages(
        post.contentPictures,
        document.getElementById("post_images_wrapper")
    );

    generatePostFiles(post.documents);
});

create_announcement_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const heading = e.target.heading.value;
    const body = e.target.body.value;
    const contentType = e.target.post_type.value;
    const className = e.target.class_type.value.split(" (")[0];
    const gradeName = e.target.class_type.value.split(" (")[1].replace(")", "");
    const contentPictures = e.target.images.files;
    const documents = e.target.documents.files;

    const formData = new FormData();

    formData.append("heading", heading);
    formData.append("body", body);
    formData.append("contentType", contentType);
    formData.append("className", className);
    formData.append("gradeName", gradeName);
    for (const image of contentPictures) {
        formData.append("contentPictures", image);
    }
    for (const document of documents) {
        formData.append("documents", document);
    }

    create_announcement_form.reset();
    const res = await fetch(endpoints.createPostApi, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    const data = await res.json();
    const announcementsRes = await data.result;
    create_announcement_dialog_box.close();
    const postHTMLEl = `
    <div class="post_card">
            <div class="posted_by_wrapper">
                <img src="${announcementsRes.posted_by.profilePicture}" class="profile_pic"/>
                <div class="posted_by_info">
                    <div class="posted_by_name_role">
                        <p class="name">${announcementsRes.posted_by.userName}</p>
                        <span class="delimiter">|</span>
                        <p class="role">${announcementsRes.posted_by.roles[0]}</p>
                    </div>
                    <p class="post_type">${announcementsRes.contentType}</p>
                </div>
                <div class="options_wrapper">
                    <svg
                        class="more_options"
                        width="35"
                        height="7"
                        viewBox="0 0 35 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M28 3.5C28 2.57174 28.3687 1.6815 29.0251 1.02513C29.6815 0.368749 30.5717 0 31.5 0C32.4283 0 33.3185 0.368749 33.9749 1.02513C34.6313 1.6815 35 2.57174 35 3.5C35 4.42826 34.6313 5.3185 33.9749 5.97487C33.3185 6.63125 32.4283 7 31.5 7C30.5717 7 29.6815 6.63125 29.0251 5.97487C28.3687 5.3185 28 4.42826 28 3.5ZM14 3.5C14 2.57174 14.3687 1.6815 15.0251 1.02513C15.6815 0.368749 16.5717 0 17.5 0C18.4283 0 19.3185 0.368749 19.9749 1.02513C20.6313 1.6815 21 2.57174 21 3.5C21 4.42826 20.6313 5.3185 19.9749 5.97487C19.3185 6.63125 18.4283 7 17.5 7C16.5717 7 15.6815 6.63125 15.0251 5.97487C14.3687 5.3185 14 4.42826 14 3.5ZM0 3.5C0 2.57174 0.368749 1.6815 1.02513 1.02513C1.6815 0.368749 2.57174 0 3.5 0C4.42826 0 5.3185 0.368749 5.97487 1.02513C6.63125 1.6815 7 2.57174 7 3.5C7 4.42826 6.63125 5.3185 5.97487 5.97487C5.3185 6.63125 4.42826 7 3.5 7C2.57174 7 1.6815 6.63125 1.02513 5.97487C0.368749 5.3185 0 4.42826 0 3.5Z"
                            fill="#A7A6A6"
                        />
                    </svg>
                    <div class="options_modalBox display_none">
                        <div class="edit_option_box option_box">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21.3153 2.66749C21.4438 2.79636 21.516 2.9709 21.516 3.15287C21.516 3.33483 21.4438 3.50937 21.3153 3.63824L19.8812 5.07374L17.1312 2.32374L18.5653 0.888241C18.6943 0.759355 18.8691 0.686951 19.0514 0.686951C19.2337 0.686951 19.4085 0.759355 19.5375 0.888241L21.3153 2.66612V2.66749ZM18.9091 6.04449L16.1591 3.29449L6.79122 12.6637C6.71555 12.7394 6.65858 12.8317 6.62485 12.9332L5.51797 16.2525C5.4979 16.313 5.49505 16.3779 5.50974 16.4399C5.52443 16.502 5.55609 16.5587 5.60117 16.6038C5.64625 16.6489 5.70298 16.6805 5.76502 16.6952C5.82706 16.7099 5.89196 16.7071 5.95247 16.687L9.27172 15.5801C9.37315 15.5468 9.46542 15.4903 9.54122 15.4151L18.9091 6.04449Z"
                                    fill="#BEEBB2"
                                />
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.375 18.5625C1.375 19.1095 1.5923 19.6341 1.97909 20.0209C2.36589 20.4077 2.89049 20.625 3.4375 20.625H18.5625C19.1095 20.625 19.6341 20.4077 20.0209 20.0209C20.4077 19.6341 20.625 19.1095 20.625 18.5625V10.3125C20.625 10.1302 20.5526 9.9553 20.4236 9.82636C20.2947 9.69743 20.1198 9.625 19.9375 9.625C19.7552 9.625 19.5803 9.69743 19.4514 9.82636C19.3224 9.9553 19.25 10.1302 19.25 10.3125V18.5625C19.25 18.7448 19.1776 18.9197 19.0486 19.0486C18.9197 19.1776 18.7448 19.25 18.5625 19.25H3.4375C3.25516 19.25 3.0803 19.1776 2.95136 19.0486C2.82243 18.9197 2.75 18.7448 2.75 18.5625V3.4375C2.75 3.25516 2.82243 3.0803 2.95136 2.95136C3.0803 2.82243 3.25516 2.75 3.4375 2.75H12.375C12.5573 2.75 12.7322 2.67757 12.8611 2.54864C12.9901 2.4197 13.0625 2.24484 13.0625 2.0625C13.0625 1.88016 12.9901 1.7053 12.8611 1.57636C12.7322 1.44743 12.5573 1.375 12.375 1.375H3.4375C2.89049 1.375 2.36589 1.5923 1.97909 1.97909C1.5923 2.36589 1.375 2.89049 1.375 3.4375V18.5625Z"
                                    fill="#BEEBB2"
                                />
                            </svg>
                            <p class="edit_option">Edit</p>
                        </div>
                        <div class="delete_option_box option_box">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.125 2.0625V3.4375H19.9375C20.1198 3.4375 20.2947 3.50993 20.4236 3.63886C20.5526 3.7678 20.625 3.94266 20.625 4.125C20.625 4.30734 20.5526 4.4822 20.4236 4.61114C20.2947 4.74007 20.1198 4.8125 19.9375 4.8125H19.1977L18.0249 19.47C17.9696 20.1591 17.6567 20.8022 17.1486 21.271C16.6405 21.7399 15.9745 22.0001 15.2831 22H6.71688C6.02552 22.0001 5.35947 21.7399 4.85138 21.271C4.34329 20.8022 4.03043 20.1591 3.97513 19.47L2.80225 4.8125H2.0625C1.88016 4.8125 1.7053 4.74007 1.57636 4.61114C1.44743 4.4822 1.375 4.30734 1.375 4.125C1.375 3.94266 1.44743 3.7678 1.57636 3.63886C1.7053 3.50993 1.88016 3.4375 2.0625 3.4375H6.875V2.0625C6.875 1.51549 7.0923 0.990886 7.47909 0.604092C7.86589 0.217298 8.39049 0 8.9375 0L13.0625 0C13.6095 0 14.1341 0.217298 14.5209 0.604092C14.9077 0.990886 15.125 1.51549 15.125 2.0625ZM8.25 2.0625V3.4375H13.75V2.0625C13.75 1.88016 13.6776 1.7053 13.5486 1.57636C13.4197 1.44743 13.2448 1.375 13.0625 1.375H8.9375C8.75516 1.375 8.5803 1.44743 8.45136 1.57636C8.32243 1.7053 8.25 1.88016 8.25 2.0625ZM6.1875 6.91487L6.875 18.6024C6.87867 18.6937 6.90053 18.7834 6.93929 18.8663C6.97806 18.9491 7.03295 19.0233 7.10076 19.0847C7.16858 19.146 7.24794 19.1932 7.33421 19.2235C7.42049 19.2538 7.51193 19.2665 7.6032 19.261C7.69447 19.2556 7.78373 19.2319 7.86576 19.1915C7.94778 19.1511 8.02092 19.0947 8.08089 19.0257C8.14087 18.9567 8.18647 18.8764 8.21504 18.7896C8.2436 18.7027 8.25455 18.611 8.24725 18.5199L7.55975 6.83237C7.55608 6.74101 7.53422 6.6513 7.49546 6.56849C7.45669 6.48568 7.4018 6.41143 7.33399 6.3501C7.26617 6.28876 7.18681 6.24157 7.10054 6.21128C7.01426 6.18099 6.92282 6.16822 6.83155 6.17371C6.74028 6.17919 6.65102 6.20283 6.56899 6.24324C6.48697 6.28364 6.41383 6.34001 6.35386 6.40902C6.29388 6.47804 6.24828 6.55833 6.21971 6.64519C6.19115 6.73205 6.1802 6.82373 6.1875 6.91487ZM15.1662 6.18887C14.9843 6.17836 14.8056 6.24052 14.6695 6.36171C14.5333 6.48289 14.4509 6.65317 14.4402 6.83513L13.7527 18.5226C13.7468 18.7019 13.8112 18.8763 13.9321 19.0088C14.0531 19.1412 14.2209 19.2212 14.4 19.2316C14.579 19.242 14.7551 19.182 14.8905 19.0645C15.0259 18.9469 15.1101 18.7811 15.125 18.6024L15.8125 6.91487C15.823 6.73292 15.7609 6.55423 15.6397 6.41809C15.5185 6.28195 15.3482 6.19951 15.1662 6.18887ZM11 6.1875C10.8177 6.1875 10.6428 6.25993 10.5139 6.38886C10.3849 6.5178 10.3125 6.69266 10.3125 6.875V18.5625C10.3125 18.7448 10.3849 18.9197 10.5139 19.0486C10.6428 19.1776 10.8177 19.25 11 19.25C11.1823 19.25 11.3572 19.1776 11.4861 19.0486C11.6151 18.9197 11.6875 18.7448 11.6875 18.5625V6.875C11.6875 6.69266 11.6151 6.5178 11.4861 6.38886C11.3572 6.25993 11.1823 6.1875 11 6.1875Z"
                                    fill="#FF6262"
                                />
                            </svg>
                            <p class="delete_option">Delete</p>
                        </div>
                        <div class="report_option_box option_box">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20.3197 0.116875C20.4136 0.179626 20.4905 0.264508 20.5437 0.364026C20.5969 0.463544 20.6249 0.574638 20.625 0.6875V11C20.625 11.1373 20.5838 11.2714 20.5069 11.3852C20.4299 11.4989 20.3207 11.5869 20.1932 11.638L20.1891 11.6394L20.1809 11.6435L20.1493 11.6559C19.9685 11.7278 19.7865 11.7966 19.6034 11.8621C19.2404 11.9927 18.7358 12.1688 18.1638 12.3434C17.0418 12.6899 15.5801 13.0625 14.4375 13.0625C13.2729 13.0625 12.309 12.6775 11.4703 12.3406L11.4318 12.3269C10.56 11.9763 9.8175 11.6875 8.9375 11.6875C7.975 11.6875 6.68525 12.0038 5.58663 12.3434C5.09481 12.4969 4.60741 12.6643 4.125 12.8453V21.3125C4.125 21.4948 4.05257 21.6697 3.92364 21.7986C3.7947 21.9276 3.61984 22 3.4375 22C3.25516 22 3.0803 21.9276 2.95136 21.7986C2.82243 21.6697 2.75 21.4948 2.75 21.3125V0.6875C2.75 0.505164 2.82243 0.330295 2.95136 0.201364C3.0803 0.0724328 3.25516 0 3.4375 0C3.61984 0 3.7947 0.0724328 3.92364 0.201364C4.05257 0.330295 4.125 0.505164 4.125 0.6875V1.07525C4.43575 0.966625 4.807 0.8415 5.21125 0.71775C6.33325 0.374 7.79625 0 8.9375 0C10.0925 0 11.033 0.380875 11.8539 0.713625L11.913 0.738375C12.7682 1.0835 13.5135 1.375 14.4375 1.375C15.4 1.375 16.6898 1.05875 17.7884 0.719125C18.4143 0.523147 19.033 0.304841 19.6433 0.064625L19.6694 0.055L19.6749 0.05225H19.6763"
                                    fill="#85BCED"
                                />
                            </svg>
                            <p class="report_option">Report</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="post_details">
                <p class="title">${announcementsRes.heading}</p>
                <p class="body">
                    ${announcementsRes.body}
                </p>
                <div id="post_images_wrapper" class="post_images_wrapper">
                    
                </div>
                <div class="reactions_wrapper">
                    <svg
                        class="heart_button"
                        width="18"
                        height="16"
                        viewBox="0 0 24 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12 1.92727C18.6572 -4.76364 35.3016 6.94472 12 22C-11.3016 6.94618 5.34282 -4.76364 12 1.92727Z"
                            fill="url(#paint0_radial_41_145)"
                        />
                        <defs>
                            <radialGradient
                                id="paint0_radial_41_145"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(12 11) rotate(90) scale(11 12)"
                            >
                                <stop stop-color="#F09595" />
                                <stop offset="1" stop-color="#F26060" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <p class="like_count">${announcementsRes.reactions}</p>
                </div>
                <div id="file_wrapper" class="files_wrapper">
                    
                </div>
            </div>
        </div>
`;
    posts_wrapper.insertAdjacentHTML("afterbegin", postHTMLEl);

    generatePostImages(
        announcementsRes.contentPictures,
        document.getElementById("post_images_wrapper")
    );

    generatePostFiles(announcementsRes.documents);
});

function removeAllUnderlineInSidebarTxt() {
    sidebar_txts.forEach((txt) => {
        txt.classList.remove("side_bar_active");
    });
}

function addViewDetailsFunctionality() {
    const view_detail_btns = document.querySelectorAll(".view_detail_btn");

    view_detail_btns.forEach((btn, i) => {
        btn.addEventListener("click", async (e) => {
            currentClass = classes[i]._id;
            view_detail_dialog_schoolnameEl.textContent =
                classes[i].school.schoolName;
            view_detail_dialog_classnameEl.textContent = classes[i].className;
            view_detail_dialog_classcodeEl.textContent = classes[i].classCode;
            if (classes[i].teachers.length === 0) {
                view_detail_dialog_teacherEl.classList.replace(
                    "dialog_name",
                    "dialog_name_unassigned"
                );
                view_detail_dialog_teacherEl.textContent = "Unassigned";
            } else if (classes[i].teachers.length > 0) {
                view_detail_dialog_teacherEl.classList.replace(
                    "dialog_name_unassigned",
                    "dialog_name"
                );
                // console.log(classes[i].teachers[0].userName);
                view_detail_dialog_teacherEl.textContent =
                    classes[i].teachers[0].userName;

                // color: rgb(154, 228, 248)
            }
            if (classes[i].students.length === 0) {
                view_detail_dialog_studentsEl.innerHTML = `<p  style="padding: 1em">No students assigned yet.`;
            } else if (classes[i].students.length > 0) {
                // console.log("This is the students of classes " + JSON.stringify(classes[i].students))
                for (let student of classes[i].students) {
                    view_detail_dialog_studentsEl.innerHTML += `<p class="student_name">${student.name}</p>`;
                    studentIds.push(student._id);
                }
            }
            classDetailDialogBox.showModal();
            viewStudentDetailsFunctionality();
        });
    });
}

function viewStudentDetailsFunctionality() {
    const students = document.querySelectorAll(".student_name");
    students.forEach((req, i) => {
        students[i].addEventListener("click", async () => {
            view_detail_dialog_parentsEl.innerHTML = ``;
            student_detail_dialog_box.showModal();
            const res = await fetch(
                endpoints.getStudentInfoApi(studentIds[i]),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            // console.log(data.result);
            const studentName = data.result.name;
            studentParents = data.result.guardians;

            view_detail_dialog_student_nameEl.innerHTML = studentName;
            view_detail_dialog_student_dobEl.innerHTML = formatDate(data.result.dateofBirth);

            if (studentParents.length === 0) {
                view_detail_dialog_parentsEl.innerHTML = `<p  style="padding: 1em">No Parents for this student yet</p>`;
            } else if (studentParents.length > 0) {
                for (let eachParent of studentParents) {
                    view_detail_dialog_parentsEl.innerHTML += `
                            <p  style="padding: 1em">
                            Parent name: ${eachParent.userName} <br>
                            Parent email: ${eachParent.email} <br>
                            Parent phone: ${eachParent.phone} <br>
                            Parent relationship: ${eachParent.relationship[0]} <br>
                            
                            </p>
                            `;
                }
            }
            if (role != "guardian") {
                const parentPendings = await fetch(
                    endpoints.readGuardianRequestsApi(currentClass,studentIds[i]),
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${token}`,
                        },
                    }
                );
                // console.log("current class " + currentClass + " and student id is " + studentIds[i] + " and token: " + token)
                const parentPendingsData = await parentPendings.json();
                // console.log(
                //     "parentPending data" + JSON.stringify(parentPendingsData)
                // );
                pendingParents = parentPendingsData.result;
                if (pendingParents.length === 0) {
                    view_detail_dialog_pending_parentsEl.innerHTML = `<p style="padding: 1em"> There are no pending parent requests at the moment </p>`;
                } else if (pendingParents.length > 0) {
                    for (let eachParent of pendingParents) {
                        view_detail_dialog_pending_parentsEl.innerHTML += `
                                <p  style="padding: 1em">
                                Parent name: ${eachParent.sender.userName} <br>
                                Parent email: ${eachParent.sender.email} <br>
                                Parent phone: ${eachParent.sender.phone} <br>
                                Parent relationship: ${eachParent.sender.relationship[0]} <br>
                                
                                </p>
    
                                <div style="padding: 1em" class="offer_accept_reject">
                                    <p class="accept_guardian">Accept</p>
                                    <p class="reject_guardian">Reject</p>
                                </div>
                                `;
                        let accept_guardian =
                            document.querySelector(".accept_guardian");
                        let reject_guardian =
                            document.querySelector(".reject_guardian");

                        let response;
                        accept_guardian.addEventListener("click", async () => {
                            response = await respondGuardianRequests(
                                currentClass,
                                eachParent._id,
                                true,
                                token
                            );

                            alert(response.msg);
                        });

                        reject_guardian.addEventListener("click", async () => {
                            response = await respondGuardianRequests(
                                currentClass,
                                eachParent._id,
                                false,
                                token
                            );

                            alert(response.msg);
                        });
                    }
                }
            } else {
                let parents_list_titleEl = document.getElementsByClassName("parents_list_title")[1];
                parents_list_titleEl.remove();
            }
             leave_requests_modal = document.getElementById("leave_requests_modal")
             
            // leave_requests_btn.addEventListener("click", async ()=> {
            //     leave_requests_modal.innerHTML = ""
            //     leave_requests_modal.classList.toggle("display_flex");
            //     let leaveRequests = [];
            //     const response = await getLeaveRequestsByClass(endpoints.readLeaveRequestByClassApi(currentClass), token)
            //     leaveRequests = response.result;
            //     if (leaveRequests.length > 0){
            //         // leave_requests_modal.innerHTML = `
            //         // <div class="request">
            //         // <p style="margin: auto"> No Requests at the moment</p>
            //         // </div>
            //         // `
            //         for (let oneRequest of leaveRequests) {
            //             leaveRequestIds.push(oneRequest._id);
            //             const request = `
            //             <div class="request">
            //                 <p class="requested_by">${oneRequest.studentId.name}</p>
            //                 <p class="requested_by">${oneRequest.reason}</p>
            //                 <p class="requested_by">${oneRequest.description}</p>
            //                 <p class="requested_by">${formatDate(oneRequest.startDate)}</p>
            //                 <p class="requested_by">${formatDate(oneRequest.endDate)}</p>
            //                 <div class="offer_accept_reject">
            //                     <p class="accept_button">Read</p>
            //                 </div>
            //             </div>
            //         `;
            //             leave_requests_modal.innerHTML += request;
            //         }
            //     }else{
            //         console.log("This function works")
            //         leave_requests_modal.innerHTML = `
            //         <div class="request">
            //         <p style="margin: auto"> No Requests at the moment</p>
            //         </div>
            //         `
                    
            //     }
            //     console.log("This is the response "+ JSON.stringify(leaveRequests))
            // })

            student_details_dialog_close_btnEl.addEventListener("click", () => {
                student_detail_dialog_box.close();
            });
        });
    });
}

async function getClasses(api, token) {
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    return data;
}

async function getPosts(api, token) {
    const res = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    });
    const resData = await res.json();
    if (res.status === 200) {
        return { statusCode: 200, resData };
    } else {
        return { statusCode: res.status, resData };
    }
}

function generatePostImages(postImageURLs, domEl) {
    // const postImagesWrapper = document.getElementById("post_images_wrapper");
    if (postImageURLs.length > 0) {
        for (const postImageUrl of postImageURLs) {
            const postImgHTMLEL = `
                                <img
                                    class="post_image"
                                    src="${postImageUrl}"
                                    alt="some png"
                                />
                            `;
            domEl.insertAdjacentHTML("afterbegin", postImgHTMLEL);
        }
    }
}

function generatePostFiles(postFilesArr) {
    const postFilesWrapper = document.getElementById("file_wrapper");
    if (postFilesArr.length > 0) {
        for (const [index, postFile] of postFilesArr.entries()) {
            const fileName = getFileNameFromURL(postFile);
            const postFileHTMLEl = `
                    <div class="file">
                        <span>${index})</span>
                        <p>${fileName}</p>
                        <div class="download_wrapper">
                            <a href="${postFile}" download="">
                                <p>Download</p>
                                <svg
                                    width="29"
                                    height="29"
                                    viewBox="0 0 29 29"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M0 14.5C0 7.6647 0 4.24705 2.1228 2.1228C4.2485 0 7.6647 0 14.5 0C21.3353 0 24.753 0 26.8758 2.1228C29 4.2485 29 7.6647 29 14.5C29 21.3353 29 24.753 26.8758 26.8758C24.7544 29 21.3353 29 14.5 29C7.6647 29 4.24705 29 2.1228 26.8758C0 24.7544 0 21.3353 0 14.5ZM14.5 6.1625C14.7884 6.1625 15.065 6.27708 15.269 6.48102C15.4729 6.68497 15.5875 6.96158 15.5875 7.25V14.7755L18.0815 12.2815C18.1811 12.1747 18.3011 12.089 18.4345 12.0295C18.5679 11.9701 18.7119 11.9381 18.8579 11.9355C19.004 11.933 19.149 11.9598 19.2844 12.0145C19.4198 12.0692 19.5428 12.1506 19.6461 12.2539C19.7494 12.3572 19.8308 12.4802 19.8855 12.6156C19.9402 12.751 19.967 12.896 19.9645 13.0421C19.9619 13.1881 19.9299 13.3321 19.8705 13.4655C19.811 13.5989 19.7253 13.7189 19.6185 13.8185L15.2685 18.1685C15.0646 18.3722 14.7882 18.4865 14.5 18.4865C14.2118 18.4865 13.9354 18.3722 13.7315 18.1685L9.3815 13.8185C9.27465 13.7189 9.18896 13.5989 9.12952 13.4655C9.07008 13.3321 9.03812 13.1881 9.03554 13.0421C9.03297 12.896 9.05983 12.751 9.11452 12.6156C9.16922 12.4802 9.25063 12.3572 9.3539 12.2539C9.45716 12.1506 9.58017 12.0692 9.71558 12.0145C9.851 11.9598 9.99604 11.933 10.1421 11.9355C10.2881 11.9381 10.4321 11.9701 10.5655 12.0295C10.6989 12.089 10.8189 12.1747 10.9185 12.2815L13.4125 14.7755V7.25C13.4125 6.96158 13.5271 6.68497 13.731 6.48102C13.935 6.27708 14.2116 6.1625 14.5 6.1625ZM8.7 20.6625C8.41158 20.6625 8.13497 20.7771 7.93102 20.981C7.72708 21.185 7.6125 21.4616 7.6125 21.75C7.6125 22.0384 7.72708 22.315 7.93102 22.519C8.13497 22.7229 8.41158 22.8375 8.7 22.8375H20.3C20.5884 22.8375 20.865 22.7229 21.069 22.519C21.2729 22.315 21.3875 22.0384 21.3875 21.75C21.3875 21.4616 21.2729 21.185 21.069 20.981C20.865 20.7771 20.5884 20.6625 20.3 20.6625H8.7Z"
                                        fill="#A0DEDE"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                `;
            postFilesWrapper.innerHTML += postFileHTMLEl;
        }
    }
}

// Add event listener for image input
imageInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        alert(`${this.files.length} image(s) selected.`);
    }
});

// Add event listener for document input
documentInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        alert(`${this.files.length} file(s) selected.`);
    }
});

function getFileNameFromURL(url) {
    // Split the URL by the '/' character and get the last part
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    // Split the file name by '.' to remove the file extension
    const nameWithoutExtension = fileName.split(".")[0];

    return nameWithoutExtension;
}

teacher_requests_modal = document.getElementById("teacher_requests_modal");
teacher_request_btn.addEventListener("click", async () => {
    teacher_requests_modal.innerHTML = "";
    teacher_requests_modal.classList.toggle("display_flex");

    const res = await fetch(
        endpoints.readTeacherRequestsApi(currentClass),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        }
    );

    const resData = await res.json();

    let allRequests = resData.result;
    requestIds = [];
    if (!allRequests) {
        teacher_requests_modal.innerHTML = `
        <div class="request">
            <p style="margin: auto"> No Requests at the moment</p>
        </div>
        `;
    } else {
        teacher_requests_modal.innerHTML = ""
        for (let oneRequest of allRequests) {
            requestIds.push(oneRequest._id);
            const request = `
            <div class="request">
                <p class="requested_by">${oneRequest.sender.userName}</p>
                <div class="offer_accept_reject">
                    <p class="accept_button">Accept</p>
                    <p class="reject_button">Reject</p>
                </div>
            </div>
        `;
            teacher_requests_modal.innerHTML += request;
        }
        respondFunctionality();
    }
});

add_student_button.addEventListener("click", async () => {
    add_student_dialog_box.showModal();
});

add_student_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const student_name = e.target.student_name.value;
    const student_dob = e.target.student_dob.value;

    const res = await fetch(
        endpoints.addNewStudentToClassApi(currentClass),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: student_name,
                dateofBirth: student_dob,
            }),
        }
    );

    const resData = await res.json();
    let newStudentData = resData.result;
    alert(resData.msg);
});

function respondFunctionality() {
    const requests = document.querySelectorAll(".request");
    requests.forEach((req, i) => {
        let username = req.querySelector(".requested_by").textContent;
        let accept_button = req.querySelector(".accept_button");
        let reject_button = req.querySelector(".reject_button");
        accept_button.addEventListener("click", async () => {
            const resData = await respondTeacherRequests(
                endpoints.respondTeacherReqApi,
                currentClass,
                requestIds[i],
                true,
                token
            );
            alert(resData.msg);
            view_detail_dialog_teacherEl.textContent = username;
            teacher_requests_modal.classList.toggle("display_flex");
            view_detail_dialog_teacherEl.classList.replace(
                "dialog_name_unassigned",
                "dialog_name"
            );
        });

        reject_button.addEventListener("click", async () => {
            const resData = await respondTeacherRequests(
                endpoints.respondTeacherReqApi,
                currentClass,
                requestIds[i],
                false,
                token
            );
            alert(resData.msg);
        });

        // reject_button.addEventListener("click", async())
    });
}

async function respondGuardianRequests(classId, requestId, response, token) {
    const res = await fetch(
        endpoints.respondGuardianReqApi,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                classId: classId,
                requestId: requestId,
                response: response,
            }),
        }
    );

    const resData = await res.json();
    return resData;
}

async function respondTeacherRequests(
    url,
    classId,
    requestId,
    response,
    token
) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId, requestId, response }),
    });

    const resData = await res.json();
    return resData;
}


//LOGOUT

logout_sidebar.addEventListener('click', async()=>{
    const returnMsg = await logOut(endpoints.logOutApi, token);
    // console.log("return msg " + returnMsg)
    alert(JSON.stringify(returnMsg))
    window.location.href = `${endpoints.mainWebsite}/signIn.html`;
})

async function logOut(api, token){
    const res = await fetch(api, {
        method: "POST", 
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    })
    const response = await res.json();
    return response.msg;
}

async function getLeaveRequests(api, token){
    const res = await fetch(api, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    })

    const response = await res.json();
    return response;
}

async function getLeaveRequestsByClass(api, token){
    const res = await fetch(api, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    })
    const response = await res.json();
    return response
}