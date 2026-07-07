import { Link } from "react-router-dom";

export default function Success() {

  const orderId = localStorage.getItem("lastOrderId");

  return (

    <section className="section-shell page">

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          textAlign: "center",
          padding: "60px 20px"
        }}
      >

        <div
          style={{
            fontSize: "70px",
            marginBottom: "20px"
          }}
        >
          ✅
        </div>

        <span className="eyebrow">
          PAYMENT SUCCESSFUL
        </span>

        <h1>
          Thank you for your order!
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#666",
            marginTop: "20px"
          }}
        >
          Your order has been placed successfully.
        </p>

        {orderId && (

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "14px"
            }}
          >

            <strong>Order Number</strong>

            <h2>{orderId}</h2>

          </div>

        )}

        <p
          style={{
            marginTop: "25px"
          }}
        >
          Estimated delivery:
          <strong> 3–7 Business Days</strong>
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginTop: "40px"
          }}
        >

          <Link to="/collections">

            <button className="button">

              Continue Shopping

            </button>

          </Link>

          <Link to="/my-orders">

            <button className="button">

              My Orders

            </button>

          </Link>

        </div>

      </div>

    </section>

  );

}