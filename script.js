const itemInput = document.querySelector('#item-input');
const itemForm = document.querySelector('#item-form');
const items = document.querySelector('.items');
const filter = document.querySelector('.filter');
const clearBtn = document.querySelector('.btn-clear');
const filterInput = document.querySelector('.form-input-filter');
const button = document.querySelector('.btn');
let editMode = false;

function onAddItem(e) {
    e.preventDefault();
    const inputValue = itemInput.value;
    if (inputValue === '') {
        alert('Enter an item');
        return;
    }
    // some actions actualize by checking if it is in edit mode
    if(editMode){
        const li = document.querySelectorAll('li');
        li.forEach(item => {
            if(item.firstElementChild.classList.contains('edit-color')){
                const d_class = item.firstElementChild.getAttributeNode('class');
                item.firstElementChild.removeAttributeNode(d_class);
                removeItem(item);
            }
        });
        editMode = false;
    } else {
        if(preventDuplicate(inputValue)){
            alert('Enter different value');
            return;
        }
    }
    //add items to DOM
    addItemsDOM(inputValue);
    //add items to localStorage
    addItemToLocalStorage(inputValue);
    checkUI();
    itemInput.value = '';
}

// This method is used to add items to DOM.
function addItemsDOM(item) {
    const li = document.createElement('li');
    li.appendChild(createP(item));
    li.appendChild(createButton('remove-item btn-link text-red'));
    items.appendChild(li);
}

// This method is used to add items to local storage.
function addItemToLocalStorage(item) {
    const itemsFromStorage = localStorageArray();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Local storage provide items to DOM when the page is reloaded.
function displayFromLocalStorage() {
    const itemsFromStorage = localStorageArray();
    itemsFromStorage.forEach(item => {
        if (itemsFromStorage.length !== 0) {
            addItemsDOM(item);
        }
    })
}

// This method remove an specific item from local storage since removeItem() method is called.
function removeFromLocalStorage(item) {
    const itemName = item.firstElementChild.textContent;
    const itemsFromStorage = localStorageArray();
    itemsFromStorage.map((element, index) => {
        if (element === itemName) {
            itemsFromStorage.splice(index, 1);
        }
    });
    if (itemsFromStorage.length === 0) {
        localStorage.clear();
        return;
    }
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeAllFromLocalStorage() {
    localStorage.clear();
}

// This method converts local storage items to array of this items to carry out transactions in a specific item 
function localStorageArray() {
    let itemsFromLocalStorage;
    if (Object.keys(localStorage).length === 0) {
        itemsFromLocalStorage = [];
    } else {
        itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromLocalStorage;
}

// This method is used to create paragraph element.
function createP(item) {
    const p = document.createElement('p');
    const text = document.createTextNode(item);
    p.appendChild(text);
    return p;
}

// This method is used to create button element.This method takes attributes to make changes in its own button element by giving class attributes to this element.
function createButton(attr) {
    const button = document.createElement('button');
    createArrayAttr(attr).forEach(item => {
        button.classList.add(item);
    });
    button.appendChild(createIcon('fa-solid fa-pen-to-square edit-mode'));
    button.appendChild(createIcon('fa-solid fa-xmark'));
    return button;
}

// This method is used to create icon element.
function createIcon(attr) {
    const i = document.createElement('i');
    createArrayAttr(attr).forEach(item => {
        i.classList.add(item);
    });
    return i;
}

function createArrayAttr(attr) {
    return attr.split(' ');
}

// This method triggers some events by depending on where it has been clicked. If you clicked remove button in a specific item, that item's li tag is going to be parameter for removeItem() function.  
function onClick(e) {
    if (e.target.classList.contains('edit-mode')) {
        editItems(e.target.parentElement.parentElement);
    } else if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
}

// This method is used to edit items which has already been added to the list.
function editItems(item) {
    editMode = true;
    items.querySelectorAll('li').forEach(element => {
        if(element.firstElementChild.classList.contains('edit-color')){
            const d_class = element.firstElementChild.getAttributeNode('class');
            element.firstElementChild.removeAttributeNode(d_class);
        }
    });
    item.firstElementChild.classList.add('edit-color');
    button.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    button.style.backgroundColor = 'green';
    itemInput.value = item.firstElementChild.textContent;
}

// This method is used to remove specific item from the list and local storage. 
function removeItem(item) {
    items.removeChild(item);
    removeFromLocalStorage(item);
    checkUI();
}

// This method is used to remove all items from the list and local storage.
function removeAll() {
    while (items.firstChild) {
        items.firstChild.remove();
    }
    removeAllFromLocalStorage();
    checkUI();
}

// This method is used to control the list.
function checkUI() {
    itemInput.value === '';

    const li = document.querySelectorAll('li');
    if (li.length === 0) {
        filter.style.display = 'none';
        clearBtn.style.display = 'none';
    } else {
        filter.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    button.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    button.style.backgroundColor = '#333';
    editMode = false;
}

// Filter items in the list
function onFilter() {
    const filterValue = filterInput.value.toLowerCase();
    const li = document.querySelectorAll('li');
    li.forEach(item => {
        const itemName = item.firstElementChild.textContent.toLowerCase();
        if (itemName.indexOf(filterValue) === -1) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    });
}

// This method is used to prevent same items from being typed multiple times to the list
function preventDuplicate(item){
    const itemsFromLocalStorage = localStorageArray();
    for(let i = 0 ; i < itemsFromLocalStorage.length ; i++){
        if(itemsFromLocalStorage[i].toLowerCase() === item.toLowerCase()){
            return true;
        }
    }
    return false;
}

function init() {
    itemForm.addEventListener('submit', onAddItem);
    items.addEventListener('click', onClick);
    clearBtn.addEventListener('click', removeAll);
    filterInput.addEventListener('input', onFilter);
    document.addEventListener('DOMContentLoaded', displayFromLocalStorage);
}
init();
