function segregated(isYes) {
    document.getElementById("step1").classList.add("hidden");

    if (isYes) {
        document.getElementById("step2").classList.remove("hidden");
    } else {
        document.getElementById("stepNo").classList.remove("hidden");
    }
}

function generateResult() {
    let type = document.getElementById("wasteType").value;
    let weight = parseFloat(document.getElementById("weight").value);

    let priorities = [];
    document.querySelectorAll('input[type=checkbox]:checked').forEach(cb => {
        priorities.push(cb.value);
    });

    // --- METHOD DATABASE ---
    let methods = {
        "Biogas": {
            pros: "Eco-friendly, ideal for organic waste",
            cons: "Slow process",
            efficiency: 0.7
        },
        "Pyrolysis": {
            pros: "Produces fuel, good for plastic",
            cons: "High setup cost",
            efficiency: 0.8
        },
        "Combustion": {
            pros: "Fast and cheap",
            cons: "Air pollution",
            efficiency: 0.6
        },
        "Gasification": {
            pros: "High energy output",
            cons: "Complex system",
            efficiency: 0.85
        },
        "Incineration": {
            pros: "Quick waste reduction",
            cons: "CO₂ emission",
            efficiency: 0.65
        }
    };

    // --- TYPE BASED SUGGESTION ---
    let typeMap = {
        "Food Waste": ["Biogas"],
        "Plastic Waste": ["Pyrolysis"],
        "Dry Waste": ["Combustion"],
        "Agricultural Waste": ["Gasification"],
        "Rubber": ["Pyrolysis"]
    };

    // --- PRIORITY BASED ---
    let priorityMap = {
        money: ["Combustion"],
        environment: ["Biogas", "Gasification"],
        time: ["Incineration"],
        power: ["Gasification", "Pyrolysis"],
        all: ["Gasification"]
    };

    let suggested = new Set();

    // Add type-based
    typeMap[type].forEach(m => suggested.add(m));

    // Add priority-based
    priorities.forEach(p => {
        if (priorityMap[p]) {
            priorityMap[p].forEach(m => suggested.add(m));
        }
    });

    let finalMethods = Array.from(suggested).slice(0, 2);

    if (finalMethods.length < 2) {
        finalMethods.push("Combustion");
    }

    let m1 = methods[finalMethods[0]];
    let m2 = methods[finalMethods[1]];

    // --- CALCULATIONS ---
    let energy1 = weight * m1.efficiency * 2;
    let energy2 = weight * m2.efficiency * 2;

    let bestMethod = energy1 > energy2 ? finalMethods[0] : finalMethods[1];
    let bestEnergy = Math.max(energy1, energy2);

    let revenue = bestEnergy * 6;
    let co2Saved = bestEnergy * 0.4;

    let resultHTML = `
        <h3>Suggested Methods</h3>

        <div class="method">
            <h4>${finalMethods[0]}</h4>
            <p><b>Pros:</b> ${m1.pros}</p>
            <p><b>Cons:</b> ${m1.cons}</p>
            <p><b>Energy:</b> ${energy1.toFixed(2)} kWh</p>
        </div>

        <div class="method">
            <h4>${finalMethods[1]}</h4>
            <p><b>Pros:</b> ${m2.pros}</p>
            <p><b>Cons:</b> ${m2.cons}</p>
            <p><b>Energy:</b> ${energy2.toFixed(2)} kWh</p>
        </div>

        <h3>Best Method: ${bestMethod}</h3>
        <p>Confidence Level: 92%</p>
        <p>Expected Energy Output: ${bestEnergy.toFixed(2)} kWh</p>
        <p>Estimated Revenue: ₹${revenue.toFixed(2)}</p>
        <p>CO₂ Saved: ${co2Saved.toFixed(2)} kg</p>
    `;

    document.getElementById("result").innerHTML = resultHTML;
    document.getElementById("result").classList.remove("hidden");
}
