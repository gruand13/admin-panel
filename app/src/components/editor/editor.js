
// import "../../helpers/iframeLoader.js";
// import axios from "axios";
// import React, {Component} from 'react';


// export default class Editor extends Component{
//     constructor(){
//         super();
//         this.currentPage='index.html';
//         this.state ={
//             pageList: [],
//             newPageList: ''
//         }
//         this.createNewPage = this.createNewPage.bind(this);
//     }
//     componentDidMount(){
       
//         this.init(this.currentPage);

//     }
//     init(page){
//         this.iframe = document.querySelector('iframe');
//         this.open(page);
//         this.loadPageList();
//     }

//     open(page){
//         this.currentPage = page;

//         axios 
//             .get(`../${page}?rnd=${Math.random()}`)
//             .then(res=> this.parseStrToDOM(res.data))
//             .then(this.wrapTextNodes)
//             .then(dom=>{
//                 this.virtualDom = dom;
//                 return dom;
//             })
//             .then(this.serializeDOMToString)
//             .then(html => axios.post("./api/saveTempPage.php", {html}))
//             .then(()=> this.iframe.load("../temp.html"))
//             .then(()=> this.enableEditing());
//     }

//     save(){
//         const newDom = this.virtualDom.cloneNode(this.virtualDom);
//         this.unwrapTextNodes(newDom);
//         const html = this.serializeDOMToString(newDom);
//         axios
//             .post("./api/savePage.php", {pageName: this.currentPage, html })

//     }
//     enableEditing(){
//         this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element =>{
//             element.contentEditable = "true";
//             element.addEventListener("input", ()=>{
//                 this.onTextEdit(element);
//             })


//         });
//     }

//     onTextEdit(element){
//         const id = element.getAttribute("nodeid");
//         this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
//         // error in this two pages
//         // console.log(element);
//     }

//     parseStrToDOM(str){
//         const parser = new DOMParser();
//         return parser.parseFromString(str, "text/html");

//     }
//     wrapTextNodes(dom){
//         const body =  dom.body;
//         let textNodes = [];

//         function recursy(element){
//             element.childNodes.forEach(node =>{
                
//                 if (node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length >0){
//                     textNodes.push(node);
                
//                 } else {
//                     recursy(node);
//                 }

//             })

//         };
//         recursy(body);
//         textNodes.forEach((node , i)=>{
//             const wrapper = dom.createElement('text-editor');
//             node.parentNode.replaceChild(wrapper, node);
//             wrapper.appendChild(node);
//             wrapper.setAttribute("noided", i)

//         });
//         return dom;
// }
//     serializeDOMToString(dom){
//         const serializer = new XMLSerializer();
//         return serializer.serializeToString(dom);
//     }

//     unwrapTextNodes(dom){
//         dom.body.querySelectorAll("text-editor").forEach(element=>{
//             element.parentNode.replaceChild(element.firstChild, element);
//         });
//     }

//     loadPageList(){
//         axios
//             .get("./api")
//             .then(res=> this.setState({pageList: res.data}))
//     }

//     createNewPage(){
//         axios
//             .post("./api/createNewPage.php", {"name": this.state.newPageName})
//             .then(this.loadPageList())
//             .catch(() => alert("Page already exist"));

            
//     }



//     deletePage(page){
//         axios
//             .post("./api/deletePage.php", {"name": page})
//             .then(this.loadPageList())
//             .catch(() => alert("Page does not exist"));

//         // console.log(page);


//     }




//     render(){
//         // const {pageList} = this.state;
//         // const pages = pageList.map((page,i) =>{
//         //     return(
//         //         <h1 key={i}>{page}
//         //             <a 
//         //             href="#"
//         //             onClick={()=> this.deletePage(page)}>(x)</a>
//         //         </h1>
//         //     )
//         // })
//         return (
//             <>
//                 <button onClick={()=>this.save()}>Click</button>
//                 <iframe src={this.currentPage} frameBorder="0"></iframe>
//             </>
//             // <>
//             //     <input 
//             //     onChange={(e)=>{this.setState({newPageName: e.target.value})}} 
//             //     type="text"/>
//             //     <button onClick={this.createNewPage}>Create page</button>
                

//             //     {pages}
//             // </>
//         )
//     }
// }

import "../../helpers/iframeLoader.js";
import axios from 'axios';
import React, {Component} from 'react';
import DOMHelper from '../../helpers/dom-helper';
import EditorText from "../editor-text/";

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = "index.html";
        this.state = {
            pageList: [],
            newPageName: ""
        }
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open(page) {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then(res => DOMHelper.parseStrToDOM(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => this.iframe.load("../temp.html"))
            .then(() => this.enableEditing())
            .then(()=> this.injectStyles());
    }

    save() {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        axios
            .post("./api/savePage.php", {pageName: this.currentPage, html})
    }

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            const id = element.getAttribute("nodeid");
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);

            new EditorText(element, virtualElement)
        });
    }
    injectStyles(){
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
        `;
        this.iframe.contentDocument.head.appendChild(style);
        
    }


 

    loadPageList() {
        axios
            .get("./api")
            .then(res => this.setState({pageList: res.data}))
    }

    createNewPage() {
        axios
            .post("./api/createNewPage.php", {"name": this.state.newPageName})
            .then(this.loadPageList())
            .catch(() => alert("Страница уже существует!"));
    }

    deletePage(page) {
        axios
            .post("./api/deletePage.php", {"name": page})
            .then(this.loadPageList())
            .catch(() => alert("Страницы не существует!"));
    }

    render() {
        // const {pageList} = this.state;
        // const pages = pageList.map((page, i) => {
        //     return (
        //         <h1 key={i}>{page}
        //             <a 
        //             href="#"
        //             onClick={() => this.deletePage(page)}>(x)</a>
        //         </h1>
        //     )
        // });

        return (
            <>
                <button onClick={() => this.save()}>Click</button>
                <iframe src={this.currentPage} frameBorder="0"></iframe>
            </>
            
            // <>
            //     <input
            //         onChange={(e) => {this.setState({newPageName: e.target.value})}} 
            //         type="text"/>
            //     <button onClick={this.createNewPage}>Создать страницу</button>
            //     {pages}
            // </>
        )
    }
}