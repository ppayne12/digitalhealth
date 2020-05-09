'use strict';

function createRenderer(id) {
    const output = id ? document.getElementById(id) : document.body;
    return (data) => {
        output.innerText = data && typeof data === "object"
            ? JSON.stringify(data, null, 4)
            : String(data);
    };
}

function App(client) {
    this.client = client;
}

App.prototype.fetchCurrentPatient = () => {
    let render = createRenderer("patient");
    render("Loading...");
    return this.client.patient.read().then(render, render);
};

App.prototype.fetchCurrentEncounter = () => {
    let render = createRenderer("encounter");
    render("Loading...");
    return this.client.encounter.read().then(render, render);
};

App.prototype.fetchCurrentUser = () => {
    let render = createRenderer("user");
    render("Loading...");
    return this.client.user.read().then(render, render);
};


App.prototype.fetchCurrentObservation = () => {
    let render = createRenderer("observation");
    render("Loading...");
    return this.client.observation.read().then(render, render);
}

App.prototype.request = (requestOptions, fhirOptions) => {
    let render = createRenderer("output");
    render("Loading...");
    return this.client.request(requestOptions, fhirOptions).then(render, render);
};

App.prototype.renderContext = () => {
    return Promise.all([
        this.fetchCurrentPatient(),
        //this.fetchCurrentUser(),
        //this.fetchCurrentEncounter()
    ]);
};

App.prototype.setLabel = function (containerId, label) {
    document.getElementById(containerId).previousElementSibling.innerText = label;
};

