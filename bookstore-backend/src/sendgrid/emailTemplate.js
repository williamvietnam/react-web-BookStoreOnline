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
    resetPasswordEmail: (password)=> `
    <div>Bạn đã yêu cầu đổi mật khẩu. Đây là một email được gửi đến bạn để thực hiện việc đó.
        <br>
        <br>
            Xin vui lòng dùng mật khẩu dưới đây để đăng nhập tài khoản của bạn:<br>
        <br>
        <b style="font-size: 28px">${password}</b><br>
        <br>
            Vui lòng đổi mật khẩu sau khi đăng nhập.
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
    </div></div>`,
    emailReciept: ({
        logo,
        recipientName,
        orderId,
        createdAt,
        userEmail,
        QRCode,
        paid,
        productsTable,
        fullAddress,
        paymentMethod
    })=> `<table class="main-body" style="box-sizing: border-box; min-height: 150px; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; width: 100%; height: 100%; background-color: rgb(234, 236, 237);" width="100%" height="100%" bgcolor="rgb(234, 236, 237)">
    <tbody style="box-sizing: border-box;">
      <tr class="row" style="box-sizing: border-box; vertical-align: top;" valign="top">
        <td class="main-body-cell" style="box-sizing: border-box;">
          <table class="container" style="box-sizing: border-box; font-family: Helvetica, serif; min-height: 150px; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; margin-top: auto; margin-right: auto; margin-bottom: auto; margin-left: auto; height: 0px; width: 90%; max-width: 550px;" width="90%" height="0">
            <tbody style="box-sizing: border-box;">
              <tr style="box-sizing: border-box;">
                <td class="container-cell" style="box-sizing: border-box; vertical-align: top; font-size: medium; padding-bottom: 50px;" align="center" valign="top">
                  <img src="${logo}" alt="GrapesJS." class="c926" style="box-sizing: border-box; color: rgb(158, 83, 129); width: 30%; font-size: 50px; padding: 0 0 0 0; margin: 0 0 0 0; text-align: left;">
                  <table class="c1766" style="box-sizing: border-box; margin-top: 0px; margin-right: auto; margin-bottom: 10px; margin-left: 0px; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; width: 100%; min-height: 30px;" width="100%">
                    <tbody style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td class="cell c1776" style="box-sizing: border-box; width: 70%; vertical-align: middle;" width="70%" valign="middle">
                          <div class="c1144" style="box-sizing: border-box; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px; font-size: 17px; font-weight: 300; text-align: center;">
                            <span style="box-sizing: border-box; font-size: 26px;"><strong style="box-sizing: border-box;">Chào ${recipientName}<br style="box-sizing: border-box;"></strong></span>
                            <span style="box-sizing: border-box; font-size: 16px;">Cảm ơn vì đã mua hàng tại Bookstore</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table id="ib2lv" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                    <tbody style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td id="ijtz5" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;" valign="top">
                          <div id="iehtu" style="box-sizing: border-box; padding: 10px; text-align: center; color: #000000;">
                            <span style="box-sizing: border-box; font-size: 24px;"><strong style="box-sizing: border-box;">Mã đơn hàng: ${orderId}</strong></span>
                          </div>
                          <div id="i93ur" style="box-sizing: border-box; padding: 5px 10px 5px 10px; border-radius: 0 0 0 0; border-bottom: 1px solid #6f777d;">
                            <span style="box-sizing: border-box; font-size: 16px;"><strong style="box-sizing: border-box;">Thông tin đơn hàng:&nbsp;</strong></span>
                          </div>
                          <table id="ih9in" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                            <tbody style="box-sizing: border-box;">
                              <tr id="iuf8p" style="box-sizing: border-box;">
                                <td id="ilf56" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0; width: 50%;" width="50%" valign="top">
                                  <div id="i2g9m" style="box-sizing: border-box; padding: 10px;">Mã đơn hàng:
                                    <span style="box-sizing: border-box; color: #000000;"><span style="box-sizing: border-box; font-size: 14px;"><strong style="box-sizing: border-box;">${orderId}</strong></span></span>
                                    <br style="box-sizing: border-box;">
                                  </div>
                                  <div id="im9l9" style="box-sizing: border-box; padding: 10px;">Ngày đặt hàng:
                                    <span style="box-sizing: border-box; color: #000000;"><br style="box-sizing: border-box;"><span style="box-sizing: border-box; font-size: 14px;"><strong style="box-sizing: border-box;">${createdAt}</strong></span></span>
                                    <br style="box-sizing: border-box;">
                                  </div>
                                </td>
                                <td id="isxvh" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0; width: 50%;" width="50%" valign="top">
                                  <div id="ivzgk" style="box-sizing: border-box; padding: 10px;">Người đặt:
                                    <br style="box-sizing: border-box;">
                                    <span style="box-sizing: border-box; font-size: 14px;"><span style="box-sizing: border-box; color: #000000;"><strong style="box-sizing: border-box;">${userEmail}</strong></span></span>
                                    <br style="box-sizing: border-box;">
                                  </div>
                                  <div id="i549d" style="box-sizing: border-box; padding: 10px;">Bên xuất:
                                    <span style="box-sizing: border-box; color: #000000;"><span style="box-sizing: border-box; font-size: 14px;"><strong style="box-sizing: border-box;">​​​​​​​<br style="box-sizing: border-box;">Bookstore</strong></span></span>
                                    <br style="box-sizing: border-box;">
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table id="iy655" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                    <tbody style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td id="itmyl" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;" valign="top">
                          <div id="ins1b" style="box-sizing: border-box; padding: 5px 10px 5px 10px; border-bottom: 1px solid #6f777d;">
                            <span style="box-sizing: border-box; font-size: 16px;"><strong style="box-sizing: border-box;">Sản phẩm:</strong></span>
                          </div>
                          <div id="m_4793566297098690509ins1b" style="box-sizing:border-box;padding:5px 10px 5px 10px">
                                <table style="
                                width: 100%;
                                text-align: left;
                            ">
                                    <thead>
                                        <tr>
                                            <th>Tên sản phẩm</th>
                                        <th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr>
                                    </thead>
                                    
                                <tbody>
                                   ${productsTable}
                                </tbody>
                                
                                </table>
                        </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table id="iy655" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                    <tbody style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td id="itmyl" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;" valign="top">
                          <div id="ins1b" style="box-sizing: border-box; padding: 5px 10px 5px 10px; border-bottom: 1px solid #6f777d;">
                            <span style="box-sizing: border-box; font-size: 16px;"><strong style="box-sizing: border-box;">Chi tiết thanh toán:</strong></span>
                          </div>
                          <table id="ih9in" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                          <tbody style="box-sizing: border-box;">
                            <tr id="iuf8p" style="box-sizing: border-box;">
                              <td id="ilf56" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0; width: 50%;" width="50%" valign="top">
                                <div id="i2g9m" style="box-sizing: border-box; padding: 10px;">Đã thanh toán:
                                  <span style="box-sizing: border-box; color: #000000;"><span style="box-sizing: border-box; font-size: 14px;"><strong style="box-sizing: border-box;">${paid}đ</strong></span></span>
                                  <br style="box-sizing: border-box;">
                                </div>
                                <div id="i2g9m" style="box-sizing: border-box; padding: 10px;">Phương thức thanh toán:
                                  <span style="box-sizing: border-box; color: #000000;"><span style="box-sizing: border-box; font-size: 14px;"><strong style="box-sizing: border-box;">${paymentMethod}</strong></span></span>
                                  <br style="box-sizing: border-box;">
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table id="iy655" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                    <tbody style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td id="itmyl" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;" valign="top">
                          <div id="ins1b" style="box-sizing: border-box; padding: 5px 10px 5px 10px; border-bottom: 1px solid #6f777d;">
                            <span style="box-sizing: border-box; font-size: 16px;"><strong style="box-sizing: border-box;">Giao tới:</strong></span>
                          </div>
                          <table id="ih9in" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                          <tbody style="box-sizing: border-box;">
                            <tr id="iuf8p" style="box-sizing: border-box;">
                              <td id="ilf56" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0; width: 50%;" width="50%" valign="top">
                                <div id="i2g9m" style="box-sizing: border-box; padding: 10px;">${fullAddress}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table id="iluef" style="box-sizing: border-box; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%">
                    <tbody id="ikmjh" style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td id="i7va8" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;" align="center" valign="top">
                          <div id="in2qh" style="box-sizing: border-box; padding: 10px; text-align: center;font-weight: 700;">Khi đã nhận được sản phẩm, nếu có thể vui lòng quét QR Code dưới đây để xác nhận rằng bạn đã nhận được hàng:
                            <br style="box-sizing: border-box;">​​​​​​​
                            <br style="box-sizing: border-box;">
                          </div>
                          <img src="${QRCode}" alt="QRCode" class="c926" style="box-sizing: border-box; color: rgb(158, 83, 129); width: 50%; font-size: 50px; padding: 0 0 0 0; margin: 0 0 0 0; text-align: left;">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="footer" style="box-sizing: border-box; margin-top: 50px; color: rgb(152, 156, 165); text-align: center; font-size: 11px; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px;" align="center">
                    <tbody style="box-sizing: border-box;">
                      <tr style="box-sizing: border-box;">
                        <td class="footer-cell" style="box-sizing: border-box;">
                          <table id="ibmsm" style="box-sizing: border-box; width: 100%; margin-top: 10px; margin-bottom: 10px;" width="100%">
                            <tbody style="box-sizing: border-box;">
                              <tr style="box-sizing: border-box;">
                                <td class="divider" style="box-sizing: border-box; background-color: rgba(0, 0, 0, 0.1); height: 1px;" height="1" bgcolor="rgba(0, 0, 0, 0.1)">
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div class="c2577" style="box-sizing: border-box; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;">
                            <p class="footer-info" style="box-sizing: border-box;">Hãy đến với chúng tôi - hệ thống bán sách trực tuyến uy tín. Nơi bạn có thể tìm được những giây phút giá trị bên những trang sách.
                            </p>
                            <p id="ipdlz" style="box-sizing: border-box;">
                              <br style="box-sizing: border-box;">
                              <a title="Trang chủ" target="_blank" href="http://18.191.134.82/" id="ijkg1" style="box-sizing: border-box; color: #3b97e3;">Trang chủ</a>
                              <a title="Fanpage" href="https://www.facebook.com/Bookstore_Fanpage-108050860802757" target="_blank" id="ioycg" style="box-sizing: border-box; color: #3b97e3; margin: 0 0 0 6px;">Fanpage</a>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`
}

export default emailTemplate;