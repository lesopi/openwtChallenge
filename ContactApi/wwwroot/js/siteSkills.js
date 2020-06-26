const uri = 'api/Skill';
const contactUri = 'api/Contact/';
const contactAndSkillUri = 'api/ContactAndSkill/';
let skills = [];
let contactSkillDict = {};

function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const nameTextbox = document.getElementById('add-name');
    const levelTextBox = document.getElementById('add-level');
    const item = {
      name: nameTextbox.value.trim(),
      level: levelTextBox.value.trim()
    };
  
    fetch(uri, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json())
      .then(() => {
        getItems();
        nameTextbox.value = '';
        levelTextBox.value = '';
      })
      .catch(error => console.error('Unable to add item.', error));
  }
  

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => fetch(`${contactAndSkillUri}deleteSkill/${id}`, {
    method: 'DELETE'
  }).then(() => getItems())
    .catch(error => console.error('Unable to delete item.', error)))
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = skills.find(item => item.id === id);
    
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-level').value = item.level;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('editForm').style.display = 'block';
  }

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name').value.trim(),
        level: document.getElementById('edit-level').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
    .then(() => getItems())
    .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'skill' : 'skills';
  
    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('skills');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {
    let contactDiv = document.createElement("div");
    contactDiv.id = `contactForSkill${item.id}`;

    getContact(item.id);

    let divModal = document.createElement("div");
    divModal.id = `myModal${item.id}`;
    divModal.className = 'modal';
    divModal.innerHTML = `<div class="modal-content" id="modalContent${item.id}">
        <span class="close" id="close${item.id}">&times;</span>
        <table classs="customTable">
          <tr>
            <th></th>
            <th></th>
          </tr>
          <tbody id="contactTableBody${item.id}"></tbody>
        </table>
      </div>`;

    contactDiv.appendChild(divModal);
    
    let addContactButton = button.cloneNode(false);
    addContactButton.innerText = 'Manage Contacts';
    addContactButton.setAttribute('onclick', `showContactWindow(${item.id})`);

    contactDiv.appendChild(addContactButton);

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

    let tr = tBody.insertRow();

    let htmlText = `
    <div class="contactName">
        <h4>${item.name}</h4>
        <p>(Level: ${item.level})</p>
    </div>`;

    let td0 = tr.insertCell(0);

    td0.innerHTML = htmlText

    let td1 = tr.insertCell(1);
    td1.appendChild(contactDiv);

    let td2 = tr.insertCell(2);
    td2.appendChild(editButton);

    let td3 = tr.insertCell(3);
    td3.appendChild(deleteButton);
  });

  skills = data;
}

function getContact(id) {
  let fullUri = contactAndSkillUri + `fromSkill/${id}`;
  fetch(fullUri)
    .then(response => response.json())
    .then((data) => {
        contactSkillDict[id] = data;
        displayContacts(id, data);
    })
    .catch(error => console.log('No contact for this skill'));
}

function displayContacts(skillId, data) {
  let contactDiv = document.getElementById(`contactForSkill${skillId}`);
    data.forEach(item => {
      let fullUri = contactUri + `${item.contactId}`;
      fetch(fullUri)
        .then(response => response.json())
        .then((data) => {
          let text = `${data.firstName} ${data.lastName}`;
          contactDiv.innerHTML = contactDiv.innerHTML + '<br>' + text;
        })
        .catch(error => console.error('Unable to load contacts.', error));
    })
}

function showContactWindow(skillId) {
  var modal = document.getElementById(`myModal${skillId}`);
  modal.style.display = "block";

  let tableBody = document.getElementById(`contactTableBody${skillId}`);
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      tableBody.innerHTML = null;
      getItems();
    }
  }
  
  var span = document.getElementById(`close${skillId}`);
  span.onclick = function() {
    modal.style.display = "none";
    tableBody.innerHTML = null;
    getItems();
  }
  
  fetch(contactUri)
    .then(response => response.json())
    .then((data) => {
      data.forEach(item => {
        let tr = tableBody.insertRow();

        let td0 = tr.insertCell(0);
        td0.innerHTML = `${item.firstName} ${item.lastName}`;

        let alreadyHave = (skillId in contactSkillDict)? contactSkillDict[skillId].map(x => x.contactId) : [];
        let addButton = document.createElement("button");
        if(alreadyHave.includes(item.id)) {
          addButton.innerText = 'Remove';
          addButton.style.color = 'red';
          let contactAndSkillItem = contactSkillDict[skillId].find(x => x.contactId == item.id)
          addButton.setAttribute('onclick', `removeContactFromSkill(${contactAndSkillItem.id}, event)`);
        } else {
          addButton.innerText = 'Add';
          addButton.style.color = 'green';
          addButton.setAttribute('onclick', `addContactToSkill(${skillId}, ${item.id}, event)`);
        }
        
        let td1 = tr.insertCell(1);
        td1.appendChild(addButton);
      })
    })
    .catch(error => console.error('Unable to load contacts.', error));
}

function addContactToSkill(skillId, contactId, event) {
  const item = {
    contactId: contactId,
    skillId: skillId
  }
  fetch(contactAndSkillUri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
        event.target.style.display = "none";
    })
    .catch(error => console.error('Unable to add item.', error));
}

function removeContactFromSkill(contactAndSkillId, event) {
    fetch(contactAndSkillUri + contactAndSkillId, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        event.target.style.display = "none";
      })
      .catch(error => console.error('Unable to add item.', error));
  }
