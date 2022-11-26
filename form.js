let inputs = document.querySelectorAll('#contact')[0]
const btn = document.getElementById('contact-submit');
let formDiv = document.querySelector('.container');



btn.addEventListener('click',(e) => {
    e.preventDefault()
    getData()
});

function getData() {
    let obj = {
        fname:inputs[1].value,
        email:inputs[3].value,
        phone:inputs[5].value,
        price:inputs[7].value,
        date:inputs[9].value,
        time:inputs[11].value,
        address:inputs[13].value,
    }

    let data = localStorage.getItem('myData')
    if(!data) {
        let arr = [];
        localStorage.setItem('myData',JSON.stringify(arr))
        data = localStorage.getItem('myData')
    }
  
    let temp = JSON.parse(data);
    temp.push(obj);
    
    localStorage.setItem('myData',JSON.stringify(temp))  
    
    document.body.style.backgroundColor = "white"
    formDiv.innerHTML = `<h1>Thank You </h1>`

}
