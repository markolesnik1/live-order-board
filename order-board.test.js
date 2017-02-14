'use strict';

const OrderBoard = require('./order-board.js');
const expect = require('expect');

describe('OrderBoard class', () => {
    it('Should register a single order and print order summary', done => {
        var orderBoard = new OrderBoard();

        orderBoard.registerOrder('user01', 3.5, 100.75, 'BUY')
            .then(() => {
                const summary = orderBoard.getSummary();
                orderBoard.printSummary(summary);

                expect(summary.length).toBe(1);

                const buys = summary[0];
                expect(buys.type).toBe('BUY');
                expect(buys.prices.length).toBe(1);
                expect(buys.prices[0].price).toBe(100.75);
                expect(buys.prices[0].quantity).toBe(3.5);

                done();
            })
            .catch(errors => {
                done();

                throw new Error(errors);
            });
    });

    it('Should register multiple orders and print order summary', done => {
        var orderBoard = new OrderBoard(),
            promises = [
                orderBoard.registerOrder('user01', 3.5, 100.75, 'BUY'),
                orderBoard.registerOrder('user02', 70.5, 180.75, 'SELL'),
                orderBoard.registerOrder('user03', 7.5, 80.75, 'BUY'),
                orderBoard.registerOrder('user04', 85, 180.75, 'SELL'),
                orderBoard.registerOrder('user01', 9, 100.75, 'BUY'),
                orderBoard.registerOrder('user04', 9, 77.12, 'SELL'),
                orderBoard.registerOrder('user03', 19, 77.12, 'SELL'),
                orderBoard.registerOrder('user02', 254, 10.57, 'SELL')
            ];

        Promise.all(promises)
            .then(() => {
                const summary = orderBoard.getSummary();
                orderBoard.printSummary(summary);

                expect(summary.length).toBe(2);

                const buys = summary[0];
                expect(buys.type).toBe('BUY');
                expect(buys.prices.length).toBe(2);
                expect(buys.prices[0].price).toBe(100.75);
                expect(buys.prices[0].quantity).toBe(12.5);
                expect(buys.prices[1].price).toBe(80.75);
                expect(buys.prices[1].quantity).toBe(7.5);

                const sells = summary[1];
                expect(sells.type).toBe('SELL');
                expect(sells.prices.length).toBe(3);
                expect(sells.prices[0].price).toBe(10.57);
                expect(sells.prices[0].quantity).toBe(254);
                expect(sells.prices[1].price).toBe(77.12);
                expect(sells.prices[1].quantity).toBe(28);
                expect(sells.prices[2].price).toBe(180.75);
                expect(sells.prices[2].quantity).toBe(155.5);

                done();
            })
            .catch(errors => {
                done();

                throw new Error(errors);
            });
    });

    it('Should register and cancel a single order and print order summary', done => {
        var orderBoard = new OrderBoard();

        orderBoard.registerOrder('user01', 3.5, 100.75, 'BUY')
            .then(id => {
                const summary = orderBoard.getSummary();
                orderBoard.printSummary(summary);

                orderBoard.cancelOrder(id)
                    .then(() => {
                        const summary = orderBoard.getSummary();
                        orderBoard.printSummary(summary);
                        expect(summary.length).toBe(0);

                        done();
                    })
                    .catch(err => {
                        done();

                        throw new Error(err);
                    });
            })
            .catch(err => {
                done();

                throw new Error(err);
            });
    });

    it('Should register multiple orders and print order summary', done => {
        var orderBoard = new OrderBoard(),
            promises = [
                orderBoard.registerOrder('user1', 3.5, 306, 'SELL'),
                orderBoard.registerOrder('user2', 1.2, 310, 'SELL'),
                orderBoard.registerOrder('user3', 1.5, 307, 'SELL'),
                orderBoard.registerOrder('user4', 2.0, 306, 'SELL'),
            ];

        Promise.all(promises)
            .then(() => {
                const summary = orderBoard.getSummary();
                orderBoard.printSummary(summary);

                expect(summary.length).toBe(1);

                const sells = summary[0];
                expect(sells.type).toBe('SELL');
                expect(sells.prices.length).toBe(3);
                expect(sells.prices[0].price).toBe(306);
                expect(sells.prices[0].quantity).toBe(5.5);
                expect(sells.prices[1].price).toBe(307);
                expect(sells.prices[1].quantity).toBe(1.5);
                expect(sells.prices[2].price).toBe(310);
                expect(sells.prices[2].quantity).toBe(1.2);

                done();
            })
            .catch(errors => {
                done();

                throw new Error(errors);
            });
    });
});