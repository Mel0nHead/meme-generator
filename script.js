const uploadImage = document.querySelector("#upload-image");
const fileInput = document.querySelector("#file-upload");
const fileName = document.querySelector("#file-name");
const displayImage = document.querySelector("#meme-display");

uploadImage.addEventListener("click", function () {
  if (fileInput) {
    fileInput.click();
  }
});

fileInput.addEventListener("change", function () {
  if (this.files && this.files.length) {
    const file = this.files[0];
    displayImage.src = URL.createObjectURL(file);
    // Saves memory
    displayImage.onload = function () {
      URL.revokeObjectURL(this.src);
    };
    fileName.textContent = file.name;
  }
});
