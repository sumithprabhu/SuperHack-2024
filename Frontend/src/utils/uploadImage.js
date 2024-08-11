async function uploadImage(fileToUpload) {
    const data = new FormData();
    data.append("file", fileToUpload);

    const response = await fetch("/api/files", { // Your API endpoint
        method: "POST",
        body: data,
    });
    const responseData = await response.json();
    if(response.ok) {
        return responseData.IpfsHash; // Returns the IPFS hash of the uploaded image
    } else {
        throw new Error(responseData.error || 'Failed to upload image.');
    }
}

export { uploadImage };
