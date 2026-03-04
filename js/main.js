let product = "Socks";
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Array,
            required: true
        },
        template: `
        <div class="product">
         <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ sale }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In Stock</p>  
            <p v-else>Out of Stock</p>
            <p v-if="inventory > 10">In stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else>Out of stock</p>
            <span v-if="onSale">On sale</span>
            <div class="color-box"
             v-for="(variant, index) in variants"
             :key="variant.variantId"
        :style="{ backgroundColor: variant.variantColor }"
             @mouseover="updateProduct(index)">
        </div>
            <product-details :details="details"> </product-details>
            <p>Shipping: {{ shipping }}</p>
            <ul>
                <li v-for="size in sizes">{{size}}</li>
            </ul>
            <button v-on:click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock}">Add to cart</button>
            <div class="cart-redu">
        </div>
        <button v-on:click="reduToCart">Reduce to cart</button>
        <button v-on:click="removeFromCart">Remove from cart</button>
            <p v-if="inStock">In stock</p>
            <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
        </div>
        </div>
`,
        data() {
            return {
                product: "Socks",
                brand: 'Vue Mastery',
                description: "A pair of warm, fuzzy socks",
                selectedVariant: 0,
                altText: "A pair of socks",
                link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
                inventory: 100,
                onSale: true,
                details: ['80% cotton', '20% polyester', 'Gender-neutral'],
                variants: [
                    {
                        variantId: 2234,
                        variantColor: 'green',
                        variantImage: "./assets/vmSocks-green-onWhite.jpg",
                        variantQuantity: 10
                    },
                    {
                        variantId: 2235,
                        variantColor: 'blue',
                        variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                        variantQuantity: 0
                    }
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            }
        },
        methods: {
            addToCart() {
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            },
            removeFromCart() {
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
            },
            updateProduct(index) {
                this.selectedVariant = index;
                console.log(index);
            },
            reduToCart() {
                this.cart -= 1
            }
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product;
            },
            image() {
                return this.variants[this.selectedVariant].variantImage;
            },
            inStock() {
                return this.variants[this.selectedVariant].variantQuantity
            },
            sale() {
                if (this.onSale) {
                    return this.brand + ' ' + this.product + ' ' + 'is on sale!';
                } else {
                    return this.brand + ' ' + this.product + ' ' + 'is not on sale!';
                }
            },
            shipping() {
                if (this.premium) {
                    return "Free";
                } else {
                    return 2.99
                }
            },
        }
    }
})

Vue.component('product-details', {
    props: {
        details:{
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details" :key="detail"> {{ detail }} </li>
    </ul>`
})

let app = new Vue ({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        }
    }
})