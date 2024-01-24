import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from '../product/product.model';

export class AddToCart {
  static readonly type = '[Cart] Add to Cart';
  constructor(public payload: Product) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove from Cart';
  constructor(public payload: number) {}
}

export class ClearCart {
  static readonly type = '[Cart] Clear Cart';
}

interface CartStateModel {
  cart: Product[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    cart: []
  }
})
export class CartState {
  @Selector()
  static getCart(state: CartStateModel): Product[] {
    return state.cart;
  }

  @Action(AddToCart)
  addToCart(ctx: StateContext<CartStateModel>, action: AddToCart) {
    const state = ctx.getState();
    const existingProduct = state.cart.find(product => product.id === action.payload.id);

    if (existingProduct) {
      const updatedCart = state.cart.map(product =>
        product.id === action.payload.id ? { ...product, quantity: product.quantity + 1 } : product
      );

      ctx.setState({
        ...state,
        cart: updatedCart,
      });
    } else {
      ctx.setState({
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      });
    }
  }

  @Action(RemoveFromCart)
  removeFromCart(ctx: StateContext<CartStateModel>, action: RemoveFromCart) {
    const state = ctx.getState();
    const existingProduct = state.cart.find(product => product.id === action.payload);

    if (existingProduct) {
      const updatedCart = state.cart.map(product =>
        product.id === action.payload ? { ...product, quantity: product.quantity - 1 } : product
      );

      ctx.setState({
        ...state,
        cart: updatedCart.filter(product => product.quantity > 0),
      });
    }
  }

  @Action(ClearCart)
  clearCart(ctx: StateContext<CartStateModel>) {
    ctx.setState({
      cart: []
    });
  }
}

