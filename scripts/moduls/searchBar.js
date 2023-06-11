//search Bar
$(() => {
    let search = document.getElementById('search');
    if (search) {
        let input = search.querySelector('input');
        let searchContent = search.querySelector('ul');
        let magnifire = search.querySelector('i');
        let currentSearch, searchResult;

        input.onkeyup = inputTypeHandler;
        magnifire.onclick = () => searchFor(input.value);

        let timeout;
        function inputTypeHandler(e) {
            clearTimeout(timeout);
            if (e.target.value.length > 2 && e.target.value !== currentSearch) {
                timeout = setTimeout(() => {
                    asyncSearchFor(e.target.value).then(showSearchResult)
                }, 500);
            }

            if (e.key === "Enter") {
                searchFor(e.target.value)
            }
        }
        function searchFor(text) {
            if (!text) return
            if (searchResult) {
                if (searchResult.searchText === text) {
                    let activeCategories = searchResult.map(i => i.Type);
                    setLocalStorage(activeCategories, activeCategories[0], searchResult.searchText);
                    location.href = '/search';
                }
            } else {
                setLocalStorage(null, null, text);
                location.href = '/search';
            }
        }
        function asyncSearchFor(text) {
            currentSearch = text;
            search.classList.add('loading');
            return new Promise((resolve, reject) => {
                let data = { searchText: text };
                let url = '/Home/HomeSearch';
                $.get(url, data, function (response) {
                    response.searchText = text;
                    if (currentSearch === text) {
                        resolve(response);
                        search.classList.remove('loading');
                    } else reject();
                })
                //$.ajax({
                //    method: 'Get',
                //    url: '/Home/HomeSearch',
                //    contentType: 'application/json',
                //    data: {},
                //    success: response => {
                //        response.searchText = text;
                //        if (currentSearch === text) {
                //            resolve(response);
                //            search.classList.remove('loading');
                //        } else reject();
                //    }
                //})
            })
        }
        function showSearchResult(object) {
            if (object.length <= 1) return nothingFound(object);
            searchResult = object;
            let fragment = document.createDocumentFragment();
            object.forEach(item => {
                let a = document.createElement('a');
                a.href = item.Href;
                a.innerHTML = `نتایج برای ${item.searchText} در دسته <span>${item.CategoryName}</span>`; /*(${ item.Count })*/
                a.dataset.icon = item.Icon;
                a.dataset.type = item.Type;
                a.onclick = e => {
                    let activeCategories = object.map(i => i.Type);
                    setLocalStorage(activeCategories, item.Type, item.searchText)
                }

                fragment.appendChild(a);
            })
            addOrReplaceChildern(searchContent, fragment)
        }
        function nothingFound(object, isEmpty) {
            let span = document.createElement('span');
            span.innerText = `متاسفانه نتیجه ای برای ${object.searchText} یافت نشد! :/`;
            searchContent.replaceChildren(span);
        }
        function addOrReplaceChildern(element, child) {
            if (element.childElementCount > 0) element.replaceChildren(child)
            else element.appendChild(child)
        }
        function setLocalStorage(activeCategories, type, text) {
            localStorage.setItem("activeCategories", activeCategories);
            localStorage.setItem("type", type);
            localStorage.setItem("searchText", text);
        }
    }
})
