import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "@/env";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	credentials: true,
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Inventra API",
			description: "API for inventory management",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: "/docs",
});

const port = env.PORT;

app.listen({ port, host: "0.0.0.0" }).then(() => {
	console.log(`🔥 HTTP server running on http://localhost:${port}`);
	console.log(`📚 Docs available at http://localhost:${port}/docs`);
});
