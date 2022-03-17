const emailTemplate = {
    resetPassword: (resetLink)=> `
    <div>Bạn đã yêu cầu đổi mật khẩu. Đây là một email được gửi đến bạn để thực hiện việc đó.
        <br>
        <br>
            Xin vui lòng dùng đường dẫn dưới đây để thiết lập lại mật khẩu của bạn:<br>
        <br>
        <a href="${resetLink}">${resetLink}</a><br>
        <br>
            Đường dẫn trên sẽ hết hạn trong 3 giờ.
        <br>
        <br>
            Thân gửi,<br>
            Bookstore
        <br>
    </div></div>`,
    accountActivation: (activationLink)=> `
    <div>Bạn vừa mới đăng ký tài khoản tại Bookstore. Đây là một email được gửi đến bạn để kích hoạt tài khoản.
        <br>
        <br>
            Xin vui lòng dùng đường dẫn dưới đây để kích hoạt tài khoản của bạn:<br>
        <br>
        <a href="${activationLink}">${activationLink}</a><br>
        <br>
            Đường dẫn trên sẽ hết hạn trong 24 giờ.
        <br>
        <br>
            Thân gửi,<br>
            Bookstore
        <br>
    </div></div>`
}

export default emailTemplate;