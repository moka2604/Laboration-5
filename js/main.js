"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Molly Karlsson
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");

// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];


/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {
    errors = [];

    if (fullnameInput.value.trim() === "") {
        errors.push("Ange ditt namn.");
    }

    if (emailInput.value.trim() === "") {
        errors.push("Ange din e-postadress.");
    } else if (!emailInput.validity.valid) {
        errors.push("Ange en giltig e-postadress.");
    }

    if (phoneInput.value.trim() === "") {
        errors.push("Ange ditt telefonnummer.");
    }

    displayErrors();
    return errors.length === 0;
}


/**
 * Visar felmeddelanden på sidan.
 */
function displayErrors() {
    errorList.replaceChildren();

    errors.forEach(function (error) {
        const listItem = document.createElement("li");
        listItem.classList.add("error");
        listItem.textContent = error;
        errorList.appendChild(listItem);
    });
}


/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {
    const studentCard = {
        fullname: fullnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        font: fontSelect.value
    };
    
    previewFullname.textContent = studentCard.fullname;
    previewEmail.textContent = studentCard.email;
    previewPhone.textContent = studentCard.phone;

    previewFullname.style.fontFamily = studentCard.font;
    previewEmail.style.fontFamily = studentCard.font;
    previewPhone.style.fontFamily = studentCard.font;

    history.push(studentCard);
    saveHistory();
    renderHistory();
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory() {
    localStorage.setItem("studentCardHistory", JSON.stringify(history));
}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    const savedHistory = localStorage.getItem("studentCardHistory");
    if (!savedHistory) {
        return;
    }

    try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
            history = parsedHistory;
        }
    } catch (error) {
        history = [];
    }
}


/**
 * Visar historiken på sidan.
 */
function renderHistory() {
    historySection.replaceChildren();

    history.forEach(function (studentCard) {
        const card = document.createElement("div");
        card.classList.add("history-card");
        card.style.fontFamily = studentCard.font;

        const name = document.createElement("p");
        name.textContent = studentCard.fullname;

        const email = document.createElement("p");
        email.textContent = studentCard.email;

        const phone = document.createElement("p");
        phone.textContent = studentCard.phone;

        card.append(name, email, phone);
        historySection.appendChild(card);
    });
}


/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {
    form.reset();
    previewFullname.textContent = "Namn";
    previewEmail.textContent = "E-post";
    previewPhone.textContent = "Telefon";

    previewFullname.style.fontFamily = fontSelect.value;
    previewEmail.style.fontFamily = fontSelect.value;
    previewPhone.style.fontFamily = fontSelect.value;

    errors = [];
    displayErrors();
}


/**
 * Raderar hela historiken.
 */
function deleteHistory() {
    localStorage.removeItem("studentCardHistory");
    history = [];
    renderHistory();
}


// Eventlyssnare

// När formuläret skickas:
// - validera inmatningen
// - skapa studentkort om valideringen lyckas
form.addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("Namn:", fullnameInput.value);
    console.log("E-post:", emailInput.value);
    console.log("Telefon:", phoneInput.value);
    console.log("Typsnitt:", fontSelect.value);

    if (validateForm()) {
        createStudentCard();
    }
});

loadHistory();
renderHistory();

// När användaren klickar på "Rensa"
clearButton.addEventListener("click", clearForm);

// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", deleteHistory);

// När sidan laddas:
// - läs in och visa eventuell tidigare historik
