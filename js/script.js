import { getAllCrypto, getCryptoById } from "./api.js";

let userCryptoList = [];
let cryptoPrices = [];

const refreshBtn = document.querySelector("#btn-refresh");

const pricesLoading = document.querySelector("#prices-loading");

const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");

const editModal = document.querySelector("#modal-edit");
const editModalContent = document.querySelector("#modal-content-edit");
const editInput = document.querySelector("#edit-value");

const form = document.querySelector("#add-form");

const saveToLocalStorage = () => {
  localStorage.setItem("userCryptoList", JSON.stringify(userCryptoList));
};

const removeCrypto = (e) => {
  const cName = e.target.parentNode.id;
  const deleted = userCryptoList.filter((el) => el.name != cName);

  userCryptoList = deleted;
  console.log(deleted);
  saveToLocalStorage();
  updateMyCryptoDOM();
};

const openEditModalDOM = (e) => {
  editModal.style.display = "flex";

  const headerText = editModalContent.childNodes[1].childNodes[1];
  const id = e.target.parentNode.id;

  editInput.value = userCryptoList[id].value;
  headerText.textContent = userCryptoList[id].name;

  document.querySelector("#btn-modal-edit").addEventListener("click", (e) => {
    if (isNaN(editInput.value)) {
      const error = document.createElement("div");
      error.setAttribute("class", "error");
      error.innerHTML = "<p>Vnešena vrednost mora biti številska!</p>";
      editModalContent.append(error);
      return;
    }
    userCryptoList[id].value = parseFloat(editInput.value);
    console.log(userCryptoList);
    saveToLocalStorage();
    updateMyCryptoDOM();
    editModal.style.display = "none";
  });
};

const setPricesTableDOM = (prices) => {
  const table = document.querySelector("#prices-table-body");

  table.innerHTML = "";
  pricesLoading.hidden = true;

  prices.forEach((el) => {
    const tr = document.createElement("tr");
    tr.id = el.id;
    tr.addEventListener("click", openInfoModalDOM);
    table.appendChild(tr);

    const tdContent = `<td>${el.rank}</td><td>${el.name}</td><td>${
      el.symbol
    }</td><td>&dollar;${parseFloat(el.priceUsd).toFixed(
      2
    )}</td><td>${parseFloat(el.changePercent24Hr).toFixed(2)} %</td>`;
    tr.innerHTML = tdContent;

    const priceChange = tr.childNodes[4];

    if (priceChange.textContent.split(" ")[0] < 0) {
      priceChange.setAttribute("class", "price-down");
      tr.childNodes[3].setAttribute("class", "price-down");
    } else if (priceChange.textContent.split(" ")[0] > 0) {
      priceChange.setAttribute("class", "price-up");
      tr.childNodes[3].setAttribute("class", "price-up");
    }
    const updatedAtDOM = document.querySelector(".updated-at");
    let currentDate = new Date();
    updatedAtDOM.textContent =
      "Posodobljeno: " +
      currentDate.getDate() +
      "." +
      (currentDate.getMonth() + 1) +
      "." +
      currentDate.getFullYear() +
      " " +
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds();
  });
};

const openInfoModalDOM = (e) => {
  const id = e.target.parentNode.id;
  getCryptoById(id).then((cryptoInfo) => {
    console.log(cryptoInfo);
    modalContent.childNodes[1].childNodes[1].textContent = cryptoInfo.name;
    createInfoTableDOM(cryptoInfo);
  });
  modal.style.display = "flex";
};

const updateMyCryptoDOM = () => {
  const userTable = document.querySelector("#user-table-body");
  userTable.innerHTML = "";

  userCryptoList.forEach((el, index) => {
    const tr = document.createElement("tr");
    userTable.appendChild(tr);

    const cryptoInfo = cryptoPrices.find((item) => item.name == el.name);

    const cryptoCurrentUsd = (el.value * cryptoInfo.priceUsd).toFixed(2);

    const tdContent = `<td>${el.name}</td><td>${
      cryptoInfo.symbol
    }</td><td>${el.value.toFixed(6)}</td><td>${cryptoCurrentUsd}</td>`;

    tr.innerHTML = tdContent;

    const deleteBtn = document.createElement("td");
    const editBtn = document.createElement("td");

    deleteBtn.setAttribute("id", el.name);
    deleteBtn.innerHTML = `<i class="fas fa-times"></i>`;
    deleteBtn.addEventListener("click", removeCrypto);

    editBtn.setAttribute("id", index);
    editBtn.innerHTML = `<i class="fas fa-pen"></i>`;
    editBtn.addEventListener("click", openEditModalDOM);

    tr.appendChild(editBtn);
    tr.appendChild(deleteBtn);
  });
};

const createInfoTableDOM = (cryptoInfo) => {
  const infoTable = document.querySelector("#info-table-body");
  infoTable.innerHTML = `<tr><td>Simbol: </td><td class="bold">${
    cryptoInfo.symbol
  }</td></tr>
  <tr><td>Sprememba v 24h: </td><td class="bold">${parseFloat(
    cryptoInfo.changePercent24Hr
  ).toFixed(6)}
  </td></tr>
  <tr><td>Cena USD: </td><td class="bold">&dollar;${parseFloat(
    cryptoInfo.priceUsd
  ).toFixed(6)}
  </td></tr>
  <tr><td>Tržna kapitalizacija: </td><td class="bold">&dollar;${parseFloat(
    cryptoInfo.marketCapUsd
  ).toFixed(6)}
  </td></tr>
  <tr><td>Volumen v 24h: </td><td class="bold">&dollar;${parseFloat(
    cryptoInfo.volumeUsd24Hr
  ).toFixed(6)}
  </td></tr>
  <tr><td>Dobava v obtoku: </td><td class="bold">${parseFloat(
    cryptoInfo.supply
  ).toFixed(6)}
  </td></tr>
  <tr><td>Skupna ponudba: </td><td class="bold">${parseFloat(
    cryptoInfo.maxSupply
  ).toFixed(6)}
  </td></tr>`;

  const priceChange = infoTable.childNodes[2].childNodes[1];
  const priceUSD = infoTable.childNodes[4].childNodes[1];

  if (priceChange.textContent.split(" ")[0] < 0) {
    priceChange.setAttribute("class", "price-down");
    priceUSD.setAttribute("class", "price-down");
  } else if (priceChange.textContent.split(" ")[0] > 0) {
    priceChange.setAttribute("class", "price-up");
    priceUSD.setAttribute("class", "price-up");
  }
};

const populateDropdownDOM = () => {
  const select = document.querySelector("#crypto");
  cryptoPrices.forEach((el) => {
    const option = document.createElement("option");
    option.textContent = el.name;
    select.appendChild(option);
  });
};

const createPopularCardsDOM = () => {
  const containerDOM = document.querySelector(".popular-cards");
  containerDOM.innerHTML = "";
  const popularCrypto = [
    "bitcoin",
    "ethereum",
    "litecoin",
    "xrp",
    "binance-coin",
  ];

  let currentDate = new Date();

  cryptoPrices.forEach((el) => {
    if (popularCrypto.includes(el.id)) {
      const card = document.createElement("div");
      card.setAttribute("class", "card");

      card.innerHTML = `<h6>BTC</h6>
      <div class="card-header">
        <h4>${el.name}</h4>
        <img
          src="img/${el.id}.png"
          alt="${el.name} logo"
          width="17"
          height="17"
        />
      </div>
      <div class="card-body">
        <h6>1 ${el.symbol} =</h6>
        <h3>&dollar;${parseFloat(el.priceUsd).toFixed(2)}</h3>
        <h6 class=${el.changePercent24Hr > 0 ? "price-up" : "price-down"}>
          ${parseFloat(el.changePercent24Hr).toFixed(2)} % <i class="fas ${
        el.changePercent24Hr > 0 ? "fa-caret-up" : "fa-caret-down"
      }"></i>
        </h6>
      </div>
      <h6 class="card-footer">Osveženo: ${currentDate.getDate()}.${currentDate.getMonth()}.${currentDate.getFullYear()} 
      ${currentDate.getHours()}:${currentDate.getMinutes()}</h6>`;
      containerDOM.appendChild(card);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  pricesLoading.hidden = false;
  getAllCrypto().then((currentPrices) => {
    cryptoPrices = [...currentPrices];
    setPricesTableDOM(currentPrices);
    createPopularCardsDOM();

    if (localStorage.hasOwnProperty("userCryptoList")) {
      console.log("test");
      userCryptoList = JSON.parse(localStorage.getItem("userCryptoList"));
    }

    updateMyCryptoDOM();
    populateDropdownDOM();
  });
});

refreshBtn.addEventListener("click", () => {
  pricesLoading.hidden = false;
  getAllCrypto().then((currentPrices) => {
    cryptoPrices = [...currentPrices];
    console.log(cryptoPrices);
    setPricesTableDOM(currentPrices);
    createPopularCardsDOM();
    updateMyCryptoDOM();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const value = formData.get("value");

  if (document.querySelector(".error")) {
    document.querySelector(".error").remove();
  }

  if (isNaN(value)) {
    const error = document.createElement("div");
    error.setAttribute("class", "error");
    error.innerHTML = "<p>Vnešena vrednost mora biti številska!</p>";
    form.append(error);
    return;
  } else if (formData.get("crypto") == "Izberi kriptovaluto") {
    const error = document.createElement("div");
    error.setAttribute("class", "error");
    error.innerHTML = "<p>Iz seznama je potrebno izbrati kriptovaluto!</p>";
    form.append(error);
    return;
  }

  const newCrypto = {
    name: formData.get("crypto"),
    value: parseFloat(formData.get("value")),
  };

  const index = userCryptoList.findIndex((el) => el.name == newCrypto.name);

  if (index != -1) {
    userCryptoList[index].value += newCrypto.value;
  } else {
    userCryptoList.push(newCrypto);
  }
  saveToLocalStorage();
  updateMyCryptoDOM();
});

// Button zapri modal

document.querySelector("#modal-edit-close").addEventListener("click", () => {
  editModal.style.display = "none";
});

document.querySelector("#modal-close").addEventListener("click", () => {
  modal.style.display = "none";
});
