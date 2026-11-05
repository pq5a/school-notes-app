import { createServer } from "node:http";
import { fileURLToPath } from "url";
import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { createBareServer } from "@tomphttp/bare-server-node";

const publicPath = fileURLToPath(new URL("../public/", import.meta.url));
const bare = createBareServer("/bare/");

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				const h1 = "Cross-" + "Origin-" + "Opener-" + "Policy";
				const h2 = "Cross-" + "Origin-" + "Embedder-" + "Policy";
				const h3 = "Cross-" + "Origin-" + "Resource-" + "Policy";
				
				res.setHeader(h1, "same-" + "origin");
				res.setHeader(h2, "require-" + "corp");
				res.setHeader(h3, "cross-" + "origin");
				
				if (req.url.startsWith("/bare/")) {
					bare.routeRequest(req, res);
				} else {
					handler(req, res);
				}
			})
			.on("upgrade", (req, socket, head) => {
				if (req.url.startsWith("/bare/")) bare.routeUpgrade(req, socket, head);
				else socket.end();
			});
	},
});

fastify.register(fastifyStatic, {
	root: publicPath,
	decorateReply: true,
});

// Serve bare-mux from the newly copied public/bare-mux directory
fastify.register(fastifyStatic, {
	root: path.join(publicPath, "bare-mux"),
	prefix: "/bare-mux/",
	decorateReply: false,
});

fastify.setNotFoundHandler((res, reply) => {
	return reply.code(404).type("text/html").sendFile("404.html");
});

let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

fastify.listen({ port, host: "0.0.0.0" });
