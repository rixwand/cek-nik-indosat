import axios from "axios";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fileUpload from "express-fileupload";
import excelToJson from "convert-excel-to-json";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.use("/public", express.static(__dirname + "/public"));

axios.defaults.withCredentials = true;

const errorHandling = (err, req, res, next) => {
  res.render("error.ejs", {
    title: "Network Error",
    data: { statusCode: "504", errMsg: err.message },
    layout: "layouts/layout",
  });
};

app.get("/", (req, res) => {
  res.render("index", {
    title: "cek nik",
    layout: "layouts/layout",
  });
});
app.get("/file", (req, res) => {
  res.render("excel", {
    title: "cek file",
    layout: "layouts/layout",
  });
});

app.post("/file", async (req, res, next) => {
  try {
    const file = req.files.excel;
    let dump;
    const rawExcel = excelToJson({
      source: file.data,
      columnToKey: {
        A: "nik",
        B: "kk",
      },
    });
    const excel = Object.values(rawExcel)[0];
    const header = excel.shift();
    if (
      header.nik.toLowerCase() == "nik" &&
      ["kk", "nokk"].includes(header.kk.toLowerCase())
    ) {
      const data = {
        nik: [],
        kk: [],
      };
      for (let i = 0; i < excel.length; i++) {
        const nikVallid =
          typeof parseInt(excel[i].nik) == "number" &&
          excel[i].nik.length == 16;
        const kkVallid =
          typeof parseInt(excel[i].kk) == "number" && excel[i].kk.length == 16;
        if (nikVallid && kkVallid) {
          data.nik.push(excel[i].nik);
          data.kk.push(excel[i].kk);
        }
      }

      dump = await check(data);
    } else {
      dump = "";
    }

    res.render("result.ejs", {
      title: "result",
      data: dump,
      layout: "layouts/layout",
    });
  } catch (err) {
    return next(new Error("Network Error"));
  }
});

app.post("/cek-nik", async (req, res, next) => {
  try {
    const data = req.body;
    data.nik.pop();
    data.kk.pop();

    const dump = await check(data);

    res.render("result.ejs", {
      title: "result",
      data: dump,
      layout: "layouts/layout",
    });
  } catch (error) {
    return next(new Error("Network Error"));
  }
});

app.use(errorHandling);
app.use((req, res, next) => {
  res.render("error.ejs", {
    title: "Page not Found",
    data: { statusCode: "404", errMsg: "Page not Found" },
    layout: "layouts/layout",
  });
});

const check = async (data) => {
  const raw = await axios.get("https://myim3.indosatooredoo.com/ceknomor");
  const getCookie = raw.headers["set-cookie"].toString();
  let dump = [];
  for (let i = 0; i < data.nik.length; i++) {
    const response = await fetch(
      `https://myim3.indosatooredoo.com/ceknomor/checkForm?nik=${data.nik[i]}&kk=${data.kk[i]}&send=PERIKSA`,
      {
        method: "get",
        headers: {
          Cookie: getCookie,
          Connection: "keep-alive",
        },
      }
    );
    const result = await response.text();
    const doc = new JSDOM(result);
    const title = doc.window.document.querySelector("title").textContent;
    let ket;
    if (title == "Registration") {
      ket = doc.window.document.querySelectorAll("ul li").length;
    } else {
      ket = 0;
    }
    dump.push({
      nik: data.nik[i],
      kk: data.kk[i],
      ket,
    });
  }
  return dump;
};

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
