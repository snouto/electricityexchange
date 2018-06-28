/**
 * Created by snouto on 28/06/18.
 */

function AddDSUView(){
    this.name = "dsu-container";
    this.index = 0;
    this.dsus = [];
    this.postfix_url = "/v1/api/dsus"

}

AddDSUView.prototype.init = function (app,viewNode){
    this.app = app;
    this.viewNode = viewNode;
};

AddDSUView.prototype.AddNewDSU = function () {

    var container = this.viewNode.find('.dsu-container');
    var singledsu = $("#singledsu");
    var self = this;
    var currentIndex = this.index++;
    singledsu = $($.parseHTML(singledsu.html()));
    //Attach the remove button
    var btnRemove = singledsu.find(".adddsu-remove");
    btnRemove.attr('id',currentIndex);
    if(btnRemove){
        btnRemove.on('click',function () {
            btnRemove.parent().remove();
            self.dsus.splice(--self.index,1);
            console.log(self.dsus);
            self.checkState();
        });
    }
    //Attach the dsu name and description
    var dsuName = singledsu.find('.dsu_name');
    dsuName.attr('id',"text-"+currentIndex);
    dsuName.on('change',function () {

        var index = Number.parseInt($(this).attr('id').split('-')[1]);
        console.log("Current Index : " + index);
        var dsu = self.dsus[index] || {};
        dsu.name = $(this).val();
        self.dsus[index] = dsu;
        console.log(self.dsus);
    });

    var dsuDescription = singledsu.find('.dsudescription');
    dsuDescription.attr('id',"description-"+currentIndex);
    dsuDescription.on('change',function(){
        var index = Number.parseInt($(this).attr('id').split('-')[1]);
        console.log("Current Index : " + index);
        var dsu = self.dsus[index] || {};
        dsu.description = $(this).val();
        self.dsus[index] = dsu;
        console.log(self.dsus);
    });


    var dsucert = singledsu.find('.dsucert');
    dsucert.attr('id','cert-'+currentIndex);
    dsucert.on('change',function(){

        var index = Number.parseInt($(this).attr('id').split('-')[1]);
        console.log("Current Index : " + index);
        var submittedVal = $(this).val();
        if(submittedVal && submittedVal > 0){

            var dsu = self.dsus[index] || {};
            dsu.cert = submittedVal;
            self.dsus[index] = dsu;
            console.log(self.dsus);
        }


    });
    this.dsus[currentIndex] = {};
    //finally we should add it to the container
    container.append(singledsu);
    this.checkState();
};

AddDSUView.prototype.checkState = function(){

    var btnSave = $(".btn-save");
    if(this.dsus.length > 0){

        btnSave.prop('disabled',false);
        this.app.toggleState(true);
    }else{
        btnSave.prop('disabled',true);
        this.app.toggleState(false);
    }

};

AddDSUView.prototype.saveChanges = function(){

    var self = this;
    var container = this.viewNode.find('.dsu-container');
    if(this.dsus.length > 0){

        this.dsus.map(function (el,index) {

            axios.put(siteConfig.backendURL+self.postfix_url,el);

        });
        this.dsus = [];
        container.empty();
        this.app.toggleState(false);
        this.checkState();
        this.index = 0;
        alert('Done saving Changes');
    }
};

AddDSUView.prototype.preRender = function () {


    var self= this;
    var btnAddNew = this.viewNode.find(".addNew");
    if(btnAddNew){
        var self = this;
        btnAddNew.on('click',function () {

            self.AddNewDSU();

        });
    };
    // Attach save changes event
    var btnSaveChanges = this.viewNode.find('.btn-save');
    if(btnSaveChanges){
        btnSaveChanges.on('click',function(){

            //now begin performing the save operations
            self.saveChanges();

        });
    }

};

AddDSUView.prototype.render = function () {
    this.preRender();
    var self = this;
    this.viewNode.map(function (el) {
        self.app.container.append(self.viewNode[el]);
    });

};