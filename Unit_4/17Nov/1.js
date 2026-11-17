// Import the EventEmitter class from the built-in 'events' module
const EventEmitter = require('events');

// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

// -------------------------------------------------------------
// 1. Basic Listener (.on)
// -------------------------------------------------------------
myEmitter.on('doorbell', () => {
    console.log('Doorbell rang! Someone is at the door.');
});

// Multiple listeners can listen to the exact same event:
myEmitter.on('doorbell', () => {
    console.log('Dog starts barking: Woof woof!');
});

// Trigger the 'doorbell' event
console.log('--- Triggering Doorbell ---');
myEmitter.emit('doorbell');

// -------------------------------------------------------------
// 2. Passing Arguments to Event Listeners
// -------------------------------------------------------------
myEmitter.on('orderPlaced', (orderId, customerName, totalAmount) => {
    console.log(`\nReceipt sent to ${customerName} for Order #${orderId} ($${totalAmount})`);
});

myEmitter.on('orderPlaced', (orderId) => {
    console.log(`Warehouse notified: Pack items for Order #${orderId}`);
});

console.log('\n--- Triggering Order Placed ---');
myEmitter.emit('orderPlaced', 101, 'Alice', 49.99);

// -------------------------------------------------------------
// 3. One-Time Listener (.once)
// -------------------------------------------------------------
// .once() will only execute the first time the event is fired
myEmitter.once('welcomeBonus', (user) => {
    console.log(`\nOne-time 20% discount coupon applied for ${user}!`);
});

console.log('\n--- Triggering Welcome Bonus ---');
myEmitter.emit('welcomeBonus', 'Alice'); // Runs
myEmitter.emit('welcomeBonus', 'Alice'); // Ignored (already executed once)
