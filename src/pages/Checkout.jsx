import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../utils/cart.js';

const API =
import.meta.env
.VITE_API_BASE_URL;

const RAZORPAY_KEY =
import.meta.env
.VITE_RAZORPAY_KEY_ID;

export default function Checkout(){

const navigate=
useNavigate();

const cart=
getCart();

const [
form,
setForm
]=useState({

name:'',
phone:'',
address:'',
city:'',
pincode:''

});

const [
loading,
setLoading
]=useState(false);

function update(
field,
value
){

setForm(

current=>({

...current,

[field]: value

})

);

}

async function placeOrder(){
    console.log(
window.Razorpay
);

setLoading(
true
);

try{

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

const payment=
await fetch(

`${API}/create-payment`,

{

method:
'POST',

headers:{
'Content-Type':
'application/json'
},

body:
JSON.stringify({

amount:
total

})

}

);

const order=
await payment.json();

const options={

key:
RAZORPAY_KEY,

amount:
order.amount,

currency:
"INR",

order_id:
order.id,

name:
"Silkwaves",

description:
"Saree Purchase",

handler:

async function(){

const payload={

customer:
form.name,

phone:
form.phone,

address:
form.address,

city:
form.city,

pincode:
form.pincode,

payment:
'Paid',

items:

cart.map(
p=>({

productId:
p.id,

quantity:
p.quantity

}))

};

const res=
await fetch(

`${API}/orders`,

{

method:
'POST',

headers:{
'Content-Type':
'application/json'
},

body:
JSON.stringify(
payload
)

}

);

if(
!res.ok
){

throw new Error(
'Order failed'
);

}

localStorage.removeItem(
'cart'
);

window.dispatchEvent(
new Event(
'cartUpdated'
)
);

navigate(
'/success'
);

}

};

if(
!window.Razorpay
){

throw new Error(
'Razorpay SDK not loaded'
);

}

if(
!window.Razorpay
){

throw new Error(
'Razorpay SDK not loaded'
);

}

const razor =
new window.Razorpay(
options
);

razor.open();

razor.open();

}

catch(err){

alert(
err.message
);

}

finally{

setLoading(
false
);

}

}

return(

<section
className="section-shell page"
>

<span className="eyebrow">

CHECKOUT

</span>

<h1>

Complete Order

</h1>

<input
placeholder="Full Name"
onChange={
e=>
update(
'name',
e.target.value
)
}
/>

<input
placeholder="Phone"
onChange={
e=>
update(
'phone',
e.target.value
)
}
/>

<input
placeholder="Address"
onChange={
e=>
update(
'address',
e.target.value
)
}
/>

<input
placeholder="City"
onChange={
e=>
update(
'city',
e.target.value
)
}
/>

<input
placeholder="Pincode"
onChange={
e=>
update(
'pincode',
e.target.value
)
}
/>

<button
onClick={
placeOrder
}

>

{

loading

?

'Opening Payment...'

:

'Pay Now'

}

</button>

</section>

);

}
