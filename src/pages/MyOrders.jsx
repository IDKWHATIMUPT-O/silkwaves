import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function MyOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const phone = localStorage.getItem("customerPhone");

        const res = await fetch(

          `${API}/orders?phone=${phone}`

        );

        const data = await res.json();

        setOrders(data);

      }

      catch (err) {

        console.error(err);

      }

      finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  if (loading) {

    return <h2>Loading Orders...</h2>;

  }

  return (

    <section className="section-shell page">

      <span className="eyebrow">

        MY ORDERS

      </span>

      <h1>

        Order History

      </h1>

      {

        orders.length === 0 ?

        (

          <div className="empty-state">

            No orders found.

          </div>

        )

        :

        (

          orders.map(order => (

            <div

              key={order.id}

              className="product-card"

              style={{ marginBottom: "30px" }}

            >

              <h3>

                {order.id}

              </h3>

              <p>

                Payment: {order.payment}

              </p>

              <p>

                Status: {order.status}

              </p>

              <p>

                Amount: ₹{order.amount}

              </p>

              <p>

                AWB: {order.awb || "Not Generated"}

              </p>

              <p>

                Courier: {order.courier}

              </p>

            </div>

          ))

        )

      }

    </section>

  );

}