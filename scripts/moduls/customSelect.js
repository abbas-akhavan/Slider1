function initCustomSelect(className = 'select') {
    document.querySelectorAll(`.${className}`).forEach(wrapper => {
        if (wrapper.alreadyInit) return

        let tag = document.createElement('span');
        let list = document.createElement('div');
        let options = wrapper.querySelectorAll('option');
        let select = wrapper.querySelector('select');
        if (!select || !options.length) {
            console.log(`there should be a select tag inside <div class="${className}">...</div> for custom select to work.\nskipping this element:`, wrapper);
        } else {

            let active = Object.values(options).find(opt => opt.value === select.value);

            list.classList.add('list');
            wrapper.value = active.value;
            tag.innerText = active.innerHTML;

            options.forEach(option => {
                let span = document.createElement('span');
                span.innerHTML = option.innerHTML;

                span.onclick = _ => {
                    tag.innerHTML = option.innerHTML;
                    wrapper.value = option.value;
                    wrapper.onchange && wrapper.onchange({ target: select });
                    select.value = option.value;
                    select.onchange && select.onchange({ target: select });
                }

                list.appendChild(span);
            })

            wrapper.appendChild(tag);
            wrapper.appendChild(list);

            document.addEventListener("click", e => {
                if (wrapper.contains(e.target))
                    open()
                else
                    close()
            })
            function open() {
                let posY = wrapper.getBoundingClientRect().y;
                let half = (window.innerHeight / 2) - posY; //position relative to the center of the screen
                let remainingBottom = window.innerHeight - posY;
                let padding = 50;

                if (half > 0) {
                    wrapper.style.setProperty('--height', `${remainingBottom - padding}px`);
                    wrapper.classList.add('bottom');
                    wrapper.classList.remove('top');
                } else {
                    wrapper.style.setProperty('--height', `${posY - padding}px`);
                    wrapper.classList.add('top');
                    wrapper.classList.remove('bottom');
                }
                wrapper.classList.toggle('active');
            }

            function close() {
                wrapper.classList.remove('top');
                wrapper.classList.remove('bottom');
                wrapper.classList.remove('active');
            }
        }
        wrapper.alreadyInit = true;
    })
}
initCustomSelect();