/**
 * Created by snouto on 28/06/18.
 */
function DisplaySitesView(){
    this.name = "sites-container";
    this.index = 0;
    this.sites = [];
    this.dsus = [];
    this.postfix_url = "/v1/api/sites";
}

DisplaySitesView.prototype.init = function (app,viewNode) {
    this.app = app;
    this.viewNode = viewNode;
};

DisplaySitesView.prototype.findDSU = function (id) {

    var found = null;
    for(var i=0;i<this.dsus.length;i++){

        if(this.dsus[i].id == Number.parseInt(id)){
            found = this.dsus[id];
            break;
        }
    }

    return found;

};

DisplaySitesView.prototype.preRender = function () {

    var self = this;

    var datatable = $("#sitestable").DataTable({
        "processing":false,
        "order":[[1,'desc'],[3,'desc']],
        "columnDefs":[{
            "targets":1,
            "sortable":true
        },{
            "targets":3,
            "sortable":true
        }]
    });

    axios.get(siteConfig.backendURL+"/v1/api/dsus").then(function (response) {

        if(response.data){
            Object.values(response.data).forEach(function (el) {

                self.dsus.push(el);

            });
        }

    });

    axios.get(siteConfig.backendURL+this.postfix_url).then(function (response) {

        if(response.data){

            Object.values(response.data).forEach(function (el) {

                var dsu = self.findDSU(el.dsuId);
                if(dsu != null){
                    var site = [el.id,el.description,dsu.id,dsu.description,dsu.cert || 'N/A'];

                   $("#sitestable > tbody").append(`<tr><td>${el.id}</td><td>${el.description}</td><td>${dsu.id}</td><td>${dsu.description}</td><td>${dsu.cert || 'N/A'}</td></tr>`);


                }
            });
        }

    });



};

DisplaySitesView.prototype.render = function(){

    this.preRender();
    var self = this;
    this.viewNode.map(function (index) {
        self.app.container.append(self.viewNode[index]);
    });

};

