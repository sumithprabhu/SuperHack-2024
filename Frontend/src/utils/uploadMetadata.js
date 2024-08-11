// Function to upload NFT metadata
async function uploadMetadata(metadata) {
    const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const data = new FormData();
    data.append("file", jsonBlob, "metadata.json"); // Append metadata as a file
    const response = await fetch("/api/files", { // Ensure this matches your API endpoint
        method: "POST",
        body: data,
    });
    const responseData = await response.json();
    if(response.ok) {
        return responseData.IpfsHash; // Returns the IPFS hash of the uploaded metadata
    } else {
        throw new Error(responseData.error || 'Failed to upload metadata.');
    }
}

export { uploadMetadata };
