const input = document.querySelector(".input-form");
const form = document.querySelector("form");
const formData = document.querySelector("form#data");
const tambah = document.querySelector("#add");
const fileInputArea = document.querySelector(".file-input-area");
const filePrev = document.querySelector(".file-prev");
const fileRmv = document.querySelector(".file-rmv");
const btn = document.querySelector(".periksa");
const note = document.querySelector(".notes");
const hasil = document.querySelector("#raw");
const unduh = document.querySelector("#unduh");

if (hasil) {
  const rows = JSON.parse(hasil.textContent);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
  unduh.addEventListener("click", () => {
    XLSX.writeFile(workbook, "result.xlsx", { compression: true });
  });
}

if (formData) {
  input.children[2].style.display = "none";
  input.children[2].addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);
  });

  tambah.addEventListener("click", (e) => {
    e.preventDefault();
    const cloned = input.cloneNode(true);
    cloned.children[2].addEventListener("click", (event) => {
      event.preventDefault();
      event.target.parentNode.remove();
    });
    cloned.children[2].style.display = "block";
    cloned.children[0].value = "";
    cloned.children[1].value = "";
    formData.insertBefore(
      cloned,
      formData.children[formData.children.length - 5]
    );
  });
}

if (fileInputArea) {
  const fileInput = form.querySelector(".file-input");
  fileInputArea.addEventListener("click", () => {
    fileInput.click();
  });
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    const supportExt = ["xlsx", "xls"];
    const fileNameParts = file.name.split(".");
    const fileNameExt = fileNameParts.pop();
    const fileName = fileNameParts.join("");
    if (!supportExt.includes(fileNameExt)) {
      document.querySelector("from#file").reset();
      return alert("only supported " + supportExt.join(" ") + " files");
    }
    fileInputArea.style.display = "none";
    filePrev.style.display = "flex";
    filePrev.querySelector(".title").innerHTML =
      fileName.length > 12
        ? fileName.substring(0, 10) + "... ." + fileNameExt
        : fileName + "." + fileNameExt;
    const fileSize = Math.ceil(file.size / 1000).toLocaleString("id-ID");
    filePrev.querySelector(".size").innerHTML = fileSize.split(".")[1]
      ? fileSize.split(".")[0] + "MB"
      : fileSize.split(".")[0] + "KB";
  };

  fileRmv.addEventListener("click", () => {
    fileInputArea.style.display = "flex";
    filePrev.style.display = "none";
  });
}

if (form) {
  form.addEventListener("submit", () => {
    btn.disabled = true;
    btn.innerHTML = "Loading...";
    note.style.display = "block";
  });
}
