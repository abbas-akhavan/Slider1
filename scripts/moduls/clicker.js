//* CLICKER
function refreshOnClicks() {
    //onClick
    let clicker = dc.queries("[data-onClick]");

    clicker.forEach(item => {
        if (item.clickEvent) return
        item.clickEvent = true;

        if (item.getAttribute('data-group')) {

            item.addEventListener("click", () => {
                dc.queries(`[data-group=${item.getAttribute('data-group')}`).forEach(item => {
                    item.classList.remove(item.getAttribute("data-onClick"));
                })
                item.classList.toggle(item.getAttribute("data-onClick"));
            });

        } else {

            item.addEventListener("click", () => {
                item.classList.toggle(item.getAttribute("data-onClick"));
            });

        }
    })

    //* Target system (grouped and single)
    let targeter = document.querySelectorAll('[data-target]');
    targeter.forEach(i => {
        if (i.targetEvent) return
        i.targetEvent = true;

        let targetValue = i.dataset.targetvalue || "active";
        let targetSelector = document.querySelectorAll(i.dataset.target);
        if (!targetSelector.length) return
        targetSelector.forEach(target => {


            if (target.dataset.group) {

                i.addEventListener("click", () => {
                    document.querySelectorAll(`[data-group=${target.dataset.group}]`).forEach(item => {
                        item.classList.remove(targetValue);
                    });
                    target.classList.add(targetValue);
                });

            } else {

                i.addEventListener("click", () => {
                    target.classList.toggle(targetValue);
                });

            }
        })
    });
}
$(refreshOnClicks)