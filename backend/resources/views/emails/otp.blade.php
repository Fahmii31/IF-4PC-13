<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>VoltCore Verification Code</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial, Helvetica, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 16px;">

                <table width="100%" cellpadding="0" cellspacing="0" style="
                    max-width:520px;
                    background:#ffffff;
                    border:1px solid #e5e7eb;
                    border-radius:12px;
                ">

                    <!-- HEADER -->
                    <tr>
                        <td style="
                            padding:32px 32px 16px 32px;
                            border-bottom:1px solid #f3f4f6;
                        ">

                            <h1 style="
                                margin:0;
                                font-size:24px;
                                font-weight:700;
                                color:#111827;
                            ">
                                VoltCore
                            </h1>

                        </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                        <td style="
                            padding:32px;
                            color:#374151;
                        ">

                            <h2 style="
                                margin:0 0 16px 0;
                                font-size:20px;
                                color:#111827;
                            ">
                                Verification Code
                            </h2>

                            <p style="
                                margin:0 0 20px 0;
                                font-size:15px;
                                line-height:1.7;
                            ">
                                Use the verification code below to continue your request.
                            </p>

                            <!-- OTP -->
                            <div style="
                                text-align:center;
                                margin:32px 0;
                            ">

                                <div style="
                                    display:inline-block;
                                    padding:16px 28px;
                                    background:#f9fafb;
                                    border:1px solid #d1d5db;
                                    border-radius:10px;
                                    font-size:32px;
                                    font-weight:700;
                                    letter-spacing:8px;
                                    color:#111827;
                                ">
                                    {{ $otp }}
                                </div>

                            </div>

                            <p style="
                                margin:0 0 12px 0;
                                font-size:14px;
                                line-height:1.7;
                                color:#6b7280;
                            ">
                                This code will expire in 5 minutes.
                            </p>

                            <p style="
                                margin:0;
                                font-size:14px;
                                line-height:1.7;
                                color:#6b7280;
                            ">
                                If you did not request this code, you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="
                            padding:20px 32px;
                            border-top:1px solid #f3f4f6;
                            font-size:12px;
                            color:#9ca3af;
                            text-align:center;
                        ">

                            © {{ date('Y') }} VoltCore

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>