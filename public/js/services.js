const contents = [
    {
        title: "Projektowanie Mebli",
        description: `Firma Perfect Size oferuje kompleksowe usługi projektowania mebli.<br>
        Nasza oferta obejmuje projektowanie mebli na wymiar, projektowanie mebli kuchennych, salonowych i biurowych,
        konsultacje i doradztwo w zakresie doboru materiałów i wykończeń,
        tworzenie wizualizacji 3D oraz personalizację projektów zgodnie z wymaganiami klienta.
        Zapewniamy profesjonalne podejście oraz indywidualne rozwiązania, które spełnią oczekiwania nawet najbardziej wymagających klientów.`,
        image: "/img/svg/serwis.png",
        buttonText: "Zaprojektuj mebel"
    },
    {
        title: "Montaż Mebli",
        description: `Firma Perfect Size oferuje profesjonalne usługi montażu mebli.<br>
        Nasz zespół wykwalifikowanych pracowników zadba o prawidłowy i szybki montaż Twoich mebli,
        zapewniając najwyższą jakość wykonania oraz dbałość o każdy szczegół. Gwarantujemy satysfakcję z końcowego efektu.`,
        image: "/img/svg/montaz.png",
        buttonText: ""
    },
    {
        title: "Wnoszenie Mebli",
        description: `Firma Perfect Size oferuje kompleksowe usługi wnoszenia mebli.<br>
        Niezależnie od tego, czy potrzebujesz pomocy w przeniesieniu mebli do nowego mieszkania, czy do biura,
        nasz zespół zadba o to, aby wszystko zostało dostarczone na miejsce bezpiecznie i bez uszkodzeń. 
        Zajmiemy się wszystkim, abyś mógł cieszyć się nowymi meblami bez stresu.`,
        image: "/img/svg/wnoszenie.png",
        buttonText: ""
    }
];

let currentIndex = 0;
let isScrolling;
const intervalTime = 4000; // zmiana uslugi co 4s

function changeContent(index) {
    document.getElementById('title').innerHTML = contents[index].title;
    document.getElementById('description').innerHTML = contents[index].description;
    document.getElementById('mainImage').src = contents[index].image;
    
    const buttonContainer = document.getElementById('buttonContainer');
    const serviceButton = document.getElementById('serviceButton');
    
    if (contents[index].buttonText) {
        serviceButton.innerText = contents[index].buttonText;
        buttonContainer.style.display = 'block';
    } else {
        buttonContainer.style.display = 'none';
    }
    
    setActiveDot(index);
}

function setActiveDot(index) {
    const dots = document.getElementsByClassName('dot');
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    dots[index].classList.add('active');
}

function handleScroll(event) {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(function() {
        if (event.deltaY > 0) {
            currentIndex = (currentIndex + 1) % contents.length;
        } else {
            currentIndex = (currentIndex - 1 + contents.length) % contents.length;
        }
        changeContent(currentIndex);
    }, 100);
}

setActiveDot(0);
changeContent(0);

window.addEventListener('wheel', handleScroll);

setInterval(function() {
    currentIndex = (currentIndex + 1) % contents.length;
    changeContent(currentIndex);
}, intervalTime);
