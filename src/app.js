'use strict';



function createRenderer(id) {
    const output = id ? document.getElementById(id) : document.body;
    return (data) => {
        if (data) {
            if (id === "patient" && data !== "Loading...") {
                output.innText = data.name[0].given[0];
            } else if (id === "encounter") {

            } else {
                output.innerText = data && typeof data === "object"
                    ? JSON.stringify(data, null, 4)
                    : String(data);
            }
        }
    };
}

function App(client) {
    this.client = client;
}

App.prototype.fetchCurrentPatient = function () {
    let render = createRenderer("patient");
    render("Loading...");
    return this.client.patient.read().then(render, render);
};

App.prototype.fetchCurrentEncounter = function () {
    let render = createRenderer("encounter");
    render("Loading...");
    return this.client.encounter.read().then(render, render);
};


App.prototype.fetchCurrentObservation = function () {
    let render = createRenderer("observation");
    render("Loading...");
    return this.client.observation.read().then(render, render);
}

App.prototype.request = function (requestOptions, fhirOptions) {
    let render = createRenderer("output");
    render("Loading...");
    return this.client.request(requestOptions, fhirOptions).then(render, render);
};

App.prototype.renderContext = function () {
    return Promise.all([
        this.fetchCurrentPatient(),
        //this.fetchCurrentEncounter()
    ]);
};

App.prototype.setLabel = function (containerId, label) {
    document.getElementById(containerId).previousElementSibling.innerText = label;
};

