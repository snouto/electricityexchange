/**
 * Created by snouto on 20/06/18.
 */
function Application(){
    this.name = "Second Assignment";
    this.stateChanged = false;
}

Application.prototype.init = function() {
    //load the introduction into the container divv
    this.container = $("#main");
    var self = this;
    $("#adddsu").on('click',function () {

        self.AddView("adddsu",0);

    });

    $("#addsite").on('click',function () {

        self.AddView("addsite",1);

    });

    $("#viewsites").on('click',function () {
        self.AddView("showsites",2);
    });
};

Application.prototype.toggleState = function(state){
    this.stateChanged = state;
};

Application.prototype.clearViews = function(){

    if(this.container){
        this.container.empty();
    }
};

Application.prototype.AddView = function(viewName,index){

    //Clear All Views
    if(this.stateChanged){
        alert("You have unsaved Changes , Please try to save them first , before proceeding.");
        return;
    }
    this.clearViews();
    var self = this;
    //build the full View Path
    var viewPath = "/frontend/templates/"+viewName+".html";
    if(axios){
        axios.get(viewPath).then(function (response) {

            var viewNode = $($.parseHTML(response.data));
            switch(index){
                case 0:
                {
                    var AdddsuView = new AddDSUView();
                    AdddsuView.init(self,viewNode);
                    AdddsuView.render();
                }
                break;
                case 1:
                {
                    var addSiteView = new AddSiteView();
                    addSiteView.init(self,viewNode);
                    addSiteView.render();
                }
                break;
                case 2:
                {
                    var displaySiteView = new DisplaySitesView();
                    displaySiteView.init(self,viewNode);
                    displaySiteView.render();
                }
                break;
            }


        });
    }

};

var app = new Application();
app.init();