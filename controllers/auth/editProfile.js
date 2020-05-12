// requiring required models

//importing jwtdecode for deocding token
const jwt_decode = require("jwt-decode");
const User = require("../../models/client/brandUserDetail");
//const login=require("")

exports.editProfile = async (req, res) => {
  try {
    //getting token from the request header
    const token = req.headers.authorization;
    //token gets Bearer in addition so split it in newtoken using variable val and split(" ")
    var val = token.split(" ");
    const newtoken = val[1];

    //decoding token --(method jwt_decode)-->id,iat..(iat-time period of the token)
    const decodedvalue = jwt_decode(token);
    //taking user id fom the decoded token
    const decodedID = decodedvalue._id;

    // finding user with token
    const user = await User.findById(decodedID);
    const userToken = user.token;

    // console.log(reqbname);
    if (userToken === newtoken) {
      const newUser = await User.findByIdAndUpdate(
        user._id,
        {
          brandName: req.body.brandName,
          brandAddress: req.body.brandAddress,
          phoneNo: req.body.phoneNo,
        },
        { new: true },
        (err, docs) => {
          if (err) res.send({ status: false, error: err });
          else return docs;
        }
      );

      const bname = await newUser.brandName;
      const baddress = await newUser.brandAddress;
      const phone = await newUser.phoneNo;

      res.send({ status: true, bname, baddress, phone });
    }

    res.send({ status: false, error: "Token not verified" });
  } catch (error) {
    res.status(400).send({ error });
  }
};
