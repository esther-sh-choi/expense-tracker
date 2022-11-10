"use strict";

// DOM Elements
const dispTotal = document.querySelector(".total");
const dispYearMonth = document.querySelector(".year-month_display");
const btnPreviousMonth = document.getElementById("previous-month");
const btnNextMonth = document.getElementById("next-month");

const expForm = document.querySelector(".expense-form");
const expDate = document.getElementById("expense-date");
const expItem = document.getElementById("expense-item-price");
const btnAdd = document.getElementById("add");

const categoryBtnsContainer = document.querySelector(".category-btns");
const btnAll = document.querySelector(".all");
const categoryBtn = document.querySelector(".btn-category button");

const historyListContainer = document.querySelector(".history-list");
const timeZone = "America/Toronto";

const locale = "en-US";
let counterMonth = 0;
const current = new Date();
const currentMonth = current.getMonth();
const expenseList = [];
const currentMonthYear = new Intl.DateTimeFormat("locale", {
  month: "2-digit",
  year: "numeric",
}).format(current);
let selectMonth = currentMonthYear;
let counter = 0;

// Initial Page
dispYearMonth.textContent = currentMonthYear;

// Update Month/Year
const updateMonthYear = (count) => {
  selectMonth = new Intl.DateTimeFormat("locale", {
    year: "numeric",
    month: "2-digit",
  }).format(new Date(current.setMonth(currentMonth + count)));

  dispYearMonth.textContent = selectMonth;
  return selectMonth;
};

// Update Total
const updateTotal = (monthYear) => {
  let currentMonthPrices = [];
  expenseList.forEach((obj) => {
    if (dateToMonthYear(obj.date) === monthYear) {
      currentMonthPrices.push(obj.price);
    }
  });

  const currentMonthTotal = currentMonthPrices.reduce(
    (acc, price) => acc + price,
    0
  );

  dispTotal.textContent = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
  }).format(currentMonthTotal);
};

// Change Date to Month/Year Format
const dateToMonthYear = (date) => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
  }).format(date);
};

// Submit Form
btnAdd.addEventListener("click", function (e) {
  e.preventDefault();

  const inputCategory = expItem.value.split(": ")[0].toUpperCase();
  const inputContent = expItem.value.split(": ")[1].split(" $")[0];
  const inputPrice = Number(expItem.value.split(": ")[1].split(" $")[1]);
  const inputDate = new Date(expDate.value);

  console.log(
    inputDate,
    new Date(expDate.value).toLocaleString("en-US", {
      timeZone: timeZone,
    })
  );

  expenseList.push({
    id: counter,
    category: inputCategory,
    content: inputContent,
    price: inputPrice,
    date: inputDate,
  });

  expItem.value = "";
  expDate.value = "";
  counter++;

  console.log(expenseList);

  updateUI(selectMonth);
});

// Choose Month/Year
btnPreviousMonth.addEventListener("click", function (e) {
  e.preventDefault();

  counterMonth = currentMonth + counterMonth < 0 ? 9 : counterMonth - 1;
  updateMonthYear(counterMonth);
  updateUI(selectMonth);
});

btnNextMonth.addEventListener("click", function (e) {
  e.preventDefault();

  counterMonth = currentMonth + counterMonth >= 12 ? 0 : counterMonth + 1;

  updateMonthYear(counterMonth);
  updateUI(selectMonth);
});

// Update History
const updateHistory = (monthYear) => {
  historyListContainer.innerHTML = "";
  expenseList.forEach((obj) => {
    if (dateToMonthYear(obj.date) === monthYear) {
      const expenseMonth = `${obj.date.getMonth() + 1}`.padStart(2, 0);
      const expenseDay = `${obj.date.getDate() + 1}`.padStart(2, 0);
      const newListHTML = `<li class = "history-list"><p class= "category">${
        obj.category
      }</p><p class= "content">${
        obj.content
      }</p><p class= "price">$${obj.price.toFixed(
        2
      )}</p><p class= "date">(${expenseMonth}/${expenseDay}/${obj.date.getFullYear()})  <button class="delete">❎</button></p></li>`;

      historyListContainer.insertAdjacentHTML("afterbegin", newListHTML);
      document.querySelector(".delete").addEventListener("click", function (e) {
        e.preventDefault();

        for (const item of expenseList) {
          if (item.id === obj.id) {
            const indexDelete = expenseList.indexOf(item);
            expenseList.splice(indexDelete, 1);
            updateUI(monthYear);
          }
        }
      });
    }
  });
};

// Update History By Category
const updateHistoryByCategory = (monthYear, btnCategory) => {
  historyListContainer.innerHTML = "";
  expenseList.forEach((obj) => {
    if (
      dateToMonthYear(obj.date) === monthYear &&
      obj.category === btnCategory
    ) {
      const expenseDate = new Date(obj.date);
      const expenseMonth = `${expenseDate.getMonth() + 1}`.padStart(2, 0);
      const expenseDay = `${expenseDate.getDate() + 1}`.padStart(2, 0);
      const newListHTML = `<li class = "history-list"><p class= "category">${
        obj.category
      }</p><p class= "content">${
        obj.content
      }</p><p class= "price">$${obj.price.toFixed(
        2
      )}</p><p class= "date">(${expenseMonth}/${expenseDay}/${expenseDate.getFullYear()})  <button class="delete">❎</button></p></li>`;

      historyListContainer.insertAdjacentHTML("afterbegin", newListHTML);
      document.querySelector(".delete").addEventListener("click", function (e) {
        e.preventDefault();

        for (const item of expenseList) {
          if (item.id === obj.id) {
            const indexDelete = expenseList.indexOf(item);
            expenseList.splice(indexDelete, 1);
            updateTotal(monthYear);
            addCategoryBtn(monthYear);
            updateHistoryByCategory(monthYear, btnCategory);
          }
        }
      });
    }
  });
};

// Add Category Button
const addCategoryBtn = (monthYear) => {
  categoryBtnsContainer.innerHTML = "";
  let uniqueCategorySet = new Set();
  expenseList.forEach((obj) => {
    if (dateToMonthYear(obj.date) === monthYear) {
      uniqueCategorySet.add(obj.category);
    }
  });
  const uniqueCategoryList = [...uniqueCategorySet];
  const addAllBtn = `<button class="all">ALL</button>`;
  categoryBtnsContainer.insertAdjacentHTML("afterbegin", addAllBtn);
  uniqueCategoryList.map((category) => {
    const newCategoryBtnHTML = `<button class="btn-category" id="${category}">${category}</button>`;
    categoryBtnsContainer.insertAdjacentHTML("beforeend", newCategoryBtnHTML);
    document
      .getElementById(`${category}`)
      .addEventListener("click", function (e) {
        e.preventDefault();

        updateHistoryByCategory(monthYear, category);
      });
  });
};

// Update UI
const updateUI = (monthYear) => {
  updateTotal(monthYear);
  updateHistory(monthYear);
  addCategoryBtn(monthYear);
};

// Display All History
btnAll.addEventListener("click", function (e) {
  e.preventDefault();

  updateHistory(selectMonth);
});
