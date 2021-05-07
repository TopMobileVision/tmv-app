function submit(event: any) {
    const username = $('#username').val()
    const password = $('#password').val()

    console.log(username)

    const valid = true;

    if (valid) window.location.href = 'index.html'

}