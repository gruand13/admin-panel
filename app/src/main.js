import $ from "jquery";

$.get("../api", data=>{
    data.forEach(file=>{
        $("body").append(`<h1>${file}</h1>`);
    })
    
},"JSON");

$("button").click(()=>{
    $.post("./api/createNewpage.php", {
        "name" : $("input").val()
    }), data=>{
        console.log(data);
    }
});