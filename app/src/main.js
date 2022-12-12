import $ from "jquery";

$.get("./api", data=>{
    data.forEach(file=>{
        $("body").append(`<h1>${file}</h1>`);
    })
    console.log('hello');
},"JSON");