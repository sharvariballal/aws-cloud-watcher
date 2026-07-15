const {
 signUpCognitoUser,
 loginCognitoUser
}
=
require("../services/cognitoService");

// REGISTER

const register = async(
 req,
 res,
 next
)=>{

try{


const {
 name,
 email,
 password,
 phoneNumber
}
=
req.body;



if(
 !name ||
 !email ||
 !password
){

return res.status(400).json({

success:false,

message:
"Name email password required"

});

}


const cognitoUser =
await signUpCognitoUser(
 name,
 email,
 password,
 phoneNumber
);

res.status(201).json({

success:true,

message:
"User registered successfully",

cognito:
cognitoUser

});

}catch(error){

next(error);

}


};


// LOGIN


const login =
async(
req,
res,
next
)=>{


try{

const {
email,
password
}
=
req.body;

if(
!email ||
!password
){

return res.status(400).json({

success:false,

message:
"Email and password required"

});

}


const session =
await loginCognitoUser(
email,
password
);


res.status(200).json({

success:true,

message:
"Login successful",


token:
session.idToken,


user:{

id:
email,

email,

name:
email.split("@")[0],

budget:0,

awsRegion:
"us-east-1"

},


cognitoSession:
session


});

}catch(error){

next(error);

}

};

module.exports={

register,

login

};