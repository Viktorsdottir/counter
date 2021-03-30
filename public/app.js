const db = firebase.firestore();
const increment = firebase.firestore.FieldValue.increment(1);
const visitorsRef = db.collection("counters").doc("webvisitors");
visitorsRef.update({ count: increment });

const countEl = document.getElementById('count');

visitorsRef.onSnapshot((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        countEl.innerHTML = doc.data().count
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
})









