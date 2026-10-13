<?php
/**
 * Copy this file to your Hostinger HOME directory (one level ABOVE public_html)
 * and rename it to: ideaburst-config.php
 *
 *   /home/u123456789/ideaburst-config.php      <- here (not web-accessible)
 *   /home/u123456789/public_html/              <- the website
 *
 * Never commit the real file. It is listed in .gitignore.
 */
return [
    // Stripe Dashboard -> Developers -> API keys. Use sk_test_... until you are ready to go live.
    'stripe_secret' => 'sk_test_REPLACE_ME',

    // Turn on only after enabling Stripe Tax in your Stripe Dashboard.
    'stripe_tax'    => false,

    'site_url'      => 'https://ideaburstflowers.com',

    // Where contact / event / newsletter emails are delivered.
    'mail_to'       => 'contact@ideaburstflowers.com',

    // Must be a mailbox on your own domain (create it in hPanel -> Emails).
    'mail_from'     => 'no-reply@ideaburstflowers.com',
];
