import { login, loginLoad } from "../../modules/user/login.js";

console.log("ValleyOB Secure Message Application for User.");

document.querySelector("#root").innerHTML = login;
loginLoad();
