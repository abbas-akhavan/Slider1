//modal
(function () {
    const modal = dc.query('#modal');
    modal.content = modal.query('.content');

    function scrollLockClousure() {
        let currentPos;

        function lock() {
            currentPos = document.documentElement.scrollTop;
            document.body.classList.add('locked');
            document.body.style.top = -currentPos + 'px';
            document.documentElement.style.scrollBehavior = "initial";
        }
        function unlock() {
            document.body.classList.remove('locked');
            document.body.style.top = null;
            document.documentElement.scrollTop = currentPos;
            document.documentElement.style.scrollBehavior = null;
        }

        return { lock: lock, unlock: unlock }
    }
    let scrollControl = scrollLockClousure();

    function callModal(content, className, lockScroll = false) {
        return prepearModal(className, (start) => {
            start(content);
        }, { scrollLock: lockScroll})
    }

    function prepearModal(className, additionalFunc, { close, scrollLock } = {}) {
        if (!close) close = 'overlay'; if (!scrollLock) scrollLock = false;
        if (!additionalFunc && typeof className === 'function') {
            additionalFunc = className;
            className = undefined;
        }

        return new Promise((res) => {

            modal.className = '';
            if (className)
                modal.className = className;

            switch (close) {
                case 'all':
                    modal.onclick = closeModal;
                    break;
                case 'overlay':
                    modal.onclick = e => {
                        if (!modal.content.contains(e.target))
                            closeModal()
                    };
                    break;
                case 'locked':
                    modal.onclick = null;
                    break;
            }

            function closeModal() {
                return new Promise((innerRes, innerRej) => {
                    if (!modal.classList.contains('active')) return
                    modal.addEventListener("transitionend", () => {
                        innerRes();
                        res();
                        scrollLock && scrollControl.unlock();
                    }, { once: true })
                    modal.classList.remove('active');
                })
            }
            function showModal(content) {
                if (typeof content === 'string')
                    modal.content.innerHTML = content;
                else
                    modal.content.replaceChildren(content);
                modal.classList.add('active');
                scrollLock && scrollControl.lock();
            }

            additionalFunc(showModal, closeModal);
        })
    }

    function scrollIntoVeiw(ele, callback) {
        if (!ele) return

        function getOffsetTop(element) {
            return element ? (element.offsetTop + getOffsetTop(element.offsetParent)) : 0;
        }
        const targetOffset = getOffsetTop(ele) - (window.innerHeight / 2) + (ele.clientHeight / 2);
        let targetOffsetFloor = Math.floor(targetOffset);
        const doucmentHeight = document.documentElement.scrollHeight;
        const maxOffset = doucmentHeight - window.innerHeight;

        if (targetOffsetFloor < 0) targetOffsetFloor = 0;
        if (targetOffsetFloor > maxOffset) targetOffsetFloor = maxOffset;

        const onScroll = function () {
            let windowOffsetFloor = Math.floor(window.pageYOffset);
            if (windowOffsetFloor === targetOffsetFloor
                || windowOffsetFloor + 1 === targetOffsetFloor
                || windowOffsetFloor - 1 === targetOffsetFloor
            ) {
                window.removeEventListener('scroll', onScroll)
                callback()
            }
        }
        window.addEventListener('scroll', onScroll);
        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        })
        onScroll()
    };

    function scrollLockClousure() {
        let currentPos;
        return function toggleScrollLock() {
            if (document.body.isLocked) unlock(); else lock();
            function lock() {
                currentPos = document.documentElement.scrollTop;
                document.body.classList.add('locked');
                document.body.style.top = -currentPos + 'px';
                document.body.isLocked = true;
            }
            function unlock() {
                document.body.classList.remove('locked');
                document.body.style.top = null;
                document.documentElement.scrollTop = currentPos;
                document.body.isLocked = false;
            }
        }
    }
    let toggleScrollLock = scrollLockClousure();


    //custom notifications
    function notif(content, duration = 5000) {
        return prepearModal('notification', (showModal, closeModal) => {
            showModal(content);
            setTimeout(closeModal, duration);
        }, { close: 'all' })
    }
    function successFail(msg, duration = 5000, failed) {
        let content = document.createElement('div');
        let icon = document.createElement('i');
        let br = document.createElement('br');
        if (failed) {
            icon.className = "fas fa-times";
        } else {
            icon.className = 'fas fa-check-circle';
        }
        content.innerText = msg;
        content.appendChild(br);
        content.appendChild(icon);

        return notif(content, duration)
    }
    function confirm(text) {
        return new Promise((resolve, reject) => {

            prepearModal('choice', (showModal, closeModal) => {
                let content = document.createElement('div');
                let buttonY = document.createElement('button');
                let buttonN = document.createElement('button');
                let span = document.createElement('span');

                span.innerText = text;
                buttonY.innerText = 'بله';
                buttonY.onclick = () => {
                    closeModal().then(resolve);
                };
                buttonY.className = 'button';
                buttonN.innerText = 'خیر';
                buttonN.onclick = () => {
                    closeModal().then(reject);
                };
                buttonN.className = "button reverse";

                content.appendChild(span);
                content.appendChild(buttonY);
                content.appendChild(buttonN);

                showModal(content)
            }).then(reject)

        })
    }
    function spinner(func) {
        return prepearModal('spinner', (openModal, closeModal) => {
            let container = document.createElement('div');
            let loader = document.createElement('div');
            loader.classList.add('loader');
            container.appendChild(loader);
            let text = document.createTextNode('لطفا صبر کنید...')
            container.appendChild(text)
            openModal(container);
            func && func(closeModal);
        }, { close: 'locked' })
    }
    function spinner2(func) {
        return prepearModal('spinner alt', (openModal, closeModal) => {
            let frg = document.createDocumentFragment();
            let img = document.createElement('img'); img.src = '/Content/images/Logo/HoloG.png';
            let div = document.createElement('div');
            let span = document.createElement('span');
            let p = document.createElement('p'); p.innerText = 'در حال بارگذاری ...';

            div.appendChild(span); div.appendChild(p);
            frg.appendChild(img); frg.appendChild(div);

            openModal(frg);
            func && func(closeModal);
        }, { close: 'locked' })
    }

    function image(src, {zoom} = {zoom: false}) {
        let className = `image ${zoom?' zoom':''}`;
        let options = zoom ? {close: "all"} : undefined;
        return prepearModal(className, (showModal, closeModal) => {
            let img = document.createElement('img');
            img.src = src;
            showModal(img);
        }, options)
    }
    function guide(msg, element) {
        return new Promise((resolve, reject) => {
            prepearModal('guide', (showModal, closeModal) => {
                let fragment = document.createDocumentFragment();
                let text = document.createTextNode(msg);
                let img = document.createElement('img');
                img.src = '/Content/images/img/swirlyArrow.png';
                let button = document.createElement('button');
                button.innerText = 'باشه!';
                button.onclick = closeModal;
                fragment.appendChild(text);
                fragment.appendChild(button);

                scrollIntoVeiw(element, () => {
                    let elementFinalPosition = element.getBoundingClientRect();

                    if (window.innerWidth > 830) {
                        let elementCenter = (elementFinalPosition.left + element.offsetWidth / 2);
                        let screenDivide = (window.innerWidth / 3);
                        let horizantalSection = Math.floor(elementCenter / screenDivide) + 1;

                        img.style.top = elementFinalPosition.top + (element.offsetHeight / 2) - 30 + 'px';
                        switch (horizantalSection) {
                            case 1:
                                img.style.left = elementFinalPosition.right + 'px';
                                img.classList.add('flip');
                                break;
                            case 2:
                                img.style.right = window.innerWidth - elementFinalPosition.left + 'px';
                                modal.classList.add('left')
                                break;
                            case 3:
                                img.style.right = window.innerWidth - elementFinalPosition.left + 'px';
                                break;
                        }

                        if (1100 >= window.innerWidth && horizantalSection === 2) {
                            img.style.right = null;
                            img.style.left = elementFinalPosition.right + 'px';
                            img.classList.add('flip');
                            modal.classList.add('left');
                        }
                    } else {
                        let elementCenter = (elementFinalPosition.top + element.offsetHeight / 2);
                        let screenDivide = (window.innerHeight / 3);
                        let verticalSection = Math.floor(elementCenter / screenDivide) + 1;

                        img.style.right = window.innerWidth - element.getBoundingClientRect().right + (element.offsetWidth / 2) - 60 + 'px';
                        switch (verticalSection) {
                            case 1:
                                img.style.bottom = elementFinalPosition.top - 20 + 'px';
                                modal.classList.add('bottom');
                                img.classList.add('toBottom');
                                break;
                            case 2:
                            case 3:
                                img.style.top = elementFinalPosition.bottom + 20 + 'px';
                                modal.classList.add('top');
                                img.classList.add('toTop');
                                break;
                        }

                    }

                    showModal(fragment);
                    modal.appendChild(img);
                });
            }, {scrollLock: true}).then(() => {
                modal.querySelector('img').remove();
                resolve();
            })
        })
    }
    function photoVeiwer(images, active) {
        return prepearModal('image photoVeiw', (showModal, closeModal) => {
            let frag = document.createDocumentFragment();
            let imagesDiv = document.createElement('div');
            let activeNum;

            imagesDiv.classList.add('cont');
            imagesDiv.onclick = closeModal;
            images.forEach((image, index) => {
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.src = image.getAttribute('src');

                if (img.src === active.src) {
                    img.classList.add('active');
                    activeNum = index;
                    rotateWheel(activeNum);
                }
                div.appendChild(img);
                imagesDiv.appendChild(div);
            })

            let next = document.createElement('i'); next.className = 'fas fa-chevron-right';
            let prev = document.createElement('i'); prev.className = 'fas fa-chevron-left';

            next.onclick = () => {
                activeNum--;
                if (activeNum < 0) activeNum = 0;
                rotateWheel(activeNum);
            }
            prev.onclick = () => {
                activeNum++;
                if (activeNum > images.length - 1) activeNum = images.length - 1;
                rotateWheel(activeNum);
            }

            function rotateWheel(number) {
                imagesDiv.style.left = `-${(images.length - number - 1) * 100}vw`;
                images.forEach(img => img.classList.remove('showing'));
                images[number].classList.add('showing');
            }

            frag.appendChild(next);
            frag.appendChild(imagesDiv);
            frag.appendChild(prev);

            showModal(frag);
        }, {scrollLock: true}).then(() => {
            images.forEach(img => img.classList.remove('showing'));
        })
    }

    callModal.notif = notif;
    callModal.success = (msg, duration) => successFail(msg, duration, false);
    callModal.fail = (msg, duration) => successFail(msg, duration, true);
    callModal.confirm = confirm;
    callModal.custom = prepearModal;
    callModal.spinner = (func, alt = false) => {
        if (!alt) spinner(func); else spinner2(func);
    };
    callModal.image = image;
    callModal.photoVeiwer = photoVeiwer;
    callModal.guide = guide;
    window.callModal = callModal;
})();