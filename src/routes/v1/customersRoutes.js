// -- Libraries -- \\
import { getAllCustomers, createCustomer, updateCustomer, getSpecificCustomer, deleteCustomer } from "../../controllers/customerController.js";

export default async function (app) {
    app.get('/customers', getAllCustomers);
    app.get('/customers/:id', getSpecificCustomer);

    app.post('/customers', createCustomer);
    app.patch('/customers/:id', updateCustomer);

    app.delete('/customers/:id', deleteCustomer);
}
