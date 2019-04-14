import { expect } from "chai";
import { it, describe } from "mocha";
import { getHandlers } from "../src/backend/controllers/link_controller";

describe("Link Controller", () => {
    
    it("Should create a link", () => {
        
        const fakeLink: any = {
            id: 1,
            title: "Titanic",
            url:"www.reddit.com"
        };

        const fakeRequest: any = {
            body: {
                title: "Titanic",
                url: "www.reddit.com"
            }
        };

        const fakeResponse: any = {
            json: (link: any) =>{
                expect(link.title).to.eq(fakeLink.title)
            },
            
            status: (code: number) => {}
        };

        const fakeRepository: any = {
            save: (link: any) => {
                expect(link.title).to.eq(fakeLink.title);
                return Promise.resolve(fakeLink);
            }
        };

        const handlers = getHandlers(fakeRepository);
        handlers.createLink(fakeRequest, fakeResponse);
    });
    
});