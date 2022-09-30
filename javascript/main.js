const Main={
    init:function()
    {
        this.cacheSelectors();
        this.bindEvents();
        this.loadData();
    },
    indexPage:0
    ,
    cacheSelectors:function()
    {
        /*Formulario registro*/
        this.$name=document.querySelector('#name');
        this.$email=document.querySelector('#email');
        this.$cpf=document.querySelector('#cpf');
        this.$contentForm=document.querySelector('.content-form');
        this.$formRegister=document.querySelector('#formRegister');
        this.$genderRadio=document.querySelectorAll('#genderRadio');
        this.$mensageNameUser=document.querySelector('#mensagemNomeUsuario');
        this.$mensageEmailUser=document.querySelector('#mensagemEmailUsuario');
        this.$mensageCPFUser=document.querySelector('#mensagemCPFUsuario');
        this.$mensageGenderUser=document.querySelector('#mensagemGenderUsuario');
        /*--------------------------------------------*/
        /*Grid*/
        this.$grid=document.querySelector('.grid');
        this.$gridButton=document.querySelector('#gridButton');
        /*--------------------------------------------*/
        /*Formulario de registro Email amigo*/
        this.$formNews=document.querySelector('#form-news');
        this.$namesFriend=document.querySelector('#namesfriend');
        this.$emailsFriend=document.querySelector('#emailsfriend');
        this.$shareNews=document.querySelector('.share-news');
        this.$mensageNameFriend=document.querySelector('#mensagemNomeAmigo');
        this.$mensageEmailFriend=document.querySelector('#mensagemEmailAmigo');
        /*--------------------------------------------*/
        this.$genderSelected=null;
    },
    bindEvents:function()
    {
        const self=this;
        this.$formRegister.onsubmit=self.Events.formRegister_click.bind(self);
        this.$genderRadio.forEach((element) => {
            element.onclick=self.Events.selectGender_click.bind(self);
        });
        this.$formNews.onsubmit=self.Events.formRegisterFriend_click.bind(self);
        this.$gridButton.onclick=self.loadData.bind(self);
    },
    completedForm:function(){
        return '<p>Formulario preenchido com sucesso</p>';
    },
    jsonConvert:function(response){
        return response.json();
    },
    loadData:function(){
        this.indexPage++;
        fetch(`https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=${this.indexPage}`)
        .then(this.jsonConvert)
        .then(this.createGridContent);
    },
    createGridContent:function(jsonData)
    {
        let gridContent='';
        let products=jsonData.products;
        products.forEach(element => {
            gridContent+=`
                <div class="box">
                    <img src="${element.image}" alt="${element.name}">
                    <div class='box-content'>
                        <h5>${element.name}</h5>
                        <p>${element.description}</p>
                        <p>De: R$${element.oldPrice.toFixed(2)}</p>
                        <p>Por: R$${element.price.toFixed(2)}</p>
                        <p>ou ${element.installments.count}x de R$${element.installments.value.toFixed(2)}</p>
                        <button>Comprar</button>
                    </div>
                </div>
            `
        });
        Main.$grid.innerHTML=gridContent;
    },
    addFeedbackError(inputField, mensageText)
    {
        mensageText.classList.remove("hide");
        inputField.classList.add("wrong");
        mensageText.classList.add("wrongMensage");
    },
    removeFeedbackError(inputField, mensageText)
    {
        mensageText.classList.add("hide");
        inputField.classList.remove("wrong");
        mensageText.classList.remove("wrongMensage");
    },
    Events:{
        selectGender_click:function(value){
            this.$genderSelected=this.$genderRadio[value.path[0].value];
            this.$genderRadio.forEach(element => {
                element.parentElement.classList.remove("wrong");
            });
            this.$mensageGenderUser.classList.add("hide");
            this.$mensageGenderUser.classList.remove("wrongMensage");
            if(value.path[0].value==0)
            {
                this.$genderRadio[1].checked=false;
            }
            else
            {
                this.$genderRadio[0].checked=false;
            }
        },
        formRegister_click:function(e)
        {
            e.preventDefault();
            let errorFlag=false;
            if(!this.$name.value)
            {
                this.addFeedbackError(this.$name,this.$mensageNameUser);
                errorFlag=true;
            }
            else
            {
                this.removeFeedbackError(this.$name,this.$mensageNameUser);
            }
            if(!this.$email.value)
            {
                this.addFeedbackError(this.$email,this.$mensageEmailUser);
                errorFlag=true;
            }
            else
            {
                this.removeFeedbackError(this.$email,this.$mensageEmailUser);
            }
            if(!this.$cpf.value)
            {
                this.addFeedbackError(this.$cpf,this.$mensageCPFUser);
                errorFlag=true;
            }
            else
            {
                this.removeFeedbackError(this.$cpf,this.$mensageCPFUser);
            }
            if(this.$genderSelected==null)
            {
                this.$genderRadio.forEach(element => {
                    element.parentElement.classList.add("wrong");
                });
                errorFlag=true;
                this.$mensageGenderUser.classList.remove("hide");
                this.$mensageGenderUser.classList.add("wrongMensage");
            }
            else
            {
                this.$genderSelected.parentElement.classList.remove("wrong");
                this.$mensageGenderUser.classList.add("hide");
                this.$mensageGenderUser.classList.remove("wrongMensage");
            }
            if(!errorFlag)
            {
                this.$formRegister.remove();
                this.$contentForm.innerHTML+=this.completedForm();
            }
        },
        formRegisterFriend_click:function(e)
        {
            e.preventDefault();
            let errorFlag=false;
            if(!this.$namesFriend.value)
            {
                this.addFeedbackError(this.$namesFriend,this.$mensageNameFriend);
                errorFlag=true;
            }
            else
            {
                this.removeFeedbackError(this.$namesFriend,this.$mensageNameFriend);
            }
            if(!this.$emailsFriend.value)
            {
                this.addFeedbackError(this.$emailsFriend,this.$mensageEmailFriend);
                errorFlag=true;
            }
            else
            {
                this.$emailsFriend.classList.remove("wrong");
                this.removeFeedbackError(this.$namesFriend,this.$mensageNameFriend);
            }
            if(!errorFlag)
            {
                this.$formNews.remove();
                this.$shareNews.innerHTML+=this.completedForm();
            }
        }
    }
}
Main.init();