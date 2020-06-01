'use strict';
const LOAD = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';


function tokenCountDown(time) {
    if (time < 1) {
        return;
    }

    let interval = setInterval(function () {
        document.querySelector(".count-down").innerHTML = `Token Expires in ${time}s`;
        time--;
        if (time === 0) {
            clearInterval(interval);
            document.querySelector(".count-down").innerHTML = "Token Expired";
        }
    }, 1000);
}

function renderObservation(data) {
    let observations = "";
    data.entry.filter((observation) => {
        observations += ("<b>" + observation.resource.code.coding[0].display + "</b>");

        if (observation.resource.hasOwnProperty("valueQuantity")) {
            observations += " - ";
            observations += observation.resource.valueQuantity.value;
            observations += observation.resource.valueQuantity.unit;
        }

        observations += "<br/>";

        console.log(observations)
    });
    return observations;
}


function App(client) {
    this.client = client;
    sessionStorage.setItem('tokenExpiry', (client.getIdToken().exp - Math.floor(Date.now() / 1000)));
    //client.getIdToken().exp - Math.floor(Date.now() / 1000);
}

App.prototype.fetchCurrentPatient = function () {
    let render = this.createRenderer("patient");
    render(LOAD);
    return this.client.patient.read().then(render, render);
};

App.prototype.fetchCurrentEncounter = function () {
    let render = this.createRenderer("encounter");
    render(LOAD);
    return this.client.encounter.read().then(render, render);
};


App.prototype.fetchCurrentObservation = function () {
    let render = this.createRenderer("observation");
    render(LOAD);
    return this.client.request("Observation").then(render, render);
}

App.prototype.request = function (requestOptions, fhirOptions) {
    let render = this.createRenderer("output");
    render("Loading...");
    return this.client.request(requestOptions, fhirOptions).then(render, render);
};

App.prototype.renderContext = function () {
    return Promise.all([
        this.fetchCurrentPatient(),
        this.fetchCurrentObservation()
    ]);
};

App.prototype.setLabel = function (containerId, label) {
    document.getElementById(containerId).previousElementSibling.innerText = label;
};

App.prototype.createRenderer = function (id) {
    const output = id ? document.getElementById(id) : document.body;
    return (data) => {
        if (data) {
            if (data === LOAD) {
                output.innerHTML = data;
            }
            else if (id === "patient") {
                output.innerText = data.name[0].given[0];
            } else if (id === "encounter") {
                output.innerText = data && typeof data === "object"
                    ? JSON.stringify(data, null, 4)
                    : String(data);
            } else if (id === "observation") {
                output.innerHTML = renderObservation(data);
            }
            else {
                output.innerHTML = data && typeof data === "object"
                    ? JSON.stringify(data, null, 4)
                    : String(data);
            }
        }
    };
}

