// Guest cart stored in localStorage
export interface GuestCartItem {
    productId: string;
    quantity: number;
    addedAt: string;
}

export interface GuestCart {
    items: GuestCartItem[];
    updatedAt: string;
}

const GUEST_CART_KEY = 'neonshop_guest_cart';

export const guestCartManager = {
    // Get guest cart
    getCart: (): GuestCart => {
        if (typeof window === 'undefined') return { items: [], updatedAt: new Date().toISOString() };

        try {
            const stored = localStorage.getItem(GUEST_CART_KEY);
            if (!stored) return { items: [], updatedAt: new Date().toISOString() };

            return JSON.parse(stored);
        } catch (error) {
            console.error('Error reading guest cart:', error);
            return { items: [], updatedAt: new Date().toISOString() };
        }
    },

    // Save guest cart
    saveCart: (cart: GuestCart): void => {
        if (typeof window === 'undefined') return;

        try {
            cart.updatedAt = new Date().toISOString();
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving guest cart:', error);
        }
    },

    // Add item to guest cart
    addItem: (productId: string, quantity: number = 1): void => {
        const cart = guestCartManager.getCart();
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                addedAt: new Date().toISOString(),
            });
        }

        guestCartManager.saveCart(cart);
    },

    // Update item quantity
    updateItem: (productId: string, quantity: number): void => {
        const cart = guestCartManager.getCart();
        const item = cart.items.find(item => item.productId === productId);

        if (item) {
            item.quantity = quantity;
            guestCartManager.saveCart(cart);
        }
    },

    // Remove item from cart
    removeItem: (productId: string): void => {
        const cart = guestCartManager.getCart();
        cart.items = cart.items.filter(item => item.productId !== productId);
        guestCartManager.saveCart(cart);
    },

    // Clear entire cart
    clearCart: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(GUEST_CART_KEY);
    },

    // Get cart count
    getCartCount: (): number => {
        const cart = guestCartManager.getCart();
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    },

    // Check if product is in cart
    hasProduct: (productId: string): boolean => {
        const cart = guestCartManager.getCart();
        return cart.items.some(item => item.productId === productId);
    },

    // Get item quantity
    getItemQuantity: (productId: string): number => {
        const cart = guestCartManager.getCart();
        const item = cart.items.find(item => item.productId === productId);
        return item?.quantity || 0;
    },

    // Sync guest cart with user cart (when user logs in)
    syncWithUserCart: async (userCartItems: any[]) => {
        const guestCart = guestCartManager.getCart();

        // Return items that need to be added to user cart
        const itemsToSync = guestCart.items.filter(guestItem => {
            return !userCartItems.some(userItem => userItem.productId === guestItem.productId);
        });

        return itemsToSync;
    },
};