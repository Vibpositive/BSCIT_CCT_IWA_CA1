require("dotenv").config();

require("es6-promise").polyfill();
require("isomorphic-fetch");

const APP_PORT = process.env.APP_PORT;
let token = "";

async function login(email:String = "random@email.com", password:String  = "secret"){
    
    const url = `http://localhost:${APP_PORT}/api/v1/auth/login`;
    
    const data = {
        email: email,
        password: password
    };
    
    try {
        const response = await fetch(url,{
            method: "POST",
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
    const url = `http://localhost:${APP_PORT}/api/v1/links/`;
    
    try {
        const response = await fetch(
            url,
            {
                method: "GET"
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

    const data = {
        url: "some url",
        title: "some title"
    };

    const url = `http://localhost:${APP_PORT}/api/v1/links/`;

    const token = await login();

    if (token) {
        
        try {
            const response = await fetch(url,
                {
                    method: "POST",
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

    const url = `http://localhost:${APP_PORT}/api/v1/links/1`;

    try {
        const response = await fetch(
            url,
            {
                method: "GET"
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
    DELETES A LINK
*/
(async () => {
    
    const url = `http://localhost:${APP_PORT}/api/v1/links/45`;

    const token = await login();
    
    if (token) {
        try {    
            const response = await fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    }
                }
            );
            
            console.log("Deletes a link");
            /*
            */
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
                console.log(response.statusText);
            }
            /**/

            console.log("\n");
            console.log("=======================================================================================");
            console.log("\n");

        } catch (error) {
            console.log("response 2");
            console.log(error.message);
        }
    }else{
        console.log("missing token");
    }

})();
/**/


/*
    UPVOTES A LINK
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/links/47/upvote`;

    console.log("url");
    console.log(url);

    const token = await login();


    if (token) {

        try {
            const response = await fetch(url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    }
                }
            );
            console.log("UPVOTES a link");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
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

/*
    DOWNVOTES A LINK
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/links/47/downvote`;
    const token = await login();

    if (token) {

        try {
            const response = await fetch(url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    }
                }
            );
            console.log("DOWNVOTES a link");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
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


/*
    CREATES A USER
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/users`;

    const data = {
        email: "newusername@domain.com",
        password: "secret"
    };
    
    try {
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        console.log("CREATES A USER");
        try {
            const json = await response.json();
            console.log("\n");
            console.log(json);
        } catch (jsonError) {
            console.log(response.statusText);
        }

        console.log("\n");
        console.log("=======================================================================================");
        console.log("\n");

    } catch (error) {
        console.log("response 2");
        console.log(error.message);
    }
    
})();
/**/


/*
    GETS A USER BY ID
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/users/1`;
    
    try {
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("GETS A USER BY ID");
        try {
            const json = await response.json();
            console.log("\n");
            console.log(json);
        } catch (jsonError) {
            console.log(response.statusText);
        }

        console.log("\n");
        console.log("=======================================================================================");
        console.log("\n");

    } catch (error) {
        console.log("response 2");
        console.log(error.message);
    }

})();
/**/


/*
    CREATES A COMMENT
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/comments`;

    const data = {
        comment: "Some random comment",
        linkId: 1
    };

    const token = await login();

    if (token) {
        try {
            const response = await fetch(url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    },
                    body: JSON.stringify(data)
                }
            );
            console.log("CREATES A COMMENT");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
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


/*
    UPDATES A COMMENT
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/comments/1`;

    const data = {
        comment: "Some random comment updateded"
    };

    const token = await login();

    if (token) {
        try {
            const response = await fetch(url,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    },
                    body: JSON.stringify(data)
                }
            );
            console.log("UPDATES A COMMENT");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
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


/*
    DELETES A COMMENT
*/
(async () => {

    const url = `http://localhost:${APP_PORT}/api/v1/comments/1`;

    const data = {
        comment: "Some random comment updateded"
    };

    const token = await login();

    if (token) {
        try {
            const response = await fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token.token
                    },
                    body: JSON.stringify(data)
                }
            );
            console.log("DELETES A COMMENT");
            try {
                const json = await response.json();
                console.log("\n");
                console.log(json);
            } catch (jsonError) {
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