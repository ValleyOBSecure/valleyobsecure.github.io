import { d } from "../../asset/js/custom.lib.js";
import { login, loginLoad } from "./login.js";
import { addMessageLoad, messagePage } from "./messagePage.js";
import { userPage, addUserLoad } from "./userPage.js";

const commonLoad = (type = "") => {
  if (type) {
    usersLoad();
    //messagesLoad();
    logoutLoad();
    return;
  }
  usersLoad();
  messagesLoad();
  backupFormLoad();
  changePasswordLoad();
  logoutLoad();
};

const usersLoad = () => {
  const { GAS, post, database, backup } = d;
  let button = document.querySelector("#homeBtn");
  button.onclick = () => {
    document.querySelector("#root").innerHTML = userPage;
    post(GAS, {
      type: 5,
      data: JSON.stringify({
        database: database,
      }),
    })
      .then(async (res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result, data } = res;
        if (result) {
          addUserLoad(data);
          document.querySelector("#backupEmail").value = backup ? backup : "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const messagesLoad = () => {
  const { GAS, post, database, backup } = d;
  let button = document.querySelector("#messageBtn");
  button.onclick = () => {
    document.querySelector("#root").innerHTML = messagePage;
    post(GAS, {
      type: 8,
      data: JSON.stringify({
        database: database,
      }),
    })
      .then(async (res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result, data } = res;
        if (result) {
          addMessageLoad(data);
          document.querySelector("#backupEmail").value = backup ? backup : "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const backupFormLoad = () => {
  const { GAS, post, database } = d;
  let backup = document.querySelector("#backupEmail");
  let button = document.querySelector("#backupBtn");
  let error = document.querySelector("#backup-error");
  let success = document.querySelector("#backup-success");

  document.forms["backup-form"].onsubmit = (e) => {
    e.preventDefault();
    button.innerText = "Processing..";
    error.style.display = "none";
    success.style.display = "none";
    loading.style.display = "block";
    d.backup = backup.value.trim();
    post(GAS, {
      type: 2,
      data: JSON.stringify({
        email: backup.value.trim(),
        database: database,
      }),
    })
      .then((res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result } = res;
        if (result) {
          button.innerText = "Backup";
          success.innerText = "Successfully set up backup email!";
          success.style.display = "block";
          loading.style.display = "none";
        } else {
          button.innerText = "Backup";
          error.innerHTML = "Error Found! Please try again.";
          error.style.display = "block";
          loading.style.display = "none";
        }
      })
      .catch((err) => {
        console.log(err);
        button.innerText = "Backup";
        error.innerText = "Error Found! Please try again.";
        error.style.display = "block";
        loading.style.display = "none";
      });
  };
};

const changePasswordLoad = () => {
  const { GAS, post, database, customPasword } = d;
  let oldPass = document.querySelector("#oldPass");
  let newPass = document.querySelector("#newPass");
  let conNewPass = document.querySelector("#conNewPass");
  let button = document.querySelector("#changePasswordBtn");
  let error = document.querySelector("#changePassword-error");
  let success = document.querySelector("#changePassword-success");

  const { $password: $oldPass } = customPasword(oldPass);
  const { $password: $newPass } = customPasword(newPass);
  const { $password: $conNewPass } = customPasword(conNewPass);

  document.forms["changePasswordForm"].onsubmit = (e) => {
    e.preventDefault();
    button.innerText = "Changing..";
    error.style.display = "none";
    success.style.display = "none";
    loading.style.display = "block";

    if ($newPass() !== $conNewPass()) {
      button.innerText = "Change";
      error.innerText = "Confirm password doesn't match.";
      error.style.display = "block";
      loading.style.display = "none";
      return;
    }
    post(GAS, {
      type: 3,
      data: JSON.stringify({
        oldPass: $oldPass(),
        newPass: $newPass(),
        database: database,
      }),
    })
      .then((res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result, messege } = res;
        if (result) {
          if (messege == "success") {
            button.innerText = "Change";
            success.innerText = "Successfully changed password!";
            success.style.display = "block";
            loading.style.display = "none";
          } else {
            button.innerText = "Change";
            error.innerHTML = "Old Password is't correct";
            error.style.display = "block";
            loading.style.display = "none";
          }
        } else {
          button.innerText = "Change";
          error.innerHTML = "Error Found! Please try again.";
          error.style.display = "block";
          loading.style.display = "none";
        }
      })
      .catch((err) => {
        console.log(err);
        button.innerText = "Change";
        error.innerText = "Error Found! Please try again.";
        error.style.display = "block";
        loading.style.display = "none";
      });
  };
};

const logoutLoad = () => {
  let button = document.querySelector("#logoutBtn");
  button.onclick = () => {
    document.querySelector("#root").innerHTML = login;
    loginLoad();
  };
};

// search load
const searchLoad = (data, callback, indexs, type = null) => {
  let search = document.querySelector("#search");

  document.forms["search-form"].onsubmit = (e) => {
    e.preventDefault();
    let finalData = [];
    for (let i = 0; i < data.length; i++) {
      indexs.forEach((value) => {
        if (
          data[i][value].toLowerCase().indexOf(search.value.toLowerCase()) > -1
        ) {
          data[i].push(i + 1);
          finalData.push(data[i]);
        }
      });
    }
    if (type === null) callback(finalData, 1);
    else {
      type.data = finalData;
      callback(type, 1);
    }
  };
};

// sortin load
const sortingLoad = (index, data, type, callback, res = null) => {
  let sortingBtn = document.querySelector("#sortingBtn");
  let loading = document.querySelector("#loading");
  sortingBtn.onclick = () => {
    if (data.length) {
      loading.style.display = "block";

      let data1 = data[0][index];
      if (type == "") {
        data.forEach((v, i) => {
          data[i].push(i + 1);
        });
        type = 1;
      }

      data = data.sort((a, b) => {
        let x = a[index].substr(1).toLowerCase();
        let y = b[index].substr(1).toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });

      if (data[0][index] === data1) {
        data = data.reverse();
      }

      if (res === null) callback(data, type);
      else {
        res.data = data;
        callback(res, type);
      }
    }
  };
};

// download file
const download = async (id, fileName) => {
  const { GAS, post } = d;
  let loading = document.querySelector("#loading");
  loading.style.display = "block";

  let data = JSON.parse(
    JSON.parse(
      await post(GAS, {
        type: 17,
        data: JSON.stringify({
          id: id,
        }),
      })
    ).messege
  ).data;
  const anchor = document.createElement("a");
  if ("download" in anchor) {
    //html5 A[download]
    anchor.href = "data:application/pdf;base64," + data;
    anchor.setAttribute("download", fileName);
    anchor.innerHTML = "downloading...";
    anchor.style.display = "none";
    anchor.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.body.appendChild(anchor);
    setTimeout(function () {
      anchor.click();
      document.body.removeChild(anchor);
      loading.style.display = "none";
    }, 66);
  }
};

export { commonLoad, searchLoad, sortingLoad, download };
