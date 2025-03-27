// remove Active Class function
function removeActiveClass() {
    const activeClass = document.getElementsByClassName("active")
    for (let btn of activeClass) {
        btn.classList.remove("active");
    }

}

// api call function
const loadLevels = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/levels/all');

    const data = await response.json();
    levelData(data.data);

}

const loadWords = async (id) => {
    // spnear add 
    document.getElementById("word-container").innerHTML = `<div class="col-span-full">
                    <span class="loading loading-dots loading-md"></span>
                    </div>`

    const response = await fetch(`https://openapi.programming-hero.com/api/level/${id}`);

    const vocabularies = await response.json();
    if (vocabularies.data) {
        vocabulariesData(vocabularies.data);
    }

    // remove Active Class
    removeActiveClass();

    const clickBtn = document.getElementById(`btn-${id}`);
    clickBtn.classList.add("active");

}

const loadWordDetails = async (id) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);

    const Details = await response.json();
    wordDetails(Details.data);
}

// worker function
const levelData = (data) => {
    const lissonList = document.getElementById("lesson-list");


    data.forEach(e => {
        const newdiv = document.createElement("div");
        newdiv.innerHTML = `
        <button id="btn-${e.level_no}" onclick="loadWords(${e.level_no})" class="btn btn-outline btn-primary rounded"><i class="fa-solid fa-book-open"></i>Lesson -${e.level_no}</button>
        `
        lissonList.append(newdiv);

    });

}

const vocabulariesData = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length === 0) {
        wordContainer.innerHTML = `
            <div class="text-center flex flex-col justify-center items-center my-16 col-span-full">
                    <img src="./assets/alert-error.png" alt="">
                    <p class="hind-siliguri  text-sm text-[#79716B] pb-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                    <h3 class="hind-siliguri font-medium text-4xl text-[#292524]">নেক্সট Lesson এ যান</h3>
                </div>
        `

    }

    words.forEach(e => {
        const card = document.createElement("div");

        let mean = (e.meaning !== null) ? e.meaning : "অর্থ নেই"
        let pronunciation = (e.pronunciation !== null) ? e.pronunciation : "উচ্চারণ নেই";


        card.innerHTML = `
        <div class="bg-white rounded-xl relative space-y-6 pt-14 pb-40">
                    <h1 class="inter font-bold text-3xl text-black text-center">${e.word}</h1>

                    <p class="inter font-medium text-xl text-black text-center">Meaning / Pronounciation</p>
                    
                    <h1 class="hind-siliguri font-semibold text-3xl text-[#18181B] text-center">"${mean} / ${pronunciation}"</h1>

                    <div>
                        <div onclick="loadWordDetails(${e.id});" class="absolute left-14 bottom-14 p-4 bg-[#1A91FF]/10 rounded-lg"><i
                                class="fa-solid fa-circle-info w-6 h-5"></i></div>

                        <div onclick="pronounceWord('${e.word}')" class="absolute right-14 bottom-14 p-4 bg-[#1A91FF]/10 rounded-lg"><i
                                class="fa-solid fa-volume-high"></i></div>
                    </div>

                </div>
        `
        wordContainer.append(card);


    })

}

const wordDetails = (details) => {
    document.getElementById("wordDettel").showModal();
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = ""

    let mean = (details.meaning !== null) ? details.meaning : "অর্থ পাওয়া যায়নি";
    let synonyms = (details.synonyms.length < 1) ? [] : details.synonyms;
    console.log(synonyms);

    const newdata = document.createElement("div")
    newdata.innerHTML = `
    <h1 class="text-3xl font-semibold text-[#000000] flex items-center pb-8">${details.word} (<i class="fa-solid fa-microphone-lines"></i>:${details.pronunciation})</h1>
                    <div class="text-left pb-8">
                        <h1 class="font-semibold text-2xl text-[#000000] pb-2">Meaning</h1>
                        <p class="hind-siliguri font-medium text-2xl text-[#000000] ">${mean}</p>
                    </div>
                    <div class="text-left pb-8">
                        <h1 class="font-semibold text-2xl text-[#000000] pb-2">Example</h1>
                        <p class="font-normal text-2xl text-[#000000] ">${details.sentence}</p>
                    </div>
                    <p class="hind-siliguri font-medium text-2xl text-[#000000] text-left pb-3">সমার্থক শব্দ গুলো</p>
                    <div class="flex gap-4 pb-5">
                    ${synonyms.map((synonym) => {
        return `<div class="bg-[#EDF7FF] text-xl border-[#D7E4EF] rounded-md text-[#000000] px-5  py-[6px]">${synonym}</div>`;
    }).join("")}
                    </div>`
    detailsContainer.append(newdata);


}


const login = () => {
    const name = document.getElementById("name").value;
    const pin = document.getElementById("pin").value;

    if (pin === '123456' && name) {

        Swal.fire({
            title: "Good job!",
            text: "Login successfull!",
            icon: "success"
        });
        document.getElementById("banner").classList.add("hidden")
        document.getElementById("header").classList.remove("hidden")
        document.getElementById("vocabulary").classList.remove("hidden")
        document.getElementById("faq").classList.remove("hidden")

    } else if (!name) {
        Swal.fire({
            title: "Oops...",
            text: "Please Tell use your Name first!",
            icon: "error"
        });

    } else {
        Swal.fire({
            title: "Oops...",
            text: "Wrong Password. Contact admin to get your Login Code!",
            icon: "error"
        });
    
    }
}

const logout = () => {
    document.getElementById("banner").classList.remove("hidden")
    document.getElementById("header").classList.add("hidden")
    document.getElementById("vocabulary").classList.add("hidden")
    document.getElementById("faq").classList.add("hidden")
    document.getElementById("name").value = '';
    document.getElementById("pin").value = '';
}

// pronounceWord
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
}
loadLevels();
