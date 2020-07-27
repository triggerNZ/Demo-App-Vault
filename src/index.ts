import {
  AuthData,
  configureFetch,
  EncryptionKey,
  Environment,
  TemplatesService,
  ItemService,
  SecretService,
  UserService,
  vaultAPIFactory,
} from "@meeco/sdk";

import {
  VAULT_URL,
  KEYSTORE_URL,
  SUB_KEY,
  BOB_PASSWORD,
  BOB_SECRET,
  $,
  $get,
  loading,
  login,
  signup,
  welcome,
  dashboard,
  itemList,
  itemForm,
  itemSpace,
  itemTemplate,
  cardList,
  itemShow,
  header,
  sidebar,
  active,
} from "./constants";

import "./styles.scss";

let environment: Environment;

environment = new Environment({
  vault: {
    url: VAULT_URL,
    subscription_key: SUB_KEY,
  },
  keystore: {
    url: KEYSTORE_URL,
    subscription_key: SUB_KEY,
    provider_api_key: "",
  },
});

const STATE: {
  user?: AuthData;
  templates?: any;
  items?: any;
} = {
  user: {
    data_encryption_key: EncryptionKey.fromSerialized(
      "8n4gBhblWtYRLk3rTH1rRGXtKHikTVtJbyTowVtpy1s="
    ),
    key_encryption_key: EncryptionKey.fromSerialized(
      "_jGrW02X_dNw4cSvZZq7XF5ICC1_mHm_f3LIdqtaGno="
    ),
    keystore_access_token:
      "dERNLspexZsg3dspiEXqrSc1Z1QRuiVUlZB6AfU2gA4=.i7J8jYqPwaiwJM67ew_kWiQryVBsK271JmnbqjBg6h4=",
    passphrase_derived_key: EncryptionKey.fromSerialized(
      "qvufd1GAJmiBEKE2FTSksbLbMTBYwh3kucmd78onqoo="
    ),
    secret: "1.bBq6Qp.6ztGfS-hKUdWN-PhnCqi-Fpd4k2-1UMXJz-dWGpGV-yZSzTQ-N",
    vault_access_token: "bwmDcZsQFBx1S2w4f9wv",
  },
};

const secretService = new SecretService();

configureFetch(window.fetch);

$("createAccount").addEventListener("click", () => {
  hideElement(login);
  showElement(signup);
});
$("generate").addEventListener("click", getUsername);
$("getAccount").addEventListener("click", fetchUserData);
$("getItems").addEventListener("click", displayAllItems);
$("addItem").addEventListener("click", getTemplates);
$("createCard").addEventListener("click", createItem);

function hideElement(element: any) {
  element.style.display = "none";
}

function showElement(element: any) {
  element.style.display = "inline-block";
}

async function getUsername() {
  try {
    const username = await new UserService(environment, log).generateUsername();
    getSecret(username);
  } catch (error) {
    console.log(error);
  }
}

async function getSecret(username: string) {
  try {
    const secret = await secretService.generateSecret(username);
    createUser(secret);
  } catch (error) {
    console.log(error);
  }
}

async function createUser(secret: string) {
  const passphrase = $get("passphrase");
  try {
    const user = await new UserService(environment, log).create(
      passphrase,
      secret
    );
    STATE.user = user;
    showSecret();
  } catch (error) {
    console.log(error);
  }
}

function showSecret() {
  $("secret-block").textContent = STATE.user.secret;
  hideElement(signup);
  showElement(welcome);
}

async function fetchUserData() {
  hideElement(login);
  try {
    const user = await new UserService(environment, log).get(
      BOB_PASSWORD,
      BOB_SECRET
    );
    STATE.user = user;
    console.log(user);
    showElement(dashboard);
    hideElement(header);
    await getAllItems();
  } catch (error) {
    console.log(error);
  }
}

async function getTemplates() {
  try {
    const service = vaultAPIFactory(environment)(STATE.user.vault_access_token)
      .ItemTemplateApi;
    const templates = await service.itemTemplatesGet(
      "esafe",
      "esafe_templates"
    );
    STATE.templates = templates;
    showTemplates();
  } catch (error) {
    console.log(error);
  }
}

function showTemplates() {
  hideElement(itemList);
  hideElement(itemShow);
  showElement(itemTemplate);
  const container = $("template");
  STATE.templates.item_templates.forEach((item: any) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.setAttribute("id", item.label);
    tile.innerHTML = `
      <div class="content">
        <div class="icon"></div
        <p class="card-label">${item.label}</p>
      </div>
    `;
    container.appendChild(tile);
    $(item.label).addEventListener("click", () => {
      getTemplate(item.label);
    });
  });
}

function getTemplate(label) {
  STATE.templates.item_templates.forEach(async (template) => {
    if (template.label === label) {
      const service = vaultAPIFactory(environment)(
        STATE.user.vault_access_token
      ).ItemTemplateApi;
      const iTemplate = await service.itemTemplatesIdGet(template.id);
      showItemForm(iTemplate);
    }
  });
}

function showItemForm(template) {
  console.log(template);
  hideElement(itemTemplate);
  hideElement(itemList);
  hideElement(itemShow);
  showElement(itemForm);
  itemSpace.innerHTML = `
  <h4>${template.item_template.label}</h4>`;
  template.slots.forEach((slot) => {
    itemSpace.innerHTML += `
    <label for="${slot.label}">${slot.label}</label>
    <input name="${slot.label}" type="text"/>`;
  });
}

async function createItem() {
  const itemLabel = $get("item-title");
  const label1 = $get("slot-1-label");
  const label2 = $get("slot-2-label");
  const value1 = $get("slot-1-value");
  const value2 = $get("slot-2-value");
  const config = {
    template_name: "custom",
    item: {
      label: itemLabel,
    },
    slots: [
      {
        name: label1,
        value: value1,
      },
      {
        name: label2,
        value: value2,
      },
    ],
  };
  try {
    const item = await new ItemService(environment, log).create(
      STATE.user.vault_access_token,
      STATE.user.data_encryption_key,
      config
    );
    await getAllItems();
  } catch (error) {
    console.log(error);
  }
}

async function getAllItems() {
  loading.innerHTML = `
    <h4> Hey Twin,</h4>
    <p class="large">Welcome back!<br/>Let's add or share some more items</p>
  `;
  sidebar.style.justifyContent = "flex-start";
  hideElement(itemForm);
  try {
    const items = await new ItemService(environment, log).list(
      STATE.user.vault_access_token
    );
    STATE.items = items.items;
    displayAllItems();
  } catch (error) {
    console.log(error);
  }
}

function displayAllItems() {
  showElement(itemList);
  hideElement(itemShow);
  hideElement(itemForm);
  cardList.innerHTML = "";
  STATE.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("id", `${item.label}`);
    card.innerHTML = `
      <div class="content">
        <div class="icon"><i class="fas fa-wifi"></i></div>
        <p class="card-label">${item.label}</p>
      </div>`;
    cardList.appendChild(card);
    $(item.label).addEventListener("click", function () {
      showItemDetail(item.label);
    });
  });
}

async function getItem(id: string) {
  const item = await new ItemService(environment, log).get(
    id,
    STATE.user.vault_access_token,
    STATE.user.data_encryption_key
  );
  displayItem(item);
}

function displayItem(item: any) {
  showElement(active);
  hideElement(itemForm);
  showElement(itemShow);
  $("item-label").innerHTML = item.item.label;
  $("item-detail").innerHTML = "";
  item.slots.forEach((slot) => {
    if (slot.creator === "user") {
      $("item-detail").innerHTML += `
      <p class="label">${slot.label}</p>
      <p class="text-value">${slot.value}</p><br/>`;
    }
  });
  $("delete").addEventListener("click", () => {
    deleteItem(item.item);
  });
}

function showItemDetail(label: string) {
  STATE.items.forEach((item) => {
    if (item.label === label) {
      getItem(item.id);
    }
  });
}

async function deleteItem(item) {
  const service = vaultAPIFactory(environment)(STATE.user.vault_access_token)
    .ItemApi;
  try {
    const res = await service.itemsIdDelete(item.id);
  } catch (error) {
    console.log(error);
  }
}

function log(message: string) {
  console.log(message);
  const newContent = message;
  loading.innerHTML = newContent;
}
