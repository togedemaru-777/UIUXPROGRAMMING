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

const explorationResult = document.querySelector("#exploration-result");
const explorationTitle = document.querySelector("#exploration-title");
const explorationTopic = document.querySelector("#exploration-topic");
const explorationContent = document.querySelector("#exploration-content");
const explorationStatus = document.querySelector("#exploration-status");
const explorationNext = document.querySelector("#exploration-next");
const viewedTopicEmpty = document.querySelector("#viewed-topic-empty");
const viewedTopicList = document.querySelector("#viewed-topic-list");

const viewedTopicsStorageKey = "physicsST.viewedTopics";
let currentStep = 1;
let currentExploration = null;
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

function renderViewedTopics() {
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

function goToTopicStep() {
  if (!validateTitle()) return;
  formData.nickname = nicknameInput.value.trim();
  setupMessage.textContent = "";
  showStep(2);
}

function goToSummaryStep() {
  const selectedTopic = document.querySelector('input[name="topic"]:checked');
  if (!selectedTopic) {
    topicError.textContent = "탐구 주제를 선택해 주세요.";
    return;
  }
  topicError.textContent = "";

  const topic = explorationTopics.find((item) => item.id === selectedTopic.value);
  formData.topicId = topic.id;
  formData.topic = topic.title;
  document.querySelector("#summary-title").textContent = formData.title;
  document.querySelector("#summary-nickname").textContent = formData.nickname || "입력 안 함";
  document.querySelector("#summary-topic").textContent = formData.topic;
  showStep(3);
}

titleInput.addEventListener("input", () => {
  if (titleInput.getAttribute("aria-invalid") === "true") validateTitle();
});

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
  if (currentStep === 1) goToTopicStep();
  else if (currentStep === 2) goToSummaryStep();
});

document.querySelector("#title-next").addEventListener("click", goToTopicStep);
document.querySelector("#option-pre").addEventListener("click", () => showStep(1));
document.querySelector("#option-next").addEventListener("click", goToSummaryStep);
document.querySelector("#summary-prev").addEventListener("click", () => showStep(2));
document.querySelector("#finish-button").addEventListener("click", () => showStep(4));

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
  setupMessage.textContent = "";
  clearExplorationResult();
  planForm.reset();
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
  setupMessage.textContent = "‘" + completedTitle + "’ 탐구를 완료했습니다. 새 탐구 이름을 입력해 주세요.";
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
