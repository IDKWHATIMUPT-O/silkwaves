import {
useState
}
from 'react';

import {
useNavigate
}
from 'react-router-dom';

import {
getCart
}
from '../utils/cart.js';

const API =
import.meta.env
.VITE_API_BASE_URL;

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

setLoading(
true
);

try{

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
'Pending',

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

navigate(
'/success'
);

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

<span
className="eyebrow"

>

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

'Placing...'

:

'Place Order'

}

</button>

</section>

);

}
