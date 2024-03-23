
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, doc, addDoc, updateDoc, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB0Q-ugc6VlteGW74wG1hSw82u6waIR8Fo",
    authDomain: "novashop-2846d.firebaseapp.com",
    projectId: "novashop-2846d",
    storageBucket: "novashop-2846d.appspot.com",
    messagingSenderId: "323055818669",
    appId: "1:323055818669:web:ec8e56aa7e4b9128313324"
};

const app = initializeApp(firebaseConfig);
document.addEventListener("DOMContentLoaded", function () {
});
const db = getFirestore(app);

fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {

        for (let product of products) {
            document.getElementById("products").innerHTML += `
                <div class="card mx-auto" style="width: 18rem;">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <a href="#" class="btn btn-primary add-product" data-id="${product.id}">Check</a>
                    </div>
                </div>
        `;
        }

        for (let el of document.getElementsByClassName("add-product")) {

            el.onclick = async function () {
                const user = doc(db, "users", localStorage.getItem("user"));
                const data = await getDoc(user)

                console.log(data)

                const products = data.data().products || []
                const newProducts = new Set([...products, +this.dataset.id])

                await updateDoc(user, {
                    products: [...newProducts]
                });
                console.log('product added')
            }
        }

    })

document.getElementById('registerForm').onsubmit = async function (e) {
    e.preventDefault();

    const name = document.getElementById('InputName').value;
    const email = document.getElementById('InputEmail').value;
    const password = document.getElementById('InputPassword1').value;
    const check = document.getElementById('Check1').value;

    await addDoc(collection(db, "users"), { name, email, password, check });

    console.log('works')
}

document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginInputEmail').value;
    const password = document.getElementById('loginInputPassword').value;

    const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => localStorage.setItem("user", doc.id));

    console.log('works')
}