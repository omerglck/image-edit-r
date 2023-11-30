const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img");
let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0";
let rotate = 0,
  flipHorizontal = 1, // yatay çevirmek
  flipVertical = 1; // dikey çevirmek

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  /*
  previewImg.src = URL.createObjectURL(file);: Bu satır, yüklenen dosyanın URL'sini oluşturur ve
  bu URL'yi previewImg adlı bir <img> elementinin src özelliğine atar. Bu sayede, kullanıcının seçtiği resmi önizleyebilirsiniz.
  */
  previewImg.addEventListener("load", () => {
    /*
         önizleme resminin yüklendiği zaman gerçekleşecek olan
         bir olay dinleyicisi ekler.
    */
    resetFilterBtn.click(); // otomatik olarak yüklendikten sonra önceki resmi kaldırır.
    document.querySelector(".container").classList.remove("disable");
    /*
     .container sınıfına sahip bir HTML öğesinin üzerindeki disable sınıfını kaldırır. 
    Bu genellikle bir stil (CSS) tarafından kullanılır ve yükleme tamamlandığında belirli bir bölgenin etkinleştirilmesini sağlar.
    */
  });
  console.log(fileInput.files[0]);
};

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

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
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

// filtre ayarları güncellendiğinde çalışır
const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`; // sliderın değerini
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

// döndürme ve çevirme
rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
      /*else if (option.id === "horizontal") { flipHorizontal = flipHorizontal === 1 ? -1 : 1; }: Eğer tıklanan butonun id özelliği "horizontal" ise, flipHorizontal değişkeni kontrol edilir. Eğer 1 ise -1, -1 ise 1 atanır. Bu, resmi yatay olarak çevirmeyi temsil eder. */
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
      /*Eğer yukarıdaki koşulların hiçbirine uymuyorsa, yani tıklanan buton "horizontal" değilse, flipVertical değişkeni kontrol edilir. Eğer 1 ise -1, -1 ise 1 atanır. Bu, resmi dikey olarak çevirmeyi temsil eder. */
    }
    applyFilter();
  });
});

// resetleme
const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  console.log(ctx);
  canvas.width = previewImg.naturalWidth; //  Canvas'in genişliği, önizleme resminin doğal genişliği olarak ayarlanır.
  canvas.height = previewImg.naturalHeight; // canvas'in yüksekliği, önizleme resminin doğal yüksekliği olarak ayarlanır.
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    // Math.PI (Pi sayısı) ile bölerek radyan cinsine dönüştürür.
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  // canvas içine resim ekler
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  // fonksiyonu, canvas üzerindeki resmi bir veri URL'sine dönüştürür. Veri URL'si, resmi temsil eden bir karakter dizisi ve bu diziyi içeren bir bağlantıdır. Bu URL, resmin base64 kodlanmış bir versiyonunu içerir.
  /*
  Bu yöntem, resimleri paylaşmak veya indirmek için kullanışlıdır, çünkü resmi doğrudan bir URL olarak kullanabilirsiniz, ayrı bir dosya veya sunucu tarafından desteklenmeyen bir resim için bile.
  */
  link.click();
  console.log(link);
};

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
