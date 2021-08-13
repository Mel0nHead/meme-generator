const uploadImage = document.querySelector("#upload-image");
const fileInput = document.querySelector("#file-upload");
const fileName = document.querySelector("#file-name");
const canvas = document.getElementById("canvas");
const editMemeControls = document.getElementById("edit-meme");
const addTextInput = editMemeControls.querySelector("input");
const addTextButton = editMemeControls.querySelector("button");

// TODO:
// need to work out how to make text draggable: http://jsfiddle.net/m1erickson/9xAGa/
// should we use img or canvas? just thinking about exporting
// could use ImgFlip API

canvas.style.width = "100%";
canvas.width = canvas.offsetWidth;

const context = canvas.getContext("2d");

function handleUploadImage() {
  if (fileInput) {
    fileInput.click();
  }
}

// Ensures that the canvas and image have matching dimensions
function scaleImageAndCanvas(img) {
  const { offsetWidth } = canvas;
  const resolution = img.width / img.height;

  img.width = offsetWidth;
  img.height = offsetWidth / resolution;
  canvas.height = img.height;
  canvas.style.height = `${canvas.height}px`;
}

function handleFileInputChange() {
  if (this.files && this.files.length) {
    const file = this.files[0];
    const img = new Image();

    img.src = URL.createObjectURL(file);
    img.onload = function () {
      scaleImageAndCanvas(img);
      context.drawImage(this, 0, 0, canvas.width, canvas.height);
      editMemeControls.classList.add("visible");
      // For optimal performance and memory usage
      URL.revokeObjectURL(this.src);
    };

    fileName.textContent = file.name;
  }
}

addTextButton.addEventListener("click", function () {
  const text = addTextInput.value;
  addTextInput.value = "";
});

uploadImage.addEventListener("click", handleUploadImage);
fileInput.addEventListener("change", handleFileInputChange);
