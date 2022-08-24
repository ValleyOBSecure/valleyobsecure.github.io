import { login, loginLoad } from "../../modules/admin/login.js";

console.log("ValleyOB Secure Message Application.");

document.querySelector("#root").innerHTML = login;
loginLoad();
