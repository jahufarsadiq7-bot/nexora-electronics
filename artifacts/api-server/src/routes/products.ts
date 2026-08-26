import { Router, type IRouter } from "express";
import { db, products } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (_req, res, next) => {
  try {
    const data = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true));

    res.json(data);
  } catch (error) {
    return next(error);
  }
});


router.get("/products/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;

    const data = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));

    const product = data[0];

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
});
export default router;
