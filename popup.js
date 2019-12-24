
document.addEventListener('DOMContentLoaded',async function() {
    let links=await getShortenLink();
    const table=document.getElementById("tabledata");
    for(let d of links){
        appendLinkRow(d,table);
    }
    const deleteLinks=document.getElementsByClassName("btn-delete");
    for(let l of deleteLinks){
        l.addEventListener("click",async function(){
            let id=l.getAttribute("data-id");
            await deleteLink(id);
           alert("delet suces");
        })
    }
    const copyLinks=document.getElementsByClassName("btn-copy");
    for(let l of copyLinks){
        l.addEventListener("click",async function(){
            let id=l.getAttribute("data-link");
            copyTextToClipboard(id);
           alert("copied");
        })
    }

});



async function getShortenLink(){
    let response=await fetch(`${BASE_API_URL}generated-links`);
    let data=await response.json();
    return data;
}
async function deleteLink(id){
    let response=await fetch(`${BASE_API_URL}delete-link`,{method:"post",headers: {
        'Content-Type': 'application/json'
      },body:JSON.stringify({linkid:id})});
    let data=await response.text();
    return data;
}
function appendLinkRow(d,table){
        
    let html="<tr>";
    html+="<td>"+d.link+"</td>";
    html+="<td><a target='_blank' href="+d.shorten+">"+d.shorten+"</a></td>";
    html+="<td>"+d.viewed+"</td>";
    html+="<td>"+ new Date(d.created).toLocaleString()+"</td>";
   
    html+="<td><div class='btn-group'> <a href='#'  type='button' class='btn btn-success btn-sm btn-copy' data-link="+d.shorten+">Copy</a>|<a type='button' href='#' class='btn btn-danger btn-delete' data-id='"+d.id+"')>Del</a></div></td>";
    html+="</tr>";
    table.insertAdjacentHTML( 'beforeend', html );
}


