import {mainWebsite, getUserProfileApi, cookieCheckApi} from "./endpoints.js"
import { checkCookie } from "../utils/cookies.js";
const goToIndexButton = document.getElementById("goToIndex")
// const aboutMyself = document.getElementById("aboutMyself")
const profileDataEl = document.getElementById("profileData")
const profilePicture = document.getElementById("profilePicture")

let token;

goToIndexButton.addEventListener("click", ()=> {
    window.location.href = `${mainWebsite}/index.html`;
})

document.addEventListener("DOMContentLoaded", async () => {
    const { statusCode, resData } = await checkCookie(
        cookieCheckApi
    );
    if (statusCode != 200) {
        // alert("Cookie does not exist. Redirecting to sign in page");
        window.location.href = `${mainWebsite}/signIn.html`;
    }else{
        token = resData.token;
        let profileData = await getUserProfile();
        let profilePic = profileData.result.profilePicture
        let ifProfilePicExists = await checkImage(profilePic)
        let userName = profileData.result.userName
        let email = profileData.result.email
        let role = profileData.result.roles[0];
        let phone = profileData.result.phone
        let school= profileData.result.schools[0]
        let childern = profileData.result.childern;
        let relationship = profileData.result.relationship
        let classesRaw = profileData.result.classes;
        let classes = [];
        if(classesRaw){
            classesRaw.forEach((eachClass)=>{
                classes.push(`Grade - ${eachClass.grade}(Class - ${eachClass.className})`)
            })
        }

        if(!school){
            school = "None"
            classes = "None"
        }else{
            school = school.schoolName
            if(classes.length === 0){
                classes = "None"
            }else{
                classes = classes.join("<br>")
            }
        }

        if(relationship.length === 0){
            relationship = "None"
            childern = "None"
        }else{
            if(childern.length === 0){
                childern="None"
            }
        }
        
        

        let userDataAll = {
            Name: userName,
            Email: email,
            Role: role,
            Phone: phone,
            School: school,
            Children: childern,
            Relationship: relationship,
            Classes: classes
          };

        if(ifProfilePicExists){
            profilePicture.innerHTML = ` <img src="${profilePic}"> </img>`
        
        }
        profileDataEl.innerHTML = ""
        Object.keys(userDataAll).forEach(eachData => {
            console.log(eachData, userDataAll[eachData])
            profileDataEl.innerHTML += `
            <div class="profileField">
                <div class="profileKey">${eachData}</div>
                <div class="profileValue">${userDataAll[eachData]}</div>
            </div>
        `
        })

        let profileValueEl = document.querySelectorAll(".profileValue")
        profileValueEl.forEach((profileValue)=>{
            if(profileValue.textContent == "None"){
                profileValue.style.color = "red"
            }
        })
        
    }
})

async function getUserProfile(){
    const res = await fetch(getUserProfileApi, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        }
    })

    return( await res.json())
}

async function checkImage(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Image failed to load with status: ${response.status}`);
      }
  
      return true;
    } catch (error) {
      console.error(`Error checking image: ${error.message}`);
      return false;
    }
  }

