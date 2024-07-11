const form = document.querySelector("#form"); // ogrenci ekleme kutucuğu
const addInput = document.querySelector("#name"); // ekleme kutucuğunun içi
const ogrenciList = document.querySelector(".list-group"); //ogrencilerin ekleneceği bölge 
const firstCardBody = document.querySelector(".yukariBolge"); //üst kısım
const secondCardBody = document.querySelector(".asagiBolge"); //alt kısım
const clearButton = document.querySelector("#clearButton"); //temizleme butonu
const filterInput = document.querySelector("#ogrenciArama"); //arama kutucuğunun içi

let ogrenciler = []; //ogrenciler dizisini tanımlıyoruz.

runEvents();

function runEvents() { //tüm olayları tanımlıyoruz.
    form.addEventListener("submit", addogrenci);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    secondCardBody.addEventListener("click", removeogrenciToUI);
    clearButton.addEventListener("click", allogrencilerEverywhere);
    filterInput.addEventListener("keyup", filter); //klavyede tuşa basıldığında çalışır
}

function pageLoaded() {  //sayfa yüklendiğinde çalışacak olanlar
    checkogrencilerFromStorage(); //depodaki öğrencileri kontrol etme fonksiyonu
    ogrenciler.forEach(function(ogrenci){  // her bir öğrenci için arayüze ekleme fonksiyonu çağırıyoruz.
        addogrenciToUI(ogrenci);
    });
}

function filter(e) {
     const filterValue = e.target.value.toLowerCase().trim(); // aranan değer hedefe yazılan değere eşit mi
    const ogrenciListesi = document.querySelectorAll(".list-group-item"); //eklenen tüm öğrencilerin listesini seçtik çünkü aramayı burada yapacağız

    if (ogrenciListesi.length > 0) {  // eğer öğrenci varsa
        ogrenciListesi.forEach(function(ogrenci) { //her bir eleman için kontrol sağla
            if (ogrenci.textContent.toLowerCase().trim().includes(filterValue)) { //arananı içeriyor mu
               ogrenci.setAttribute("style","display: block"); //içeriyorsa göster
            } else {
                ogrenci.setAttribute("style","display: none !important"); //içermiyorsa sakla
            }
        });
    } else {
        showAlert("warning", "En az bir öğrenci gerekli!"); //boş listede arama yapılmadı
    }
}

function allogrencilerEverywhere() { //tüm öğrencileri silmek için 
    const ogrenciListesi = document.querySelectorAll(".list-group-item"); //silme işlemi için tüm öğrencilerin listedi tutuldu
    if (ogrenciListesi.length > 0) {
        ogrenciListesi.forEach(function(ogrenci) { //ekrandan sil
            ogrenci.remove();
        });

        // Storage'dan Silme
        ogrenciler = []; //öğrenci listesinin içini boşalt
        localStorage.setItem("ogrenciler", JSON.stringify(ogrenciler)); //storage güncellenmesi
        showAlert("success", "Başarılı bir şekilde silindi");
    } else {
        showAlert("warning", "En az bir öğrenci gerekli");
    }
}

function removeogrenciToUI(e) { //ogrencileri arayüzden silmek için fonksiyon
    if (e.target.classList.contains("fa-remove")) { //silme ikonuna tıkladığında onun hedefi için 
        // Ekrandan Silme
        const ogrenci = e.target.parentElement.parentElement; //öğrenciyi bul
        ogrenci.remove(); //arayuzden temizle

        // Storage'dan Silme
        removeogrenciToStorage(ogrenci.textContent.trim()); //storage dan silme fonksiyonunu o öğrenci için çağırıyoruz
        showAlert("success", "Öğrenci başarıyla silindi.");
    }
}

function removeogrenciToStorage(removeogrenci) { //öğrenciyi silme fonksiyonu
    checkogrencilerFromStorage(); //storage daki öğrencileri kontrol et 
    ogrenciler = ogrenciler.filter(ogrenci => ogrenci !== removeogrenci); //koşul sağlanırsa öğrenci değişkenini yeni bir diziye atar yani burada silinen eleman dışındaki elemanalrı almak için böyle bir kod yazdık.
    localStorage.setItem("ogrenciler", JSON.stringify(ogrenciler)); //silinmeyen elemanları local storage a
}

function addogrenci(e) {
    e.preventDefault(); //sayfa yenilenmesini engeller
    const inputText = addInput.value.trim(); //girilen metni alıyoruz boşluksuz
    if (inputText === "") {
        showAlert("warning", "Lütfen boş bırakmayınız!");
    } else {
        // Arayüze ekleme  //boş değilse arayüze ve storage a ekleme fonksiyonları çağrılır
        addogrenciToUI(inputText);
        addogrenciToStorage(inputText);
        showAlert("success", "Öğrenci Eklendi.");
    }
}

function addogrenciToUI(newogrenci) { //arayüze öğrenci ekleme
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = newogrenci;

    const a = document.createElement("a");
    a.href = "#";
    a.className = "delete-item";

    const i = document.createElement("i");
    i.className = "fas fa-trash-alt fa-remove";

    a.appendChild(i);
    li.appendChild(a);
    ogrenciList.appendChild(li);

    addInput.value = ""; //giriş lanını temizler
}

function addogrenciToStorage(newogrenci) { //storag a yeni eleman ekleme
    checkogrencilerFromStorage(); //storage kontrolü
    ogrenciler.push(newogrenci); //diziye yeni bir eleman eklemek için kullanılır
    localStorage.setItem("ogrenciler", JSON.stringify(ogrenciler)); //storage güncellendi
}

function checkogrencilerFromStorage() {
    ogrenciler = JSON.parse(localStorage.getItem("ogrenciler")) || []; //kontrol için eleman listesini al yoksa da diziyi boş olarak başlat
}

function showAlert(type, message) { 
    const div = document.createElement("div"); //yeni bir div oluştur
    div.className = `alert alert-${type}`;
    div.textContent = message; //yazılab mesajı dive ekle

    firstCardBody.appendChild(div); //üst bölgeye bu divi ekle

    setTimeout(function() {
        div.remove(); //belirli bir süre sonra bu divi ekrandan kaldır.
    }, 2500);
}