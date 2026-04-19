let totalEaten = 0;
let targetCal = 2000;

// Elemen
const totalEatenDisplay = document.getElementById('totalEaten');
const targetCalDisplay = document.getElementById('targetCal');
const progressBar = document.getElementById('progressBar');
const foodList = document.getElementById('foodList');

// 1. Fungsi Simpan
const saveData = () => {
    const data = {
        totalEaten,
        targetCal,
        foodItems: foodList.innerHTML,
        profile: {
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            goal: document.getElementById('goal').value
        }
    };
    localStorage.setItem('fittrack_pro_data', JSON.stringify(data));
};

// 2. Fungsi Update UI
const updateUI = () => {
    totalEatenDisplay.innerText = totalEaten;
    targetCalDisplay.innerText = Math.round(targetCal);
    const percent = Math.min((totalEaten / targetCal) * 100, 100);
    progressBar.style.width = percent + '%';
    progressBar.style.background = totalEaten > targetCal ? '#ef4444' : '#10b981';
};

// 3. Tombol Simpan Target
document.getElementById('btnSave').addEventListener('click', () => {
    const gender = document.getElementById('gender').value;
    const age = Number(document.getElementById('age').value);
    const weight = Number(document.getElementById('weight').value);
    const height = Number(document.getElementById('height').value);
    const goal = document.getElementById('goal').value;

    let bmr = (gender === "Pria") 
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    let tdee = bmr * 1.375;
    if (goal === "bulking") targetCal = tdee + 500;
    else if (goal === "cutting") targetCal = tdee - 500;
    else targetCal = tdee;

    updateUI();
    saveData();
    alert("Target berhasil disimpan!");
});

// 4. Tambah Makanan
document.getElementById('btnAddFood').addEventListener('click', () => {
    const name = document.getElementById('foodName').value;
    const cal = Number(document.getElementById('foodCal').value);

    if (name && cal > 0) {
        totalEaten += cal;
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}</span> <strong>${cal} kkal</strong>`;
        foodList.prepend(li);
        
        document.getElementById('foodName').value = "";
        document.getElementById('foodCal').value = "";
        updateUI();
        saveData();
    }
});

// 5. Reset
document.getElementById('btnReset').addEventListener('click', () => {
    if(confirm("Reset semua data?")) {
        localStorage.removeItem('fittrack_pro_data');
        location.reload();
    }
});

// 6. Muat Data Saat Refresh
window.onload = () => {
    const saved = localStorage.getItem('fittrack_pro_data');
    if (saved) {
        const data = JSON.parse(saved);
        totalEaten = data.totalEaten;
        targetCal = data.targetCal;
        foodList.innerHTML = data.foodItems;
        document.getElementById('gender').value = data.profile.gender;
        document.getElementById('age').value = data.profile.age;
        document.getElementById('weight').value = data.profile.weight;
        document.getElementById('height').value = data.profile.height;
        document.getElementById('goal').value = data.profile.goal;

    }
    updateUI();
};

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
        .then(reg => console.log("Service Worker Registered", reg))
        .catch(err => console.log("Service Worker Failed", err));
  });
}