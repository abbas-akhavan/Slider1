//sms validation
function sendMobileValidationCode(Data) {
    callModal.spinner((closeSpinner) => {
        $.post("/User/VerifyMobileCode",
            Data,
            function (view) {
                closeSpinner().then(() => {
                    callModal.custom((showModal, closeModal) => {
                        showModal(view);
                        setSmsValidationInput(closeModal);
                    }).then(checkMobileValidation)

                    $.get("/User/GetTimerValue", Data, function (time) {
                        mobileCodeResendTimer(time)
                    });
                })
            }
        );
    })
}
function setSmsValidationInput(closeModal) {
    dc.queries('input.coupledSms').forEach(item => {
        item.onkeydown = e => {
            if (!/[0-9]/.test(e.key))
                e.preventDefault()
            else if (e.target.value)
                e.target.value = '';
        }
        item.onkeyup = e => {
            if (/[0-9]/.test(e.key)) {
                if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.focus()
                } else {
                    closeModal()
                }
            } else {
                if (e.key === 'Enter')
                    closeModal()
            }
        }
    })
}
function mobileCodeResendTimer(i) {
    i = Math.floor(i);
    let timerDone = new Promise((resolve, reject) => {
        let resend = dc.query('.resend');
        resend.innerHTML = 'ارسال مجدد در <span></span> ثانیه...';
        let span = resend.query('.resend span');
        if (i <= 0) {
            resolve(resend);
            return;
        }
        span.innerText = i;
        let timer = setInterval(() => {
            span.innerText = --i;
            if (i <= 0) {
                clearInterval(timer);
                resolve(resend);
            }
        }, 1000);
    })

    timerDone.then(resendBtn => {
        resendBtn.innerText = 'ارسال مجدد';
        resendBtn.classList.add('button')
        resendBtn.onclick = e => {
            resendBtn.disabled = true;

            let Data = {
                iDSecond: $("#IDSecond").val(),
                Mobile: $("#MobileNumber").val()
            };

            $.post("/User/VerifyMobileCode",
                Data,
                function () {
                    resendBtn.disabled = false;
                    resendBtn.classList.remove('button');
                    dc.query('#modal span.alert').classList.add('active');

                    $.get("/User/GetTimerValue", Data, function (time) {
                        mobileCodeResendTimer(time)
                    });
                }
            );
        }
    })
}
function checkMobileValidation() {
    let verifyCode = '';
    let error = false;
    dc.queries('.coupledSms').forEach(i => {
        if (!i.value) error = true;
        verifyCode += i.value
    })
    if (error) return;


    Data = {
        ID: $("#IDSecond").val(),
        VerifyCode: verifyCode

    }
    $.post("/user/ConfirmVerify", Data, function (data) {

        if (!data.Error) {
            callModal.success('شماره شما با موفقیت تغییر یافت', 5000).then(() => {
                window.location.href = "/UserPanel/Profile?cate=editProfile";
            })
        } else {
            callModal.fail('کد وارد شده مطابقت نداشت', 10000);
        }
    })
}