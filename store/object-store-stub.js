/*
	Stub for accessing IBM Bluemix Object Store
*/

var pkgcloud = require('pkgcloud-bluemix-objectstorage');
var path = require('path');
var fs = require( 'fs');

var ObjectStoreStub = function( objectStoreCredentials){
	this.id = "ObjectStoreStub-" + Math.random().toString( 16).slice( -6);
	this.credentials = objectStoreCredentials;
	this.storageClient = createBluemixStorageClient( objectStoreCredentials);
}

createBluemixStorageClient =  function( objectStoreCredentials){
	//Create a config object
	var config = {};

	//Specify Openstack as the provider
	config.provider = "openstack";

	//Authentication url
	config.authUrl = objectStoreCredentials.auth_url;
	config.region= objectStoreCredentials.region;

	//Use the service catalog
	config.useServiceCatalog = true;

	//true for applications running inside Bluemix, otherwise false
	config.useInternal = false;

	//projectId as provided in your Service Credentials
	config.tenantId = objectStoreCredentials.projectId;

	//userId as provided in your Service Credentials
	config.userId = objectStoreCredentials.userId;

	//username as provided in your Service Credentials
	config.username = objectStoreCredentials.username;

	//password as provided in your Service Credentials
	config.password = objectStoreCredentials.password;

	//This is part which is NOT in original pkgcloud. This is how it works with newest version of bluemix and pkgcloud at 22.12.2015.
	//In reality, anything you put in this config.auth will be send in body to server, so if you need change anything to make it work, you can. PS : Yes, these are the same credentials as you put to config before.
	//I do not fill this automatically to make it transparent.

	config.auth = {
			forceUri  : objectStoreCredentials.auth_url + "/v3/auth/tokens", //force uri to v3, usually you take the baseurl for authentication and add this to it /v3/auth/tokens (at least in bluemix)
			interfaceName : "public", //use public for apps outside bluemix and internal for apps inside bluemix. There is also admin interface, I personally do not know, what it is for.
			"identity": {
				"methods": [
				            "password"
				            ],
				            "password": {
				            	"user": {
				            		"id": objectStoreCredentials.userId, //userId
				            		"password": objectStoreCredentials.password //userPassword
				            	}
				            }
			},
			"scope": {
				"project": {
					"id": objectStoreCredentials.projectId //projectId
				}
			}
	};

	return pkgcloud.storage.createClient( config);
}

ObjectStoreStub.prototype.storeFile = function( containerName, localFile, callback) {

	var remoteFileName = new Date().getTime() + "_" + path.basename(localFile);

	var objectStore = this;
	
	objectStore.storageClient.getContainer(containerName, function (err, container) {
		if (err) {
		
			console.log( "The container does not exist.");
			
			objectStore.storageClient.createContainer( containerName, function (err, container) {
				if (err) {
					callback( objectStore, containerName, remoteFileName, err);
					return;
				}
				else {
					console.log( "The container was created.");
				}
			});
		} 
		
		//console.log( "The container exists.");
		
		var writeStream = objectStore.storageClient.upload({
			container: containerName,
			remote: remoteFileName
		});

		
		writeStream.on('error', function(error) {
			callback( objectStore, containerName, remoteFileName, error);
		});
		
		writeStream.on('success', function(file) {
			callback( objectStore, containerName, remoteFileName, null);
		});
		
		var readStream = fs.createReadStream(localFile);
		readStream.pipe(writeStream);
	});
}

ObjectStoreStub.prototype.retrieveFile = function( containerName, fileName, localFile, callback) {

	var options = {
		container: containerName,
		remote: fileName,
		local: localFile
	};

	this.storageClient.download(options, function (err, res) {
		if (err) {
			callback(null,err);
		} else {
			callback( localFile, null);
		}
	});
	
	/*
	var writeStream = fs.createWriteStream(localFile);
	
	stream.pipe(writeStream).on( 'error', function( error) {
		callback( null, error);
	}).on( "finish", function( ) {
		callback( localFile, null);
	});
	*/
}

module.exports = ObjectStoreStub;