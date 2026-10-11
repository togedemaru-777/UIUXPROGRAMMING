const serviceName = "physicsST"
let isSubcribed = false
let submiCount = 0;

const subcribeForm = document.querySelector("#subscribe-form")
const emailInput= document.querySelector("#email")

const subcribeButton = document.querySelector("#subscribeButton")
const subcribeMessage = document.querySelector("#subscribeMessage")


function makeSubcribeMessage(email, subcribed){
    if (subcribed == true) {
        return email + "로 신청이 완료 되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

function handleSubcribe(event){
    event.preventDefault();
    const subcribedemail = emailInput.value.trim();

    if (subcribedemail === ""){
        subcribeMessage.textContent =
        "이메일을 입력한 뒤 신청해주세요."
        emailInput.focus();
        return;
    }

    isSubcribed = true;
    submiCount += 1;
    subcribeMessage.textContent = makeSubcribeMessage(subcribedemail, isSubcribed);

    subcribeMessage.classList.add("is-success");
    subcribeButton.textContent = "신청 완료";
    subcribeButton.disabled = true;

}

subcribeForm.addEventListener("submit", handleSubcribe);

// console.log(subcribeForm);
// console.log(emailInput);
// console.log(subcribeButton);
// console.log(subcribeMessage);

// console.log(makeSubcribeMessage("", false));
// console.log(makeSubcribeMessage("learner@email.com", true));

// console.log(typeof serviceName);
// console.log(typeof isSubcribed);
// console.log(typeof submiCount);

