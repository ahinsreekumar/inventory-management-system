console.log('Dashboard.js loaded');
let allAssets = [];

// Load assets on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAssets();
});

function loadAssets() {
    db.collection('assets').orderBy('assetName')
        .onSnapshot((snapshot) => {
            allAssets = [];
            const tableBody = document.getElementById('assetsTableBody');
            tableBody.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const asset = { id: doc.id, ...doc.data() };
                allAssets.push(asset);
                addAssetToTable(asset);
            });
        });
}

function addAssetToTable(asset) {
    const tableBody = document.getElementById('assetsTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${asset.assetName || ''}</td>
        <td>${asset.assetType || ''}</td>
        <td>${asset.location || ''}</td>
        <td>${asset.department || ''}</td>
        <td>${asset.custodianName || ''}</td>
        <td><span class="status ${asset.assetStatus?.toLowerCase()}">${asset.assetStatus || ''}</span></td>
        <td>
            <button onclick="viewAsset('${asset.id}')" class="btn-view">View</button>
            <button onclick="deallocateAsset('${asset.id}')" class="btn-delete">Deallocate</button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

// Add Asset Form Functions
function showAddAssetForm() {
    document.getElementById('assetForm').style.display = 'block';
}

function hideAssetForm() {
    document.getElementById('assetForm').style.display = 'none';
    document.getElementById('addAssetForm').reset();
}

// Add new asset
document.getElementById('addAssetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const assetData = Object.fromEntries(formData);
    
    // Add timestamp
    assetData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    
    db.collection('assets').add(assetData)
        .then(() => {
            alert('Asset added successfully!');
            hideAssetForm();
        })
        .catch((error) => {
            alert('Error adding asset: ' + error.message);
        });
});

// Deallocate Asset
function deallocateAsset(assetId) {
    if (confirm('Are you sure you want to deallocate this asset?')) {
        const deallocationDate = new Date().toISOString().split('T')[0];
        
        db.collection('assets').doc(assetId).update({
            assetStatus: 'Inactive',
            deallocationDate: deallocationDate
        })
        .then(() => {
            alert('Asset deallocated successfully!');
        })
        .catch((error) => {
            alert('Error deallocating asset: ' + error.message);
        });
    }
}

// View Asset Details
function viewAsset(assetId) {
    const asset = allAssets.find(a => a.id === assetId);
    if (asset) {
        let details = 'Asset Details:\n\n';
        Object.keys(asset).forEach(key => {
            if (key !== 'id' && asset[key]) {
                details += `${key}: ${asset[key]}\n`;
            }
        });
        alert(details);
    }
}

// Search Functionality
function searchAssets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('assetsTableBody');
    tableBody.innerHTML = '';
    
    const filteredAssets = allAssets.filter(asset => 
        (asset.assetName && asset.assetName.toLowerCase().includes(searchTerm)) ||
        (asset.assetType && asset.assetType.toLowerCase().includes(searchTerm)) ||
        (asset.location && asset.location.toLowerCase().includes(searchTerm)) ||
        (asset.department && asset.department.toLowerCase().includes(searchTerm)) ||
        (asset.custodianName && asset.custodianName.toLowerCase().includes(searchTerm)) ||
        (asset.systemSerialNumber && asset.systemSerialNumber.toLowerCase().includes(searchTerm))
    );
    
    filteredAssets.forEach(asset => addAssetToTable(asset));
}
