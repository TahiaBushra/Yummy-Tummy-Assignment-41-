import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const frontend_url = process.env.CLIENT_HOSTNAME as string;

interface CheckoutSessionRequest {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    addressLine1: string;
    country: string;
    city: string;
  };
  restaurantId: string;
}

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

function createLineItems(
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "USD",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
}
