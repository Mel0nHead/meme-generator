const uploadImage = document.querySelector("#upload-image");
const fileInput = document.querySelector("#file-upload");
const canvas = document.getElementById("canvas");
const editMemeControls = document.getElementById("edit-meme");
const addTextInput = editMemeControls.querySelector("input");
const addTextButton = editMemeControls.querySelector("#add-text-button");
const img = document.querySelector("#uploaded-image");
const downloadButton = document.querySelector("#download");

// TODO:
// improve styling
// more intuitive UX
// clean up CSS classes

const customTexts = [];
// Used to track the beginning position of the mouse when the user starts dragging text
let mouseStartX, mouseStartY;
let selectedTextIndex = -1;

canvas.style.width = "100%";
canvas.width = canvas.offsetWidth;
const context = canvas.getContext("2d");

let file;

// Ensures that the canvas and image have matching dimensions
function scaleImageAndCanvas(img) {
  const { offsetWidth } = canvas;
  const resolution = img.width / img.height;

  img.width = offsetWidth;
  img.height = offsetWidth / resolution;
  canvas.height = img.height;
  canvas.style.height = `${canvas.height}px`;
}

function drawImageToCanvas(src) {
  img.src = src;

  img.onload = function () {
    scaleImageAndCanvas(img);
    editMemeControls.classList.add("visible");
    // For optimal performance and memory usage
    URL.revokeObjectURL(this.src);
  };
}

function drawTextToCanvas(textArray) {
  context.font = "30px verdana";
  textArray.forEach(({ text, x, y }) => {
    context.fillText(text, x, y);
  });
}

function handleFileInputChange() {
  if (this.files && this.files.length) {
    file = this.files[0];
    const imgSrc = URL.createObjectURL(file);
    drawImageToCanvas(imgSrc);
  }
}

function redrawCanvas(shouldDrawImage = false) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (shouldDrawImage) {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  drawTextToCanvas(customTexts);
}

function isMouseWithinTextCoordinates(mouseX, mouseY, text) {
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
    context.measureText(text.text);
  const height = actualBoundingBoxAscent - actualBoundingBoxDescent;

  return (
    mouseX >= text.x &&
    mouseX <= text.x + width &&
    mouseY <= text.y &&
    mouseY >= text.y - height
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

  customTexts.push(textObj);
  redrawCanvas();
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
  const { left, top } = canvas.getBoundingClientRect();
  mouseStartX = parseInt(e.clientX - left);
  mouseStartY = parseInt(e.clientY - top);

  customTexts.forEach((text, i) => {
    if (isMouseWithinTextCoordinates(mouseStartX, mouseStartY, text)) {
      selectedTextIndex = i;
    }
  });
}

function handleCanvasMouseMove(e) {
  if (selectedTextIndex < 0) return;

  const { left, top } = canvas.getBoundingClientRect();
  const mouseX = parseInt(e.clientX - left);
  const mouseY = parseInt(e.clientY - top);

  const changeX = mouseX - mouseStartX;
  const changeY = mouseY - mouseStartY;
  mouseStartX = mouseX;
  mouseStartY = mouseY;

  const text = customTexts[selectedTextIndex];
  text.x += changeX;
  text.y += changeY;

  redrawCanvas();
}

function handleDownloadMeme() {
  redrawCanvas(true);
  const imgUrl = canvas.toDataURL("image/jpeg", 1.0);
  const a = document.createElement("a");
  a.href = imgUrl;
  a.download = "generated-meme";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

downloadButton.addEventListener("click", handleDownloadMeme);
canvas.addEventListener("mousemove", handleCanvasMouseMove);
canvas.addEventListener("mouseup", handleCanvasMouseUp);
canvas.addEventListener("mouseout", handleCanvasMouseOut);
canvas.addEventListener("mousedown", handleCanvasMouseDown);
addTextButton.addEventListener("click", handleAddText);
fileInput.addEventListener("change", handleFileInputChange);
