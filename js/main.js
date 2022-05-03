/* ссылки на все строки изначальной таблицы */
let allBodyRows;
/* ссылки на все строки отфильтрованной таблицы */
let allFilteredRows;

let save_json;

class Table {
    constructor(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    /**
     * Отображение таблицы
     */
    show() {
        document.getElementById("tab").style.display = "block";
    }

    /**
     * Создание таблицы на основе имеющихся данных
     * @param {JSON} json - данные файла
     */
    createTable(json) {
        this.show();
        document.getElementById("tab").append(document.createElement('tbody'));
        let tbody = document.getElementsByTagName("tbody")[0];
        for (let key in json) {
            //создание массива фраз
            //let memoArr = [];
            //for (let k in json[key]) {
            //    memoArr[k] = json[key].properties.memo[k];
           // }
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${json[key].properties.gid}</td>
		<td>${json[key].properties.name}</td>
             <td>${json[key].properties.fugitive_status}</td>
             <td>${json[key].properties.general_info}</td>
	     <td>${json[key].properties.entry_doc}</td>
             <td>${json[key].properties.reg_doc}</td>
             <td>${json[key].properties.transport}</td>
             <td>${json[key].properties.housing}</td>
	     <td>${json[key].properties.nutrition}</td>
		<td>${json[key].properties.pets}</td>
		<td>${json[key].properties.charity}</td>
		<td>${json[key].properties.add_info}</td>`;
            //обработчик нажатия
            tr.onclick = function() {
                //let arr = tr.children.item(4).innerHTML.split('<br>');
		
                let modal = new Modal(tr,key);
                modal.open(tr.children.item(0).innerHTML,tr.children.item(1).innerHTML, tr.children.item(2).innerHTML, tr.children.item(3).innerHTML, tr.children.item(4).innerHTML, tr.children.item(5).innerHTML, 						tr.children.item(6).innerHTML, tr.children.item(7).innerHTML, tr.children.item(8).innerHTML, tr.children.item(9).innerHTML, tr.children.item(10).innerHTML, tr.children.item(11).innerHTML);
                document.getElementById("edit_ok").onclick = modal.saveChanges.bind(modal);
            };
            tbody.append(tr);
        }
        let copied = [];
        for (let i = 0; i < document.getElementById("tab").tBodies[0].children.length; i++) {
            copied.push(document.getElementById("tab").tBodies[0].children.item(i));
        }
        //понадобятся при фильтрации и поиске по таблице (чтоб искать по всем страницам таблицы, а не по текущей)
        allBodyRows = copied;
        allFilteredRows = copied;
    }
}

/**
 * Выполнение создания таблицы с постраничным выводом
 */
   async function makeTable(json) {
       //не создавать, если уже есть
    if (document.getElementsByTagName("tbody")[0]) return;
    //let response = await fetch('tableData.json');
    //let json =  await response.json();
    let table = new Table(json);
    table.createTable(table.data);

    Pager(document.getElementById("tab"), 10);
}

/**
 * Поиск по таблице с выделением ячейки, содержащей найденное слово
 */
function findByWord() {
    let table = document.getElementById("tab");
    let enteredWord = document.getElementById("search").value;
    if (enteredWord.trim() === '') {
        return;
    }
    //очистка текущей таблицы (страницы) и создание полной таблицы
    while (table.tBodies[0].firstChild) {
        table.tBodies[0].removeChild(table.tBodies[0].firstChild);
    }
    for (let i = 0; i < allFilteredRows.length; i++) {
        table.tBodies[0].appendChild(allFilteredRows[i]);
    }
    let reg = new RegExp(enteredWord, 'i');
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = reg.test(table.rows[i].cells[j].innerHTML);
            if (flag) {
                table.rows[i].cells[j].style.backgroundColor = "yellow";
            } else {
                table.rows[i].cells[j].style.backgroundColor = "white";
            }
        }
    }
    Pager(document.getElementById("tab"), 10);
}

/**
 * Скрытие колонки таблицы
 * @param {Number} colNum - номер колонки, которую нужно скрыть
 * @param {HTMLElement} table - таблица
 */
function setColumnInvisible(colNum, table) {
    let rowCells = table.rows[0].getElementsByTagName("th");
    rowCells[colNum].style.display = "none";
    for (let i = 1; i < table.rows.length - 1; i++) {
        rowCells = table.rows[i].getElementsByTagName("td");
        rowCells[colNum].style.display = "none";
    }
}

/**
 * Показ колонки таблицы
 * @param {Number} colNum - номер колонки, которую нужно отобразить
 * @param {HTMLElement} table - таблица
 */
function setColumnVisible(colNum, table) {
    let rowCells = table.rows[0].getElementsByTagName("th");
    rowCells[colNum].style.display = "";
    for (let i = 1; i < table.rows.length - 1; i++) {
        rowCells = table.rows[i].getElementsByTagName("td");
        rowCells[colNum].style.display = "";
    }
}

/**
 * Настройка видимости колонок таблицы
 */
function setAllColumnsVisibility() {
    let table = document.getElementById("tab");
    if (!document.getElementById("name").checked) {
        setColumnInvisible(1, table);
    } else {
        setColumnVisible(1, table);
    }
    if (!document.getElementById("status").checked) {
        setColumnInvisible(2, table);
    } else {
        setColumnVisible(2, table);
    }
    if (!document.getElementById("general_info").checked) {
       setColumnInvisible(3, table);
    } else {
        setColumnVisible(3, table);
    }
   if (!document.getElementById("entry_doc").checked) {
       setColumnInvisible(4, table);
    } else {
        setColumnVisible(4, table);
    }
    if (!document.getElementById("reg_doc").checked) {
        setColumnInvisible(5, table);
    } else {
        setColumnVisible(5, table);
    }
    if (!document.getElementById("transport").checked) {
        setColumnInvisible(6, table);
    } else {
        setColumnVisible(6, table);
    }
    if (!document.getElementById("housing").checked) {
        setColumnInvisible(7, table);
    } else {
        setColumnVisible(7, table);
    }
if (!document.getElementById("nutrition").checked) {
        setColumnInvisible(8, table);
    } else {
        setColumnVisible(8, table);
    }
if (!document.getElementById("pets").checked) {
        setColumnInvisible(9, table);
    } else {
        setColumnVisible(9, table);
    }
if (!document.getElementById("charity").checked) {
        setColumnInvisible(10, table);
    } else {
        setColumnVisible(10, table);
    }
if (!document.getElementById("add_info").checked) {
        setColumnInvisible(11, table);
    } else {
        setColumnVisible(11, table);
    }
}

class Modal {
    constructor(row, id) {
        this._tableRow = row;
	this._id = id;
    }

    get tableRow() {
        return this._tableRow;
    }


    open(id, name, first, general_info, entry_doc, reg_doc, transport, housing, nutrition, pets, charity, add_info) {
        document.getElementById("modal").style.display = "block";
	document.getElementById("edit_id").textContent = id;
	document.getElementById("edit_name").value = name;
        document.getElementById("edit_status").value = first;
        document.getElementById("edit_general_info").value = general_info;
	document.getElementById("edit_entry_doc").value = entry_doc;
        document.getElementById("edit_reg_doc").value = reg_doc;
        document.getElementById("edit_transport").value = transport;
	document.getElementById("edit_housing").value = housing;
	document.getElementById("edit_nutrition").value = nutrition;
	document.getElementById("edit_pets").value = pets;
	document.getElementById("edit_charity").value = charity;
	document.getElementById("edit_add_info").value = add_info;

    }


    saveChanges() {
        let id = document.getElementById("edit_id").textContent;
	let name = document.getElementById("edit_name").value;
	let status = document.getElementById("edit_status").value;
        let general_info = document.getElementById("edit_general_info").value;
        let reg_doc = document.getElementById("edit_reg_doc").value;
        let transport = document.getElementById("edit_transport").value;
	let entry_doc = document.getElementById("edit_entry_doc").value;
	let housing = document.getElementById("edit_housing").value;
	let nutrition = document.getElementById("edit_nutrition").value;
	let pets = document.getElementById("edit_pets").value;
	let charity = document.getElementById("edit_charity").value;
	let add_info = document.getElementById("edit_add_info").value;
	
	json_Territories_2.features[this._id].properties.name = name;
	json_Territories_2.features[this._id].properties.fugitive_status = status;
        json_Territories_2.features[this._id].properties.general_info = general_info;
	json_Territories_2.features[this._id].properties.entry_doc = entry_doc;
        json_Territories_2.features[this._id].properties.reg_doc = reg_doc;
        json_Territories_2.features[this._id].properties.transport = transport;
        json_Territories_2.features[this._id].properties.housing = housing;
	json_Territories_2.features[this._id].properties.nutrition = nutrition;
	json_Territories_2.features[this._id].properties.pets = pets;
	json_Territories_2.features[this._id].properties.charity = charity;
	json_Territories_2.features[this._id].properties.add_info = add_info;

	this.tableRow.cells[1].innerHTML = name;
        this.tableRow.cells[2].innerHTML = status;
        this.tableRow.cells[3].innerHTML = general_info;
	this.tableRow.cells[4].innerHTML = entry_doc;
        this.tableRow.cells[5].innerHTML = reg_doc;
        this.tableRow.cells[6].innerHTML = transport;
	this.tableRow.cells[7].innerHTML = housing;
	this.tableRow.cells[8].innerHTML = nutrition;
	this.tableRow.cells[9].innerHTML = pets;
	this.tableRow.cells[10].innerHTML = charity;
	this.tableRow.cells[11].innerHTML = add_info;


        closeModal();
    }
}


function saveAllChanges(){

	
	//showFilters();
	document.getElementById("modal2").style.display = "block";	
	
	//document.getElementById("edit_save_info").value = table.rows.length;

	var text = "var json_Territories_2 = " + JSON.stringify(json_Territories_2);

	document.getElementById("href_file").setAttribute('href',  "data:text/plain;charset=utf-8,%EF%BB%BF" + encodeURIComponent(text) );
	document.getElementById("href_file").setAttribute('download',"Territories_2.js");
	

	/*document.getElementById("ul_buttons").write(
    		'<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(text) + '" download="Territories_2.js">Territories_2.js</a>'
	);
	*/

	
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
	document.getElementById("modal2").style.display = "none";
}

class Filter {
     constructor(filtersArr) {
         this._filters = filtersArr;
     }
     get filters() {
         return this._filters;
     }


     doFiltration() {
         let table = document.getElementById("tab");
         //очистка текущей таблицы (страницы) и создание полной таблицы
         while (table.tBodies[0].firstChild) {
             table.tBodies[0].removeChild(table.tBodies[0].firstChild);
         }
         for (let i = 0; i < allBodyRows.length; i++) {
             table.tBodies[0].appendChild(allBodyRows[i]);
         }
         //массив flag содержит номера столбцов, по которым нужно отфильтровать таблицу
         let flag = [];
         let index = 0;
         for (let i = 0; i < this.filters.length; i++) {
             if (this.filters[i].length !== 0) {
                     flag[index] = i;
                     index++;
             }
         }
        if (flag.length == 0) return;
         let rowsToDelete = [];
         for (let i = 1; i < allBodyRows.length + 1; i++) {
             for (let j = 0; j < flag.length; j++) {
                 if (flag[j] == this.filters.length - 1) {
                     //проверка равенства ключевых фраз
                     let filteredMemo = this.filters[flag[j]];
                     
                     if (!checkMemoEquality(table.rows[i],filteredMemo)) {
                         rowsToDelete.push(table.rows[i]);
                         break;
                     }
                 } else {
                     //проверка всех ячеек, кроме ключевых фраз
                 if (this.filters[flag[j]] !== table.rows[i].cells[flag[j]].innerHTML) {
                     rowsToDelete.push(table.rows[i]);
                     break;
                 } }
             }
         }
         //удаление неподходящих строк
         for (let k = 0; k < rowsToDelete.length; k++) {
             rowsToDelete[k].remove();
         }
         //сохранение табличных строк после фильтрации, используется при поиске по таблице
         let copied = [];
         for (let i = 0; i < document.getElementById("tab").tBodies[0].children.length; i++) {
             copied.push(document.getElementById("tab").tBodies[0].children.item(i));
         }
         allFilteredRows = copied;
     }
}


function makeFilter() {


    // Создание объекта фильтра
    let filter = new Filter([
	document.getElementById("fltr_id").value.trim(), 
	document.getElementById("fltr_name").value.trim(),
        document.getElementById("fltr_status").value.trim(),
        document.getElementById("fltr_memo").value.trim()]
    );
    //фильтрация
    filter.doFiltration();
    //постраничный вывод результатов
    Pager(document.getElementById("tab"), 10);
}

/**
 * Проверка эквивалентности введенных пользователем ключевых фраз и фраз из строки таблицы
 * @param {Array} filteredMemo - массив фраз из панели фильров
 * @param {Array} tableMemo - массив фраз в строке таблицы
 * @returns {Boolean}
 */
function checkMemoEquality(tableRow, text) {
    
    let reg = new RegExp(text, 'i');
    let flag = false;
        for (let k = 3; k < tableRow.cells.length; k++) {

 	    let flagg = reg.test( tableRow.cells[k].innerHTML );
            if (flagg) {
                tableRow.cells[k].style.backgroundColor = "yellow";
		flag = true;
            } else {
                tableRow.cells[k].style.backgroundColor = "white";
            }
		
          }       
    return flag;
}

let Pager = (function() {

    /**
     * Создание постраничной навигации таблицы
     * @param {HTMLTableElement} docTable - ссылка на таблицу
     * @param {number} numRowsOnPage - число строк на каждой странице
     */
    return function (docTable, numRowsOnPage) {
        let table = docTable;
        let config = {
            linkOnPage: 3,
            template: "<span class='summary'>Страница: %p из %c всего %r</span><ul class='page-nav'>%n</ul>",
            onNavClick: undefined
        };
        let navigationContainer = table.tFoot.rows[0].cells[0];
        let currentPage = 0,
            allRowsLinks = copyRows(table.tBodies[0].children);
        let numPages = Math.ceil(allRowsLinks.length / numRowsOnPage),
            linksSet = createPager(numPages, config.linkOnPage);

        renderTableState(currentPage, numRowsOnPage);

        /**
         * Сохранить копию строк в виде массива
         * @param {HTMLCollection} rows
         * @returns {Array}
         */
        function copyRows(rows) {
            let copied = [];
            for (let i = 0; i < rows.length; i++) {
                copied.push(rows.item(i));
            }
            return copied;
        }

        /**
         * Отобразить подмножество ссылок
         * @param {Number} curPage - номер текущей страницы
         */
        function renderLinks(curPage) {
            let currentLinkArrNum = Math.floor(curPage / config.linkOnPage);
            let pager = "<li class='pager' id=\"0\">В начало</li>",
                setKey = 0;
            if (currentLinkArrNum > 0) {
                pager += "<li class='pager' id=\"" + (linksSet[currentLinkArrNum][0] - 1) + "\">вернуться</li>";
            }
            for (let i = 0; i < linksSet[currentLinkArrNum].length; i++) {
                setKey = linksSet[currentLinkArrNum][i]; //отдельный эл-т массива
                pager += "<li class='pager' id=\"" + setKey + "\"" + (setKey === curPage ? " class=\"current\"" : "") + ">" + (setKey + 1) + "</li>";
            }
            if (currentLinkArrNum < linksSet.length - 1) {
                pager += "<li class='pager' id=\"" + (linksSet[currentLinkArrNum + 1][0]) + "\">далее</li>";
            }
            pager += "<li class='pager' id=\"" + (numPages - 1) + "\">В конец</li>";
            navigationContainer.innerHTML = config.template.replace(/%n/g, pager).
            replace(/%p/g, String(curPage+1)).
            replace(/%r/g, String(allRowsLinks.length)).
            replace(/%c/g, numPages);
        }

        /**
         * Отобразить заданную часть таблицы.
         * @param {Number} curPage - номер первой строки
         * @param {Number} rowsNumPerPage - количество строк для отображения
         */
        function renderTableState(curPage, rowsNumPerPage) {
            let firstRowOnCurPage = curPage * rowsNumPerPage,
                lastRowOnCurPage = Math.min(allRowsLinks.length, firstRowOnCurPage + rowsNumPerPage);
            while (table.tBodies[0].firstChild) {
                table.tBodies[0].removeChild(table.tBodies[0].firstChild);
            }
            for (let i = firstRowOnCurPage; i < lastRowOnCurPage; i++) {
               table.tBodies[0].appendChild(allRowsLinks[i]);
            }
            renderLinks(currentPage);
        }

        /**
         * Создание множеств ссылок
         * @param {Number} numOfPages - количество страниц
         * @param {Number} linksEveryPage - число ссылок на одной странице
         * @returns {Array}
         */
        function createPager(numOfPages, linksEveryPage) {

            let linksSet = [];
            let key;
            for (let i = 0; i < numOfPages; i++) {
                key = Math.floor(i / linksEveryPage); //определяем номер подмассива
                if (linksSet[key] === undefined) {
                    linksSet[key] = [];
                }
                linksSet[key].push(i);
            }
            return linksSet;
        }

        // Обработчик нажатий
        navigationContainer.onclick = function(e) {
            let target = e.target;
            let start = 0;

            if (target.tagName.toLowerCase() === "li" && isNaN(parseInt(target.id, 10)) === false) {
                start = parseInt(target.id, 10);
                if ((config.onNavClick && !config.onNavClick(start)) ^ start !== currentPage) {
                    currentPage = start;
                    renderTableState(start, numRowsOnPage);
                }
            }
        };
    };
}(this));

/**
 * Показ панели фильтров
 */
function showFilters() {
    if (document.getElementsByClassName("filters_panel")[0].style.display == "none") {
        document.getElementsByClassName("filters_panel")[0].style.display = "block";
    } else {
        document.getElementsByClassName("filters_panel")[0].style.display = "none";
    }
}