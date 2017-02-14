'use strict';

var validator = require('indicative'),
    uuid = require('node-uuid');

const validationRules = {
    userId: 'required|alpha_numeric',
    quantity: 'required|regex:^[0-9]*\.?[0-9]*$',
    price: 'required|regex:^[0-9]*\.?[0-9]*$',
    type: 'required|in:BUY,SELL'
};

class Order {
    constructor(userId, quantity, price, type) {
        this.id = uuid.v4();
        this.userId = userId;
        this.quantity = quantity;
        this.price = price;
        this.type = type;
    }

    validate() {
        return validator.validate(this, validationRules);
    }
}

module.exports = Order;