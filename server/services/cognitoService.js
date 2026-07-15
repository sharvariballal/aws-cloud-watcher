const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminConfirmSignUpCommand,
  GetUserCommand
} = require("@aws-sdk/client-cognito-identity-provider");

const { getAWSConfig } = require("../config/awsConfig");


const cognitoClient =
  new CognitoIdentityProviderClient(
    getAWSConfig()
  );


// REGISTER USER
const signUpCognitoUser = async (
  name,
  email,
  password,
  phoneNumber
) => {

  try {

    const attributes = [
      {
        Name: "email",
        Value: email
      },
      {
        Name: "name",
        Value: name
      }
    ];


    if(phoneNumber){

      attributes.push({
        Name:"phone_number",
        Value:phoneNumber
      });

    }


    const command =
      new SignUpCommand({

        ClientId:
          process.env.COGNITO_CLIENT_ID,

        Username:
          email,

        Password:
          password,

        UserAttributes:
          attributes

      });


    const response =
      await cognitoClient.send(command);



    // Auto confirm user
    await cognitoClient.send(
      new AdminConfirmSignUpCommand({

        UserPoolId:
          process.env.COGNITO_USER_POOL_ID,

        Username:
          email

      })
    );


    return response;


  } catch(error){

    console.log(
      "Cognito signup error",
      error
    );

    throw error;

  }

};

// LOGIN USER

const loginCognitoUser = async(
  email,
  password
)=>{

  try{


    const command =
      new InitiateAuthCommand({

        AuthFlow:
          "USER_PASSWORD_AUTH",

        ClientId:
          process.env.COGNITO_CLIENT_ID,


        AuthParameters:{

          USERNAME:
            email,

          PASSWORD:
            password

        }

      });


    const response =
      await cognitoClient.send(command);



    return {

      accessToken:
        response.AuthenticationResult.AccessToken,


      idToken:
        response.AuthenticationResult.IdToken,


      refreshToken:
        response.AuthenticationResult.RefreshToken,


      expiresIn:
        response.AuthenticationResult.ExpiresIn

    };


  }catch(error){

    console.log(
      "Cognito login error",
      error
    );

    throw error;

  }


};

module.exports = {

 signUpCognitoUser,
 loginCognitoUser

};