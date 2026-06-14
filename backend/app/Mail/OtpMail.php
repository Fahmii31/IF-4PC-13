<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;

class OtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            // Menggunakan config() bukan env()
            from: new Address(
                config('mail.from.address') ?? 'voltcorepbl@gmail.com', 
                'VoltCore'
            ),

            replyTo: [
                new Address(
                    config('mail.from.address') ?? 'voltcorepbl@gmail.com', 
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