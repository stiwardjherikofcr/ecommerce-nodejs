function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.querySelector('img');
    const reader = new FileReader();
    reader.addEventListener('load', function () {
        preview.src = reader.result;
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}