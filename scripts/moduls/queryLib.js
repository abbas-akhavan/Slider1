//*query framework
(function () {
    let dc = {
        query: (e) => {
            return query(document, e);
        },
        queries: (e) => {
            return queries(document, e);
        },
        id: (e) => {
            return getId(document, e);
        }
    }
    function getId(ele, trgt) {
        return querify(ele.getElementById(trgt))
    }
    function query(ele, trgt) {
        return querify(ele.querySelector(trgt))
    }
    function queries(ele, trgt) {
        return querify(ele.querySelectorAll(trgt))
    }

    function querify(ele) {
        if (!ele) return
        ele.query = (e) => query(ele, e);
        ele.queries = (e) => queries(ele, e);
        return ele
    }
    window.dc = dc;
})()