// importing required modules
const fs = require('fs')
const path = require('path')
const S3 = require('aws-sdk/clients/s3');
const jwt_decode = require("jwt-decode");
const {
    ObjectId
} = require('mongodb');

// importing the required models
const BrandAsset = require("../../models/client/brandAsset");

// gets the userID from the token
const getUserId = async (token) => {
    //token gets Bearer in addition so split it in newtoken using variable val and split(" ")
    var val = token.split(" ");
    const newtoken = val[1];
    //decoding token --(method jwt_decode)-->id,iat..(iat-time period of the token)
    const decodedvalue = await jwt_decode(newtoken);
    //taking user id fom the decoded token and returning it
    return decodedvalue._id;
};

// inserts the upload details into the database
const insertUploadDetails = async (uploadData, userId, uploadMetadata, res) => {

    try {
        // created object to insert into database
        const brandAssetObj = {
            brandUserId: ObjectId(userId),
            assetType: uploadMetadata,
            assetLocation: uploadData["Location"],
            assetBucket: uploadData["Bucket"],
            assetName: uploadData["Key"]
        };

        // check if userdocument exists in databse
        const docExists = await BrandAsset.findOneAndUpdate({
            brandUserId: ObjectId(userId),
            assetType: uploadMetadata,
            assetName: uploadData["Key"]
        }, brandAssetObj, {
            new: true,
            upsert: true
        }, (error, data) => {
            if (error) return null;
            else return data;
        });

        console.log(docExists);


    } catch (error) {
        console.log("ERROR", error);

        // sending error response 
        res.send({
            status: false,
            error: error
        });
    }

};

// starts uploading files to s3 instance
const startUploadProcess = async (files, s3Client, userId, uploadMetadata, res) => {

    try {
        // looping through each file
        for (index in files) {

            // creating configuration file for the s3 instance
            const config = {
                Key: userId + "/" + path.basename(files[index]["path"]),
                Bucket: 'crevaltoassets',
                Body: fs.createReadStream(files[index]["path"]),
            };

            // uploading file to server
            s3Client.upload(config, (err, data) => {
                console.log(err, data);
                // updating the database
                insertUploadDetails(data, userId, uploadMetadata, res);
            });

        }
    } catch (error) {
        // sending error response 
        res.send({
            status: false,
            error: error
        });
    }
};


// uploads file to s3 bucket
module.exports.uploadFile = async (req, res, next) => {

    try {

        // gets the token for user identification
        const token = req.headers.authorization;

        // getting user ID stored in the token
        const userId = await getUserId(token);

        // s3 bucket configuration 
        const s3Config = {
            accessKeyId: 'AKIAJVH6OKSTOXAEW3GQ',
            secretAccessKey: '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',
        };

        // creating s3 client instance
        const s3Client = new S3(s3Config);
        // starts the upload process
        await startUploadProcess(req.files, s3Client, userId, req.body["metadata"], res);

        // sending response 
        res.send({
            status: true,
            message: "File recieved and upload started"
        });

    } catch (error) {
        // sending error response 
        res.send({
            status: false,
            error: error
        });
    }


};