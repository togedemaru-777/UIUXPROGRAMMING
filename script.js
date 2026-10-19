const serviceName = "physicsST"
let isSubscribed = false
let submitCount = 0;

const subscribeForm = document.querySelector("#subscribe-form")
const emailInput = document.querySelector("#email")

const subscribeButton = document.querySelector("#subscribeButton")
const subscribeMessage = document.querySelector("#subscribeMessage")


function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료 되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

function handleSubscribe(event) {
    event.preventDefault();
    const subscribedemail = emailInput.value.trim();

    if (subscribedemail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요."
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;
    subscribeMessage.textContent = makeSubscribeMessage(subscribedemail, isSubscribed);

    subscribeMessage.classList.add("is-success");
    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;

}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeMessage = document.querySelector("#agreeMessage");
const agreeCheck = document.querySelector("#agreecheck");
const startButton = document.querySelector("#startButton");

function handlethemeClick() {
    // console.log("click:", event.currentTarget.id);
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handlethemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed
        ? "탐구를 시작할 수 있습니다"
        : "동의 후 탐구를 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    if (targetPanel) {
        targetPanel.classList.add("is-active");
        targetPanel.hidden = false;
    }
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});


// console.log(subscribeForm);
// console.log(emailInput);
// console.log(subscribeButton);
// console.log(subscribeMessage);

// console.log(makeSubscribeMessage("", false));
// console.log(makeSubscribeMessage("learner@email.com", true));

// console.log(typeof serviceName);
// console.log(typeof isSubscribed);
// console.log(typeof submitCount);

