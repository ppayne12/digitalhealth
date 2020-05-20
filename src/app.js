'use strict';
const LOAD = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';




function renderEncounter(data) {
    let a = data;

}


function App(client) {
    this.client = client;
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
                let map = this.client.byCode(data, "code"); //do something with this map
                for (let [key, value] of map) {
                    console.log(key + ' = ' + value)
                }
                output.innerText = data && typeof data === "object"
                    ? JSON.stringify(data, null, 4)
                    : String(data);
            }
            else {
                output.innerHTML = data && typeof data === "object"
                    ? JSON.stringify(data, null, 4)
                    : String(data);
            }
        }
    };
}

