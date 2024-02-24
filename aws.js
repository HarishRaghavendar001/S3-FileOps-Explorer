var region = "us-east-1"
var accessKeyId = "AKIAWBBX35QGQWMNGRNR"
var secretAccesKey = "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"

AWS.config.update({
    region:region,
    credentials:new AWS.Credentials(accessKeyId,secretAccesKey)
});

var s3 = new AWS.S3();

function uploading(bucketname){
    let files = document.getElementById('fileinput').files;
    var fileCount = files.length
    for(var i=0;i<fileCount;i++){
        var file = files[i]
        var params = {
            Bucket:bucketname,
            Key:file.name,
            Body:file
        }
        s3.upload(params,(err,data) => {
            console.log("file uploaded")
        })
    }
}
function refreshFileList(bucketname) {

    var tableBody = document.querySelector("#table tbody");
    tableBody.innerHTML = "";
    
    s3.listObjectsV2({Bucket: bucketname}, (err, data) => {
    
    if (err){
    
    console.log("Error fetching file list",err)
    }
    else{
        data.Contents.forEach((object) => {

            var fileRow = document.createElement('tr')

            var fileNameCell = document.createElement('td')
            fileNameCell.textContent = object.Key;
            fileRow.appendChild(fileNameCell);
            

            var downloadCell = document.createElement('td')
            var downloadLink = document.createElement('a')
            downloadLink.href = s3.getSignedUrl("getObject",{
            Bucket: bucketname,
            Key: object.Key,
        });
        downloadLink.textContent = "Download"
        downloadCell.appendChild(downloadLink) 
        fileRow.appendChild(downloadCell)
        
        var deleteCell = document.createElement('td')
        var deleteButton = document.createElement('button')
        deleteButton.textContent="Delete"
        deleteButton.addEventListener('click', () => { 
            deleteFile(bucketname, object.Key)
        })

        deleteCell.appendChild(deleteButton)
        fileRow.appendChild(deleteCell)

         tableBody.appendChild(fileRow)
 
        });
    }
    })
}
function deleteFile(bucketname, key){

    var params = {
    Bucket: bucketname,
    Key:key
}
    
    s3.deleteObject(params, (err, data) => {
console.log("file deleted successfully")
refreshFileList(bucketname)
})
}    
refreshFileList("upload-file-image");