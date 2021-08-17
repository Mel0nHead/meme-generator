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
// Used to track the beginning position of the mouse when the user starts dragging text
let mouseStartX, mouseStartY;
let selectedTextIndex = -1;

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
      context.font = "30px verdana";

      textArray.forEach(({ text, x, y }) => {
        context.fillText(text, x, y);
      });
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

function isMouseWithinTextCoordinates(mouseX, mouseY, text) {
  const textWidth = context.measureText(text.text).width;

  return (
    mouseX >= text.x &&
    mouseX <= text.x + textWidth &&
    mouseY <= text.y &&
    mouseY >= text.y - text.height
  );
}

function handleAddText() {
  const text = addTextInput.value;
  addTextInput.value = "";
  const y = customTexts.length * 50 + 50;

  const textObj = {
    text,
    x: 20,
    y,
  };

  // TODO: fix height calculation as it seems a bit inaccurate
  textObj.height = 30;

  customTexts.push(textObj);
  redrawToCanvas();
}

function handleCanvasMouseUp(e) {
  e.preventDefault();
  selectedTextIndex = -1;
}

function handleCanvasMouseOut(e) {
  e.preventDefault();
  selectedTextIndex = -1;
}

function handleCanvasMouseDown(e) {
  mouseStartX = e.clientX - canvas.offsetLeft;
  mouseStartY = e.clientY - canvas.offsetTop;

  customTexts.forEach((text) => {
    if (isMouseWithinTextCoordinates(mouseStartX, mouseStartY, text)) {
      console.log(text);
    }
  });
}

canvas.addEventListener("mouseup", handleCanvasMouseUp);
canvas.addEventListener("mouseout", handleCanvasMouseOut);
canvas.addEventListener("mousedown", handleCanvasMouseDown);
addTextButton.addEventListener("click", handleAddText);
uploadImage.addEventListener("click", handleUploadImage);
fileInput.addEventListener("change", handleFileInputChange);
