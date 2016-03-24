/*
	Test for the objects-store-stub
*/

var path = require('path')

// read the information from the VCAP services of your Bluemix application/service using Object Store
var bluemixObjectStore = {
	"auth_url": "https://identity.open.softlayer.com",
	"project": "...",
	"projectId": "...",
	"region": "dallas",
	"userId": "...",
	"username": "...",
	"password": "...",
	"domainId": "...",
	"domainName": "..."
 };

downloadComplete = function( localFile, error) {
	if ( error)
	{
		console.log( "Download error: " + error.failCode);
		return;
	}
	
	console.log( "Download complete: " + localFile);
}

/*
 * Download the result
 */
uploadComplete = function(objectStore, container, remoteFile, error) {
	if ( error)
	{
		console.log( "Upload error: " + error.failCode);
		return;
	}
	
	console.log( "Upload complete: " + remoteFile);
	
	var localFile = "./test/download/" + remoteFile;
	objectStore.retrieveFile( container, remoteFile, localFile, downloadComplete);
}

// upload and download 2 files
var ObjectStoreStub = require('./store/object-store-stub');
var objectStore = new ObjectStoreStub( bluemixObjectStore);

objectStore.storeFile( "test",  "./test/upload/image.jpg", uploadComplete);
objectStore.storeFile( "test",  "./test/upload/text.txt", uploadComplete);




