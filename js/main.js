let eventBus = new Vue()
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock > 10">In Stock</p>
            <p v-else-if="inStock <= 10 && inStock > 0">Almost sold out!</p>
            <p v-else :class="{outStock: !inStock}">Out of Stock</p>
            
            <p>Shipping: {{ shipping }}</p>
            <span v-if="onSale"> On Sale </span>
            <p>{{ sale }}</p>
            
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            ></div>

            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>

            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">
                Add to cart
            </button> 
            <br>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
        <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            linkText: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 0,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            reviews: [],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 2,
                }
            ],

            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },
    methods: {
        addToCart() {
            const variant = this.variants[this.selectedVariant];

            const productData = {
                id: variant.variantId,
                name: this.brand + ' ' + this.product,
                image: variant.variantImage,
                color: variant.variantColor,
                shipping: this.shipping,
                quantity: 1
            };

            this.$emit('add-to-cart', productData);
        },

        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },

    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale';
            } else {
                return this.brand + ' ' + this.product + ' are not on sale';
            }
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },

    },
})


Vue.component('product-details', {
    props: ["details"],
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
});

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            
             <p v-if="errors.length">
                 <b>Please correct the following error(s):</b>
                 <ul>
                    <li v-for="error in errors">{{ error }}</li>
                 </ul>
             </p>
            
             <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
             </p>
    
             <p>
               <label for="review">Review:</label>
               <textarea id="review" v-model="review"></textarea>
             </p>
    
             <p>
               <label for="rating">Rating:</label>
               <select id="rating" v-model.number="rating">
                 <option>5</option>
                 <option>4</option>
                 <option>3</option>
                 <option>2</option>
                 <option>1</option>
               </select>
             </p>
             <p>
               <label>Would you recommend this product?</label><br>
               <input type="radio" id="recommend-yes" value="yes" v-model="recommend":disabled="rating !== null && rating < 4">
               <label for="recommend-yes">Yes</label>
               <input type="radio" id="recommend-no" value="no" v-model="recommend" :disabled="rating !== null && rating >= 4">
               <label for="recommend-no">No</label>
             </p>
            
             <p>
              <input 
                type="submit" 
                value="Submit" 
                :disabled="(rating < 4 && recommend !== 'no') || (rating >= 4 && recommend !== 'yes')"> 
            </p>
            
        </form>

 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        }
    },

    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
                this.errors = []
            } else {
                this.errors = [];
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Please tell us if you would recommend this product.")
            }
        }

    },

});
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: [String, Number],
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
             <p>{{ review.name }}</p>
             <p>Rating: {{ review.rating }}</p>
             <p>{{ review.review }}</p>
              <p>
        <p>Would recommend?</> 
        {{ review.recommend === 'yes' ? ' Yes' : 'No' }}
    </p>
           </li>
         </ul>
       </div>
       
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
     
       <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
       </div>
       
     <div v-show="selectedTab === 'Shipping'">
        <p>{{ shipping }}</p>
     </div>
     
   </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        showModal: false,
    },
    methods: {
        updateCart(productData) {
            this.cart.push(productData);
        },

        removeFromCart(variantId) {
            for (let i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i].id === variantId) {
                    this.cart.splice(i, 1);
                    break;
                }
            }
        },
    },
});