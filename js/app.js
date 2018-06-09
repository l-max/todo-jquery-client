
var serverUrl = 'http://127.0.0.1:8000/api/';
var authToken = null;
(function (window) {
	'use strict';

    $('#register').click(function() {
        var popup_id = $('#' + $(this).attr('rel'));
        $(popup_id).show();
        $('.overlay_popup').show();
        $('.login-wrapper').hide();
    });

    $('#closeRegister').click(function() {
        $('.overlay_popup, .popup').hide();
        $('.login-wrapper').show();
    });

    $('#register-form').submit(function(event) {
        $.post(serverUrl + 'register', $('#register-form').serialize(), function(data, status) {
            if (status === 'success') {
                alert('User has been created!');
            } else {
                alert('Something was wrong.');
            }
        });
        event.preventDefault();
    });

    $('#loginBtn').click(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: serverUrl + 'login',
            success: function (data) {
                if (data) {
                    authToken = data.token;
                    startSession();
                } else {
                    location.reload(true);
                }
            },
            data: $('#login-form').serialize()
        });
        $('.login-wrapper').show();
    });

    $('.overlay_popup').click(function() {
        $('.overlay_popup, .popup').hide();
        $('.login-wrapper').show();
    });

    function startSession() {
        initForms();
        showTodoList();
    }

    function initForms() {
        $('.login-wrapper').hide();
        $('.todoapp-wrapper').removeClass('hidden');
    }

    function showTodoList(isDone = null) {
        $.ajax({
            type: 'GET',
            url: serverUrl + 'todo',
            data: 'done=' + isDone,
            beforeSend: function(x) {
                x.setRequestHeader('Authorization', 'Bearer ' + authToken);
            },
            success: function (data) {
                if (data) {
                    fillTodoList(data.data, isDone);
                } else {
                    location.reload(true);
                }
            }
        });
    }

    function fillTodoList(data, needFillLeftNum) {
        var list = '';
        var leftNum = data.length;
        for (var i = 0; i < data.length; i++) {
            var isDone = data[i].done;
            leftNum -= isDone;
            list += '<li' + (isDone ? ' class="completed"' : '') + '>';
            list += '<div class="view">';
            list += '<input class="toggle" type="checkbox"' + (isDone ? ' checked' : '') + '>';
            list += '<label>' + data[i].description + '</label>';
            list += '<button class="destroy" data-id="' + data[i].id + '"></button></div>';
            list += '<input class="edit" value="Create a TodoMVC template"></li>';
        }
        $('.todo-list').html(list);
        if (needFillLeftNum === null) {
            fillLeftNum(leftNum);
        }
    }

    function fillLeftNum(num) {
        $('.todo-count > strong').html(num);
    }

    $('#allBtn').click(function () {
        $('ul.filters a').removeClass('selected');
        $(this).addClass('selected');
        showTodoList();
    });

    $('#activeBtn').click(function () {
        $('ul.filters a').removeClass('selected');
        $(this).addClass('selected');
        showTodoList(0);
    });

    $('#completedBtn').click(function () {
        $('ul.filters a').removeClass('selected');
        $(this).addClass('selected');
        showTodoList(1);
    });

    //todo: need fix and done
    // $('.destroy').click(function () {
    //     deleteItem($(this).data('id'));
    // });
    //
    // function deleteItem(id) {
    //     $.ajax({
    //         type: 'DELETE',
    //         url: serverUrl + 'todo/' + id,
    //         beforeSend: function(x) {
    //             x.setRequestHeader('Authorization', 'Bearer ' + authToken);
    //         },
    //         success: function (data) {
    //         }
    //     });
    // }

    // function changeDoneState($id, isDone) {
    //     $.ajax({
    //         type: 'PUT',
    //         url: serverUrl + 'todo/' + id,
    //         dataType: "json",
    //         data: { done: isDone },
    //         beforeSend: function(x) {
    //             x.setRequestHeader('Authorization', 'Bearer ' + authToken);
    //         },
    //         success: function (data) {
    //         }
    //     });
    // }

    $('.new-todo').keydown(function (e) {
        var key = e.which;
        if (key == 13) {
            addNewTodo($('.new-todo').val());
        }
    });

    function addNewTodo(description) {
        $.ajax({
            type: 'POST',
            url: serverUrl + 'todo/',
            data: 'description=' + description,
            beforeSend: function(x) {
                x.setRequestHeader('Authorization', 'Bearer ' + authToken);
            },
            success: function (data) {
                if (data) {
                    $('.new-todo').val('');
                    showTodoList();
                }
            }
        });
    }

})(window);
