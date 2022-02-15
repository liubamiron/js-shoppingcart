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
            <!-- Product price-->
            $${product.price}
            <!-- Product count-->
            quantity - ${product.quantity}
        </div>
    </div>
    <!-- Product actions-->
    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center">
        <button class="add-to-cart btn btn-outline-dark mt-auto">+</button>
        </div>
    </div>
   <br>
   <!-- Product actions-->
    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center">
        <button class="delete-from-cart btn btn-outline-dark mt-auto">-</button>
        </div>
    </div>
</div>
</div>
`;
}

async function fetchProducts() {
    let products = localStorage.getItem('cart');


    if (products === null) {
        const response = await fetch('https://fakestoreapi.com/products')
        const result = await response.json()

        products = result.map(product => {
            return {
                id: product.id,
                title: product.title,
                image: product.image,
                price: product.price,
                quantity: product.quantity

            };
            
        })
        console.log(products);

        localStorage.setItem('cart', JSON.stringify(products))
    } else {
        products = JSON.parse(products)
    }

    generate_table(products);

    return products;
}

// create orders table 

function generate_table(products) {
    // let products = JSON.parse(localStorage.getItem('cart'));
    // get the reference for the body
    var result = document.getElementById("result");   
    // creates a <table> element and a <tbody> element
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
    var tblHead = document.createElement("thead");
    

    tbl.appendChild(tblHead);

    var orderArrayHeader = ["Product id","Title","Price","Quantity", "Total Item Price"];
        
        for(var i=0;i<orderArrayHeader.length;i++){
            tblHead.appendChild(document.createElement("th")).
            appendChild(document.createTextNode(orderArrayHeader[i]));
        }

    for (var i = 0; i < products.length; i++) {
      // creates a table row
      
      var row = document.createElement("tr");
      row.setAttribute("border", "2")
  
    //   for (var j = 0; j < products.length; j++) {
        var cellId = document.createElement("td");
        var cellTextId = document.createTextNode(products[i].id);
        cellId.appendChild(cellTextId);
        row.appendChild(cellId);
        

        var cellTitle = document.createElement("td");
        var cellTextTitle = document.createTextNode(products[i].title);
        cellTitle.appendChild(cellTextTitle);
        row.appendChild(cellTitle);

        var cellPrice = document.createElement("td");
        var cellTextPrice = document.createTextNode(products[i].price);
        cellPrice.appendChild(cellTextPrice);
        row.appendChild(cellPrice);

        var cellQuantity = document.createElement("td");
        var cellTextQuantity = document.createTextNode(products[i].quantity);
        cellQuantity.appendChild(cellTextQuantity);
        row.appendChild(cellQuantity);

        var sum = parseFloat(cellTextPrice.data) * parseInt(cellTextQuantity.data);
        var cellTotal = document.createElement("td");
        var cellTextTotal = document.createTextNode(sum);
        cellTotal.appendChild(cellTextTotal);
        row.appendChild(cellTotal);
    //   }
  
      // add the row to the end of the table
      tblBody.appendChild(row);
    }

    // put the <tbody>
    tbl.appendChild(tblBody);

    result.appendChild(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "2");
    tbl.setAttribute("style", "margin:0 auto")
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
   addItemsToCart(product.id);
}

    function addItemsToCart(id, quantity = 1){
        let products = JSON.parse(localStorage.getItem('products'));
        //Find product from catalog, build object, add to storage
        if (localStorage.getItem('cart') === null || JSON.parse(localStorage.getItem('cart')).length === 0){
            var tempItem = find(id, products);
            var item = Object.assign({}, tempItem, {quantity: quantity});

            localStorage.setItem('cart', JSON.stringify([item]))

        }else if(find(id, JSON.parse(localStorage.getItem('cart')))){
            //Item already exists in cart, increase its quantity

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
    function total(){

   let cartProducts = JSON.parse(localStorage.getItem('cart'));
    let total = 0;

    cartProducts.forEach(product => {
        total = total + product.quantity;
    })
    return total;
}



 

function findForDelete(id, source){

    for(var i = 0; i < source.length; i++){
        if(source[i].id == id && source[i].quantity > 0){
            return source[i];
        }
    }
    return false;
}

    function deleteFromCart(event, product) {
   deleteItemsFromCart(product.id);
}

    function deleteItemsFromCart(id, quantity = 1){
        let products = JSON.parse(localStorage.getItem('products'));
        // let carts = JSON.parse(localStorage.getItem('cart'));
        
     
        if (localStorage.getItem('cart') !== null || JSON.parse(localStorage.getItem('cart')).length > 0){
    
         //Find product from catalog
         if(findForDelete(id, JSON.parse(localStorage.getItem('cart')))){
            //Item already exists in cart, increase quantity

            var cartObj = JSON.parse(localStorage.getItem('cart'));

            var oldItem = findForDelete(id, JSON.parse(localStorage.getItem('cart')));
            var itemIndex = cartObj.findIndex(x => x.id === id);
           

            var q = oldItem.quantity - 1

            if (q === 0) {
                cartObj = cartObj.filter(x => x.id !== id)
            } else {
            
                 var newItem = Object.assign({}, oldItem, {quantity: (q)});
                  cartObj[itemIndex] = newItem;
             }

            localStorage.setItem('cart', JSON.stringify(cartObj))
        
        }

        }
    }


fetchProducts().then((products) => {
    const productsRow = document.querySelector('[data-products-row2]');


    let countProducts = [];

    products.forEach(product => {
        if (countProducts === null) {
            countProducts.push(product);
        }
        else {
            countProducts.forEach(product => {
                if (this.product.id !== product.id) {
                    countProducts.push(product);
                }

            })
        }
    })

    //populate html
    products.forEach(product => {
        productsRow.innerHTML += getProductTemplate(product)
    });

    document.querySelector("#total").innerHTML = total();
   


    products.forEach(product => {
        const addToCartButton = productsRow.querySelector(`#product-${product.id} button.add-to-cart`)
        addToCartButton.addEventListener('click', (event) => {
            addtoCart(event, product)


            if (addToCartButton.style.color == 'orange') {
                addToCartButton.style.color = '';
                

            } else {
                addToCartButton.style.color = 'orange';
            }

            document.querySelector("#total").innerHTML = total();
            document.location.reload();

        })

        const deleteFromCartButton = productsRow.querySelector(`#product-${product.id} button.delete-from-cart`)
        deleteFromCartButton.addEventListener('click', (event) => {
            deleteFromCart(event, product)


            if (deleteFromCartButton.style.color == 'orange') {
                deleteFromCartButton.style.color = '';
                

            } else {
                deleteFromCartButton.style.color = 'orange';
            }

            document.querySelector("#total").innerHTML = total();
            document.location.reload();

        })

    });
})
 
