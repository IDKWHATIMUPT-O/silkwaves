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
getCart
}
from '../utils/cart.js';

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

<span
className="eyebrow"

>

Qty:
{
item.quantity
}

</span>

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

display:
'flex',

justifyContent:
'space-between',

alignItems:
'center',

marginTop:
'40px'

}}

>

<h2>

Total:

{
formatPrice(
total
)
}

</h2>

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

</>

)

}

</section>

);

}
