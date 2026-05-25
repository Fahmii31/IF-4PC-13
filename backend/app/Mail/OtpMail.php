<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailable;

class OtpMail extends Mailable
{
    public $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address(
                env('MAIL_FROM_ADDRESS'),
                'VoltCore'
            ),

            replyTo: [
                new \Illuminate\Mail\Mailables\Address(
                    env('MAIL_FROM_ADDRESS'),
                    'VoltCore Support'
                )
            ],

            subject: 'VoltCore Security Verification Code',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.otp',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}