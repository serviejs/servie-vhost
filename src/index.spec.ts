import { vhost, getHostFromUrl } from "./index";
import { Request, Response } from "servie/dist/node";
import { send } from "servie-send";
import { finalhandler } from "servie-finalhandler";

describe("servie-route", () => {
  it("should match a route", async () => {
    const app = vhost<Request, Response>("example.com", req =>
      send(req, "hello world")
    );

    const req = new Request("/test", {
      method: "get",
      headers: { Host: "example.com" }
    });

    const res = await app(req, finalhandler(req));

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("hello world");
  });

  it("should not match when path does not equal", async () => {
    const app = vhost<Request, Response>("example.com", req =>
      send(req, "hello world")
    );

    const req = new Request("/");
    const res = await app(req, finalhandler(req));

    expect(res.status).toEqual(404);
  });

  it("should work with parameters", async () => {
    const app = vhost<Request, Response>(":id.example.com", req =>
      send(req, req.vhost[0])
    );

    const req = new Request("/", {
      headers: { Host: "1.example.com" }
    });

    const res = await app(req, finalhandler(req));

    expect(await res.text()).toEqual("1");
  });

  it("should read host from url", async () => {
    const app = vhost<Request, Response>(
      "example.com",
      req => send(req, "hello world"),
      getHostFromUrl
    );

    const req = new Request("http://example.com:8080/");
    const res = await app(req, finalhandler(req));

    expect(await res.text()).toEqual("hello world");
  });
});
