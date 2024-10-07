
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
    } else {
        currentlyActive = element;
        element.classList.remove("rounded-xl");
        element.classList.add("rounded-full");
        element.classList.add("bg-teal-200");
        element.classList.add("bg-opacity-25");
    }

}