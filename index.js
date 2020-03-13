const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////////

// // BLOCKING SYNCHRONOUSLY
// const textIn = fs.readFileSync('./txt/input.txt' , 'utf-8')
// console.log(textIn);

// const textOut = `hello! This is output text : ${textIn} \n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt' , textOut);
// console.log('content written');

// // BLOCKING ASYNCHRONOUSLY

// fs.readFile('./txt/start.txt' ,'utf-8', (err , data1)=>{
//     fs.readFile(`./txt/${data1}.txt` ,'utf-8', (err , data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt' ,'utf-8', (err , data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2} \n ${data3}` , 'utf-8' , err =>{
//                 console.log("Your file is written");
//             })
//         })
//     })
// })
// console.log("will read");

//////////////////////////////////////

const replaceTemplate = (temp , product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g , product.productName);
    output = output.replace(/{%IMAGE%}/g , product.image); 
    output = output.replace(/{%PRICE%}/g , product.price);
    output = output.replace(/{%FROM%}/g , product.from);
    output = output.replace(/{%NUTRIENTS%}/g , product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g , product.description);
    output = output.replace(/{%QUANTITY%}/g , product.quantity);
    output = output.replace(/{%ID%}/g , product.id);

    if(!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g , 'not-organic')
    return output;
}


const tempCard = fs.readFileSync(`${__dirname}/templates/card.html` , 'utf-8' )
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html` , 'utf-8' )
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html` , 'utf-8' )

const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8' )
const dataObj = JSON.parse(data);



const server = http.createServer((req , res)=>{
    //console.log(req.url);
    const path = req.url
    
    if(path === '/overview' || path === '/'){
        res.writeHead(200 , {'Content-type':'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard , el) ).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardsHtml);
        //console.log(cardsHtml);
        res.end(output);
    }
    
    else if(path === '/product'){
        res.writeHead(200 , {'Content-type':'text/html'})
        res.end(tempProduct);
    }
    
    else if(path === '/api'){
            res.writeHead(200 , {'Content-type':'application/json'})
            res.end(data); 
    }
    
    else {
        res.writeHead(404 , {
            'Content-type':'text/html' ,
            'my-own-header':'hello-world',
        });
        res.end("<h1>page not found! </h1>");
    }
});

server.listen(8000 ,'127.0.0.1' , ()=>{
    console.log("listening to requests on port 8000");
})





