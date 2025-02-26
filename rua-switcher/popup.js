async function random_number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function random_item(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Inspired from python library called "fake_useragent"
async function create_user_agent(device, browser) {
  const brands = {
    android: ["Samsung", "Xiaomi", "Realme", "Vivo", "Oppo", "OnePlus", "Sony", "Google"],
    ios: ["iPhone"],
    windows: ["Dell", "Asus", "ThinkPad", "HP", "MSI", "Acer", "Lenovo"],
    mac: ["MacBook", "iMac"],
    linux: ["Generic Linux"]
  };

  const versions = {
    chrome: `Chrome/${await random_number(90, 120)}.0.${await random_number(1000, 5000)}.${await random_number(50, 150)}`,
    firefox: `Firefox/${await random_number(80, 110)}.0`,
    edge: `Edg/${await random_number(90, 120)}.0.${await random_number(1000, 5000)}.${await random_number(50, 150)}`,
    opera: `OPR/${await random_number(70, 90)}.0.${await random_number(1000, 5000)}.${await random_number(50, 150)}`,
  };

  const os = {
    android: `Mozilla/5.0 (Linux; Android ${await random_number(7, 13)}; ${await random_item(brands.android)})`,
    ios: `Mozilla/5.0 (${await random_item(brands.ios)}; CPU iPhone OS ${await random_number(12, 16)} like Mac OS X)`,
    windows: `Mozilla/5.0 (Windows NT ${await random_number(6, 10)}.0; Win64; x64; ${await random_item(brands.windows)})`,
    mac: `Mozilla/5.0 (Macintosh; ${await random_item(brands.mac)}; Intel Mac OS X ${await random_number(10, 15)}_${await random_number(0, 9)})`,
    linux: `Mozilla/5.0 (X11; ${await random_item(brands.linux)} x86_64)`
  };

  return `${os[device]} AppleWebKit/537.36 (KHTML, like Gecko) ${versions[browser]} Safari/537.36`;
}

document.getElementById("setUserAgent").addEventListener("click", async () => {
  const device = document.querySelector('select[name="devices"]').value;
  const browser = document.querySelector('select[name="browsers"]').value;

  if (!device || !browser) {
    alert("Pilih perangkat dan browser terlebih dahulu!");
    return;
  }

  if (device === "Select Device" || browser === "Select Browsers") {
    alert("Pilih perangkat dan browser terlebih dahulu!");
    return;
  }

  const userAgent = await create_user_agent(device, browser);

  chrome.storage.local.get("userAgent", (result) => {
    const previousUserAgent = result.userAgent || null;
    chrome.storage.local.set({ userAgent }, () => {
      if (previousUserAgent) {
        chrome.runtime.sendMessage({ action: "updateUserAgent" });
      }
    });
  });
});

const current_useragent = document.getElementById("current-useragent");
chrome.storage.local.get("userAgent", (result) => {
  current_useragent.textContent = `${result.userAgent || "None"}`;
});
