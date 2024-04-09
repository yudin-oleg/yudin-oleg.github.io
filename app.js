const arrowButtons = document.querySelectorAll(".arrow-button");

const counters = document.querySelectorAll("[data-counter]");
const recieverInputs = document.querySelectorAll(".group input");

const finalSummCheckbox = document.getElementById("final-summ-checkbox");
const finalSummButton = document.getElementById("final-summ-button");
const finalSummMeaning = document.getElementById("final-summ-meaning");

const payingPopUp = document.getElementById("pop-up-paying");
const changePayingButtons = document.querySelectorAll(".change-paying-button");
const payingPopUpClose = document.getElementById("pop-up-paying-close");

const deliveryPopUp = document.getElementById("pop-up-delivery");
const changeDeliveryButtons = document.querySelectorAll(".change-delivery-button");
const deliveryPopUpClose = document.getElementById("pop-up-delivery-close");

const finalItemsNumber = document.getElementById("finalItemsNumber");
const finalPreviousPrice = document.getElementById("finalPreviousPrice");
const finalSale = document.getElementById("finalSale");

const tabs = document.querySelectorAll(".tabs button");
const storeAdresses = document.getElementById("store");
const courierAdresses = document.getElementById("courier");

const chooseAllCheckbox = document.getElementById("choose-all");
const itemCheckboxes = document.querySelectorAll(".item-checkbox");

const bins = document.querySelectorAll(".bin-icon");

const itemsInTrolley = document.querySelector(".trolley .items-number");
const itemsInMobileTrolley = document.querySelector("footer .icon-mobile .items-number");

const popUpPayingButton = document.querySelector(".pop-up-paying-button");
const popUpDeliveryButton = document.querySelector(".pop-up-delivery-button");

document.addEventListener("DOMContentLoaded", () => {
    decreaseBigFont();
    arrowButtonClick();
    disableNullCounters();
    counterClick();
    changePayingButtonClick();
    closePayingPopUp();
    changeDeliveryButtonClick();
    closeDeliveryPopUp();
    recieverInputClick();
    summCheckboxClicked();
    finalSummButtonClicked();
    showChosenAdressCategory();
    chooseAllClicked();
    cancelChooseAll();
    showOrHideItemInDelivery();
    binClicked();
    payingCardChanged();
    deliveryPlaceChanged();
});

let shirts = {
    name: "shirt",
    amount: 3,
    previousPrice: 1051,
    currentPrice: 522,
    image: "img/t-shirt.png",
    deliveryNumberForOnce: 2,
};

let covers = {
    name: "cover",
    amount: 210,
    previousPrice: 11500.235,
    currentPrice: 10500.235,
    image: "img/silicone.png",
    deliveryNumberForOnce: 184,
};

let pencils = {
    name: "pencil",
    amount: 4,
    previousPrice: 475,
    currentPrice: 247,
    image: "img/faber-castell.png",
    deliveryNumberForOnce: 3,
};

let possibleDeliveryDates = [
    ["5-6-feb", "5—6 февраля"],
    ["7-8-feb", "7—8 февраля"],
];

let itemsArray = [shirts, covers, pencils];

//
//функция для закрытия раскрытия списков с товарами
function arrowButtonClick() {
    if (!arrowButtons) return;

    arrowButtons.forEach((arrowButton) => {
        arrowButton.addEventListener("click", ({ target }) => {
            const goodsSection = target.closest(".goods-section");
            target.classList.toggle("arrow-button-closed");
            goodsSection.querySelector(".items-container").classList.toggle("items-container-closed");

            if (goodsSection.classList.contains("present")) {
                goodsSection.querySelector("span").classList.toggle("hide");
                goodsSection.classList.toggle("gray-bottom-border");
                goodsSection
                    .closest(".goods-order-container")
                    .querySelector(".absent")
                    .classList.toggle("margin-top-16px");

                if (goodsSection.querySelector("label").querySelector("p").innerHTML === "Выбрать все") {
                    const cartInfo = getItemsInCartInfo();

                    goodsSection
                        .querySelector("label")
                        .querySelector("p").innerHTML = `${cartInfo.goodsNumber}  товаров · ${cartInfo.finalSumm} сом`;
                    goodsSection.querySelector("label").querySelector("p").style.fontWeight = 600;
                } else {
                    goodsSection.querySelector("label").querySelector("p").style.fontWeight = 400;
                    goodsSection.querySelector("label").querySelector("p").innerHTML = "Выбрать все";
                }
            }
        });
    });
}

//
// функция чтобы получить значения общего кол ва товаров в корзине и их цены
function getItemsInCartInfo() {
    const itemsNumberInputs = document.querySelectorAll(".counter-input input");
    const currentPrices = document.querySelectorAll(".price-number");

    if (!currentPrices || !itemsNumberInputs) return;

    let finalSumm = 0;
    let goodsNumber = 0;

    currentPrices.forEach((price) => {
        finalSumm += parseInt(price.textContent.replaceAll(" ", ""));
    });
    itemsNumberInputs.forEach((input) => {
        finalSumm += parseInt(input.value);
    });

    finalSumm = formatNumber(finalSumm);
    return { goodsNumber, finalSumm };
}

//
//функция для обработки кликов на счетчик и изменения отображения финальной суммы
function counterClick() {
    if(!counters) return;
    counters.forEach((counter) => {
        counter.addEventListener("click", ({ target }) => {
            if (target.closest(".counter-button")) {
                let value = parseInt(target.closest(".counter").querySelector("input").value);
                const itemName = target.closest(".item-row").querySelector(".item-name").getAttribute("data-item");
                let itemAmount;
                let previousPrice;
                let currentPrice;
                let chosenItem;
                itemsArray.forEach((item) => {
                    if (itemName === item.name) {
                        itemAmount = item.amount;
                        previousPrice = item.previousPrice;
                        currentPrice = item.currentPrice;
                        chosenItem = item;
                    }
                });
                if (target.classList.contains("counter-button-plus")) {
                    value++;
                    if (itemAmount - value > 2) {
                        target.closest(".manage").querySelector("p").classList.add("hide");
                        target
                            .closest(".counter")
                            .querySelector(".counter-button-minus")
                            .classList.remove("disabled");
                    } else if (itemAmount - value <= 2 && itemAmount - value > 0) {
                        target.closest(".manage").querySelector("p").classList.remove("hide");
                        target.closest(".manage").querySelector("p").innerHTML = `Осталось ${
                            itemAmount - value
                        } шт.`;
                        target
                            .closest(".counter")
                            .querySelector(".counter-button-minus")
                            .classList.remove("disabled");
                    } else if (itemAmount - value <= 0) {
                        target.closest(".manage").querySelector("p").classList.add("hide");
                        target.closest(".counter").querySelector(".counter-button-plus").classList.add("disabled");
                        value = itemAmount;
                    }
                } else {
                    --value;
                    target.closest(".counter").querySelector(".counter-button-plus").classList.remove("disabled");
                    if (value <= 0) {
                        value = 0;
                    }
                    if (itemAmount - value <= 2 && itemAmount - value > 0) {
                        target.closest(".manage").querySelector("p").classList.remove("hide");
                        target.closest(".manage").querySelector("p").innerHTML = `Осталось ${
                            itemAmount - value
                        } шт.`;
                        target
                            .closest(".counter")
                            .querySelector(".counter-button-minus")
                            .classList.remove("disabled");
                    } else if (itemAmount - value > 2) {
                        target.closest(".manage").querySelector("p").classList.add("hide");
                        target
                            .closest(".counter")
                            .querySelector(".counter-button-minus")
                            .classList.remove("disabled");
                    }
                }
                if (value <= 0) {
                    value = 0;
                    target.closest(".counter").querySelector(".counter-button-minus").classList.add("disabled");
                }

                let finalSumm = formatNumber(Math.round(value * currentPrice, 0));
                let summWithoutSale = formatNumber(Math.round(value * previousPrice));

                target.closest(".item-row").querySelector(".mobile-price-number").textContent = finalSumm;
                target.closest(".item-row").querySelector(".mobile-previous-price-text").textContent =
                    summWithoutSale + " сом";
                target.closest(".manage-price").querySelector(".price-number").textContent = finalSumm;
                target.closest(".manage-price").querySelector(".previous-price-text").textContent =
                    summWithoutSale + " сом";

                let difference = value - parseInt(target.closest(".counter").querySelector("input").value);
                target.closest(".counter").querySelector("input").value = value;
                showFinalSumm();
                putOrTakeDeliveryItems(chosenItem, difference);
                changePriceInPopUp(target);
            }
        });
    });
}

//
// функция для изменения отображения колтчества товаров в секции с доставкой
function putOrTakeDeliveryItems(chosenItem, difference) {
    let deliveryDates = document.querySelectorAll(".delivery-dates");
    if (!deliveryDates) return;
    if (difference > 0) {
        for (let i = 0; i <= deliveryDates.length - 1; i++) {
            let deliveryDate = deliveryDates[i];
            let itemsForDelivery = deliveryDate.closest(".delivery-row").querySelectorAll(".delivery-items-number");

            //получить список всех элементов в строке доставки
            let allDateRowDataItems = [];
            for (let j = 0; j <= itemsForDelivery.length - 1; j++) {
                let dataItem = itemsForDelivery[j].getAttribute("data-item");
                allDateRowDataItems.push(dataItem);
            }
            if (allDateRowDataItems.includes(chosenItem.name)) {
                for (let j = 0; j <= itemsForDelivery.length - 1; j++) {
                    let itemForDelivery = itemsForDelivery[j];

                    if (itemForDelivery.getAttribute("data-item") === chosenItem.name) {
                        let itemsInDeliverySection = parseInt(itemForDelivery.querySelector("p").textContent);
                        if (itemsInDeliverySection < chosenItem.deliveryNumberForOnce) {
                            itemsInDeliverySection++;
                            itemForDelivery.querySelector("p").textContent = itemsInDeliverySection;
                            itemForDelivery.querySelector(".items-number").classList.remove("hide");
                            return;
                        } else if (itemsInDeliverySection === chosenItem.deliveryNumberForOnce) {
                            if (deliveryDates[i + 1] != undefined) {
                                console.log("переходим к следующей строке и в ней проходим тот же алгоритм");
                                j = itemsForDelivery.length;
                            } else {
                                //создаем строку с товаром
                                console.log("создаем строку с товаром");
                                let deliveryRow = document.createElement("div");
                                deliveryRow.setAttribute("data-dates", possibleDeliveryDates[i + 1][0]);
                                deliveryRow.classList.add("delivery-row");

                                let deliveryDatesP = document.createElement("p");
                                deliveryDatesP.classList.add("delivery-dates");
                                deliveryDatesP.textContent = possibleDeliveryDates[i + 1][1];
                                deliveryRow.append(deliveryDatesP);

                                let deliveryGoods = document.createElement("div");
                                deliveryGoods.classList.add("delivery-goods");

                                let deliveryItemsNumber = document.createElement("div");
                                deliveryItemsNumber.classList.add("delivery-items-number");
                                deliveryItemsNumber.setAttribute("data-item", chosenItem.name);

                                let innerP = document.createElement("p");
                                innerP.textContent = 1;

                                let itemsNumber = document.createElement("div");
                                itemsNumber.className = "items-number goods-number hide";
                                itemsNumber.append(innerP);

                                let image = document.createElement("img");
                                image.setAttribute("src", chosenItem.image);

                                deliveryItemsNumber.append(itemsNumber);
                                deliveryItemsNumber.append(image);

                                deliveryGoods.append(deliveryItemsNumber);
                                deliveryRow.append(deliveryGoods);

                                deliveryDate.closest(".delivery").append(deliveryRow);

                                let deliveryItemsNumbers = deliveryRow.querySelectorAll(".delivery-items-number");
                                hideItemIfCkeckboxNotChecked(chosenItem.name, deliveryItemsNumber);
                                showOrHideDeliveryRow(deliveryGoods, deliveryItemsNumbers);
                                return;
                            }
                        }
                    }
                }
            } else {
                //создаем элемент товара в строке

                let deliveryItemsNumber = document.createElement("div");
                deliveryItemsNumber.classList.add("delivery-items-number");
                deliveryItemsNumber.setAttribute("data-item", chosenItem.name);

                let innerP = document.createElement("p");
                innerP.textContent = 1;

                let itemsNumber = document.createElement("div");
                itemsNumber.classList.add("items-number");
                itemsNumber.classList.add("goods-number");
                itemsNumber.classList.add("hide");
                itemsNumber.append(innerP);

                let image = document.createElement("img");
                image.setAttribute("src", chosenItem.image);

                deliveryItemsNumber.append(itemsNumber);
                deliveryItemsNumber.append(image);

                deliveryDate.closest(".delivery-row").querySelector(".delivery-goods").append(deliveryItemsNumber);

                let deliveryGood = deliveryItemsNumber.closest(".delivery-goods");
                let deliveryItemsNumbers = deliveryGood.querySelectorAll(".delivery-items-number");

                let name = chosenItem.name;
                hideItemIfCkeckboxNotChecked(name, deliveryItemsNumber);
                showOrHideDeliveryRow(deliveryGood, deliveryItemsNumbers);
                return;
            }
        }
    } else if (difference < 0) {
        for (let i = deliveryDates.length - 1; i >= 0; i--) {
            let deliveryDate = deliveryDates[i];
            let itemsForDelivery = deliveryDate.closest(".delivery-row").querySelectorAll(".delivery-items-number");
            for (let j = itemsForDelivery.length - 1; j >= 0; j--) {
                let itemForDelivery = itemsForDelivery[j];
                if (itemForDelivery.getAttribute("data-item") === chosenItem.name) {
                    let itemsInDeliverySection = parseInt(itemForDelivery.querySelector("p").textContent);
                    if (itemsInDeliverySection > 2) {
                        itemsInDeliverySection--;
                        itemForDelivery.querySelector("p").textContent = itemsInDeliverySection;
                        return;
                    } else if (itemsInDeliverySection === 2) {
                        itemsInDeliverySection--;
                        itemForDelivery.querySelector("p").textContent = itemsInDeliverySection;
                        itemForDelivery.querySelector(".items-number").classList.add("hide");
                        return;
                    } else if (itemsInDeliverySection <= 1) {
                        let deliveryRow = itemForDelivery.closest(".delivery-row");
                        itemForDelivery.remove();
                        if (deliveryRow.querySelectorAll(".delivery-items-number").length === 0) {
                            deliveryRow.remove();
                        }
                        return;
                    }
                }
            }
            let deliveryGood = deliveryDate.closest(".delivery-row").querySelector(".delivery-goods");
            showOrHideDeliveryRow(deliveryGood, itemsForDelivery);
        }
    }
}

//
// функция для вывода финальной суммы в итого, финального кол-ва товаров и финальной скидки
function showFinalSumm() {
    const itemsNumberInputs = document.querySelectorAll(".counter-input input");
    const currentPrices = document.querySelectorAll(".price-number");
    const previousPrices = document.querySelectorAll(".previous-price-text");
    if (
        finalSummMeaning &&
        currentPrices &&
        previousPrices &&
        itemsNumberInputs &&
        finalItemsNumber &&
        finalPreviousPrice &&
        finalSale
    ) {
        let finalSumm = 0;
        let finalPriceWithoutSale = 0;
        let goodsNumber = 0;
        let sale;

        for (let i = 0; i < currentPrices.length; i++) {
            if (currentPrices[i].closest(".item-row").querySelector(".real-checkbox").checked === true) {
                finalSumm += parseInt(currentPrices[i].textContent.replaceAll(" ", ""));
            }
        }

        for (let i = 0; i < previousPrices.length; i++) {
            if (previousPrices[i].closest(".item-row").querySelector(".real-checkbox").checked === true) {
                finalPriceWithoutSale += parseInt(previousPrices[i].textContent.replaceAll(" ", ""));
            }
        }

        for (let i = 0; i < itemsNumberInputs.length; i++) {
            if (itemsNumberInputs[i].closest(".item-row").querySelector(".real-checkbox").checked === true) {
                goodsNumber += parseInt(itemsNumberInputs[i].value);
            }
        }
        finalItemsNumber.textContent = goodsNumber + " товара";

        sale = -1 * (finalSumm - finalPriceWithoutSale);
        sale = formatNumber(sale);
        finalSale.textContent = "-" + sale + " сом";

        finalSumm = formatNumber(finalSumm);
        finalSummMeaning.textContent = finalSumm;

        finalPriceWithoutSale = formatNumber(finalPriceWithoutSale);
        finalPreviousPrice.textContent = finalPriceWithoutSale + " сом";
    }
    decreaseBigFont();
}

//
//  функция для уменьшения размера шрифта финальной суммы еслм она больше 999 999
function decreaseBigFont() {
    const currentPrices = document.querySelectorAll(".price-number");

    for (let i = 0; i < currentPrices.length; i++) {
        let price = parseInt(currentPrices[i].textContent.replaceAll(" ", ""));
        if (price >= 1000000) {
            // TODO: заменить на класс вместо инлайн стилей
            //currentPrices[i].classList.add("price-number-big")
            currentPrices[i].style.fontSize = "16px";
            currentPrices[i].style.lineHeight = "24px";
            currentPrices[i].style.letterSpacing = "0";
        } else {
            currentPrices[i].style.fontSize = "20px";
            currentPrices[i].style.lineHeight = "28px";
            currentPrices[i].style.letterSpacing = "-0.2px";
        }
    }
}

//
// функция для добавления пробелом в суммы больше 9 999
function formatNumber(num) {
    if (num > 9999) {
        let numString = num.toString();
        let formattedString = "";

        for (let i = numString.length - 1, count = 0; i >= 0; i--, count++) {
            formattedString = numString[i] + formattedString;

            if (count % 3 === 2 && i !== 0) {
                formattedString = " " + formattedString;
            }
        }
        return formattedString;
    } else {
        return num.toString();
    }
}

//
//функция для изначального добавления неактивного стиля для кнопки минус если кол во товара 0
function disableNullCounters() {

    if (!counters)  return;
    counters.forEach((counter) => {
        let value = parseInt(counter.querySelector("input").value);
        if (value <= 0) {
            value = 0;
            counter.querySelector(".counter-button-minus").classList.add("disabled");
        }
    });
}

//
// функция для обработки фокусировки и расфокусировки на инпутах с информацией о пользователе
function recieverInputClick() {
    if (!recieverInputs) return;
    recieverInputs.forEach((recieverInput) => {
        recieverInput.addEventListener("focus", (e) => {
            if (recieverInput.id === "first-name") {
                recieverInput.closest(".group").querySelector("label").innerHTML = "Имя";
                recieverInput.closest(".group").querySelector("label").classList.remove("label-empty-error");
            } else if (recieverInput.id === "second-name") {
                recieverInput.closest(".group").querySelector("label").innerHTML = "Фамилия";
                recieverInput.closest(".group").querySelector("label").classList.remove("label-empty-error");
            } else if (recieverInput.id === "e-mail") {
                recieverInput.closest(".group").querySelector("label").innerHTML = "Электронная почта";
                recieverInput.closest(".group").querySelector("label").classList.remove("label-empty-error");
            } else if (recieverInput.id === "phone") {
                recieverInput.closest(".group").querySelector("label").innerHTML = "Телефон";
                recieverInput.closest(".group").querySelector("label").classList.remove("label-empty-error");
            } else if (recieverInput.id === "inn") {
                recieverInput.closest(".group").querySelector("label").innerHTML = "ИНН для таможни";
                recieverInput.closest(".group").querySelector("label").classList.remove("label-empty-error");
            }
        });
    });
    recieverInputs.forEach((recieverInput) => {
        recieverInput.addEventListener("blur", (e) => {
            let inputText = recieverInput.value;
            if (inputText.length === 0) {
                if (recieverInput.id === "first-name") {
                    recieverInput.closest(".group").querySelector("label").innerHTML = "Укажите имя";
                    recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                    recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                } else if (recieverInput.id === "second-name") {
                    recieverInput.closest(".group").querySelector("label").innerHTML = "Укажите фамилию";
                    recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                    recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                } else if (recieverInput.id === "e-mail") {
                    recieverInput.closest(".group").querySelector("label").innerHTML = "Укажите электронную почту";
                    recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                    recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                } else if (recieverInput.id === "phone") {
                    recieverInput.closest(".group").querySelector("label").innerHTML = "Укажите номер телефона";
                    recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                    recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                } else if (recieverInput.id === "inn") {
                    recieverInput.closest(".group").querySelector("label").innerHTML = "Укажите ИНН";
                    recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                    recieverInput.closest(".group").querySelector(".inn-info").classList.remove("hide");
                    recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                }
            } else {
                if (recieverInput.id === "first-name") {
                    const regex = /^[A-Za-zА-Яа-я]+([ -][A-Za-zА-Яа-я]+)*$/;
                    if (!regex.test(inputText)) {
                        recieverInput.closest(".group").querySelector("input").classList.add("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.remove("hide");
                    } else {
                        recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                    }
                } else if (recieverInput.id === "second-name") {
                    const regex = /^[A-Za-zА-Яа-я]+([ -][A-Za-zА-Яа-я]+)*$/;
                    if (!regex.test(inputText)) {
                        recieverInput.closest(".group").querySelector("input").classList.add("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.remove("hide");
                    } else {
                        recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                    }
                } else if (recieverInput.id === "e-mail") {
                    const regex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
                    if (!regex.test(inputText)) {
                        recieverInput.closest(".group").querySelector("input").classList.add("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.remove("hide");
                    } else {
                        recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                    }
                } else if (recieverInput.id === "phone") {
                    const regex =
                        /^(\+\d{1,2}[-\s]?(\(\d{3,4}\)|\d{3,4})[-\s]?(\d{1,2}[-\s]?){3}\d{1,4}|\+\d{1,2}(\(\d{3,4}\)|\d{3,4})([-\s]\d{1,2}){2}[-\s]?\d{0,3}\d{1,4})$/i;
                    if (!regex.test(inputText)) {
                        recieverInput.closest(".group").querySelector("input").classList.add("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.remove("hide");
                    } else {
                        recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                        recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");

                        recieverInput.value = formatPhoneNumber(inputText);
                    }
                } else if (recieverInput.id === "inn") {
                    const regex = /^\d{14}$/;
                    if (!regex.test(inputText)) {
                        recieverInput.closest(".group").querySelector("input").classList.add("input-error");
                        recieverInput.closest(".group").querySelector(".inn-info").classList.add("hide");
                        recieverInput.closest(".group").querySelector(".error-message").classList.remove("hide");
                    } else {
                        recieverInput.closest(".group").querySelector("input").classList.remove("input-error");
                        recieverInput.closest(".group").querySelector(".inn-info").classList.remove("hide");
                        recieverInput.closest(".group").querySelector(".error-message").classList.add("hide");
                    }
                }
            }
        });
    });
}

function formatPhoneNumber(inputString) {
    const plusSymbol = inputString.includes("+") ? "+" : "";
    const cleanNumber = inputString.replace(/[^\d]/g, "");

    if (/^\d{4,}$/.test(cleanNumber)) {
        const formattedNumber = cleanNumber.replace(
            /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
            (_, group1, group2, group3, group4, group5) => {
                return `${group1} ${group2} ${group3} ${group4} ${group5}`;
            }
        );

        return `${plusSymbol}${formattedNumber}`;
    } else {
        return inputString;
    }
}

//
// функция для обработки нажатия на чекбокс подтверждающий списание оплаты
function summCheckboxClicked() {
    if (!finalSummCheckbox || !finalSummButton || !finalSummMeaning) return;
    finalSummCheckbox.addEventListener("click", (e) => {
        if (finalSummCheckbox.checked) {
            finalSummButton.innerHTML = "Оплатить " + finalSummMeaning.innerHTML + " сом";
        } else {
            finalSummButton.innerHTML = "Заказать";
        }
    });
}

//
// функция для обработки нажатия на кнопку заказать и проверки пустые ли инпуты с информацией о получателе и если да, то прейти к ним
function finalSummButtonClicked() {
    if (!finalSummButton || !recieverInputs) return;
    finalSummButton.addEventListener("click", (e) => {
        for (let i = 0; i < recieverInputs.length; i++) {
            if (recieverInputs[i].closest(".group").querySelector("input").value === "") {
                if (window.screen.width === 320) {
                    document.getElementById("reciever-info").scrollIntoView();
                }
                recieverInputs[i].closest(".group").querySelector("input").classList.add("input-error");
                recieverInputs[i].closest(".group").querySelector("label").classList.add("label-empty-error");
                recieverInputs[i].closest(".group").querySelector(".error-message").classList.remove("hide");
                if (recieverInputs[i].id === "inn") {
                    recieverInputs[i].closest(".group").querySelector(".inn-info").classList.add("hide");
                }
            }
        }
    });
}

//
// функция для вывода попапа со способами оплаты при нажатии соответствующих кнопок
function changePayingButtonClick() {
    if (!payingPopUp || !changePayingButtons) return;
    changePayingButtons.forEach((changePayingButton) => {
        changePayingButton.addEventListener("click", (e) => {
            payingPopUp.classList.remove("hide");
        });
    });
}

//
// функция для закрытия попапа с выбором способа оплаты
function closePayingPopUp() {
    if (!payingPopUp || !payingPopUpClose) return;
    payingPopUpClose.addEventListener("click", () => {
        payingPopUp.classList.add("hide");
    });
}

//
// функция для вывода попапа со способами доставки при нажатии соответствующих кнопок
function changeDeliveryButtonClick() {
    if (!deliveryPopUp || !changeDeliveryButtons) return;
    changeDeliveryButtons.forEach((changeDeliveryButton) => {
        changeDeliveryButton.addEventListener("click", (e) => {
            deliveryPopUp.classList.remove("hide");
        });
    });
}

//
// функция для закрытия попапа с выбором доставки оплаты
function closeDeliveryPopUp() {
    if (!deliveryPopUp || !deliveryPopUpClose) return;
    deliveryPopUpClose.addEventListener("click", () => {
        deliveryPopUp.classList.add("hide");
    });
}

//
// функция для выбора категории доставки курьером или в пункт доставки в попапе
function showChosenAdressCategory() {
    if (!tabs || !storeAdresses || !courierAdresses) return;
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            const tabType = e.target.getAttribute("data-tab");
            if (tabType === "store") {
                e.target.classList.add("tabs-chosen");
                document.querySelector("[data-tab='courier']").classList.remove("tabs-chosen");
                courierAdresses.classList.add("hide");
                storeAdresses.classList.remove("hide");
            } else {
                e.target.classList.add("tabs-chosen");
                document.querySelector("[data-tab='store']").classList.remove("tabs-chosen");
                storeAdresses.classList.add("hide");
                courierAdresses.classList.remove("hide");
            }
        });
    });
}

//
// функция для обработки нажатия чекбокса выбрать все
function chooseAllClicked() {
    if (!chooseAllCheckbox || !itemCheckboxes) return; 
    chooseAllCheckbox.addEventListener("change", (e) => {
        if (chooseAllCheckbox.checked === true) {
            for (let i = 0; i < itemCheckboxes.length; i++) {
                itemCheckboxes[i].checked = true;
                let event = new Event("change");
                itemCheckboxes[i].dispatchEvent(event);
            }
        }
    });
}

//
// функция для снятия чекбокса выбрать все при снятии чекбокса с одного из элементов
function cancelChooseAll() {
    if (!chooseAllCheckbox || !itemCheckboxes) return;
    itemCheckboxes.forEach((itemCheckbox) => {
        itemCheckbox.addEventListener("change", (e) => {
            if (itemCheckbox.checked === false) {
                chooseAllCheckbox.checked = false;
            }
        });
    });
}

//
// функция для скрытия или отображения товара в доставке а также учета его стоимости в
// финальной сумме в зависимости от того выбран его чекбокс или нет
function showOrHideItemInDelivery() {
    if (!itemCheckboxes) return;
    itemCheckboxes.forEach((itemCheckbox) => {
        itemCheckbox.addEventListener("change", (e) => {
            showFinalSumm();
            if (itemCheckbox.checked === false) {
                const itemName = itemCheckbox
                    .closest(".item-row")
                    .querySelector(".item-name")
                    .getAttribute("data-item");
                let deliveryGoods = document.querySelectorAll(".delivery-goods");
                if (deliveryGoods) {
                    for (let deliveryGood of deliveryGoods) {
                        let deliveryItemsNumbers = deliveryGood.querySelectorAll(".delivery-items-number");
                        if (deliveryItemsNumbers) {
                            for (let deliveryItemsNumber of deliveryItemsNumbers) {
                                if (deliveryItemsNumber.getAttribute("data-item") === itemName) {
                                    deliveryItemsNumber.classList.add("hide");

                                    removeMarginWhenItemHidden(deliveryItemsNumber);
                                    // скрыть саму строку с датой если все элементы спрятаны
                                    showOrHideDeliveryRow(deliveryGood, deliveryItemsNumbers);
                                }
                            }
                        }
                    }
                }
            } else {
                const itemName = itemCheckbox
                    .closest(".item-row")
                    .querySelector(".item-name")
                    .getAttribute("data-item");
                let deliveryGoods = document.querySelectorAll(".delivery-goods");
                if (deliveryGoods) {
                    for (let deliveryGood of deliveryGoods) {
                        let deliveryItemsNumbers = deliveryGood.querySelectorAll(".delivery-items-number");
                        if (deliveryItemsNumbers) {
                            for (let deliveryItemsNumber of deliveryItemsNumbers) {
                                if (deliveryItemsNumber.getAttribute("data-item") === itemName) {
                                    deliveryItemsNumber.classList.remove("hide");
                                    addMarginWhenItemShown(deliveryItemsNumber);

                                    // показать саму строку
                                    showOrHideDeliveryRow(deliveryGood, deliveryItemsNumbers);
                                }
                            }
                        }
                    }
                }
            }
        });
    });
}

//
// функция чтобы убрать марджин у следующего за скрытым или удаленным элементом
// если пред скрытым нет другого элемента
function removeMarginWhenItemHidden(deliveryItemsNumber) {
    if (deliveryItemsNumber.previousElementSibling) {
        return;
    } else if (deliveryItemsNumber.nextElementSibling) {
        deliveryItemsNumber.nextElementSibling.style.marginLeft = "0px";
    }
}

//
// функция чтобы добавить марджин к элементу следующему за тем который был скрыт и который мы сделали видимым
function addMarginWhenItemShown(deliveryItemsNumber) {
    if (deliveryItemsNumber.nextElementSibling) {
        deliveryItemsNumber.nextElementSibling.style.marginLeft = "8px";
    }
}

//
// функция чтобы скрыть строку с товарами если у всех товаров в ней не выбран чекбокс
function showOrHideDeliveryRow(deliveryGood, deliveryItemsNumbers) {
    let goodsNumber = deliveryItemsNumbers.length;
    let numberOfNotChecked = 0;
    for (let deliveryItemsNumber of deliveryItemsNumbers) {
        if (deliveryItemsNumber.classList.contains("hide")) {
            numberOfNotChecked += 1;
        }
    }
    if (numberOfNotChecked === goodsNumber) {
        deliveryGood.closest(".delivery-row").classList.add("hide");
    } else {
        deliveryGood.closest(".delivery-row").classList.remove("hide");
    }
}

//
// функция для удаления товара из корзины при нажатии на иконку мусорки
function binClicked() {
    if (!bins) return;
    bins.forEach((bin) => {
        bin.addEventListener("click", (e) => {
            let itemType = bin.closest(".item-row").querySelector(".item-name").getAttribute("data-item");
            let deliveryGoods = document.querySelectorAll(".delivery-goods");
            for (let deliveryGood of deliveryGoods) {
                let deliveryItems = deliveryGood.querySelectorAll(".delivery-items-number");
                for (let deliveryItem of deliveryItems) {
                    if (deliveryItem.getAttribute("data-item") === itemType) {
                        bin.closest(".item-row").remove();
                        let itemsInRow = deliveryItem
                            .closest(".delivery-goods")
                            .querySelectorAll(".delivery-items-number").length;
                        let deliveryRow = deliveryItem.closest(".delivery-row");
                        deliveryItem.remove();
                        if (itemsInRow === 1) {
                            deliveryRow.remove();
                        }
                        removeMarginWhenItemHidden(deliveryItem);

                        deliveryItems = deliveryGood.querySelectorAll(".delivery-items-number");
                        showOrHideDeliveryRow(deliveryGood, deliveryItems);
                        showFinalSumm();
                    }
                }
            }
            decreaseCartIconNumber();
        });
    });
}

//
// функция для скрытия товара в доставке если его чекбокс выключен
function hideItemIfCkeckboxNotChecked(itemName, deliveryItemsNumber) {
    let itemRows = document.querySelectorAll(".present .item-row");
    for (let itemRow of itemRows) {
        if (itemName === itemRow.querySelector(".item-name").getAttribute("data-item")) {
            if (itemRow.querySelector(".real-checkbox").checked === false) {
                deliveryItemsNumber.classList.add("hide");
            }
        }
    }
}

//
// функция для изменения значка с колвом товараов в корзине
function decreaseCartIconNumber() {
    let itemsNumber = document.querySelectorAll(".present .item-row").length;
    itemsInTrolley.querySelector("p").textContent = itemsNumber;
    itemsInMobileTrolley.querySelector("p").textContent = itemsNumber;
    if (itemsNumber === 0) {
        itemsInTrolley.classList.add("hide");
        itemsInMobileTrolley.classList.add("hide");
    }
}

//
// функция для изменения цены в попапах которые вылазиют при наведение на старую цену
function changePriceInPopUp(counterClicked) {
    let itemRow = counterClicked.closest(".item-row");
    let pricePopUps = itemRow.querySelectorAll(".price-pop-up");
    pricePopUps.forEach((pricePopUp) => {
        let previousPrice;
        let currentPrice;

        if (pricePopUp.closest(".price")) {
            previousPrice = parseInt(
                pricePopUp.closest(".price").querySelector(".previous-price-text").textContent.replaceAll(" ", "")
            );
            currentPrice = parseInt(
                pricePopUp.closest(".price").querySelector(".price-number").textContent.replaceAll(" ", "")
            );
        } else if (pricePopUp.closest(".mobile-price")) {
            previousPrice = parseInt(
                pricePopUp
                    .closest(".mobile-price")
                    .querySelector(".mobile-previous-price-text")
                    .textContent.replaceAll(" ", "")
            );
            currentPrice = parseInt(
                pricePopUp
                    .closest(".mobile-price")
                    .querySelector(".mobile-price-number")
                    .textContent.replaceAll(" ", "")
            );
        }

        let saleNumber = currentPrice - previousPrice;
        let salePerCent = Math.round(100 - (currentPrice / previousPrice) * 100);

        pricePopUp
            .querySelector(".price-pop-up-first-div")
            .querySelector(".price-pop-up-first-p").textContent = `Скидка ${salePerCent}%`;
        pricePopUp
            .querySelector(".price-pop-up-second-div")
            .querySelector(".price-pop-up-first-p").textContent = `${saleNumber}  сом`;
    });
}

//
// функция для изменения способа оплаты
function payingCardChanged() {
    let payingRows = document.querySelectorAll("main .paying-info");
    if (!popUpPayingButton || !payingRows) return;
    popUpPayingButton.addEventListener("click", (e) => {
        let payingCards = popUpPayingButton.closest(".pop-up-paying-body").querySelectorAll(".pop-up-paying-card");
        if (payingCards) {
            for (let payingCard of payingCards) {
                if (payingCard.querySelector("input").checked === true) {
                    for (let payingRow of payingRows) {
                        let payingsystem = payingCard.querySelector("img").getAttribute("src");
                        payingRow.querySelector("img").setAttribute("src", payingsystem);

                        let cardNumber = payingCard.querySelector("p").textContent;
                        payingRow.querySelector(".card-info").querySelector("p").textContent = cardNumber;
                    }
                }
            }
        }
        popUpPayingButton.closest(".pop-up-paying").classList.add("hide");
    });
}

//
// функция для изменения способа доставки
function deliveryPlaceChanged() {
    let deliveryName = document.querySelector(".delivery-place-name");
    let deliveryInfoDesktopOnly = document.querySelector(".summ-section-text.desktop-only");
    if (!popUpDeliveryButton || !deliveryName || !deliveryInfoDesktopOnly) return;
    popUpDeliveryButton.addEventListener("click", (e) => {
        let tabs = popUpDeliveryButton
            .closest(".pop-up-delivery")
            .querySelector(".tabs")
            .querySelectorAll("button");
        let adresses = popUpDeliveryButton.closest(".pop-up-delivery").querySelectorAll(".pop-up-adress-container");
        console.log(adresses);
        for (let adress of adresses) {
            if (adress.querySelector("input").checked === true) {
                for (let tab of tabs) {
                    let buttonType = tab.getAttribute("data-tab");
                    if (tab.classList.contains("tabs-chosen") && buttonType === "store") {
                        console.log("store");
                        deliveryName.textContent = adress.querySelector("p").textContent;
                        deliveryInfoDesktopOnly.textContent =
                            adress.querySelector("p").textContent;
                    } else if (tab.classList.contains("tabs-chosen") && buttonType === "courier") {
                        console.log("courier");
                        deliveryName.textContent = adress.querySelector("p").textContent;
                        deliveryInfoDesktopOnly.textContent =
                            adress.querySelector("p").textContent;
                    }
                }
            }
        }
        popUpDeliveryButton.closest(".pop-up-delivery").classList.add("hide");
    });
}
