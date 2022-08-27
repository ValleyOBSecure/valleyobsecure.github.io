import { d } from "../../asset/js/custom.lib.js";
import { commonLoad, searchLoad, sortingLoad, download } from "./common.js";

const historyPage = `
<div>
  <section id="wrapper">
    <header class="site-header">
      <div class="container-fluid">
        <nav class="navbar site-navigation">
          <div class="navbar-brand">
            <a href="javascript:void(0);">
              <img src="./asset/img/logo.svg" alt="Logo" />
            </a>
          </div>

          <div class="search-dv">
            <form name="search-form" id="search_form">
              <button type="submit">
                <img src="./asset/img/search-icon.png" alt="Search" />
              </button>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                autocomplete="off"
                spellchaeck="false"
              />
            </form>
            <span id="sortingBtn" class="ic-dv arrow-ic">
              <a href="javascript:void(0);">
                <img src="./asset/img/up-dwn-arr.png" alt="Icon" />
              </a>
            </span>
          </div>

          <ul class="navbar-nav">
            <li id="homeBtn">
              <a href="javascript:void(0);" class="">
                <span class="txt">Home</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0);" class="active">
                <span class="icon">
                  <img
                    src="./asset/img/share-clock.png"
                    alt="History"
                    class="iconBlack"
                  />
                  <img
                    src="./asset/img/share-clock-blue.png"
                    alt="History"
                    class="iconBlue"
                  />
                </span>
                <span class="txt">History</span>
              </a>
              </li>
            <li id="logoutBtn">
              <a href="javascript:void(0);">
                <span class="icon"
                  ><img src="./asset/img/logout.png" alt="LogOut"
                /></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- container -->
    </header>

    <main class="site-main">
      <section>
        <div class="container-fluid">
          <div class="history-table-wrapp">
            <table class="custom-table"></table>
          </div>
        </div>
        <!-- container -->
      </section>
      <!-- common-sec -->
    </main>
  </section>
  <!-- wrapper -->

  <div style="" id="loading">
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  </div>
</div>
`;

const showData = ({ user, database, data }, type = "") => {
  const { post, GAS } = d;
  let table = document.querySelector(".custom-table");
  let loading = document.querySelector("#loading");
  let result = "";
  let index = 1;
  let idList = [];
  for (let x of data) {
    let id = index;
    if (type) id = x[6];
    idList.push({
      id,
      file: x[5].substr(1),
      name: x[0].substr(1),
    });

    let docName = "";
    let exportField = "";
    if (x[0].substr(1).replace(".pdf", "").replace(".PDF", "")) {
      docName = `
        <span class="icon">
          <img src="./asset/img/pdf.png" alt="PDF"/>
        </span>
        <span class="txt">${x[0].substr(1).replace(".pdf", "").replace(".PDF", "")}</span>
      `;

      exportField = `
        <button id="export-${index}" class="tb-btn export">
          <span class="icon">
            <img src="./asset/img/pdf.png" class="black" alt="PDF" />
            <img
              src="./asset/img/pdf-white.png"
              class="white"
              alt="PDF"
            />
          </span>
          <span class="txt">Export</span>
        </button>
      `;
    }


    result += `
    <tr>
      <td>
        ${docName}
      </td>
      <td>${x[1].substr(1)}</td>
      <td>${x[2].substr(1)}</td>
      <td>${x[3].substr(1)}</td>
      <td>${x[4].substr(1)}</td>
      <td class="text-center">
        ${exportField}
      </td>
      <td class="text-center">
        <button id="delete-${id}" class="tb-btn-smpl delete">
          <span class="icon"
            ><img
              src="./asset/img/Icon-feather-trash.png"
              alt="Trash"
          /></span>
        </button>
      </td>
    </tr>
    `;
    index++;
  }

  table.innerHTML = `
  <caption
    style="
      text-align: center;
      display: table-caption;
      font-weight: 600;
      font-size: 18px;
      caption-side: top;
      color: #000;
      margin-bottom: 10px;
    "
  >
    ${user}
  </caption>
  <tr>
    <th>Attachments</th>
    <th>Date</th>
    <th>Name</th>
    <th>Email</th>
    <th>Message</th>
    <th class="text-center">Export PDF</th>
    <th class="text-center position-relative">
      <button id="clearAllBtn"
        class="custom-btn popSubmit"
        style="
          position: absolute;
          top: -50px;
          left: 0;
          right: 0;
          margin: 0 auto;
          max-width: 130px;
          padding: 10px 20px;
        "
      >
        Clear History
      </button>
      <span>Delete</span>
    </th>
  </tr>
	${result}
  `;

  for (let x of idList) {
    //console.log(x)
    let button = document.querySelector(`#delete-${x.id}`);
    let exportBtn = document.querySelector(`#export-${x.id}`);
    // delete
    button.onclick = async () => {
      loading.style.display = "block";
      let res = await post(GAS, {
        type: 11,
        data: JSON.stringify({
          id: x.id,
          database: database,
        }),
      });
      res = JSON.parse(JSON.parse(res).messege);
      showData(res);
      searchLoad(res.data, showData, [1, 2, 3], res);
      document.querySelector("#search").value = "";
    };

    if (exportBtn) {
      exportBtn.onclick = () => {
        download(x.file, x.name);
      };
    }
  }
  table.style.display = "table";
  loading.style.display = "none";

  // clear all history
  let clearAllBtn = document.querySelector("#clearAllBtn");
  clearAllBtn.onclick = async () => {
    clearAllBtn.innerHTML = "Processing...";
    loading.style.display = "block";
    let res = await post(GAS, {
      type: 12,
      data: JSON.stringify({
        database: database,
      }),
    });
    res = JSON.parse(JSON.parse(res).messege);
    clearAllBtn.innerHTML = "Clear History";
    showData(res);
    searchLoad(res.data, showData, [1, 2, 3], res);
    document.querySelector("#search").value = "";
  };
  sortingLoad(2, data, type, showData, { user, database, data });
};

const historyLoad = (database) => {
  const { post, GAS } = d;
  commonLoad(1);
  post(GAS, {
    type: 10,
    data: JSON.stringify({
      database: database,
    }),
  })
    .then(async (res) => {
      res = JSON.parse(JSON.parse(res).messege);
      if (res.result) {
        showData(res);
        searchLoad(res.data, showData, [1, 2, 3], res);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export { historyPage, historyLoad };
