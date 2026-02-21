document.addEventListener("DOMContentLoaded", function() {

    const form = document.getElementById("registrationForm");
    const codeDisplay = document.getElementById("generatedCode");
    const qrContainer = document.getElementById("qrcode");
    const payBtn = document.getElementById("payBtn");
    const registerBtn = document.getElementById("registerBtn");

    let records = JSON.parse(localStorage.getItem("records")) || [];
    let paymentCompleted = false;

    function showAlert(message) {
        document.getElementById("alertMessage").textContent = message;
        document.getElementById("customAlert").style.display = "flex";
    }

    window.closeAlert = function() {
        document.getElementById("customAlert").style.display = "none";
    };

    // 💳 SIMULA PAGAMENTO
    payBtn.addEventListener("click", function() {

        if (paymentCompleted) {
            showAlert("Payment already completed.");
            return;
        }

        showAlert("Processing Payment...");

        setTimeout(() => {
            paymentCompleted = true;
            registerBtn.disabled = false;
            registerBtn.style.opacity = "1";
            showAlert("Payment Successful! You can now generate access.");
        }, 2000);

    });

    // 🚗 REGISTO
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        if (!paymentCompleted) {
            showAlert("Please complete payment first.");
            return;
        }

        const name = document.getElementById("name").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const plate = document.getElementById("plate").value.trim().toUpperCase();

        if (!name || !studentId || !phone || !plate) {
            showAlert("Please fill in all fields.");
            return;
        }

        const alreadyExists = records.some(record => record.plate === plate);

        if (alreadyExists) {
            showAlert("This car plate is already registered.");
            return;
        }

        const uniqueCode = "CAR-" + Math.floor(100000 + Math.random() * 900000);

        const studentData = { name, studentId, phone, plate, code: uniqueCode };

        records.push(studentData);
        localStorage.setItem("records", JSON.stringify(records));

        codeDisplay.textContent = "Access Code: " + uniqueCode;

        qrContainer.innerHTML = "";

        new QRCode(qrContainer, {
            text: JSON.stringify(studentData),
            width: 200,
            height: 200
        });

        form.reset();
        paymentCompleted = false;
        registerBtn.disabled = true;

        showAlert("Vehicle Registered Successfully!");
    });

});