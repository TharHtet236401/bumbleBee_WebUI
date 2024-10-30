import {cookieCheckApi, readByAdminApi, readByTrAndGuardianApi, getPostsApi} from "./indexApi.js"

const dashboard_sidebar = document.getElementById("dashboard_sidebar");

let classApi, role, token;

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode, resData } = await checkCookie(
        cookieCheckApi
    );
    token = resData.token;
    if (statusCode != 200) {
        alert("Cookie does not exist. Redirecting to sign in page");
        window.location.href = "http://127.0.0.1:5501/pages/signIn.html";
    }
    role = resData.userData.roles[0];

    if(role == "guardian" || role == "teacher"){
        classApi = readByTrAndGuardianApi
        teacher_request_btn.remove()
        if(role == "guardian"){
            add_student_button.remove();
            // add_student_button.style.display == "none"
        }
    }else{
        classApi = readByAdminApi
        add_student_button.remove()
        // add_student_button.style.display == "none"
    }
    
    const classData = await getClasses(
        classApi,
        token
    );

    if(classData.result){
        classes = classData.result.classes;
        classListNames = classes.map((classData) => classData.className);
        classListGrades = classes.map((classData) => classData.grade);
        const classNameGradeObj = classListNames.map((name, index) => ({
            className: name,
            gradeName: classListGrades[index]
        }))
            .sort((a, b) => a.gradeName - b.gradeName);
        const classTypeSelectEl = document.getElementById("class_type")
        for (const classData of classNameGradeObj) {
            const optionEl = document.createElement("option");
            optionEl.value = `${classData.className} (${classData.gradeName})`;
            optionEl.innerText = `${classData.className} (${classData.gradeName})`;
            
            classTypeSelectEl.appendChild(optionEl);
        }
    }
    const postDatas = await getPosts(getPostsApi, token);
    const postStatusCode = postDatas.statusCode;
    if (postStatusCode === 200) {
        posts = postDatas.resData.result.items;
        feeds = posts.filter((post) => post.contentType === 'feed');
        announcements = posts.filter((post) => post.contentType === 'announcement');
    }
});

dashboard_sidebar.addEventListener("click", () => {
    removeAllUnderlineInSidebarTxt();
    dashboard_txt.classList.add("side_bar_active");

    if(role == "admin"){
        dashboardClassButton = "Create class"
    }else{
        dashboardClassButton = "Join class"
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
        `
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
            `

            let classButton;
            classButton = `
                        <div class="class-right">
                            <p class="view_detail_btn">View details</p>
                        </div>
                `
            classWrapper.innerHTML += `<div class="class"> ${classHTMLEl} ${classButton} </div>`
            // classWrapper.innerHTML += classHTMLEl;
        }
    }

    const create_class_btn = document.getElementById("create_class_btn");
    addViewDetailsFunctionality();

    class_detail_dialog_clost_btn.addEventListener("click", () => {
        classDetailDialogBox.close();
        view_detail_dialog_studentsEl.innerHTML = ""
    });

    create_class_btn.addEventListener("click", () => {
        if(role == "admin"){
            create_class_dialog_box.showModal();
        }else if(role == "teacher"){
            join_class_dialog_box.showModal()
        }else {
            parent_join_class_dialog_box.showModal();
        }
        
    });

    create_class_dialog_close_btn.addEventListener("click", () => {
        create_class_dialog_box.close();
    });

    join_class_dialog_close_btn.addEventListener("click", () => {
        join_class_dialog_box.close()
    })

    add_student_close_dialog_box.addEventListener("click", () => {
        add_student_dialog_box.close()
    })

    parent_join_class_dialog_close_btn.addEventListener("click", () => {
        parent_join_class_dialog_box.close();
    })
});