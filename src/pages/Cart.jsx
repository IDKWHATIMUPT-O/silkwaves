import { useEffect, useState } from 'react';
import { getCart } from '../utils/cart.js';

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
b.price*
b.quantity
),

0

);

return(

<div
className="section-shell page"
>

<h1>
Cart
</h1>

{

cart.map(
(item)=>(

<div
key={
item.id
}
>

<h3>
{
item.title
}
</h3>

<p>

Qty:
{
item.quantity
}

</p>

<p>

₹{
item.price
}

</p>

</div>

)

)

}

<h2>

Total:

₹{
total
}

</h2>

<button>

Checkout

</button>

</div>

);

}
