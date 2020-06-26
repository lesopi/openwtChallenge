const uri = 'api/Contact';
const skillUri = 'api/Skill/';
const contactAndSkillUri = 'api/ContactAndSkill/';
let contacts = [];
let contactSkillDict = {};

function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
  const firstNameTextbox = document.getElementById('add-firstName');
  const lastNameTextBox = document.getElementById('add-lastName');
  const fullNameTextBox = document.getElementById('add-fullName');
  const addressTextBox = document.getElementById('add-address');
  const emailTextBox = document.getElementById('add-email');
  const phoneNumberTextBox = document.getElementById('add-phoneNumber');
  const item = {
    firstName: firstNameTextbox.value.trim(),
    lastName: lastNameTextBox.value.trim(),
    fullName: fullNameTextBox.value.trim(), 
    address: addressTextBox.value.trim(), 
    email: emailTextBox.value.trim(), 
    phoneNumber: phoneNumberTextBox.value.trim()
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
      firstNameTextbox.value = '';
      lastNameTextBox.value  = '';
      fullNameTextBox.value = '';
      addressTextBox.value = '';
      emailTextBox.value = '';
      phoneNumberTextBox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => fetch(`${contactAndSkillUri}deleteContact/${id}`, {
    method: 'DELETE'
  }).then(() => getItems())
    .catch(error => console.error('Unable to delete item.', error)))
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
  const item = contacts.find(item => item.id === id);
  
  document.getElementById('edit-name').value = item.firstName;
  document.getElementById('edit-lastName').value = item.lastName;
  document.getElementById('edit-fullName').value = item.fullName;
  document.getElementById('edit-address').value = item.address;
  document.getElementById('edit-email').value = item.email;
  document.getElementById('edit-phoneNumber').value = item.phoneNumber;
  document.getElementById('edit-id').value = item.id;
  document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
  const itemId = document.getElementById('edit-id').value;
  const item = {
    id: parseInt(itemId, 10),
    firstName: document.getElementById('edit-name').value.trim(),
    lastName: document.getElementById('edit-lastName').value.trim(),
    fullName: document.getElementById('edit-fullName').value.trim(),
    address: document.getElementById('edit-address').value.trim(),
    email: document.getElementById('edit-email').value.trim(),
    phoneNumber: document.getElementById('edit-phoneNumber').value.trim()
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
  const name = (itemCount === 1) ? 'contact' : 'contacts';
  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById('contacts');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(item => {
    let skillDiv = document.createElement("div");
    skillDiv.id = `skillForContact${item.id}`;

    getSkill(item.id);

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
          <tbody id="skillTableBody${item.id}"></tbody>
        </table>
      </div>`;

    skillDiv.appendChild(divModal);
    
    let addSkillButton = button.cloneNode(false);
    addSkillButton.innerText = 'Manage skills';
    addSkillButton.setAttribute('onclick', `showSkillWindow(${item.id})`);

    skillDiv.appendChild(addSkillButton);

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

    let tr = tBody.insertRow();

    let htmlText = `
    <div class="contactName">
        <h4>${item.firstName} ${item.lastName}</h4>
        <p>(${item.fullName})</p>
        <i class="glyphicon glyphicon-globe"> ${item.address} </i>
        <br>
        <i class="glyphicon glyphicon-envelope"> ${item.email} </i>
        <br>
        <i class="glyphicon glyphicon-earphone"> ${item.phoneNumber} </i>
    </div>`;

    let td0 = tr.insertCell(0);

    td0.innerHTML = htmlText

    let td1 = tr.insertCell(1);
    td1.appendChild(skillDiv);

    let td2 = tr.insertCell(2);
    td2.appendChild(editButton);

    let td3 = tr.insertCell(3);
    td3.appendChild(deleteButton);
  });

  contacts = data;
}

function getSkill(id) {
  let fullUri = contactAndSkillUri + `fromContact/${id}`;
  fetch(fullUri)
    .then(response => response.json())
    .then((data) => {
      contactSkillDict[id] = data;
      displaySkills(id, data);
    })
    .catch(error => console.log('No skill for this contact'));
}

function displaySkills(contactId, data) {
  let skillDiv = document.getElementById(`skillForContact${contactId}`);
    data.forEach(item => {
      let fullUri = skillUri + `${item.skillId}`;
      fetch(fullUri)
        .then(response => response.json())
        .then((data) => {
          let text = `${data.name}, ${data.level}`;
          skillDiv.innerHTML = skillDiv.innerHTML + '<br>' + text;
        })
        .catch(error => console.error('Unable to load skills.', error));
    })
}

function showSkillWindow(contactId) {
  var modal = document.getElementById(`myModal${contactId}`);
  modal.style.display = "block";

  let tableBody = document.getElementById(`skillTableBody${contactId}`);
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      tableBody.innerHTML = null;
      getItems();
    }
  }
  
  var span = document.getElementById(`close${contactId}`);
  span.onclick = function() {
    modal.style.display = "none";
    tableBody.innerHTML = null;
    getItems();
  }
  
  fetch(skillUri)
    .then(response => response.json())
    .then((data) => {
      data.forEach(item => {
        let tr = tableBody.insertRow();

        let td0 = tr.insertCell(0);
        td0.innerHTML = `${item.name}, ${item.level}`;
        
        let alreadyHave = (contactId in contactSkillDict)? contactSkillDict[contactId].map(x => x.skillId) : [];
        let addButton = document.createElement("button");
        if(alreadyHave.includes(item.id)) {
          addButton.innerText = 'Remove';
          addButton.style.color = 'red';
          let contactAndSkillItem = contactSkillDict[contactId].find(x => x.skillId == item.id)
          addButton.setAttribute('onclick', `removeSkillFromContact(${contactAndSkillItem.id}, event)`);
        } else {
          addButton.innerText = 'Add';
          addButton.style.color = 'green';
          addButton.setAttribute('onclick', `addSkillToContact(${contactId}, ${item.id}, event)`);
        }
        let td1 = tr.insertCell(1);
        td1.appendChild(addButton);
      })
    })
    .catch(error => console.error('Unable to load skills.', error));
}

function addSkillToContact(contactId, skillId, event) {
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

function removeSkillFromContact(contactAndSkillId, event) {
  fetch(contactAndSkillUri + contactAndSkillId, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(() => {
      event.target.style.display = "none";
    })
    .catch(error => console.error('Unable to add item.', error));
}
