/**
 * Created by snouto on 28/06/18.
 */
function AddSiteView(){
    this.name = "site-container";
    this.index = 0;
    this.sites = [];
    this.postfix_url = "/v1/api/sites"
}

AddSiteView.prototype.init = function(app,viewNode){
  this.app = app;
  this.viewNode = viewNode;
};

AddSiteView.prototype.AddNewSite = function(){

    var container = this.viewNode.find('.site-container');
    var singlesite = $("#singlesite");
    var self = this;
    var currentIndex = this.index++;
    singlesite = $($.parseHTML(singlesite.html()));
    var btnRemove = singlesite.find(".addsite-remove");
    btnRemove.attr('id',currentIndex);
    if(btnRemove){
        btnRemove.on('click',function(){
            btnRemove.parent().remove();
            self.sites.splice(--this.index,1);
            console.log(this.sites);
            self.checkState();
        });
    }

    var siteName = singlesite.find('.site_name');
    siteName.attr('id','text-'+currentIndex);
    siteName.on('change',function(){
        var index = Number.parseInt($(this).attr('id').split('-')[1]);
        console.log("Current Index : " + index);
        var site = self.sites[index] || {};
        site.name = $(this).val();
        self.sites[index] = site;
        console.log(self.sites);
    });
    var siteDescription = singlesite.find('.site_description');
    siteDescription.attr('id','description-'+currentIndex);
    siteDescription.on('change',function () {

        var index = Number.parseInt($(this).attr('id').split('-')[1]);
        var site = self.sites[index] || {};
        site.description = $(this).val();
        self.sites[index] = site;
        console.log(self.sites);
    });

    var dsus = singlesite.find('.sitedsus');
    dsus.attr('id','sitedsus-'+currentIndex);

    axios.get(siteConfig.backendURL+"/v1/api/dsus").then(function(response){


        Object.values(response.data).map(function(el,key){

            dsus.append($('<option>',{
                value : el.id,
                text : el.name
            }));

        });


    });

    dsus.on('change',function(){

        var index = Number.parseInt($(this).attr('id').split('-')[1]);
        console.log("Current Index : " + index);
        var submittedVal = $(this).val();
        if(submittedVal){
            var site = self.sites[index] || {};
            site.dsuId = submittedVal;
            self.sites[index] = site;
            console.log(self.sites);
        }

    });

    this.sites[currentIndex] = {};
    container.append(singlesite);
    this.checkState();

};

AddSiteView.prototype.checkState = function(){

    var btnSave = $(".btn-save-site");
    if(this.sites.length > 0){

        btnSave.prop('disabled',false);
        this.app.toggleState(true);
    }else{
        btnSave.prop('disabled',true);
        this.app.toggleState(false);
    }

};

AddSiteView.prototype.saveChanges = function(){

    var self = this;
    var container = this.viewNode.find('.site-container');
    if(this.sites.length > 0){
        this.sites.map(function(el,index){

            axios.put(siteConfig.backendURL+self.postfix_url,el).catch(err=>console.log(err.message || err));
        });
        this.sites = [];
        container.empty();
        this.app.toggleState(false);
        this.index = 0;
        this.checkState();
        alert('Done Saving Changes.');
    }
};

AddSiteView.prototype.preRender = function(){

    var self = this;
    var btnAddNew = this.viewNode.find(".addNew");
    if(btnAddNew){
        var self = this;
        btnAddNew.on('click',function(){
            self.AddNewSite();
        });
    };
    var btnSaveChanges = this.viewNode.find('.btn-save-site');
    if(btnSaveChanges){
        btnSaveChanges.on('click',function(){
            self.saveChanges();
        });
    }

};

AddSiteView.prototype.render = function () {

    this.preRender();
    var self = this;
    this.viewNode.map(function(index){
        self.app.container.append(self.viewNode[index]);
    });

};