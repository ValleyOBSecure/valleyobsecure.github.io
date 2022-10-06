import { d } from "../../asset/js/custom.lib.js";
import { commonLoad } from "./common.js";
const { PDFDocument, StandardFonts } = PDFLib;

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
                      />
                    </div>

                    <div class="input-bx">
                      <label for="File"
                        >Attach File ( < 5 MB PDF Only )</label
                      >
                      <input type="file" id="File" />
                    </div>

                    <div
                      style="display: none;"
                      class="input-bx input-checkbox secure-message-checkbox"
                    >
                      <input
                        type="checkbox"
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

// download file
const download = async (data, fileName) => {
  let loading = document.querySelector("#loading");
  loading.style.display = "block";

  const anchor = document.createElement("a");
  if ("download" in anchor) {
    //html5 A[download]
    anchor.href = data;
    anchor.setAttribute("download", fileName + ".pdf");
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

const breakLine = (data) => {
  let dataArray = data.split(" ");
  let result = "";
  let line = "";
  let maxChr = 67;

  for (let i = 0; i < dataArray.length; i++) {
    let x = dataArray[i];
    line += x + " ";
    if (line.length > maxChr) {
      line = line.substr(0, line.length - x.length - 1);
      result += line + "\n";
      line = x + " ";
    }

    if (i == dataArray.length - 1) {
      result += line;
    }
  }

  return result;
};

const createPdf = async (obj, pdf) => {
  const fontSize = 13;
  const size = [];

  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let key in obj) {
    size.push(helveticaBold.widthOfTextAtSize(key, fontSize));
  }

  let initY = 50;
  let maxH = helveticaBold.heightAtSize(fontSize);
  let maxW = Math.max(...size);

  const page = pdfDoc.addPage();

  for (let key in obj) {
    page.drawText(key, {
      x: 50,
      y: page.getHeight() - initY,
      size: fontSize,
      font: helveticaBold,
    });

    page.drawText(":", {
      x: maxW + 60,
      y: page.getHeight() - initY,
      size: fontSize,
      font: helveticaBold,
    });

    page.drawText(obj[key], {
      x: maxW + 70,
      y: page.getHeight() - initY,
      size: fontSize,
      font: helvetica,
    });

    initY += maxH + 10;
  }

  console.log(page);

  let pdfBytes;
  if (pdf) {
    const pdfDoc_ = await PDFDocument.load(pdf);
    const page = await pdfDoc_.copyPages(pdfDoc, [0]);
    pdfDoc_.insertPage(0, page[0]);
    pdfBytes = await pdfDoc_.saveAsBase64({ dataUri: true });
  } else {
    pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
  }

  return pdfBytes;
};

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

const getDateTime = () => {
  let time = new Date();
  return (
    time.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " | " +
    time.toLocaleTimeString("en-US")
  );
};

const homeLoad = (data) => {
  const { readFiles, convertDataURIToBinary, post, GAS, database } = d;
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

  Birth.addEventListener("input", (e) => {
    if (
      /^(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])\-\d{4}$/.test(Birth.value) ==
      false
    ) {
      error.style.display = "block";
      error.innerText = "Date of Birth allow only MM-DD-YYYY format.";
    } else {
      error.style.display = "none";
    }
  });

  File.onchange = (e) => {
    let checkboxDiv = document.querySelector(".secure-message-checkbox");
    checkboxDiv.style.display = "flex";
    document.querySelector("#defaultCheck1").required = true;
  };

  document.forms["secure-message-form"].onsubmit = async (e) => {
    e.preventDefault();

    let custom_message = document.querySelector("#custom-message");
    let custom_message_value = document.querySelector("#custom-message-value");

    error.style.display = "none";

    if (
      /^(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])\-\d{4}$/.test(Birth.value) ==
      false
    ) {
      error.style.display = "block";
      error.innerText = "Date of Birth allow only MM-DD-YYYY format.";
      return;
    }

    button.innerText = "Sending...";

    success.style.display = "none";
    loading.style.display = "block";

    let fileData64 = "";
    let fileName = "";

    const object = {
      Date: getDateTime(),
      Name: Name.value,
      Email: Email.value,
      "Date of Birth": Birth.value,
      Messege: breakLine(custom_message_value.value),
    };

    if (File.files.length) {
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

      fileData64 = await readFiles(File.files[0]);
      fileData64 = await convertDataURIToBinary(fileData64[0]);

      fileName = File.files[0].name;
    }

    fileData64 = await createPdf(object, fileData64);

    post(GAS, {
      type: 15,
      data: JSON.stringify({
        time: "",
        fileName: fileName,
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
          const fileName = Name.value + Birth.value;
          e.target.reset();
          custom_message.style.display = "none";
          custom_message_value.required = false;
          document.querySelector(".secure-message-checkbox").style.display =
            "none";
          document.querySelector("#defaultCheck1").required = false;
          button.innerText = "Send";
          loading.style.display = "none";
          success.style.display = "block";
          download(fileData64, fileName);
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
