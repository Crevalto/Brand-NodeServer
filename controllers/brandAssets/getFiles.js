// importing required modules
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

module.exports.getFiles = async (req, res, next) => {

    try {
        // gets the token for user identification
        const token = req.headers.authorization;

        // getting user ID stored in the token
        const userId = await getUserId(token);

        // getting all data required from database
        const responseData = await BrandAsset.find({
            brandUserId: ObjectId(userId)
        }, (error, data) => {
            if (error) return null;
            else return data;
        });
        // sending error response 
        res.send({
            status: true,
            data: responseData
        });


    } catch (error) {
        // sending error response 
        res.send({
            status: false,
            error: error
        });
    }
};