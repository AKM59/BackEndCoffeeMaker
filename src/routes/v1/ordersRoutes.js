// -- Libraries -- \\
import { getAllOrders, getSpecificOrder, getOrdersByCustomer, createOrder, updateOrder, deleteOrder, getFilteredOrders } from "../../controllers/orderController.js";

export default async function (app) {
    app.get('/orders', getAllOrders);
    app.get('/orders/filters', getFilteredOrders);

    app.get('/orders/:id', getSpecificOrder);
    app.get('/orders/costumer/:id', getOrdersByCustomer);

    app.post('/orders', createOrder);
    app.patch('/orders/:id', updateOrder);

    app.delete('/orders/:id', deleteOrder);
}
