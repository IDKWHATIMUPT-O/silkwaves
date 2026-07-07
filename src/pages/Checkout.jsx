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
const total = cart.reduce(

  (sum, item) =>

    sum +

    Number(item.price) *

    item.quantity,

  0

);

const [form, setForm] = useState({

  name: "",

  email: "",

  phone: "",

  address: "",

  city: "",

  state: "",

  pincode: ""

});
const [deliveryStatus, setDeliveryStatus] = useState("");

const [checkingPincode, setCheckingPincode] = useState(false);
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
const STATE_NAMES = {

  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CG: "Chhattisgarh",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JH: "Jharkhand",
  KA: "Karnataka",
  KL: "Kerala",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  PB: "Punjab",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TG: "Telangana",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UK: "Uttarakhand",
  WB: "West Bengal",
  DL: "Delhi"

};
async function checkPincode(pin) {

  if (pin.length !== 6) return;

  setCheckingPincode(true);

  try {

    const res = await fetch(
  `${API}/public/check-serviceability?pincode=${pin}`
);

const data = await res.json();
console.log(data);
if (!res.ok) {

  throw new Error("Unable to check serviceability");

}

    if (
  data.delivery_codes &&
  data.delivery_codes.length > 0
) {

      const office =
data.delivery_codes[0].postal_code;

setForm(current => ({

  ...current,

  city: office.city,

  state: STATE_NAMES[office.state_code] || office.state_code

}));

setDeliveryStatus(
  `✅ Delivery available in ${office.city}`
);

    }

    else {

      setDeliveryStatus("❌ Delivery Not Available");

    }

  }

  catch (err) {

    console.error(err);

    setDeliveryStatus("Unable to check delivery");

  }

  finally {

    setCheckingPincode(false);

  }

}
async function placeOrder(){
    console.log(
window.Razorpay
);

setLoading(
true
);
// Empty Cart
if (cart.length === 0) {

  setLoading(false);

  return alert("Your cart is empty.");

}

// Name
if (!form.name.trim()) {

  setLoading(false);

  return alert("Please enter your name.");

}

// Phone
if (!/^[6-9]\d{9}$/.test(form.phone)) {

  setLoading(false);

  return alert("Please enter a valid 10-digit phone number.");

}

// Address
if (!form.address.trim()) {

  setLoading(false);

  return alert("Please enter your address.");

}

// City
if (!form.city.trim()) {

  setLoading(false);

  return alert("Please enter your city.");

}

// Pincode
if (!/^\d{6}$/.test(form.pincode)) {

  setLoading(false);

  return alert("Please enter a valid 6-digit pincode.");

}
try{
const productsResponse = await fetch(

  `${API}/products`

);

const productList = await productsResponse.json();

for (const item of cart) {

  const latest = productList.find(

    p => String(p._id) === String(item.id) ||

         String(p.id) === String(item.id)

  );

  if (!latest) {

    throw new Error(

      `${item.title} no longer exists.`

    );

  }

  if (latest.stock < item.quantity) {

    throw new Error(

      `${item.title} only has ${latest.stock} item(s) left in stock.`

    );

  }

}
// Create Pending Order First

const orderPayload = {

  customer: form.name,

  email: form.email || "",

  phone: form.phone,

  address: form.address,

  city: form.city,

  state: form.state,

  pincode: form.pincode,

  amount: total,

  items: cart.map(item => ({

    productId: item.id,

    title: item.title,

    price: item.price,

    quantity: item.quantity

  }))

};

const orderRequest = await fetch(

  `${API}/orders`,

  {

    method: "POST",

    headers: {

      "Content-Type": "application/json"

    },

    body: JSON.stringify(orderPayload)

  }

);

if (!orderRequest.ok) {

  throw new Error("Unable to create order");

}

const pendingOrder = await orderRequest.json();
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

body: JSON.stringify({

amount: total,

orderId: pendingOrder.id

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

handler: async function (response) {

  try {

    const verify = await fetch(

      `${API}/verify-payment`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          razorpay_order_id: response.razorpay_order_id,

          razorpay_payment_id: response.razorpay_payment_id,

          razorpay_signature: response.razorpay_signature,

          orderId: pendingOrder.id

        })

      }

    );

    const verifyResult = await verify.json();

    if (!verify.ok) {

      throw new Error(

        verifyResult.error ||

        "Payment verification failed"

      );

    }

    localStorage.removeItem("cart");

    window.dispatchEvent(

      new Event("cartUpdated")

    );

    navigate("/success");

  }

  catch (err) {

    alert(err.message);

  }

}

};

if(
!window.Razorpay
){

throw new Error('Razorpay SDK not loaded');

}

const razor = new window.Razorpay(options);

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
placeholder="Email"
onChange={
e=>
update(
'email',
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

value={form.city}

readOnly
disabled

/>
<input

placeholder="State"

value={form.state}

readOnly

/>
<input
placeholder="Pincode"

value={form.pincode}

onChange={(e)=>{

const pin = e.target.value;

update("pincode", pin);

if (pin.length === 6) {

  checkPincode(pin);

}

}}

/>
{checkingPincode && (

<p>

Checking delivery...

</p>

)}

{deliveryStatus && (

<p>

{deliveryStatus}

</p>

)}
<div
style={{
marginTop:"30px",
padding:"20px",
border:"1px solid #ddd",
borderRadius:"12px"
}}
>

<h2>Order Summary</h2>

{

cart.map(item=>(

<div

key={item.id}

style={{
display:"flex",
justifyContent:"space-between",
marginBottom:"10px"
}}

>

<div>

<strong>

{item.title}

</strong>

<br/>

Qty: {item.quantity}

</div>

<div>

₹{

(Number(item.price)*item.quantity)

.toLocaleString("en-IN")

}

</div>

</div>

))

}

<hr/>

<div
style={{
display:"flex",
justifyContent:"space-between",
marginTop:"15px"
}}
>

<strong>

Subtotal

</strong>

<strong>

₹{

total.toLocaleString("en-IN")

}

</strong>

</div>

<div
style={{
display:"flex",
justifyContent:"space-between"
}}
>

<span>

Shipping

</span>

<span>

FREE

</span>

</div>

<hr/>

<div
style={{
display:"flex",
justifyContent:"space-between",
fontSize:"20px",
marginTop:"15px"
}}
>

<strong>

Total

</strong>

<strong>

₹{

total.toLocaleString("en-IN")

}

</strong>

</div>

</div>
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
