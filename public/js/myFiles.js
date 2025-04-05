// myFiles.js - code for my-files.html

function loadFiles() {

  const tableBody = document.getElementById('file-table');

  tableBody.innerHTML = '';

  const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');

  if (!files.length) {

    tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No files uploaded yet.</td></tr>';

    return;

  }

  files.forEach(file => {

    const row = document.createElement('tr');

    const nameCell = document.createElement('td');

    nameCell.textContent = file.name;

    const urlCell = document.createElement('td');

    const link = document.createElement('a');

    link.href = file.url;

    link.textContent = 'Download';

    link.target = '_blank';

    urlCell.appendChild(link);

    const dateCell = document.createElement('td');

    dateCell.textContent = new Date(file.timestamp).toLocaleString();

    row.appendChild(nameCell);

    row.appendChild(urlCell);

    row.appendChild(dateCell);

    tableBody.appendChild(row);

  });

}

function navigateToViewAnalysis() {

  window.location.href = 'analysis-dashboard.html';

}

window.addEventListener('load', loadFiles);
