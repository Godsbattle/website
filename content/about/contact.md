+++
title = 'Contact Me'
layout = 'contact'
showDate = false
showAuthor = false
showWordCount = false
showReadingTime = false
sharingLinks = false
+++

<style>
  .ct-form {
    width: 100%;
    margin: 1.5rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .ct-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .ct-label {
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.45;
  }
  .ct-input,
  .ct-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 0.6rem;
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
    color: inherit;
    outline: none;
    transition: border-color 0.15s;
    font-family: inherit;
    resize: none;
  }
  .ct-input::placeholder,
  .ct-textarea::placeholder {
    opacity: 0.25;
  }
  .ct-input:focus,
  .ct-textarea:focus {
    border-color: rgba(255,255,255,0.3);
  }
  :root:not(.dark) .ct-input,
  :root:not(.dark) .ct-textarea {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.12);
    color: #111;
  }
  :root:not(.dark) .ct-input:focus,
  :root:not(.dark) .ct-textarea:focus {
    border-color: rgba(0,0,0,0.3);
  }
  .ct-submit {
    align-self: stretch;
    background: rgba(255,255,255,0.92);
    color: #111;
    border: none;
    border-radius: 0.65rem;
    padding: 0.6rem 1.6rem;
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .ct-submit:hover { opacity: 0.8; }
  :root:not(.dark) .ct-submit {
    background: #111;
    color: #fff;
  }
</style>

<p style="opacity:0.45; font-size:0.875rem; margin:0;">Get in touch and I'll get back to you.</p>

<form class="ct-form" action="https://formspree.io/f/mbdyabzz" method="POST">
  <div class="ct-field">
    <label class="ct-label">Name</label>
    <input class="ct-input" name="name" type="text" placeholder="John Doe">
  </div>
  <div class="ct-field">
    <label class="ct-label">Email</label>
    <input class="ct-input" name="email" type="email" placeholder="john@example.com">
  </div>
  <div class="ct-field">
    <label class="ct-label">Message</label>
    <textarea class="ct-textarea" name="message" rows="5" placeholder="Hey Christian, ..."></textarea>
  </div>
  <button class="ct-submit" type="submit">Send</button>
</form>
