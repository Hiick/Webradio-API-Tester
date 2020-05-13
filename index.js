import './scss/main.scss';

let firebaseConfig = {
    apiKey: "AIzaSyAhoKFp3X1BremGeZ_aeNoFXd715vhQS4U",
    authDomain: "webradio-stream.firebaseapp.com",
    databaseURL: "https://webradio-stream.firebaseio.com",
    projectId: "webradio-stream",
    storageBucket: "webradio-stream.appspot.com"
};

firebase.initializeApp(firebaseConfig);

$(document).ready(function(){
    $(".show_token").hide();
    $(".image-upload").hide();
    $(".image-upload-channel").hide();
    $(".show_login_token").hide();
    $("#forgot_pass_form").hide();
    let user = {};
    let channel = {};
    let downloadURL;
    let downloadURLChannel;
    let downloadURLRadio;

    const reset = () => {
        $(".btn_submit").attr("disabled", false);
        $(".btn_submit").css("background-color", "#EF0051");
        $(".btn_submit").hover(() => { $(".btn_submit").css("background-color", "#D31052") })
    };

    const disable = () => {
        $(".btn_submit").attr("disabled", true);
        $(".btn_submit").css("background-color", "gray");
    }

    $("#register_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable()

        let data = {
            email: $("#register_email").val(),
            username: $("#register_username").val(),
            password: $("#register_password").val()
        };

        $.ajax({
            type: "POST",
            url: 'https://webradio-stream.herokuapp.com/auth/register',
            data: data,
            success: (response) =>
            {
                reset()
                if (response.message.token) {
                    localStorage.setItem("token", response.message.token);
                    $('#register_response').html("");
                    $('#register_json_response').html(JSON.stringify(response, undefined, 4));
                    $(".show_token").show();
                    $("#new_token").html(response.message.token);
                } else {
                    $('#register_response').html("");
                    $('#register_json_response').html(JSON.stringify(response, undefined, 4));
                }
            },
            error: (err) => {
                reset();
                $('#register_response').html("");
                $('#register_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
            }
        });
    });

    $("#login_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        let data = {
            email: $("#login_email").val(),
            password: $("#login_password").val()
        };

        $.ajax({
            type: "POST",
            url: 'https://webradio-stream.herokuapp.com/auth/login',
            data: data,
            success: (response) =>
            {
                reset();
                if (response.message.token) {
                    localStorage.setItem("token", response.message.token);
                    $('#login_response').html("");
                    $('#login_json_response').html(JSON.stringify(response, undefined, 4));
                    $(".show_login_token").show();
                    $("#new_login_token").html(response.message.token);
                } else {
                    $('#login_response').html("");
                    $('#login_json_response').html(JSON.stringify(response, undefined, 4));
                }
            },
            error: (err) => {
                reset();
                $('#login_response').html("");
                $('#login_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
            }
        });
    });

    $("#forgot_pass_email_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        let data = {
            email: $("#forgot_pass_email_email").val()
        };

        $.ajax({
            type: "POST",
            url: 'https://webradio-stream.herokuapp.com/auth/forgot/password',
            data: data,
            success: (response) =>
            {
                reset();
                $('#forgot_response').html("");
                $('#forgot_json_response').html(JSON.stringify(response, undefined, 4));
                $("#forgot_pass_email_form").hide();
                $("#forgot_pass_form").show();
            },
            error: (err) => {
                reset();
                $('#forgot_response').html("");
                $('#forgot_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
            }
        });
    });

    $("#forgot_pass_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        let url = $("#forgot_pass_url").val();
        let data = {
            password: $("#forgot_pass_password").val()
        };

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: (response) =>
            {
                reset();
                $('#forgot_response').html("");
                $('#forgot_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                $('#forgot_response').html("");
                $('#forgot_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
            }
        });
    });

    $("#get_user_connected_form").on('submit', () => {
        const token = localStorage.getItem("token");
        disable()

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/users/logged',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_user_connected_response').html("");
                $('#get_user_connected_json_response').html(JSON.stringify(response, undefined, 4));
                user = response;

                setTimeout(function() {
                    $('#update_user_connected_username').val(user.user[0].username);
                    $('#profil').attr('src', user.user[0].avatar);
                    $(".image-upload").show();
                }, 2000);
            },
            error: () => {
                reset();
                $('#get_user_connected_response').html("");
                $('#get_user_connected_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
            }
        });
    });

    $('#cameraInput').on('change', function() {
        let selectedFile = event.target.files[0];

        let filename = $('#cameraInput').val().replace(/C:\\fakepath\\/i, '');
        let storageRef = firebase.storage().ref('/API_Tester/' + filename);

        let upload = storageRef.put(selectedFile);

        upload.on('state_changed', function(snapshot) {

        }, function(error) {
            console.log(error)
        }, function() {
            downloadURL = upload.snapshot.downloadURL;
            $('#profil').attr('src', downloadURL);
        });
    });

    $("#update_user_connected_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        let data = {
            avatar: $("#profil").attr('src'),
            username: $("#update_user_connected_username").val(),
        };

        $.ajax({
            type: "PUT",
            url: 'https://webradio-stream.herokuapp.com/authorized/users/'+user.user[0].user_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            data: data,
            success: (response) =>
            {
                reset();
                $('#update_user_connected_response').html("");
                $('#update_user_connected_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#update_user_connected_response').html("");
                    $('#update_user_connected_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#update_user_connected_response').html("");
                    $('#update_user_connected_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#update_user_password_connected_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        let data = {
            password: $("#update_user_password_connected_password").val(),
        };

        $.ajax({
            type: "PUT",
            url: 'https://webradio-stream.herokuapp.com/authorized/users/password/'+user.user[0].user_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            data: data,
            success: (response) =>
            {
                reset();
                $('#update_user_password_connected_response').html("");
                $('#update_user_password_connected_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#update_user_password_connected_response').html("");
                    $('#update_user_password_connected_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#update_user_password_connected_response').html("");
                    $('#update_user_password_connected_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_user_channel").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/'+user.user[0].channel_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_user_channel_response').html("");
                $('#get_user_channel_json_response').html(JSON.stringify(response, undefined, 4));
                channel = response;

                setTimeout(function() {
                    $('#update_user_channel_name').val(channel.channel.channel_name);
                    $('#profil_channel').attr('src', channel.channel.avatar);
                    $(".image-upload-channel").show();
                }, 2000);
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_user_channel_response').html("");
                    $('#get_user_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_user_channel_response').html("");
                    $('#get_user_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $('#cameraInputChannel').on('change', function() {
        let selectedFileChannel = event.target.files[0];

        let filenameChannel = $('#cameraInputChannel').val().replace(/C:\\fakepath\\/i, '');
        let storageRefChannel = firebase.storage().ref('/API_Tester/' + filenameChannel);

        let upload = storageRefChannel.put(selectedFileChannel);

        upload.on('state_changed', function(snapshot) {

        }, function(error) {
            console.log(error)
        }, function() {
            downloadURLChannel = upload.snapshot.downloadURL;
            $('#profil_channel').attr('src', downloadURLChannel);
        });
    });

    $("#update_user_channel_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        let data = {
            avatar: $("#profil_channel").attr('src'),
            name: $("#update_user_channel_name").val(),
        };

        $.ajax({
            type: "PUT",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/update/'+channel.channel._id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            data: data,
            success: (response) =>
            {
                reset();
                $('#update_user_channel_response').html("");
                $('#update_user_channel_json_response').html(JSON.stringify(response, undefined, 4));

            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#update_user_channel_response').html("");
                    $('#update_user_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#update_user_channel_response').html("");
                    $('#update_user_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#create_signalement_form").on('submit', (e) => {

        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        const channel_id = $("#create_signalement_channel_id").val();

        let data = {
            motif: $("#format").val()
        };

        $.ajax({
            type: "POST",
            url: 'https://webradio-stream.herokuapp.com/authorized/signalements/channel/'+channel_id,
            data: data,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#create_signalement_response').html("");
                $('#create_signalement_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#create_signalement_response').html("");
                    $('#create_signalement_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#create_signalement_response').html("");
                    $('#create_signalement_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_radios_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/radios/all',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_radios_response').html("");
                $('#get_all_radios_json_response').html(JSON.stringify(response, undefined, 4));
                channel = response;
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_all_radios_response').html("");
                    $('#get_all_radios_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_all_radios_response').html("");
                    $('#get_all_radios_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_one_radio_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        const radio_id = $("#get_one_radio_id").val();

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/radios/'+radio_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_one_radio_response').html("");
                $('#get_one_radio_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_one_radio_response').html("");
                    $('#get_one_radio_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_one_radio_response').html("");
                    $('#get_one_radio_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_channel_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/all',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_channel_response').html("");
                $('#get_all_channel_json_response').html(JSON.stringify(response, undefined, 4));
                channel = response;
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_all_channel_response').html("");
                    $('#get_all_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_all_channel_response').html("");
                    $('#get_all_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_channel_in_live_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/stream/all',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_channel_in_live_response').html("");
                $('#get_all_channel_in_live_json_response').html(JSON.stringify(response, undefined, 4));
                channel = response;
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_all_channel_in_live_response').html("");
                    $('#get_all_channel_in_live_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_all_channel_in_live_response').html("");
                    $('#get_all_channel_in_live_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_one_channel_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        const channel_id = $("#get_one_channel_id").val();

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/'+channel_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset()
                $('#get_one_channel_response').html("");
                $('#get_one_channel_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_one_channel_response').html("");
                    $('#get_one_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_one_channel_response').html("");
                    $('#get_one_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_users_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/users',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_users_response').html("");
                $('#get_all_users_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_all_users_response').html("");
                    $('#get_all_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_all_users_response').html("");
                    $('#get_all_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_active_users_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/users/active',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_active_users_response').html("");
                $('#get_all_active_users_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_all_active_users_response').html("");
                    $('#get_all_active_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_all_active_users_response').html("");
                    $('#get_all_active_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_inactive_users_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/users/inactive',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_inactive_users_response').html("");
                $('#get_all_inactive_users_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    reset();
                    $('#get_all_inactive_users_response').html("");
                    $('#get_all_inactive_users_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    reset();
                    $('#get_all_inactive_users_response').html("");
                    $('#get_all_inactive_users_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_one_user_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        const user_id = $("#get_one_user_id").val();

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/user/'+user_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_one_user_response').html("");
                $('#get_one_user_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_one_user_response').html("");
                    $('#get_one_user_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_one_user_response').html("");
                    $('#get_one_user_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#get_all_banish_channels_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");

        $.ajax({
            type: "GET",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/banish/all',
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#get_all_banish_channels_response').html("");
                $('#get_all_banish_channels_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#get_all_banish_channels_response').html("");
                    $('#get_all_banish_channels_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#get_all_banish_channels_response').html("");
                    $('#get_all_banish_channels_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#banish_one_channel_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        const channel_id = $("#banish_one_channel_id").val();

        $.ajax({
            type: "PUT",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/banish/'+channel_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset()
                $('#banish_one_channel_response').html("");
                $('#banish_one_channel_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#banish_one_channel_response').html("");
                    $('#banish_one_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#banish_one_channel_response').html("");
                    $('#banish_one_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $("#unbanish_one_channel_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        const channel_id = $("#unbanish_one_channel_id").val();

        $.ajax({
            type: "PUT",
            url: 'https://webradio-stream.herokuapp.com/authorized/channels/unbanish/'+channel_id,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset()
                $('#unbanish_one_channel_response').html("");
                $('#unbanish_one_channel_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#unbanish_one_channel_response').html("");
                    $('#unbanish_one_channel_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#unbanish_one_channel_response').html("");
                    $('#unbanish_one_channel_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });

    $('#cameraInputRadio').on('change', function() {
        let selectedFileRadio = event.target.files[0];

        let filenameRadio = $('#cameraInputRadio').val().replace(/C:\\fakepath\\/i, '');
        let storageRefChannel = firebase.storage().ref('/API_Tester/' + filenameRadio);

        let upload = storageRefChannel.put(selectedFileRadio);

        upload.on('state_changed', function(snapshot) {

        }, function(error) {
            console.log(error)
        }, function() {
            downloadURLRadio = upload.snapshot.downloadURL;
            $('#radio').attr('src', downloadURLRadio);
        });
    });

    $("#create_radio_form").on('submit', (e) => {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        disable();

        const token = localStorage.getItem("token");
        let data;

        if ($("#radio").attr('src') === '/image_1.5309ecb3.png') {
            data = {
                logo: '',
                radio_name: $("#create_radio_name").val(),
                direct_url: $("#create_radio_url").val()
            };
        } else {
            data = {
                logo: $("#radio").attr('src'),
                radio_name: $("#create_radio_name").val(),
                direct_url: $("#create_radio_url").val()
            };
        }

        $.ajax({
            type: "POST",
            url: 'https://webradio-stream.herokuapp.com/authorized/radios',
            data: data,
            headers: {
                'Authorization':'Bearer ' + token
            },
            success: (response) =>
            {
                reset();
                $('#create_radio_response').html("");
                $('#create_radio_json_response').html(JSON.stringify(response, undefined, 4));
            },
            error: (err) => {
                reset();
                if (err.responseJSON) {
                    $('#create_radio_response').html("");
                    $('#create_radio_json_response').html(JSON.stringify(err.responseJSON, undefined, 4));
                } else {
                    $('#create_radio_response').html("");
                    $('#create_radio_json_response').html("Problème avec le token OAuth2. Il n'est pas valide");
                }
            }
        });
    });
});

