const seller_address_field = document.getElementById("insert_seller_address");
const seller_pan_field = document.getElementById("insert_pan");
const seller_gst_field = document.getElementById("insert_gst");
const supply_place_field = document.getElementById("insert_supply_place");
const billing_address_field = document.getElementById("insert_billing_address");
const billing_state_code_field = document.getElementById("insert_state_code");
const shipping_address_field = document.getElementById(
  "insert_shipping_address"
);
const shipping_state_code_field = document.getElementById(
  "insert_ship_state_code"
);
const delivery_place_field = document.getElementById("insert_del_place");
const order_number_field = document.getElementById("insert_order_num");
const order_date_field = document.getElementById("insert_order_date");
const invoice_number_field = document.getElementById("insert_invoice_num");
const invoice_date_field = document.getElementById("insert_invoice_date");
const invoice_details_field = document.getElementById("insert_invoice_details");
const insert_row_field = document.getElementById("insert_item_row");

// this ia an object containing two key-value pairs: data:invoice data and meta: not needed
const fetchData = async () => {
  const response = await fetch(
    "https://invoice-generator-bc103-default-rtdb.firebaseio.com/invoice.json"
  );
  const invoice_obj = await response.json();
  let two_taxes = false;
  if (invoice_obj.supply_place == invoice_obj.delivery_place) two_taxes = true;
  seller_address_field.innerHTML =
    invoice_obj.seller_name + "\n" + invoice_obj.seller_adress;
  seller_pan_field.innerHTML = invoice_obj.seller_pan;
  seller_gst_field.innerHTML = invoice_obj.seller_gst;
  supply_place_field.innerHTML = invoice_obj.supply_place;
  billing_address_field.innerHTML =
    invoice_obj.billing_name + "  , " + invoice_obj.billing_address;
  billing_state_code_field.innerHTML = invoice_obj.billing_state_code;
  shipping_address_field.innerHTML =
    invoice_obj.shippping_name + " , " + invoice_obj.shipping_address;
  shipping_state_code_field.innerHTML = invoice_obj.shipping_state_code;
  delivery_place_field.innerHTML = invoice_obj.delivery_place;
  order_number_field.innerHTML = invoice_obj.order_number;
  order_date_field.innerHTML = invoice_obj.order_date;
  invoice_number_field.innerHTML = invoice_obj.invoice_number;
  invoice_date_field.innerHTML = invoice_obj.invoice_date;
  invoice_details_field.innerHTML = invoice_obj.invoice_details;
  let list_items = invoice_obj.listitems;
  // console.log(typeof list_items);
  let overall_tax = 0,
    overall_amount = 0;
  let cnt = 0;
  for (key in list_items) {
    cnt++;
    let element = list_items[key];
    let notes = element.description;
    // console.log(typeof element.quantity);
    let quantity = element.quantity;
    // console.log(quantity);
    let cost = element.unit_price;
    console.log(cost);
    let discount = element.discount * 0.01 * cost * quantity;
    let net_amount = cost * quantity - discount;

    let tax_rate_1, tax_rate_2, tax_type_1, tax_type_2;
    if (two_taxes) {
      tax_rate_1 = 9;
      tax_rate_2 = 9;
      tax_type_1 = "CGST";
      tax_type_2 = "SGST";
    } else {
      tax_rate_1 = 18;
      tax_rate_2 = 0;
      tax_type_1 = "IGST";
      // tax_type_2="SGST";
    }
    let total_tax = 0.01 * ((tax_rate_1 + tax_rate_2) * net_amount);
    let total_amount = net_amount + total_tax;
    // console.log(total_amount);
    overall_tax += total_tax;
    overall_amount += total_amount;

    insert_row_field.innerHTML += `<tr>
    <td>${cnt}</td>
    <td>${notes}</td>
    <td>${cost}</td>
    <td>${quantity}</td>
    <td>${element.discount}</td>
    <td>${net_amount}</td>
    <td>${tax_rate_1}</td>
    <td>${tax_type_1}</td>
    <td>${0.01 * tax_rate_1 * net_amount}</td>
    <td>${total_amount}</td>
    </tr>
    `;
    if (two_taxes) {
      insert_row_field.innerHTML += `<tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>${tax_rate_2}</td>
    <td>${tax_type_2}</td>
    <td >${0.01 * tax_rate_2 * net_amount}</td>
    </tr>
    `;
    }
  }
  insert_row_field.innerHTML += ` <tr>
  <td colspan="8">Total :</td>
  <td><span >${overall_tax}</span></td>
  <td><span >${overall_amount}</span></td>
</tr>
<tr>
  <td colspan="10">
    <div class="row1">
      <div class="billing-address">
        <h4>Seller company</h4>
        <img
          src="./Screenshot 2024-02-01 170457.png"
          alt="yoursignaturehere"
          class="signatureimage"
        />
        <h4>Authorized Signatory</h4>
      </div>
    </div>
  </td>
</tr>`;
  console.log("all ok");
};
fetchData();
