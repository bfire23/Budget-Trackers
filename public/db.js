let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.results;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.results;

    if (navigator.online) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("uh oh!" + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "rewrite");

    const store = transaction.objectStore("pending");

    store.add(record);
}