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
const customTexts = [];

canvas.style.width = "100%";
canvas.width = canvas.offsetWidth;
const context = canvas.getContext("2d");

let file;

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

function drawImageToCanvas(src, textArray) {
  const img = new Image();
  img.src = src;

  img.onload = function () {
    scaleImageAndCanvas(img);
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
    editMemeControls.classList.add("visible");
    if (textArray && Array.isArray(textArray)) {
      textArray.forEach(({ text, x, y }) => context.fillText(text, x, y));
    }
    // For optimal performance and memory usage
    URL.revokeObjectURL(this.src);
  };
}

function handleFileInputChange() {
  if (this.files && this.files.length) {
    file = this.files[0];
    const imgSrc = URL.createObjectURL(file);
    drawImageToCanvas(imgSrc);
    fileName.textContent = file.name;
  }
}

function redrawToCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const imgSrc = URL.createObjectURL(file);
  drawImageToCanvas(imgSrc, customTexts);
}

function handleAddText() {
  const text = addTextInput.value;
  addTextInput.value = "";

  const textObj = {
    text,
    x: 20,
    y: 20,
  };
  // TODO: all text seems to be really small - probably need to move this logic to `drawImageToCanvas`
  context.font = "30px verdana";
  textObj.width = context.measureText(textObj.text).width;
  text.height = 16;

  customTexts.push(textObj);
  redrawToCanvas();
}

addTextButton.addEventListener("click", handleAddText);
uploadImage.addEventListener("click", handleUploadImage);
fileInput.addEventListener("change", handleFileInputChange);
