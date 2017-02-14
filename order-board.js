'use strict';

var Order = require('./models/order.js'),
    _ = require('lodash');

class OrderBoard {
    constructor() {
        this.orders = [];
    }

    registerOrder(userId, quantity, price, type) {
        var order = new Order(userId, quantity, price, type),
            that = this;

        return new Promise((resolve, reject) => {
            order.validate()
                .then(order => {
                    that.orders.push(order);

                    resolve(order.id);
                })
                .catch(errors => reject(errors));
        });
    }

    cancelOrder(orderId) {
        const idx = _.findIndex(this.orders, o => o.id === orderId),
            that = this;

        return new Promise((resolve, reject) => {
            if (idx > -1) {
                that.orders.splice(idx, 1);

                resolve();
            } else {
                reject(`Order with ID ${orderId} not found`);
            }
        });
    }

    getSummary() {
        // groups by type, then calculates quantity totals per each distinct price
        const summary = _.chain(this.orders)
            .map(o => {
                return {
                    quantity: o.quantity,
                    price: o.price,
                    type: o.type
                };
            })
            .groupBy('type')
            .map(ordersOfType => {
                const type = ordersOfType[0].type;

                return {
                    type: type,
                    prices: _.chain(ordersOfType)
                                .orderBy('price', type === 'SELL' ? 'asc' : 'desc')
                                .groupBy('price')
                                .map(ordersOfTypeAndPrice => {
                                    const price = ordersOfTypeAndPrice[0].price;

                                    return {
                                        price: price,
                                        quantity: _.reduce(ordersOfTypeAndPrice, (quantity, o) => quantity + o.quantity, 0)
                                    };
                                })
                                .value()
                };
            })
            .value();

        return summary;
    }

    printSummary(summary) {
        console.log('Order Summary');

        summary.forEach(type => {
            console.log(`${type.type}:`);

            type.prices.forEach(price => {
                console.log(`- ${price.quantity} kg for £${price.price}`);
            });
        });
    }
}

module.exports = OrderBoard;