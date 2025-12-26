import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import axios from "axios";

const DEFAULT_LOCAL_LAPTOPS_URL = "http://localhost:3004/api/laptops";

const getLaptopServiceUrl = (req) => {
  // Highest priority: explicit env configuration
  const fromEnv =
    process.env.LAPTOP_SERVICE_URL || process.env.BOOK_SERVICE_URL;
  if (fromEnv) return fromEnv;

  // If cart-service is called through the API gateway, use the forwarded host
  // and call gateway's public laptop route (gateway will proxy to item-service).
  const forwardedHost = req?.get?.("x-forwarded-host");
  const forwardedProto = req?.get?.("x-forwarded-proto") || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}/v1/laptops`;
  }

  // Local development fallback
  return DEFAULT_LOCAL_LAPTOPS_URL;
};

// Fetch laptop details from laptop service
const fetchLaptopDetails = async (req, laptopId) => {
  try {
    const laptopServiceUrl = getLaptopServiceUrl(req);
    const fullUrl = `${laptopServiceUrl.replace(/\/+$/, "")}/${laptopId}`;
    console.log(`[Cart Controller] Fetching laptop details from: ${fullUrl}`);

    const response = await axios.get(fullUrl, { timeout: 8000 });
    console.log(
      `[Cart Controller] Successfully fetched laptop: ${laptopId}`,
      response.data
    );
    return response.data;
  } catch (err) {
    const status = err?.response?.status;
    const errorMessage = err?.response?.data?.message || err.message;

    if (status === 404) {
      console.warn(
        `[Cart Controller] Laptop not found: ${laptopId} - ${errorMessage}`
      );
    } else if (status === 401 || status === 403) {
      console.warn(
        `[Cart Controller] Authentication/Authorization error fetching laptop ${laptopId}: ${status} - ${errorMessage}`
      );
    } else {
      console.error(
        `[Cart Controller] Failed to fetch laptop details (${
          status || "no-status"
        }): ${laptopId} - ${errorMessage}`
      );
    }
    return null;
  }
};

// Get cart details with populated laptops
const getCartDetails = async (cartId, req) => {
  const items = await CartItem.find({ cart: cartId });
  return await Promise.all(
    items.map(async (i) => {
      const laptop = await fetchLaptopDetails(req, i.laptop);
      const unitPrice = (laptop?.price ?? i.unitPrice ?? 0) || 0;
      const laptopPayload = {
        _id: laptop?._id || i.laptop,
        Brand: laptop?.Brand ?? i.brand ?? "Unknown",
        Model: laptop?.Model ?? i.model ?? "",
        Spec: laptop?.Spec,
        category: laptop?.category ?? i.category ?? "",
        price: unitPrice,
        coverImage: laptop?.coverImage,
        image_url: laptop?.image_url ?? i.image_url ?? "",
      };
      return {
        _id: i._id,
        quantity: i.quantity,
        price: unitPrice * i.quantity,
        laptop: laptopPayload,
        book: laptopPayload,
      };
    })
  );
};

// Get user cart
export const getCart = async (req, res) => {
  console.log("[Cart Controller] Get cart request:", {
    userId: req.user?.id,
    hasAuth: !!req.user?.id,
  });

  try {
    // Verify user is authenticated
    if (!req.user || !req.user.id) {
      console.warn("[Cart Controller] Unauthenticated get cart attempt");
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to view your cart",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    console.log("[Cart Controller] Found cart:", cart?._id || "none");

    if (!cart) {
      console.log("[Cart Controller] No cart found, returning empty");
      return res.json({ cartId: null, items: [] });
    }

    const detailedItems = await getCartDetails(cart._id, req);
    console.log(
      "[Cart Controller] Returning cart with",
      detailedItems.length,
      "items"
    );

    res.json({ cartId: cart._id, items: detailedItems });
  } catch (err) {
    console.error("[Cart Controller] Error getting cart:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { laptopId } = req.body;
  console.log("[Cart Controller] Add to cart request:", {
    laptopId,
    userId: req.user?.id,
    hasAuth: !!req.user?.id,
  });

  try {
    // Validate laptop ID
    if (!laptopId) {
      console.warn("[Cart Controller] Missing laptop ID");
      return res.status(400).json({
        error: "Bad Request",
        message: "Laptop ID is required",
      });
    }

    // Verify user is authenticated
    if (!req.user || !req.user.id) {
      console.warn("[Cart Controller] Unauthenticated add to cart attempt");
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to add items to cart",
      });
    }

    // Fetch laptop details to validate it exists and get price
    console.log(`[Cart Controller] Validating laptop existence: ${laptopId}`);
    const laptop = await fetchLaptopDetails(req, laptopId);

    if (!laptop) {
      console.warn(
        `[Cart Controller] Laptop validation failed for ID: ${laptopId}`
      );
      return res.status(404).json({
        error: "Not Found",
        message: `Laptop with ID ${laptopId} does not exist or is not available`,
      });
    }

    // Get or create user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    console.log("[Cart Controller] Found cart:", cart?._id || "none");

    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
      console.log("[Cart Controller] Created new cart:", cart._id);
    }

    // Get or create cart item
    let item = await CartItem.findOne({ cart: cart._id, laptop: laptopId });

    if (item) {
      // Update existing item
      item.quantity += 1;
      // Fill snapshot fields if missing (helps old records)
      if (!item.unitPrice) item.unitPrice = laptop?.price ?? 0;
      if (!item.brand) item.brand = laptop?.Brand ?? "";
      if (!item.model) item.model = laptop?.Model ?? "";
      if (!item.category) item.category = laptop?.category ?? "";
      if (!item.image_url) item.image_url = laptop?.image_url ?? "";
      await item.save();
      console.log(
        "[Cart Controller] Updated cart item quantity to:",
        item.quantity
      );
    } else {
      // Create new item
      item = await CartItem.create({
        cart: cart._id,
        laptop: laptopId,
        unitPrice: laptop?.price ?? 0,
        brand: laptop?.Brand ?? "",
        model: laptop?.Model ?? "",
        category: laptop?.category ?? "",
        image_url: laptop?.image_url ?? "",
        quantity: 1,
      });
      console.log("[Cart Controller] Created new cart item:", item._id);
    }

    // Return updated cart with all details
    const detailedItems = await getCartDetails(cart._id, req);
    console.log(
      "[Cart Controller] Returning updated cart with",
      detailedItems.length,
      "items"
    );

    res.status(201).json({
      cartId: cart._id,
      items: detailedItems,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.error("[Cart Controller] Error adding to cart:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// Remove one item from cart
export const removeOneFromCart = async (req, res) => {
  const { laptopId } = req.body;

  console.log("[Cart Controller] Remove from cart request:", {
    laptopId,
    userId: req.user?.id,
  });

  try {
    // Verify user is authenticated
    if (!req.user || !req.user.id) {
      console.warn(
        "[Cart Controller] Unauthenticated remove from cart attempt"
      );
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to modify your cart",
      });
    }

    if (!laptopId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Laptop ID is required",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        error: "Not Found",
        message: "Cart not found",
      });
    }

    const item = await CartItem.findOne({ cart: cart._id, laptop: laptopId });
    if (!item) {
      return res.status(404).json({
        error: "Not Found",
        message: "Item not in cart",
      });
    }

    item.quantity -= 1;
    if (item.quantity <= 0) {
      await item.deleteOne();
      console.log("[Cart Controller] Removed cart item:", item._id);
    } else {
      await item.save();
      console.log(
        "[Cart Controller] Updated cart item quantity to:",
        item.quantity
      );
    }

    const detailedItems = await getCartDetails(cart._id, req);
    res.json({
      cartId: cart._id,
      items: detailedItems,
      message: "Item quantity decreased",
    });
  } catch (err) {
    console.error("[Cart Controller] Error removing from cart:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// Remove cart item by ID
export const removeCartItem = async (req, res) => {
  const { itemId } = req.params;

  console.log("[Cart Controller] Remove cart item request:", {
    itemId,
    userId: req.user?.id,
  });

  try {
    // Verify user is authenticated
    if (!req.user || !req.user.id) {
      console.warn("[Cart Controller] Unauthenticated remove item attempt");
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to modify your cart",
      });
    }

    // Verify the item belongs to the user's cart
    const item = await CartItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        error: "Not Found",
        message: "Item not found",
      });
    }

    // Verify the cart belongs to the user
    const cart = await Cart.findById(item.cart);
    if (!cart || cart.user.toString() !== req.user.id) {
      console.warn(
        "[Cart Controller] Unauthorized cart access attempt:",
        req.user.id
      );
      return res.status(403).json({
        error: "Forbidden",
        message: "You cannot modify this cart",
      });
    }

    // Remove the item
    await CartItem.findByIdAndDelete(itemId);
    console.log("[Cart Controller] Removed cart item:", itemId);

    // Return updated cart
    const items = await CartItem.find({ cart: item.cart });
    const detailedItems = await Promise.all(
      items.map(async (i) => {
        const laptop = await fetchLaptopDetails(req, i.laptop);
        const unitPrice = (laptop?.price ?? i.unitPrice ?? 0) || 0;
        const laptopPayload = {
          _id: laptop?._id || i.laptop,
          Brand: laptop?.Brand ?? i.brand ?? "Unknown",
          Model: laptop?.Model ?? i.model ?? "",
          Spec: laptop?.Spec,
          category: laptop?.category ?? i.category ?? "",
          price: unitPrice,
          coverImage: laptop?.coverImage,
          image_url: laptop?.image_url ?? i.image_url ?? "",
        };
        return {
          _id: i._id,
          quantity: i.quantity,
          price: unitPrice * i.quantity,
          laptop: laptopPayload,
          book: laptopPayload,
        };
      })
    );

    res.json({
      cartId: item.cart,
      items: detailedItems,
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error("[Cart Controller] Error removing cart item:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// Clear cart - only callable by order-service with valid service token
export const clearCart = async (req, res) => {
  try {
    const token = req.header("X-Service-Token");
    if (!token || token !== process.env.CART_SERVICE_TOKEN) {
      return res
        .status(403)
        .json({ message: "Forbidden: invalid service token" });
    }

    const { userId } = req.body;
    if (!userId)
      return res
        .status(400)
        .json({ message: "userId is required to clear cart" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.deleteMany({ cart: cart._id });

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
