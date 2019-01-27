require("dotenv").config();

require("es6-promise").polyfill();
require("isomorphic-fetch");

const APP_PORT = process.env.APP_PORT;
let token = "";

async function login(email:String = "random@email.com", password:String  = "secret"){
    const controller = "auth";
    const method = "POST";
    const endpoint = "login";
    
    const url = `http://localhost:${APP_PORT}/api/v1/${controller}/${endpoint}`;
    
    const data = {
        email: email,
        password: password
    };
    
    try {
        const response = await fetch(url,{
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
        
    } catch (error) {
        console.log("error.message");
        console.log(error);
        return null;
    }
}

// /api/v1/links GET Returns all links
/*
*/
(async () => {
    const controller = "links";
    const method = "GET";
    const endpoint = "";
    
    const url = `http://localhost:${APP_PORT}/api/v1/${controller}/${endpoint}`;
    
    try {
        const response = await fetch(
            url,
            {
                method: method
            }
        );
        const json = await response.json();
        console.log("Returns all links");
        console.log("\n");
        console.log(json);
        console.log("\n");
        console.log("=======================================================================================");
        console.log("\n");
    } catch (error) {
        console.log(error)
    }
})();
/**/

// POST /api/v1/links requires user authentication and takes a link in the request body. It should return the new link
(async () => {
    const controller = "links";
    const method = "POST";
    const endpoint = "";

    const data = {
        url: "some url",
        title: "some title"
    };

    const url = `http://localhost:${APP_PORT}/api/v1/${controller}/${endpoint}`;

    const token = await login();

    if (token) {
        
        try {
            const response = await fetch(url,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    },
                    body: JSON.stringify(data)
                }
            );
            console.log("Returns the new link");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
                console.log(jsonError.message);
                console.log("response 1");
                console.log(response);
            }

            console.log("\n");
            console.log("=======================================================================================");
            console.log("\n");

        } catch (error) {
            console.log(error.message);
            console.log("response 2");
        }
    }

})();

/*
*/
(async () => {
    const controller = "links";
    const method = "GET";
    const endpoint = "1";

    const url = `http://localhost:${APP_PORT}/api/v1/${controller}/${endpoint}`;

    try {
        const response = await fetch(
            url,
            {
                method: method
            }
        );
        const json = await response.json();
        console.log("Returns a link and its comments");
        console.log("\n");
        console.log(json);
        console.log("\n");
        console.log("=======================================================================================");
        console.log("\n");
    } catch (error) {
        console.log(error)
    }
})();
/**/
/*

*/
(async () => {
    const controller = "links";
    const method = "DELETE";
    const endpoint = "32";
    
    const url = `http://localhost:${APP_PORT}/api/v1/${controller}/${endpoint}`;

    const token = await login();

    if (token) {

        try {
            const response = await fetch(url,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    }
                }
            );
            console.log("Deleetes a link");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
                console.log(jsonError.message);
                console.log("response 1");
                console.log(response.statusText);
            }

            console.log("\n");
            console.log("=======================================================================================");
            console.log("\n");

        } catch (error) {
            console.log("response 2");
            console.log(error.message);
        }
    }

})();
/**/