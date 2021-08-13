const uploadImage = document.querySelector("#upload-image");
const fileInput = document.querySelector("#file-upload");
const fileName = document.querySelector("#file-name");
const canvas = document.getElementById("canvas");

canvas.style.width = "100%";
canvas.width = canvas.offsetWidth;

const context = canvas.getContext("2d");

function handleUploadImage() {
  if (fileInput) {
    fileInput.click();
  }
}

function handleFileInputChange() {
  if (this.files && this.files.length) {
    const file = this.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      const { offsetWidth } = canvas;
      const resolution = this.width / this.height;
      img.width = offsetWidth;
      img.height = offsetWidth / resolution;
      canvas.height = img.height;
      canvas.style.height = `${canvas.height}px`;

      console.log("image", img.width, img.height);
      console.log("canvas", canvas.width, canvas.height);

      context.drawImage(
        img,
        0,
        0,
        // img.width,
        // img.height,
        // 0,
        // 0,
        canvas.width,
        canvas.height
        // 0,
        // 0,
        // offsetWidth,
        // offsetWidth / resolution
      );
      // For optimal performance and memory usage
      URL.revokeObjectURL(this.src);
    };
    fileName.textContent = file.name;
  }
}

uploadImage.addEventListener("click", handleUploadImage);
fileInput.addEventListener("change", handleFileInputChange);
