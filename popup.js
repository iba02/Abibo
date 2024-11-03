document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const environment = document.getElementById('environment').value;
  const group = document.getElementById('group').value;

  const credentials = { username, password, environment, group };

  chrome.storage.sync.get({ credentialsList: [] }, function(data) {
    const credentialsList = data.credentialsList;
    credentialsList.push(credentials);
    chrome.storage.sync.set({ credentialsList }, () => {
      console.log('Credentials saved');
      displayCredentials();
    });
  });
});

function displayCredentials() {
  chrome.storage.sync.get({ credentialsList: [] }, function(data) {
    const credentialsList = data.credentialsList;
    const credentialsListDiv = document.getElementById('credentialsList');
    credentialsListDiv.innerHTML = '';

    credentialsList.forEach((cred, index) => {
      const credDiv = document.createElement('div');
      credDiv.className = 'credential';
      credDiv.innerHTML = `
        <p><strong>Username:</strong> ${cred.username}</p>
        <p><strong>Environment:</strong> ${cred.environment}</p>
        <p><strong>Group:</strong> ${cred.group}</p>
        <button onclick="editCredential(${index})">Edit</button>
        <button onclick="deleteCredential(${index})">Delete</button>
        <button onclick="openInIncognito('${cred.username}', '${cred.password}', '${cred.environment}')">Open in Incognito</button>
      `;
      credentialsListDiv.appendChild(credDiv);
    });
  });
}

function editCredential(index) {
  chrome.storage.sync.get({ credentialsList: [] }, function(data) {
    const credentialsList = data.credentialsList;
    const cred = credentialsList[index];
    document.getElementById('username').value = cred.username;
    document.getElementById('password').value = cred.password;
    document.getElementById('environment').value = cred.environment;
    document.getElementById('group').value = cred.group;

    credentialsList.splice(index, 1);
    chrome.storage.sync.set({ credentialsList }, displayCredentials);
  });
}

function deleteCredential(index) {
  chrome.storage.sync.get({ credentialsList: [] }, function(data) {
    const credentialsList = data.credentialsList;
    credentialsList.splice(index, 1);
    chrome.storage.sync.set({ credentialsList }, displayCredentials);
  });
}

function openInIncognito(username, password, environment) {
  const url = environment === 'production' ? 'https://login.salesforce.com' : 'https://test.salesforce.com';
  chrome.windows.create({
    url: url,
    incognito: true
  }, function(window) {
    // You can add further logic to handle login in the new incognito window
  });
}

document.addEventListener('DOMContentLoaded', displayCredentials);
