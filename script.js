const explorationTopics = [
  { id: "bulb", title: "전구는 어떻게 빛날까?", description: "전기가 흐르면 전구에서 빛이 발생하는 이유를 알아봅니다." },
  { id: "magnet", title: "자석은 왜 서로 밀어낼까?", description: "자석 사이에 힘이 왜 발생하는지 원리를 알아봅니다." },
  { id: "matter", title: "물질의 성질은 어떻게 결정될까?", description: "물질의 성질이 결정되는 원인을 살펴봅니다." },
  { id: "gravity", title: "물체는 왜 아래로 떨어질까?", description: "일상에서 경험하는 중력과 물체의 운동을 살펴봅니다." }
];
 
const themeButton = document.querySelector("#themeButton");
themeButton.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");
  themeButton.textContent = dark ? "라이트 모드" : "다크 모드";
  themeButton.setAttribute("aria-pressed", String(dark));
});

function renderTopicOptions() {
  const optionList = document.querySelector("#topic-option-list");

  explorationTopics.forEach((topic) => {
    const label = document.createElement("label");
    label.className = "choice-card";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "topic";
    radio.value = topic.id;
    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = topic.title;
    const small = document.createElement("small");
    small.textContent = topic.description;
    text.append(title, small);
    label.append(radio, text);
    optionList.append(label);
  });
}

renderTopicOptions();

const planForm = document.querySelector("#plan-form");
const flowSteps = [...document.querySelectorAll(".flow-step")];
const progressItems = [...document.querySelectorAll(".progress-item")];
const titleInput = document.querySelector("#topic-title");
const titleError = document.querySelector("#title-error");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const topicError = document.querySelector("#topic-error");
const topicRadios = document.querySelectorAll('input[name="topic"]');
const setupMessage = document.querySelector("#setup-message");
const showTopicButton = document.querySelector("#mdnebonegi");
const finishButton = document.querySelector("#finish-button");
const finishButtonLabel = finishButton.innerHTML;
const summaryPrev = document.querySelector("#summary-prev");
const memoOption = document.querySelector("#memo-option");
const memoArea = document.querySelector("#memo-area");
const memoInput = document.querySelector("#memo");

const explorationResult = document.querySelector("#exploration-result");
const explorationTitle = document.querySelector("#exploration-title");
const explorationTopic = document.querySelector("#exploration-topic");
const explorationContent = document.querySelector("#exploration-content");
const explorationStatus = document.querySelector("#exploration-status");
const explorationNext = document.querySelector("#exploration-next");
const viewedTopicEmpty = document.querySelector("#viewed-topic-empty");
const viewedTopicList = document.querySelector("#viewed-topic-list");

const viewedTopicsStorageKey = "physicsST.viewedTopics";
const setupsStorageKey = "physicsST.setups";
let currentStep = 1;
let currentExploration = null;
let isSubmitting = false;
let viewedTopics = loadViewedTopics();

const formData = { title: "", nickname: "", topic: "", topicId: "" };

function loadViewedTopics() {
  try {
    const saved = JSON.parse(localStorage.getItem(viewedTopicsStorageKey) || "[]");
    if (!Array.isArray(saved)) return [];

    const restored = [];
    saved.forEach((item) => {
      if (!item || typeof item.title !== "string" || !item.title.trim()) return;
      if (!explorationTopics.some((topic) => topic.id === item.topicId)) return;
      if (restored.some((record) => record.topicId === item.topicId)) return;
      restored.push({ topicId: item.topicId, title: item.title, completed: item.completed === true });
    });
    return restored;
  } catch {
    return [];
  }
}

function saveViewedTopics() {
  try {
    localStorage.setItem(viewedTopicsStorageKey, JSON.stringify(viewedTopics));
  } catch {
  }
}

function syncTopicOptions() {
  topicRadios.forEach((radio) => {
    const topic = explorationTopics.find((item) => item.id === radio.value);
    const viewed = viewedTopics.some((record) => record.topicId === radio.value);
    radio.disabled = viewed;
    radio.closest(".choice-card").querySelector("small").textContent = viewed
      ? "이미 본 주제입니다. 한 번 본 탐구 주제에서 다시 볼 수 있습니다."
      : topic.description;
  });
}

function renderViewedTopics() {
  syncTopicOptions();
  viewedTopicList.replaceChildren();
  viewedTopicEmpty.hidden = viewedTopics.length !== 0;
  viewedTopicList.hidden = viewedTopics.length === 0;

  viewedTopics.forEach((record) => {
    const topic = explorationTopics.find((item) => item.id === record.topicId);
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "viewed-topic-button";

    const status = document.createElement("span");
    status.className = record.completed ? "viewed-topic-status is-complete" : "viewed-topic-status";
    status.textContent = record.completed ? "탐구 완료" : "읽는 중";
    const name = document.createElement("strong");
    name.className = "viewed-topic-name";
    name.textContent = topic.title;
    const title = document.createElement("span");
    title.className = "viewed-topic-title";
    title.textContent = record.title;
    const action = document.createElement("span");
    action.className = "viewed-topic-action";
    action.textContent = "다시 보기";

    button.append(status, name, title, action);
    button.addEventListener("click", () => showExploration(record.topicId, record.title));
    item.append(button);
    viewedTopicList.append(item);
  });
}

function clearExplorationResult() {
  currentExploration = null;
  explorationStatus.textContent = "";
  explorationStatus.classList.remove("is-complete");
  explorationResult.hidden = true;
  explorationTitle.textContent = "";
  explorationTopic.textContent = "";
  explorationContent.replaceChildren();
  showTopicButton.setAttribute("aria-expanded", "false");
}

function showStep(number, moveFocus = true) {
  currentStep = number;
  flowSteps.forEach((step) => {
    step.hidden = Number(step.dataset.step) !== number;
  });
  progressItems.forEach((item, index) => {
    const isCurrent = index === number - 1;
    item.classList.toggle("is-current", isCurrent);
    item.classList.toggle("is-done", index < number - 1);
    if (isCurrent) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  if (!moveFocus) return;
  const heading = flowSteps[number - 1].querySelector("h3");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  document.querySelector("#planner").scrollIntoView({ block: "start", behavior: "smooth" });
}

function validateTitle() {
  const value = titleInput.value.trim();
  if (!value) {
    titleError.textContent = "탐구 이름을 입력해 주세요. 공백만으로는 진행할 수 없습니다.";
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.focus();
    return false;
  }
  titleError.textContent = "";
  titleInput.removeAttribute("aria-invalid");
  formData.title = value;
  return true;
}

function setSetupMessage(message, type) {
  setupMessage.textContent = message;
  setupMessage.className = type ? "setup-message is-" + type : "setup-message";
}

function syncMemoArea() {
  memoArea.hidden = !memoOption.checked;
  memoInput.disabled = !memoOption.checked;
}

function goToTopicStep() {
  if (!validateTitle()) return;
  formData.nickname = nicknameInput.value.trim();
  setSetupMessage("");
  showStep(2);
}

function goToSummaryStep() {
  const selectedTopic = document.querySelector('input[name="topic"]:checked');
  if (!selectedTopic) {
    topicError.textContent = [...topicRadios].every((radio) => radio.disabled)
      ? "모든 주제를 이미 보았습니다. 한 번 본 탐구 주제에서 다시 볼 수 있습니다."
      : "탐구 주제를 선택해 주세요.";
    return;
  }
  topicError.textContent = "";

  const topic = explorationTopics.find((item) => item.id === selectedTopic.value);
  formData.topicId = topic.id;
  formData.topic = topic.title;
  document.querySelector("#summary-title").textContent = formData.title;
  document.querySelector("#summary-nickname").textContent = formData.nickname || "입력 안 함";
  document.querySelector("#summary-topic").textContent = formData.topic;
  document.querySelector("#summary-memo").textContent = (memoInput.disabled ? "" : memoInput.value.trim()) || "입력 안 함";
  showStep(3);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function saveSetup(setup) {
  const saved = JSON.parse(localStorage.getItem(setupsStorageKey) || "[]");
  localStorage.setItem(setupsStorageKey, JSON.stringify([setup, ...saved]));
}

function setSubmitting(submitting) {
  isSubmitting = submitting;
  finishButton.disabled = submitting;
  summaryPrev.disabled = submitting;
}

async function submitSetup() {
  setSubmitting(true);
  finishButton.textContent = "저장 중...";
  setSetupMessage("탐구 설정을 저장하고 있습니다. 잠시만 기다려 주세요.", "pending");

  try {
    await wait(800);
    saveSetup({
      title: formData.title,
      nickname: formData.nickname,
      topicId: formData.topicId,
      memo: memoInput.disabled ? "" : memoInput.value.trim()
    });
    setSubmitting(false);
    finishButton.innerHTML = finishButtonLabel;
    setSetupMessage("‘" + formData.title + "’ 탐구 설정을 저장했습니다.", "success");
    showStep(4);
  } catch {
    setSubmitting(false);
    finishButton.textContent = "다시 시도하기";
    setSetupMessage("탐구 설정을 저장하지 못했습니다. 입력한 내용은 그대로 있으니 다시 시도해 주세요.", "failure");
  }
}

titleInput.addEventListener("input", () => {
  if (titleInput.getAttribute("aria-invalid") === "true") validateTitle();
});

memoOption.addEventListener("change", syncMemoArea);

nicknameInput.addEventListener("input", () => {
  nicknameCount.textContent = nicknameInput.value.length + " / " + nicknameInput.maxLength + "자";
});

topicRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    topicError.textContent = "";
  });
});

// Enter 입력도 버튼과 같은 단계 이동으로 처리합니다.
planForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isSubmitting) return;
  if (currentStep === 1) goToTopicStep();
  else if (currentStep === 2) goToSummaryStep();
  else if (currentStep === 3) submitSetup();
});

document.querySelector("#title-next").addEventListener("click", goToTopicStep);
document.querySelector("#option-pre").addEventListener("click", () => showStep(1));
document.querySelector("#option-next").addEventListener("click", goToSummaryStep);
summaryPrev.addEventListener("click", () => {
  setSetupMessage("");
  finishButton.innerHTML = finishButtonLabel;
  showStep(2);
});

function showExploration(topicId, title) {
  const topic = explorationTopics.find((item) => item.id === topicId);
  if (!topic || !title) return;

  const template = document.querySelector("#content-" + topic.id);
  const hasContent = template && template.innerHTML.trim();
  explorationTitle.textContent = title;
  explorationTopic.textContent = topic.title;
  explorationContent.replaceChildren();
  explorationNext.disabled = !hasContent;

  if (hasContent) {
    explorationContent.append(template.content.cloneNode(true));
    const previous = viewedTopics.find((record) => record.topicId === topic.id);
    const record = { topicId: topic.id, title: title, completed: previous ? previous.completed : false };
    viewedTopics = viewedTopics.filter((item) => item.topicId !== topic.id);
    viewedTopics.unshift(record);
    currentExploration = { topicId: topic.id, title: title };
    explorationStatus.textContent = record.completed ? "탐구 완료" : "읽는 중";
    explorationStatus.classList.toggle("is-complete", record.completed);
    saveViewedTopics();
    renderViewedTopics();
  }

  explorationResult.hidden = false;
  showTopicButton.setAttribute("aria-expanded", "true");
  explorationTitle.focus({ preventScroll: true });
  explorationResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

showTopicButton.addEventListener("click", () => {
  showExploration(formData.topicId, formData.title);
});

function resetExplorationSetup() {
  setSetupMessage("");
  finishButton.innerHTML = finishButtonLabel;
  clearExplorationResult();
  planForm.reset();
  syncMemoArea();
  formData.title = "";
  formData.nickname = "";
  formData.topic = "";
  formData.topicId = "";
  nicknameCount.textContent = "0 / " + nicknameInput.maxLength + "자";
  titleError.textContent = "";
  topicError.textContent = "";
  titleInput.removeAttribute("aria-invalid");
  document.querySelector("#summary-title").textContent = "";
  document.querySelector("#summary-nickname").textContent = "";
  document.querySelector("#summary-topic").textContent = "";
  document.querySelector("#summary-memo").textContent = "";

  showStep(1, false);
  document.querySelector("#planner").scrollIntoView({ behavior: "smooth", block: "start" });
  titleInput.focus({ preventScroll: true });
}

document.querySelector("#restart-button").addEventListener("click", resetExplorationSetup);

explorationNext.addEventListener("click", () => {
  if (!currentExploration) return;
  const record = viewedTopics.find((item) => item.topicId === currentExploration.topicId);
  if (!record) return;

  record.completed = true;
  const completedTitle = currentExploration.title;
  saveViewedTopics();
  renderViewedTopics();
  resetExplorationSetup();
  setSetupMessage("‘" + completedTitle + "’ 탐구를 완료했습니다. 새 탐구 이름을 입력해 주세요.", "success");
});

renderViewedTopics();

// 새로운 탐구 소식 받기
const subscribeForm = document.querySelector("#subscribe-form");
const subscribeEmail = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

subscribeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = subscribeEmail.value.trim();

  if (email === "") {
    subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
    subscribeEmail.focus();
    return;
  }

  subscribeMessage.textContent = email + "로 신청이 완료 되었습니다.";
  subscribeMessage.classList.add("is-success");
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
});
