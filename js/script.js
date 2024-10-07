
// adds pet buttons
async function fetchCatagories() {

    const petBtns = document.querySelector('#pet-btns');
    const categoriesObj = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
    const category = await categoriesObj.json()

    category.categories.forEach(obj => {
        petBtns.innerHTML +=
            `<button
                class="btn-ghost min-w-[300px] inline-flex items-center gap-4 border-2 border-teal-600 px-16 py-5 rounded-xl border-opacity-25" onclick="active(this)">
                <img src="${obj.category_icon}" alt="${obj.category} icon">
                <p class="font-black text-2xl">${obj.category}</p>
        </button>`
    });
}

fetchCatagories()

// active state for pet buttons
let currentlyActive;
let petCategory;

function active(element) {

    if (currentlyActive) {
        currentlyActive.classList.remove("rounded-full");
        currentlyActive.classList.remove("bg-teal-200");
        currentlyActive.classList.remove("bg-opacity-25");
        currentlyActive.classList.add("rounded-xl");
        currentlyActive = element;
        element.classList.remove("rounded-xl");
        element.classList.add("rounded-full");
        element.classList.add("bg-teal-200");
        element.classList.add("bg-opacity-25");
        petCategory = element.querySelector('p').innerText;
        loadWithSpinner()
    } else {
        currentlyActive = element;
        element.classList.remove("rounded-xl");
        element.classList.add("rounded-full");
        element.classList.add("bg-teal-200");
        element.classList.add("bg-opacity-25");
        petCategory = element.querySelector('p').innerText;
        loadWithSpinner()
    }

}

// load pets
const petContainer = document.querySelector("#pet-container");
const petError = document.querySelector("#pet-error");
const spinner = document.querySelector("#spinner");
let sortByPrice;

function sortPetsByPrice() {
    sortByPrice = true;
    loadWithSpinner();
}

function loadWithSpinner() {
    petContainer.parentElement.classList.add("hidden");
    spinner.classList.remove('hidden');

    setTimeout(loadPets, 2000);
}

async function loadPets() {
    petContainer.parentElement.classList.remove("hidden");
    spinner.classList.add("hidden");

    const pets = await fetch(`https://openapi.programming-hero.com/api/peddy/${petCategory ? `category/${petCategory}` : "pets"}`);
    const petObj = await pets.json();
    let petArr = petCategory ? petObj.data : petObj.pets;
    const checkEmpty = petArr.length === 0;

    if (checkEmpty) {
        petContainer.classList.add("hidden");
        petError.classList.remove("hidden");
        return
    }

    if (sortByPrice) {
        petArr.forEach((element, index) => {
            if (element.price == null) petArr.push(petArr.splice(index, 1)[0])
        });
    }

    const finalPets = sortByPrice ? petArr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)) : petArr;

    petContainer.classList.remove("hidden");
    petError.classList.add("hidden");
    petContainer.innerHTML = '';
    finalPets.forEach(item => {
        petContainer.innerHTML +=
            `<div class="flex flex-col space-y-1 border-2 border-gray-100 rounded-xl p-4">
                <img class="max-w-[250px] rounded-xl" src="${item.image}" alt="${item.breed} image">
                <h3 class="font-extrabold text-lg pt-2">${item.pet_name}</h3>
                <p class="inline-flex items-center gap-2 text-gray-500">
                    <svg class="w-5 h-5">
                        <use href="#icon-squares" />
                    </svg>
                    <span class="font-semibold">Breed: ${item.breed ? item.breed : "Not available"}</span>
                </p>
                <p class="inline-flex items-center gap-2 text-gray-500">
                    <svg class="w-5 h-5">
                        <use href="#icon-calendar" />
                    </svg>
                    <span class="font-semibold">Birth: ${item.date_of_birth ? item.date_of_birth : "Not available"}</span>
                </p>
                <p class="inline-flex items-center gap-2 text-gray-500">
                    <svg class="w-5 h-5">
                        <use href="#icon-gender" />
                    </svg>
                    <span class="font-semibold">Gender: ${item.gender ? item.gender : "Not available"}</span>
                </p>
                <p class="inline-flex items-center gap-2 text-gray-500">
                    <svg class="w-5 h-5">
                        <use href="#icon-dollar" />
                    </svg>
                    <span class="font-semibold">Price : ${item.price ? item.price + '$' : "Not available"}</span>
                </p>

                <div class="py-2">
                    <hr>
                </div>

                <div class="inline-flex justify-between">
                    <button class="btn btn-ghost border-1 border-teal-500 border-opacity-50 px-6" onclick="handleLike('${item.image}','${item.breed}')">
                        <svg class="w-5 h-5">
                            <use href="#icon-like" />
                        </svg>
                    </button>

                    <button
                        class="btn btn-ghost border-1 border-teal-500 border-opacity-50 font-extrabold text-teal-700" onclick="handleAdopt(this)">Adopt</button>
                    <button
                        class="btn btn-ghost border-1 border-teal-500 border-opacity-50 font-extrabold text-teal-700" onclick="showDetailsModal('${item.petId}')">Details</button>
                </div>
            </div>`
    })

}

loadWithSpinner();

// add images to pet sidebar
const petSidebar = document.querySelector('#pet-sidebar');

function handleLike(imgUrl, breed) {

    petSidebar.innerHTML +=
        `<div class="border-2 border-gray-100 rounded-lg p-2 h-max">
                    <img class=" rounded-lg" src="${imgUrl}" alt="${breed} image">
                </div>`;
}

// show success modal
function handleAdopt(element) {

    details_modal.innerHTML =
        `<div class="text-center">
                <img class="mx-auto" src="./images/icons8-handshake-48.png" alt="handshake image">
                <h2 class="font-extrabold text-lg py-2">Congrates</h2>
                <p>Adoption Process is Started For your Pet</p>
                <span class="font-extrabold text-5xl">3</span>
        </div>`;

    let modalSpan = details_modal.querySelector('span');

    let intervalId = setInterval(() => {
        modalSpan.innerText = parseInt(modalSpan.innerText) - 1;
        if (parseInt(modalSpan.innerText) === 0) {
            clearInterval(intervalId);
            details_modal.close();
        }
    }, 1000);

    details_modal.showModal();
    element.innerText = 'Adopted';
    element.setAttribute('disabled', 'disabled');
}

// show details
async function showDetailsModal(id) {

    const DetailsObj = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`);
    const Details = await DetailsObj.json();
    const petData = Details.petData;
    details_modal.innerHTML =
        `<div>
            <img class="w-[460px] object-cover rounded-lg mx-auto" src="${petData.image}" alt="${petData.breed} image">
        </div>

            <h2 class="font-extrabold text-lg pt-4 pb-2">${petData.pet_name}</h2>
            
            <div class="flex max-sm:flex-col md:gap-8">
                <div class="flex flex-col">
                    <p class="inline-flex items-center gap-2 text-gray-500">
                        <svg class="w-5 h-5">
                            <use href="#icon-squares" />
                        </svg>
                        <span class="font-semibold">Breed: ${petData.breed ? petData.breed : "Not available"}</span>
                    </p>
                    
                    <p class="inline-flex items-center gap-2 text-gray-500">
                        <svg class="w-5 h-5">
                            <use href="#icon-gender" />
                        </svg>
                        <span class="font-semibold">Gender: ${petData.gender ? petData.gender : "Not available"}</span>
                    </p>
                    
                    <p class="inline-flex items-center gap-2 text-gray-500">
                        <svg class="w-5 h-5">
                            <use href="#icon-gender" />
                        </svg>
                        <span class="font-semibold">Vaccinated status: ${petData.vaccinated_status ? petData.vaccinated_status : "Not available"}</span>
                    </p>
                </div>

                <div class="flex flex-col">
                    <p class="inline-flex items-center gap-2 text-gray-500">
                        <svg class="w-5 h-5">
                            <use href="#icon-calendar" />
                        </svg>
                        <span class="font-semibold">Birth: ${petData.date_of_birth ? petData.date_of_birth : "Not available"}</span>
                    </p>
                    <p class="inline-flex items-center gap-2 text-gray-500">
                        <svg class="w-5 h-5">
                            <use href="#icon-dollar" />
                        </svg>
                        <span class="font-semibold">Price : ${petData.price ? petData.price + '$' : "Not available"}</span>
                    </p>
                </div>
            </div>
            
            <div class="py-3">
                <hr>
            </div>

            <div class="space-y-2">
                <h3 class="font-extrabold">Details Information</h3>
                <p class="max-w-[50ch] font-semibold text-gray-500">${petData.pet_details}</p>
                <button class="w-full btn btn-ghost font-extrabold text-teal-700 bg-teal-100 bg-opacity-50 outline-none" onclick="details_modal.close()">Cancel</button>
            </div>`

    details_modal.showModal();

}