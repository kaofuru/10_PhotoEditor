const fileInput = document.querySelector(".file-input"),//デフォルト
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".choose-img"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");//JavaScriptでWebページの特定の要素を選択するために使用される。カスタマイズ

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`; 

}

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    console.log(file);
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
    
}

// アクティブ切り替え
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;//スライダーの名前変更

        // スライダーの値をフィルターごとに切り替える
        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;  
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;  
        } else  {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;  
        }
    });   
});

// スライダーパーセント変更

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    // スライダー切り替え
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id == "right") {
            rotate += 90;
        } else if (option.id == "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

const resetFilter = () => {
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilters();
}

const saveImage = () => {//saveImgeという関数を定義
    const canvas = document.createElement("canvas");//関数の中身
    const ctx = canvas.getContext("2d");

    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    //フィルターを適用する
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal = 1, flipVertical);
    ctx.drawImage(previewImg, -canvas.width/ 2, -canvas.height/ 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);// スライダーパーセント変更
resetFilterBtn.addEventListener("click", resetFilter);// スライダーパーセント変更
saveImgBtn.addEventListener("click", saveImage);//クリックされたときの動作を定義。イベントリスナー追加。クリックされたときの動作を定義。
chooseImgBtn.addEventListener("click", () => fileInput.click());//標準のボタンが動作する