import {
useEffect,
useState
}
from 'react';

import {
Link
}
from 'react-router-dom';

import {

  getCart,

  increaseQuantity,

  decreaseQuantity,

  removeFromCart,

  clearCart

} from "../utils/cart.js";

import {
formatPrice
}
from '../utils/currency.js';

export default function Cart(){

const [
cart,
setCart
]=useState([]);

useEffect(()=>{

setCart(
getCart()
);

},[]);
function refreshCart() {

  setCart(getCart());

}
const total=
cart.reduce(

(a,b)=>

a+
(
Number(
b.price
)*
b.quantity
),

0

);

return(

<section
className="section-shell page"
>

<span
className="eyebrow"

>

SHOPPING CART

</span>

<h1>

Your Cart

</h1>

{

cart.length===0

?

(

<div
className="empty-state"
>

Your cart is empty

</div>

)

:

(

<>

<div
className="product-grid"
>

{

cart.map(

(item)=>(

<article
className="product-card"
key={
item.id
}
>

<div
className="product-card__media"
>

<img

src={
item.coverImage
}

alt={
item.title
}

/>

</div>

<div
className="product-card__content"
>

<span className="eyebrow">

Qty: {item.quantity}

</span>

<h3>

{item.title}

</h3>

<p>

{formatPrice(item.price)}

</p>

<div
style={{

display:"flex",

alignItems:"center",

gap:"10px",

marginTop:"15px"

}}
>

<button
className="button"
onClick={()=>{
decreaseQuantity(item.id);
refreshCart();
}}
>

-

</button>

<strong>

{item.quantity}

</strong>

<button
className="button"
onClick={()=>{
increaseQuantity(item.id);
refreshCart();
}}
>

+

</button>

<button
className="button"
style={{marginLeft:"20px"}}
onClick={()=>{
removeFromCart(item.id);
refreshCart();
}}
>

Remove

</button>

</div>

<h3>

{
item.title
}

</h3>

<p>

{
formatPrice(
item.price
)
}

</p>

</div>

</article>

)

)

}

</div>

<div
style={{

marginTop:"40px",

borderTop:"1px solid #ddd",

paddingTop:"25px"

}}
>

<div
style={{

display:"flex",

justifyContent:"space-between",

marginBottom:"10px"

}}
>

<span>

Subtotal

</span>

<strong>

{formatPrice(total)}

</strong>

</div>

<div
style={{

display:"flex",

justifyContent:"space-between",

marginBottom:"20px"

}}
>

<span>

Shipping

</span>

<strong>

FREE

</strong>

</div>

<div
style={{

display:"flex",

justifyContent:"space-between",

fontSize:"22px",

marginBottom:"25px"

}}
>

<strong>

Total

</strong>

<strong>

{formatPrice(total)}

</strong>

</div>

<div
style={{

display:"flex",

gap:"15px"

}}
>

<button

className="button"

onClick={()=>{

clearCart();

refreshCart();

}}

>

Clear Cart

</button>

<Link
to="/checkout"
>

<button
className="button"
>

Checkout

</button>

</Link>

</div>

</div>

</>

)

}

</section>

);

}
