let db;


const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

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

    function checkDatabase() {
        // open a transaction on your pending db
        const transaction = db.transaction(["pending"], "readwrite");
        // access your pending object store
        const store = transaction.objectStore("pending");
        // get all records from store and set to a variable
        const getAll = store.getAll();
      
        getAll.onsuccess = function() {
          if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
              method: "POST",
              body: JSON.stringify(getAll.result),
              headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
              }
            })
            .then(response => response.json())
            .then(() => {
              // if successful, open a transaction on your pending db
              const transaction = db.transaction(["pending"], "readwrite");
      
              // access your pending object store
              const store = transaction.objectStore("pending");
      
              // clear all items in your store
              store.clear();
            });
          }
        };
      }
      
      // listen for app coming back online
      window.addEventListener("online", checkDatabase);
      
}