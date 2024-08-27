const express = require("express");
const { PrismaClient } = require("@prisma/client");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

app.use(logger());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/pizzas", async (req, res) => {
  try {
    const pizzas = await prisma.Pizza.findMany();
    const data = {
      pizzas,
      meta: {},
    };
    res.json(data);
  } catch (error) {
    console.error("Error fetching pizzas:", error);
    res.status(500).json({ error: "Error fetching pizzas" });
  }
});

app.post("/pizzas", async (req, res) => {
  try {
    const { imageUrl, nameUa, nameEn, types, sizes, price, category, rating } =
      req.body;
    const pizza = await prisma.pizza.create({
      data: {
        imageUrl,
        nameUa,
        nameEn,
        types,
        sizes,
        price,
        category,
        rating,
      },
    });
    res.json(pizza);
  } catch (error) {
    console.error("Error creating pizza:", error);
    res.status(500).json({ error: "Error creating pizza" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

prisma.$connect().catch((error) => {
  console.error("Error connecting to the database:", error);
  process.exit(1); // Завершение работы сервера при ошибке подключения
});
