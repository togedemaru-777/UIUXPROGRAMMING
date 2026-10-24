const explorationTopics = [
    {
        id: "bulb",
        title: "전구는 어떻게 빛날까?",
        description: "전기가 흐르면 전구에서 빛이 발생하는 이유를 알아봅니다."
    },
    {
        id: "magnet",
        title: "자석은 왜 서로 밀어낼까?",
        description: "자석 사이에 힘이 왜 발생하는지 원리를 알아봅니다."
    },
    {
        id: "matter",
        title: "물질의 성질은 어떻게 결정될까?",
        description: "물질의 성질이 결정되는 원인을 살펴봅니다."
    },
    {
        id: "gravity",
        title: "물체는 왜 아래로 떨어질까?",
        description: "일상에서 경험하는 중력과 물체의 운동을 살펴봅니다."
    }
];

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
        ? "탐구 설정을 시작할 수 있습니다"
        : "안내 확인 후 탐구 설정을 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

function renderTopicOptions() {
    const tabList = document.querySelector("#topic-tabs");
    const panelList = document.querySelector("#topic-panels");
    const topicOptions = document.querySelector("#topic-options");

    explorationTopics.forEach((topic, index) => {
        const tab = document.createElement("button");
        tab.id = "tab-" + topic.id;
        tab.className = index === 0 ? "tab is-active" : "tab";
        tab.type = "button";
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", String(index === 0));
        tab.setAttribute("aria-controls", "feature-" + topic.id);
        tab.dataset.target = "#feature-" + topic.id;
        tab.textContent = topic.title;
        tabList.append(tab);

        const panel = document.createElement("div");
        panel.id = "feature-" + topic.id;
        panel.className = index === 0 ? "panel is-active" : "panel";
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        panel.hidden = index !== 0;

        const heading = document.createElement("h3");
        heading.textContent = topic.title;
        const description = document.createElement("p");
        description.textContent = topic.description;
        panel.append(heading, description);
        panelList.append(panel);

        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "topic";
        radio.value = topic.id;
        label.append(radio, document.createTextNode(topic.title));
        topicOptions.append(label);
    });
}

renderTopicOptions();

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


const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");

const titleInput = document.querySelector("#topic-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");

const topicError = document.querySelector("#topic-error");
const topicRadios = document.querySelectorAll('input[name="topic"]');

const optionPrev = document.querySelector("#option-pre");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");

const summaryTitle = document.querySelector("#summary-title");
const summaryTopic = document.querySelector("#summary-topic");
const showTopicButton = document.querySelector("#mdnebonegi");
const explorationResult = document.querySelector("#exploration-result");
const explorationTitle = document.querySelector("#exploration-title");
const explorationTopic = document.querySelector("#exploration-topic");
const explorationContent = document.querySelector("#exploration-content");

const formData = {
    title: "",
    topic: "",
    topicId: ""
};

function clearExplorationResult() {
    explorationResult.hidden = true;
    explorationTitle.textContent = "";
    explorationTopic.textContent = "";
    explorationContent.textContent = "";
    showTopicButton.setAttribute("aria-expanded", "false");
}

function showStep(index) {
    flowSteps.forEach((step, i) => {
        step.hidden = i !== index;
    });

    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function cancelSetup() {
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    clearExplorationResult();
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    recordingDialog.showModal();
});

recordingCancel.addEventListener("click", () => {
    recordingDialog.close();
    cancelSetup();
});

recordingDialog.addEventListener("cancel", cancelSetup);

recordingConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;

    recordingDialog.close();
    clearExplorationResult();
    trainingFlow.hidden = false;
    showStep(0);

    trainingFlow.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();

    if (!value) {
        titleError.textContent = "탐구할 현상을 입력해 주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }

    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});

optionPrev.addEventListener("click", () => showStep(0));

optionNext.addEventListener("click", () => {
    const selectedTopic =
        document.querySelector('input[name="topic"]:checked');

    if (!selectedTopic) {
        topicError.textContent = "탐구 주제를 선택해 주세요.";
        return;
    }

    topicError.textContent = "";

    const topic = explorationTopics.find((item) => item.id === selectedTopic.value);
    formData.topicId = topic.id;
    formData.topic = topic.title;

    summaryTitle.textContent = formData.title;
    summaryTopic.textContent = formData.topic;

    showStep(2);
});

topicRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        topicError.textContent = "";
    });
});

summaryPrev.addEventListener("click", () => showStep(1));

finishButton.addEventListener("click", () => {
    showStep(3);
});

showTopicButton.addEventListener("click", () => {
    const topic = explorationTopics.find((item) => item.id === formData.topicId);
    if (!topic || !formData.title) return;

    const template = document.querySelector("#content-" + topic.id);
    explorationTitle.textContent = formData.title;
    explorationTopic.textContent = topic.title;
    explorationContent.replaceChildren();

    if (template && template.innerHTML.trim()) {
        explorationContent.append(template.content.cloneNode(true));
    } else {
        explorationContent.textContent = "이 주제의 탐구 내용은 아직 준비 중입니다. 다른 주제를 설정해 주세요.";
    }

    explorationResult.hidden = false;
    showTopicButton.setAttribute("aria-expanded", "true");
    explorationTitle.focus({ preventScroll: true });
    explorationResult.scrollIntoView({ behavior: "smooth", block: "start" });
});

restartButton.addEventListener("click", () => {
    clearExplorationResult();
    formData.title = "";
    formData.topic = "";
    formData.topicId = "";

    titleInput.value = "";
    titleError.textContent = "";
    topicError.textContent = "";
    titleInput.classList.remove("has-error");

    topicRadios.forEach((radio) => {
        radio.checked = false;
    });

    summaryTitle.textContent = "";
    summaryTopic.textContent = "";

    showStep(0);
    titleInput.focus();
});


// const trainingFlow = document.querySelector("#training-flow") || document.querySelector("#traing-flow");
// const traingFlow = trainingFlow;
// const flowSteps = traingFlow.querySelectorAll(".step");
// const progressItems = traingFlow.querySelectorAll(".progress_item, .progress__item");
// const titleInput = document.querySelector("#topic-title") || document.querySelector("#presentation-title");
// const titleError = document.querySelector("#title-error");
// const titleNext = document.querySelector("#title-next");
// const durationRange = document.querySelector("#duration-range");
// const durationValue = document.querySelector("#duration-value") || document.querySelector("#durtaion-value");
// const topicOption = document.querySelector("#topic-option") || document.querySelector("#qna-option");
// const topicOptions = document.querySelector("#topic-options") || document.querySelector("#qna-options");
// const qnaOption = topicOption;
// const qnaOptions = topicOptions;
// const optionPrev = document.querySelector("#option-prev") || document.querySelector("#option-pre");
// const optionNext = document.querySelector("#option-next");
// const summaryPrev = document.querySelector("#summary-prev");
// const finishButton = document.querySelector("#finish-button");
// const restartButton = document.querySelector("#restart-button");
// const summaryTitle = document.querySelector("#summary-title");
// const summaryDuration = document.querySelector("#summary-duration");
// const summaryTopic = document.querySelector("#summary-topic") || document.querySelector("#summary-qna");
// const summaryQna = summaryTopic;
// const durationValues = ["3", "5", "10"];

// const formData = {
//     title: "",
//     duration: "5",
//     topic: "",
//     qna: false,
//     qnaCount: "2"
// };

// function showStep(index) {
//     flowSteps.forEach((step, i) => { step.hidden = i !== index; });
//     progressItems.forEach((item, i) => {
//         item.classList.toggle("is-active", i === index);
//     });
// }

// const recordingDialog = document.querySelector("#recording-dialog");
// const recordingCancel = document.querySelector("#recording-cancel");
// const recordingConfirm = document.querySelector("#recording-confirm");

// function revokeRecordingAgreement() {
//     agreeCheck.checked = false;
//     trainingFlow.hidden = true;
//     handleAgreeChange();
//     agreeCheck.focus();
// }

// startButton.addEventListener("click", () => {
//     if (!agreeCheck.checked) return;
//     recordingDialog.showModal();
// });

// recordingCancel.addEventListener("click", () => {
//     recordingDialog.close();
//     revokeRecordingAgreement();
// });

// recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

// recordingConfirm.addEventListener("click", () => {
//     if (!agreeCheck.checked) return;
//     recordingDialog.close();
//     trainingFlow.hidden = false;
//     showStep(0);
//     trainingFlow.scrollIntoView({ behavior: "smooth" });
//     titleInput.focus();
// });

// function validateTitle() {
//     const value = titleInput.value.trim();
//     if (!value) {
//         titleError.textContent = "발표 제목을 입력해 주세요.";
//         titleInput.classList.add("has-error");
//         titleInput.focus();
//         return false;
//     }
//     titleError.textContent = "";
//     titleInput.classList.remove("has-error");
//     formData.title = value;
//     return true;
// }

// titleNext.addEventListener("click", () => {
//     if (!validateTitle()) return;
//     showStep(1);
// });

// durationRange?.addEventListener("input", () => {
//     if (durationValue) durationValue.value = durationValues[durationRange.value] + "분";
// });

// qnaOption?.addEventListener("change", () => {
//     if (qnaOptions) qnaOptions.hidden = !qnaOption.checked;
// });

// optionPrev?.addEventListener("click", () => showStep(0));
// optionNext?.addEventListener("click", () => {
//     if (durationRange) formData.duration = durationValues[durationRange.value];
//     if (qnaOption && qnaOption.type === "checkbox") formData.qna = qnaOption.checked;
//     const count = document.querySelector('input[name="qna-count"]:checked');
//     if (count) formData.qnaCount = count.value;

//     const selectedTopic = document.querySelector('input[name="topic"]:checked');
//     if (selectedTopic) {
//         formData.topic = selectedTopic.parentElement.textContent.trim();
//     }

//     if (summaryTitle) summaryTitle.textContent = formData.title;
//     if (summaryDuration) summaryDuration.textContent = formData.duration + "분";
//     if (summaryTopic) summaryTopic.textContent = formData.topic || (formData.qna ? formData.qnaCount + "개 포함" : "미포함");

//     showStep(2);
// });

// summaryPrev.addEventListener("click", () => showStep(1));
// finishButton.addEventListener("click", () => showStep(3));
// restartButton.addEventListener("click", () => {
//     formData.title = "";
//     formData.duration = "5";
//     formData.qna = false;
//     formData.qnaCount = "2";
//     formData.topic = "";
//     titleInput.value = "";
//     titleError.textContent = "";
//     titleInput.classList.remove("has-error");
//     if (durationRange) durationRange.value = "1";
//     if (durationValue) durationValue.value = "5분";
//     if (qnaOption && qnaOption.type === "checkbox") qnaOption.checked = false;
//     if (qnaOptions) qnaOptions.hidden = true;
//     const defaultQna = document.querySelector('input[name="qna-count"][value="2"]');
//     if (defaultQna) defaultQna.checked = true;
//     const checkedTopic = document.querySelector('input[name="topic"]:checked');
//     if (checkedTopic) checkedTopic.checked = false;
//     if (summaryTitle) summaryTitle.textContent = "";
//     if (summaryDuration) summaryDuration.textContent = "";
//     if (summaryQna) summaryQna.textContent = "";
//     if (summaryTopic) summaryTopic.textContent = "";
//     showStep(0);
// });


// console.log(subscribeForm);
// console.log(emailInput);
// console.log(subscribeButton);
// console.log(subscribeMessage);

// console.log(makeSubscribeMessage("", false));
// console.log(makeSubscribeMessage("learner@email.com", true));

// console.log(typeof serviceName);
// console.log(typeof isSubscribed);
// console.log(typeof submitCount);

