import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.email || !body.password) {
      return c.text("Email and password are required", 400);
    }
    await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    return c.text("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    return c.text("Internal Server Error", 500);
  }
});

export default app;
