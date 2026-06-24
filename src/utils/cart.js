export function getCart() {
return JSON.parse(
localStorage.getItem(
'cart'
) || '[]'
);
}

export function addToCart(
product
){

const cart =
getCart();

const existing =
cart.find(
p=>
p.id===product.id
);

if(existing){

existing.quantity += 1;

}else{

cart.push({

id:
product.id,

title:
product.title,

price:
product.price,

coverImage:
product.coverImage,

quantity:
1

});

}

localStorage.setItem(
'cart',
JSON.stringify(
cart
)
);

window.dispatchEvent(
new Event(
'cartUpdated'
)
);

}
