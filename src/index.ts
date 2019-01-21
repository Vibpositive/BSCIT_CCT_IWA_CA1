require("dotenv").config();
import { createApp } from "./app";
(async () => {
    const app:any = await createApp();
    const APP_PORT = process.env.APP_PORT;
    
    app.listen(APP_PORT, () => {
      console.log(`The server is running in port ${APP_PORT}!`);
    });
})();