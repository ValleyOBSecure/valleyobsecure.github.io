import { d } from "../../asset/js/custom.lib.js";
import { commonLoad } from "./common.js";

const homePage = `
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

            <ul class="navbar-nav">
              <li id="homeBtn">
                <a href="javascript:void(0);" class="active">
                  <span class="txt">Home</span>
                </a>
              </li>
              <li id="historyBtn">
                <a href="javascript:void(0);">
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
        <section class="common-sec">
          <div class="container-fluid">
            <form name="secure-message-form" id="secure-message-form">
              <div class="row">
                <div class="col-md-5 col-lg-4">
                  <div class="secure-message-fields">
                    <div class="input-bx">
                      <label for="">Name</label>
                      <input
                        type="text"
                        name=""
                        class="form-control"
                        id="Name"
                        autocomplete="off"
                        spellcheck="false"
                        required
                        placeholder="Copy & Paste Only"
                        oninput="inputPrevent(event)"
                        value="Test Name"
                      />
                    </div>

                    <div class="input-bx">
                      <label for="">Email</label>
                      <input
                        type="text"
                        name=""
                        class="form-control"
                        id="Email"
                        autocomplete="off"
                        spellcheck="false"
                        required
                        placeholder="Copy & Paste Only"
                        oninput="inputPrevent(event)"
                        value="saffiullah.fahim@gmail.com"
                      />
                    </div>

                    <div class="input-bx">
                      <label for="">Date Of Birth</label>
                      <input
                        type="text"
                        name=""
                        class="form-control"
                        id="Birth"
                        autocomplete="off"
                        spellcheck="false"
                        required
                        placeholder="Copy & Paste Only"
                        oninput="inputPrevent(event)"
                        value="01-01-2000"
                      />
                    </div>

                    <div class="input-bx">
                      <label for="File"
                        >Attach File ( < 5 MB PDF Only )</label
                      >
                      <input type="file" required id="File" />
                    </div>

                    <div
                      class="input-bx input-checkbox secure-message-checkbox"
                    >
                      <input
                        type="checkbox"
                        required
                        value=""
                        id="defaultCheck1"
                      />
                      <label for="defaultCheck1">
                        Check this box to confirm that you have personally
                        varified NAME and DOB on the file and the file belongs
                        to this patient.
                      </label>
                    </div>

                    <div style="margin-bottom: 10px" class="input-submit">
                      <button type="submit" class="custom-btn">Send</button>
                    </div>
                    <p style="display: none" class="msg-success text-center">
                      Message Sent
                    </p>
                    <p style="display: none" class="msg-error text-center">
                      Message Sent
                    </p>
                  </div>
                </div>
                <!-- col -->

                <div class="col-md-7 col-lg-8">
                  <div class="secure-message-radios">
                    
                  </div>
                </div>
                <!-- col -->
              </div>
              <!-- row -->
            </form>
          </div>
          <!-- container -->
        </section>
        <!-- common-sec -->
      </main>
    </section>

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

let finalMessage = "";

const showData = (data) => {
  data = data.reverse();
  let messages = document.querySelector(".secure-message-radios");
  let loading = document.querySelector("#loading");
  let result = "";
  let index = 0;
  let idList = [];
  for (let x of data) {
    idList.push(index);
    result += `
    <div class="input-bx input-radio">
        <div class="radio-bx">
        <input
            type="radio"
            name="radioSelector"
            value=""
            autocomplete="off"
            spellcheck="false"
            required
            id="checkRadio${index}"
        />
        </div>
        <label for="checkRadio${index}">
        ${x[0].substr(1)}
        </label>
    </div>
    `;
    index++;
  }
  messages.innerHTML = `
    ${result}

    <div class="input-bx input-radio">
        <div class="radio-bx">
        <input
            type="radio"
            name="radioSelector"
            value=""
            id="checkRadioCustom"
            autocomplete="off"
            spellcheck="false"
            required
        />
        </div>
        <label for="checkRadioCustom"> Custom </label>
    </div>

    <div
        style="display: none"
        id="custom-message"
        class="input-bx"
    >
        <textarea
        name=""
        class="form-control"
        id="custom-message-value"
        cols="30"
        autocomplete="off"
        spellcheck="false"
        ></textarea>
    </div>
  `;

  let custom_message = document.querySelector("#custom-message");
  let custom_message_value = document.querySelector("#custom-message-value");

  document.querySelector("#checkRadioCustom").onchange = () => {
    custom_message_value.required = true;
    custom_message_value.value = "";
    custom_message.style.display = "block";
  };

  for (let x of idList) {
    let input = document.querySelector(`#checkRadio${x}`);
    input.onchange = (e) => {
      custom_message.style.display = "none";
      custom_message_value.value = data[x][0].substr(1);
      custom_message_value.required = false;
    };
  }
  loading.style.display = "none";
};

const homeLoad = (data) => {
  const { readFiles, post, GAS, database } = d;
  commonLoad();
  showData(data);
  let Name = document.querySelector("#Name");
  let Email = document.querySelector("#Email");
  let Birth = document.querySelector("#Birth");
  let File = document.querySelector("#File");
  let button = document.querySelector(".custom-btn");
  let error = document.querySelector(".msg-error");
  let success = document.querySelector(".msg-success");
  let loading = document.querySelector("#loading");

  document.forms["secure-message-form"].onsubmit = async (e) => {
    e.preventDefault();

    let custom_message_value = document.querySelector("#custom-message-value");

    button.innerText = "Sending...";
    error.style.display = "none";
    success.style.display = "none";
    loading.style.display = "block";

    if (File.files[0].type != "application/pdf") {
      button.innerText = "Send";
      error.innerHTML = "Only PDF files may be uploaded.";
      error.style.display = "block";
      loading.style.display = "none";
      return;
    }

    if (File.files[0].size > 5242880) {
      button.innerText = "Send";
      error.innerHTML = "Error! PDF file size < 5MB";
      error.style.display = "block";
      loading.style.display = "none";
      return;
    }
    let fileData64 = await readFiles(File.files[0]);
    fileData64 = fileData64[0];

    post(GAS, {
      type: 15,
      data: JSON.stringify({
        time: "",
        fileName: File.files[0].name,
        file: fileData64,
        date: Birth.value,
        name: Name.value,
        email: Email.value,
        messege: custom_message_value.value,
        id: "",
        database: database,
      }),
    })
      .then((res) => {
        res = JSON.parse(JSON.parse(res).messege);
        const { result } = res;
        if (result) {
          e.target.reset();
          button.innerText = "Send";
          loading.style.display = "none";
          success.style.display = "block";
        } else {
          console.log(res);
          error.style.display = "block";
          error.innerText = "Error found!";
          button.innerText = "Send";
          loading.style.display = "none";
        }
      })
      .catch((err) => {
        console.log(err);
        error.style.display = "block";
        error.innerText = "Error found!";
        button.innerText = "Send";
        loading.style.display = "none";
      });
  };
};

export { homePage, homeLoad };
