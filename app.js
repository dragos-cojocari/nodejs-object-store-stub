/*
	Test for the objects-store-stub
*/

var path = require('path')

var bluemixObjectStore = {
	"auth_url": "https://identity.open.softlayer.com",
	"project": "object_storage_0bdded51_d5c1_40d0_8d1b_52e14d70b93a",
	"projectId": "30e91540a19942d6928ee2522ead5aa5",
	"region": "dallas",
	"userId": "3c5fe22e11554bd6891b3cfa9ceaa44f",
	"username": "Admin_270f4b1a7249ad692af0c121e852b323cf7e35de",
	"password": "R?^Uzz05Otmg[(s_",
	"domainId": "2a2d5d46c6de4cd1a4ff869af7e5cca5",
	"domainName": "948759"
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




