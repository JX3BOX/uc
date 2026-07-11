export function suppressProductionConsoleLog() {
    if (process.env.NODE_ENV === "production") {
        console.log = () => {};
    }
}
