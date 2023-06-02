// handling uncaught exception
exports.uncaughtException = () => process.on('uncaughtException',err => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to the uncaught Exception`);
    process.exit(1);
})

// unhandled promise rejection
exports.unhandledRejection = () => process.on('unhandledRejection',err => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to the unhandled rejections`)
    server.close(() => {
        process.exit(1); 
    })
})