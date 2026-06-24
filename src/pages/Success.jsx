import {
Link
}
from 'react-router-dom';

export default function Success(){

return(

<section
className="section-shell page"
>

<span
className="eyebrow"

>

ORDER SUCCESS

</span>

<h1>

Thank you for your order

</h1>

<p>

Your order has been received.

</p>

<Link
to="/collections"
>

<button>

Continue Shopping

</button>

</Link>

</section>

);

}
