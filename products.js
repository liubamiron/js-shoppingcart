"use strict"


function getProductTemplate(product) {
    return `
 <div class="col mb-5">
    <div class="card h-100 product-id" id="product-${product.id}">
        <!-- Product image-->
        <img class="card-img-top" src="${product.image}" alt="..." />
        <!-- Product details-->
        <div class="card-body p-4">
        <div class="text-center">
            <!-- Product name-->
            <h5 class="fw-bolder">${product.title}</h5>
            <!-- Product reviews-->
            <div class="star-rating d-flex justify-content-center small text-warning mb-2">
                ${product.stars}
                
            </div>
            <!-- Product price-->
            $${product.price}
           
        </div>
    </div>
    <!-- Product actions-->
    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center">
        <button class="add-to-cart btn btn-outline-dark mt-auto">Add to cart</button>
        </div>
    </div>
</div>
</div>
`;
}


async function fetchProducts() {
    let products = localStorage.getItem('products');

    if (products === null) {
        const response = await fetch('https://fakestoreapi.com/products')
        const result = await response.json()

        products = result.map(product => {
            return {
                id: product.id,
                title: product.title,
                image: product.image,
                price: product.price,
                stars: Math.round(product.rating.rate),
                quantity: product.quantity
                // count: 1
            };
        })

        localStorage.setItem('products', JSON.stringify(products))
    } else {
        products = JSON.parse(products)
    }

    return products;
}

function find(id, source){

    for(var i = 0; i < source.length; i++){
        if(source[i].id == id){
            return source[i];
        }
    }
    return false;
}

function addtoCart(event, product) {
   add(product.id);
}

/*
	*Add items to cart
	*/

	function add(id, quantity = 1){
        let products = JSON.parse(localStorage.getItem('products'));
		//Find product from catalog, build object, add to storage
		if (localStorage.getItem('cart') === null || JSON.parse(localStorage.getItem('cart')).length === 0){
			var tempItem = find(id, products);
			var item = Object.assign({}, tempItem, {quantity: quantity});

			localStorage.setItem('cart', JSON.stringify([item]))

		}else if(find(id, JSON.parse(localStorage.getItem('cart')))){
			//Item already exists in cart, increase quantity

			var cartObj = JSON.parse(localStorage.getItem('cart'));

			var oldItem = find(id, JSON.parse(localStorage.getItem('cart')));
			var itemIndex = cartObj.findIndex(x => x.id === id);
			var newItem = Object.assign({}, oldItem, {quantity: (quantity + oldItem.quantity)});

			cartObj[itemIndex] = newItem;
			localStorage.setItem('cart', JSON.stringify(cartObj))
		
		}else{
			var tempItem = find(id, products);
			var item = Object.assign({}, tempItem, {quantity: quantity});

			var cartObj = JSON.parse(localStorage.getItem('cart'));
			cartObj.push(item)
			localStorage.setItem('cart', JSON.stringify(cartObj))
		}		
	}
    /*
	*Show single item from cart
	*/
	 function showSingleItem(id){
	 	return find(id, JSON.parse(localStorage.getItem('cart')))
	 }
    /*
	*List all items in cart
	*/
	function allItemsInCart(){
		return  JSON.parse(localStorage.getItem('cart'));
	}

	
	/*Sum cost of items in cart
	*/

	function sum(){
		var sum = 0;
		var items = JSON.parse(localStorage.getItem('cart'));

		for (var i = 0; i < items.length; i++) {
			sum += (items[i].price * items[i].quantity)
		}
		return sum;       
	 }
     
    /*
	*Remove an item from cart
	*/
	function remove(id){
		
		var items = JSON.parse(localStorage.getItem('cart'));
		var index = items.findIndex(x => x.id == id);

		if (index >= 0){
			items.splice(index, 1)
			localStorage.setItem('cart', JSON.stringify(items));
		}
	}

    /*
	*Update cart item by its quantity
	*/
	function update(id, quantity){
		var cartObj = JSON.parse(localStorage.getItem('cart'));

		var oldItem = this.find(id, cartObj)
		var itemIndex = cartObj.findIndex(x => x.id === id);
		var updatedItem = Object.assign({}, oldItem, {quantity: quantity})
		cartObj[itemIndex] = updatedItem;

		//Save back to storage
		localStorage.setItem('cart', JSON.stringify(cartObj))
        
	}

fetchProducts().then((products) => {
    const productsRow = document.querySelector('[data-products-row]');


    //populate html
    products.forEach(product => {
        productsRow.innerHTML += getProductTemplate(product)
    });
    //add listner to elements
    products.forEach(product => {
        const addToCartButton = productsRow.querySelector(`#product-${product.id} button.add-to-cart`)
        addToCartButton.addEventListener('click', (event) => {
            addtoCart(event, product)

            // console.log(addToCartButton); 
            let cartProducts = JSON.parse(localStorage.getItem('cart'));

            let total = 0;

            cartProducts.forEach(product => {
                total = total + product.quantity;
            })

            if (addToCartButton.style.color == 'orange') {
                addToCartButton.style.color = '';
                

            } else {
                addToCartButton.style.color = 'orange';
                
            }
             document.querySelector("#total").innerHTML=total;
            //    console.log(addToCartButton);             
        })
        const $productratio = productsRow.querySelector(`#product-${product.id} .star-rating`);

        const text = $productratio.textContent;
        $productratio.innerHTML = '';
        for (var i = 0; i < parseInt(text); i++) {
            $productratio.innerHTML += '<div class="bi-star-fill"></div>';

        }

    });

})


