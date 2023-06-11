//respond to visibility
function respondToVisibility(queryOrElement, callback, { once = true, offset = 0, root = null } = {}) {

    switch (typeof queryOrElement) {
        case 'string':
            document.querySelectorAll(queryOrElement).forEach(ele => observeElement(ele));
            break;
        case 'object':
            if (queryOrElement.nodeName) {
                observeElement(queryOrElement);
                break;
            }
            if (queryOrElement[0]?.nodeName) {
                queryOrElement.forEach(el => observeElement(el));
                break;
            }
        default:
            throw new Error('please pass an html element or a valid query string to "respondToVisibility" funtion');
    }

    function observeElement(element) {
        let options = {
            root: root,
            rootMargin: `${offset}px 0px`
        }

        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(element);
                    once && observer.disconnect();
                }
            });
        }, options);

        observer.observe(element);
    }
}