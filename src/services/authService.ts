import api from "./api";

export interface User {

id:string;

email:string;

name:string;

phoneNumber?:string;

budget?:number;

awsRegion?:string;

}

export const authService = {


login: async(
email:string,
password:string
):Promise<User>=>{


try{


const response =
await api.post(
"/auth/login",
{
email,
password
}
);

const user =
response.data.user;

localStorage.setItem(
"aws_watcher_user",
JSON.stringify(user)
);

localStorage.setItem(
"token",
response.data.token
);

return user;

}catch(error:any){


throw new Error(

error.response?.data?.message
||
"Login failed"

);

}

},


register: async(

email:string,
password:string,
name:string

):Promise<User>=>{


try{

const response =
await api.post(
"/auth/register",

{
email,
password,
name
}

);

const user =
{

id:
response.data.cognito.UserSub,

email,

name

};

localStorage.setItem(

"aws_watcher_user",

JSON.stringify(user)

);

return user;

}catch(error:any){


throw new Error(

error.response?.data?.message
||
"Registration failed"

);

}


},

getCurrentUser:
async():Promise<User|null>=>{


const user =
localStorage.getItem(
"aws_watcher_user"
);

if(user){

return JSON.parse(user);

}


return null;

},

logout:
async()=>{


localStorage.removeItem(
"token"
);


localStorage.removeItem(
"aws_watcher_user"
);

}
};