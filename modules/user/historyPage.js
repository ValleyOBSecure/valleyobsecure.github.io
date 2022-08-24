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
            <li id="historyBtn">
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

const showData = (data, type = "") => {
  let table = document.querySelector(".custom-table");
  let loading = document.querySelector("#loading");
  let result = "";
  let index = 0;
  let idList = [];
  for (let x of data) {
    idList.push(index);
    result += `
    <tr>
      <td>
        <span class="icon"
          ><img src="./asset/img/pdf.png" alt="PDF"
        /></span>
        <span class="txt">${x[0].substr(1)}</span>
      </td>
      <td>${x[1].substr(1)}</td>
      <td>${x[2].substr(1)}</td>
      <td>${x[3].substr(1)}</td>
      <td>${x[4].substr(1)}</td>
      <td class="text-center">
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
      </td>
    </tr>
    `;
    index++;
  }

  table.innerHTML = `
  <tr>
    <th>Attachments</th>
    <th>Date</th>
    <th>Name</th>
    <th>Email</th>
    <th>Message</th>
    <th class="text-center">Export PDF</th>
  </tr>
	${result}
  `;

  for (let x of idList) {
    let exportBtn = document.querySelector(`#export-${x}`);
    exportBtn.onclick = () => {
      download(data[x][5], data[x][1]);
    };
  }
  table.style.display = "table";
  loading.style.display = "none";
  sortingLoad(0, data, type, showData);
};

const historyLoad = (database) => {
  const { post, GAS } = d;
  commonLoad();
  post(GAS, {
    type: 10,
    data: JSON.stringify({
      database: database,
    }),
  })
    .then(async (res) => {
      res = JSON.parse(JSON.parse(res).messege);
      if (res.result) {
        showData(res.data);
        searchLoad(res.data, showData, [1, 2, 3]);
      } else {
        console.log(res);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export { historyPage, historyLoad };
