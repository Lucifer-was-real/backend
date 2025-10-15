document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseAndDisplayData(content);
    };
    reader.readAsText(file);
});

function parseAndDisplayData(data) {
    const lines = data.split('\n');
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear previous results

    let currentSiteId = null;

    for (const line of lines) {
        // Skip empty lines or irrelevant text
        if (line.trim().length === 0) continue;

        // Check if the line is a SITE ID (a 4-digit number)
        const siteIdMatch = line.trim().match(/^[A-Z]?\d{4}$/);
        if (siteIdMatch) {
            currentSiteId = siteIdMatch[0];
            continue; // Move to the next line
        }

        // If we don't have a site ID yet, we can't process the data line
        if (!currentSiteId) continue;

        // Regular expression to find the data parts, regardless of order
        const latLongMatch = line.match(/(\d{2}\.\d+)\s*°?\s*(\d{2,3}\.\d+)/);
        const angleMatch = line.match(/(\d+)\s*deg/i); // 'i' for case-insensitive
        const distanceMatch = line.match(/(\d+)\s*m/i);
        const buildingMatch = line.match(/(B\d)/i);

        if (latLongMatch && angleMatch && distanceMatch) {
            const lat = latLongMatch[1];
            const long = latLongMatch[2];
            const angle = angleMatch[1];
            const distance = distanceMatch[1];
            const building = buildingMatch ? buildingMatch[1].toUpperCase() : 'N/A'; // Use 'N/A' if no building found

            // Create a new row and cells for the table
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${currentSiteId}</td>
                <td>${lat}</td>
                <td>${long}</td>
                <td>${angle}</td>
                <td>${distance}</td>
                <td>${building}</td>
            `;

            // Add the new row to the table
            tableBody.appendChild(row);
        }
    }
}