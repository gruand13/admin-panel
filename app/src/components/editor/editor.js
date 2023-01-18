
import "../../helpers/iframeLoader.js";
import axios from 'axios';
import React, {Component} from 'react';
import DOMHelper from '../../helpers/dom-helper';
import EditorText from "../editor-text/";
import UIkit from "uikit";
import Spinner from "../spinner";
import ConfirmModal from "../confirm-modal";
import ChooseModal from "../choose-modal/choose-modal.js";
import Panel from "../panel";
import EditorMeta from "../editor-meta";
import EditorImages from "../editor-images";
import Login from "../login";




export default class Editor extends Component {
   
    currentPage = "index.html";
    state = {
        pageList: [],
        backupsList: [],
        newPageName: "",
        loading: true,
        auth: false,
        loginError: false,
        loginLengthError: false
    }
        // this.createNewPage = this.createNewPage.bind(this);
        // this.isLoading = this.isLoading.bind(this);
        // this.isLoaded = this.isLoaded.bind(this);
        // this.save = this.save.bind(this);
        // this.init = this.init.bind(this);
        // this.login = this.login.bind(this);
        // this.logout = this.logout.bind(this);

        // this.restoreBackup = this.restoreBackup.bind(this);




    

    componentDidMount() {
        this.checkAuth();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.auth !==prevState.auth){
            this.init(null, this.currentPage);  
        }
    }

    checkAuth = ()=> {
        axios   
            .get("./api/checkAuth.php")
            .then(res=>{
                console.log(res);
                this.setState({
                    auth: res.data.auth
                })
            })
    }


    login = (pass) =>{
        if(pass.length >5){
            axios
                .post('./api/login.php', {"password": pass})
                .then(res =>{
                    this.setState({
                        auth: res.data.auth,
                        loginError: !res.data.auth,
                        loginLengthError: false
                    })
                })
        } else {
            this.setState({
                loginError: false,
                loginLengthError: true
            })
        }
    }
    logout(){
        axios
            .get("./api/logout.php")
            .then(()=>{
                window.location.replace("/");
            })
    }


    init = (e, page) => {
        if(e){
            e.preventDefault();
        }

        if(this.state.auth){
            this.isLoading();
            this.iframe = document.querySelector('iframe');
            this.open(page, this.isLoaded);
            this.loadPageList();
            this.loadBackupsList();
        }
        
    }

    open = (page, cb) => {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then(res => DOMHelper.parseStrToDOM(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then(DOMHelper.wrapImages)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => this.iframe.load("../dfsgh132fd.html"))
            .then(()=> axios.post("./api/deleteTempPage.php"))
            .then(() => this.enableEditing())
            .then(()=> this.injectStyles())
            .then(cb);

        this.loadBackupsList();

    }

    save = async () =>{
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        DOMHelper.unwrapImages(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        await axios
            .post("./api/savePage.php", {pageName: this.currentPage, html})
            .then(()=> this.showNotifications('Successfully saved','success'))
            .catch(()=> this.showNotifications('Error with saving','danger' ))
            .finally(this.isLoaded);

        this.loadBackupsList();
        
    }

    enableEditing=()=> {
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            const id = element.getAttribute("nodeid");
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);

            new EditorText(element, virtualElement)
        });

        this.iframe.contentDocument.body.querySelectorAll("[editableimgid]").forEach(element => {
            const id = element.getAttribute("editableimgid");
            const virtualElement = this.virtualDom.body.querySelector(`[editableimgid="${id}"]`);

            new EditorImages(element, virtualElement, this.isLoading, this.isLoaded, this.showNotifications)
        });
    }
    injectStyles=()=>{
        const style = this.iframe.contentDocument.createElement("style");
        style.innerHTML=`
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
            [editableimgid]:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
        
    }
    showNotifications=(message, status)=>{
        UIkit.notification({message, status});
    }

 

    loadPageList =() =>{
        axios
            .get("./api/pageList.php")
            .then(res => this.setState({pageList: res.data}))
    }

    loadBackupsList=()=>{
        axios
            .get("./backups/backups.json")
            .then(res=> this.setState({backupsList: res.data.filter(backup=> {
                return backup.page === this.currentPage;
            })
        }))
    }

    restoreBackup=(e, backup)=>{
        if(e){
            e.preventDefault();
        }
        UIkit.modal.confirm("Do you really want to restore from backup copy? all unsaved data will be lost!", {labels: {ok: "restore", cancel: "CANCEL"} })
        .then(()=>{
            this.isLoading();
            return axios
                .post('./api/restoreBackup.php', {"page": this.currentPage, "file": backup})
        })
        .then(()=>{
            this.open(this.currentPage, this.isLoaded);
        })
    }


    // createNewPage() {
    //     axios
    //         .post("./api/createNewPage.php", {"name": this.state.newPageName})
    //         .then(this.loadPageList())
    //         .catch(() => alert("Страница уже существует!"));
    // }

    // deletePage(page) {
    //     axios
    //         .post("./api/deletePage.php", {"name": page})
    //         .then(this.loadPageList())
    //         .catch(() => alert("Страницы не существует!"));
    // }
    isLoading=()=>{
        this.setState({
            loading: true
        })
    }
    isLoaded=()=>{
        this.setState({
            loading: false
        })
    }

    render() {
        const {loading, pageList, backupsList, auth, loginError, loginLengthError} = this.state;
        const modal= true;
        let spinner;

        // console.log(backupsList);

        loading ? spinner = <Spinner active/> : <Spinner />

        if (!auth){
            return  <Login login={this.login} lengthErr={loginLengthError} logErr={loginError}/>
        }

        return (
            <>
               
                <iframe src="" frameBorder="0"></iframe>
                <input id="img-upload" type="file" accept="image/*" style={{display: "none"}}></input>
                {spinner}
                <Panel />

                <ConfirmModal 
                    modal={modal} 
                    target={'modal-save'} 
                    method={this.save}
                    text={{
                        title: "Saving",
                        descr: "Do you really want to save changes?",
                        btn: "Publish"
                    }}/>
                    <ConfirmModal 
                    modal={modal} 
                    target={'modal-logout'} 
                    method={this.logout}
                    text={{
                        title: "Exit",
                        descr: "Do you really want to exit?",
                        btn: "LOG OUT"
                    }}/>
                <ChooseModal 
                    modal={modal} 
                    target={'modal-open'}  
                    data={pageList} 
                    redirect={this.init}/>
                <ChooseModal 
                    modal={modal} 
                    target={'modal-backup'}  
                    data={backupsList} 
                    redirect={this.restoreBackup}/>
                {this.virtualDom ? <EditorMeta modal={modal} target= {'modal-meta'} virtualDom={this.virtualDom}/> : false}


                
            </>
            
           
        )
    }
}