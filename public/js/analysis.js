// analysis.js - functions specific to analysis-dashboard.html

// These functions assume that teamConfigs is exposed globally

// Global variables for this page:

let currentTeam = '';

let currentFile = null;

let currentCircle = '';

// Called when team is selected

function handleTeamChange() {

  currentTeam = document.getElementById('teamSelect').value;

  if (!currentTeam) {

    showToast('Please select a team');

    return;

  }

  showToast(`Selected ${currentTeam} team`);

}

// Called when circle is changed (optional filtering)

function handleCircleChange() {

  currentCircle = document.getElementById('circleSelect').value;

  showToast(currentCircle ? `Filtered by ${currentCircle} circle` : 'Showing all circles');

}

// File input change event: show password modal

document.getElementById('fileInput').addEventListener('change', function(e) {

  if (!currentTeam) {

    showToast('Please select a team first');

    return;

  }

  const file = e.target.files[0];

  if (!file) return;

  currentFile = file;

  document.getElementById('passwordModal').style.display = 'block';

});

// Validate password and then process file & upload

function validatePassword() {

  const password = document.getElementById('passwordInput').value;

  const teamConfig = window.teamConfigs[currentTeam];

  if (password === teamConfig.password) {

    document.getElementById('passwordModal').style.display = 'none';

    processFile(currentFile);

    uploadFileToS3(currentFile);

    document.getElementById('passwordInput').value = '';

  } else {

    showToast('Invalid password');

  }

}

// Upload file to S3 via backend

async function uploadFileToS3(file) {

  const formData = new FormData();

  formData.append('file', file);

  try {

    const response = await fetch('/api/upload-file', { method: 'POST', body: formData });

    if (!response.ok) throw new Error('Upload failed');

    const result = await response.json();

    showToast('File uploaded to S3 successfully');

    // Save file info in localStorage for My Files page

    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');

    const fileInfo = { name: file.name, url: result.fileUrl, timestamp: Date.now() };

    uploadedFiles.push(fileInfo);

    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

  } catch (err) {

    console.error('Error uploading file:', err);

    showToast('Error uploading file to S3');

  }

}

// Process file locally using FileReader

function processFile(file) {

  const reader = new FileReader();

  reader.onload = function(e) {

    try {

      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, { type: 'array' });

      console.log("Processed file. Sheets found:", workbook.SheetNames);

      showToast('File processed successfully');

      // Optionally, extract data from workbook and call displayAnalysis(extractedData)

    } catch (error) {

      console.error("Error processing file:", error);

      showToast('Error processing file');

    }

  };

  reader.onerror = function() { showToast('Error reading file'); };

  reader.readAsArrayBuffer(file);

}

// Download template from backend

async function downloadTeamTemplate() {

  const team = document.getElementById("teamSelect").value;

  if (!team) { showToast("Please select a team first"); return; }

  try {

    const response = await fetch(`/api/generate-template/${team}`);

    if (!response.ok) throw new Error('Template generation failed');

    const blob = await response.blob();

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${team}_template.xlsx`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    showToast("Template downloaded successfully");

  } catch (error) {

    console.error("Error downloading template:", error);

    showToast("Error downloading template");

  }

}
