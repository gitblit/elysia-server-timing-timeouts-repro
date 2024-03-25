import { describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "./index";

const client = treaty<typeof app>("http://localhost:3000");

describe("Get Index", () => {
    it("returns 400 Nope", async () => {
        // arrange
        // act
        const { status, error } = await client.index.get({ headers: { authorization: "SendNope" } });

        // assert
        expect(status).toBe(400);
        expect(error?.value).toBe("Nope");
    });

    it("returns 200 OK", async () => {
        // arrange
        // act
        const { status, data } = await client.index.get({ headers: { authorization: "SendOK" } });

        // assert
        expect(status).toBe(200);
        expect(data).toBe("OK");
    });
});