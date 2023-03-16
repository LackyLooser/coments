'use strict'

const commentName = document.querySelector('#comment-name');
const commentBody = document.querySelector('#comment-body');
const commentDate = document.querySelector('#comment-date');
const form = document.querySelector('#comment-add');
const commentField = document.querySelector('.commets-list');
const deleteItem = document.querySelectorAll('.comments-item__delete');
const validateItem = document.querySelectorAll('.validate');

let comments = [];
loadComments();

function removeError(item){
    const parent = item.parentNode;
    if(parent.classList.contains("error")){
        parent.classList.remove('error');
        parent.querySelector(".error-text").remove();
    }
}

function createErrorInfo(item, text){
    const parent = item.parentNode;
    const errorWrapper = document.createElement('div');
    
    errorWrapper.classList.add("error-text");
    errorWrapper.textContent = text;
    
    if(!parent.classList.contains('error')){
        parent.classList.add('error');
        parent.append(errorWrapper);
    }
    
}

function validate(){
    let errorValidate = false;
    function validationRule(item){
        if(item.value == ""){
            createErrorInfo(item, "Поле обязательно");
            errorValidate = true
        } else {
            removeError(item);
        }
    }
    validateItem.forEach(item =>{
        item.addEventListener('input', function(){
            validationRule(item);
        })
        validationRule(item);
    })


    return errorValidate
}
form.addEventListener('submit', function addComment(e){
    e.preventDefault();

    if(validate()){
        return 
    }

    let userDate = `${commentDate.value}:${new Date().getHours()}:${new Date().getMinutes()}`

    const comment = {
        name : commentName.value,
        body : commentBody.value,
        date : commentDate.value ? Math.floor(new Date(userDate) / 1000) : Math.floor(new Date() / 1000),
        like : false
    }

    commentName.value = '';
    commentBody.value = '';
    commentDate.value = '';
    comments.push(comment);
    saveComments();
    showComments();
})


function deleteComment(index){
    comments = comments.filter((item, i) => i != index);
    saveComments();
    showComments();
}

function like(index){
    let isLike = comments[index].like;
    comments[index].like = !isLike;
    saveComments();
    showComments();
}
function saveComments(){
    localStorage.setItem('comments', JSON.stringify(comments));
}
function loadComments(){
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
}

function commentItemRender(name, body, date, like, index){
    const classLike = like ? " comments-item__like active" : "comments-item__like"
    const element = `<li class="comments-item">
                        <div class="comments-item__header">
                            <div class="comments-item__header-item">
                                <span class="comments-item__name">${name}</span>
                                <span class="comments-item__date">${timeConverter(date)}</span>
                            </div>
                            <div class="comments-item__header-icons">
                                <span class="${classLike}" onclick="like('${index}')">
                                    <i class="fa-solid fa-heart"></i>
                                </span>
                                <span onclick="deleteComment('${index}')" class="comments-item__delete">
                                    <i class="fa-solid fa-trash"></i>
                                </span>
                            </div>
                        </div>
                        <p class="comments-item__text">${body}</p>
                    </li>
                    `
    return element
}

function showComments (){
    let commentList = '';
    if(comments.length > 0) {
        comments.forEach((item, index)=>{
            commentList += commentItemRender(item.name, item.body, item.date, item.like, index)
        });
    } else {
        commentList = `<li class="comments-item__not">Коментариев нет</li>`
    }
    
    commentField.innerHTML = commentList;
}

function timeConverter(date){
    let a = new Date(date * 1000);
    let months = ['января','февраля','марта',
                  'апреля','мая','июня',
                  'июля','августа','сентября',
                  'октября','наября','декабря'];
    let year = a.getFullYear();
    let month = a.getMonth();
    let day = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let today = new Date();
    
    hour = hour < 10 ? `0${hour}` : hour;
    min = min < 10 ? `0${min}` : min;
    

    if(today.getFullYear() == year && today.getMonth() == month && today.getDate() == day){
        return `Сегодня, ${hour}:${min}`
    } else if(today.getFullYear() == year && today.getMonth() == month && today.getDate() - 1 == day){
        return `Вчера, ${hour}:${min}`
    } else {
        return day + ' ' + months[month] + ' ' + year;
    }
  }

