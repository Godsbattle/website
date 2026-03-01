+++
title = 'Resume'
showDate = false
showAuthor = false
showWordCount = false
showReadingTime = false
sharingLinks = false
 
+++

<style>
  /* ── Animated gradient border on experience cards ── */
  @property --gt-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @keyframes gt-spin {
    to { --gt-angle: 360deg; }
  }

  li > .flex > .break-words {
    position: relative;
    isolation: isolate;
  }
  li > .flex > .break-words::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.5rem; /* matches rounded-lg */
    padding: 1px;
    background: conic-gradient(
      from var(--gt-angle),
      transparent 50%,
      rgba(255,255,255,0.1) 63%,
      rgba(255,255,255,0.65) 80%,
      rgba(255,255,255,0.1) 93%,
      transparent 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: gt-spin 5s linear infinite;
    pointer-events: none;
  }
  /* Light mode – subtler dark stroke */
  :root:not(.dark) li > .flex > .break-words::before {
    background: conic-gradient(
      from var(--gt-angle),
      transparent 50%,
      rgba(0,0,0,0.05) 63%,
      rgba(0,0,0,0.22) 80%,
      rgba(0,0,0,0.05) 93%,
      transparent 100%
    );
  }

  /* Timeline date badges — more pronounced */
  span.rounded-md.border.border-primary-400 {
    border-color: rgba(255,255,255,0.4) !important;
    color: rgba(255,255,255,0.85) !important;
    background: rgba(255,255,255,0.07);
  }
  :root:not(.dark) span.rounded-md.border.border-primary-400 {
    border-color: rgba(0,0,0,0.28) !important;
    color: rgba(0,0,0,0.65) !important;
    background: rgba(0,0,0,0.04);
  }

  /* Website buttons — base layout (colors set via JS to beat Tailwind's !important) */
  a[role="button"][class*="bg-primary"] {
    border-radius: 0.75rem !important;
    padding: 0.55rem 1.4rem !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
    text-decoration: none !important;
    transition: opacity 0.15s !important;
  }
  a[role="button"][class*="bg-primary"] span,
  a[role="button"][class*="bg-primary"] svg {
    background: transparent !important;
  }
  a[role="button"][class*="bg-primary"]:hover {
    opacity: 0.85 !important;
  }
</style>

<script>
(function () {
  function styleButtons() {
    var dark = document.documentElement.classList.contains('dark');
    var bg   = dark ? 'rgba(255,255,255,0.92)' : '#111';
    var fg   = dark ? '#111' : '#fff';
    document.querySelectorAll('a[role="button"][class*="bg-primary"]').forEach(function (btn) {
      btn.style.setProperty('background', bg, 'important');
      btn.style.setProperty('color',      fg, 'important');
      btn.querySelectorAll('span, svg').forEach(function (el) {
        el.style.setProperty('color',      fg,          'important');
        el.style.setProperty('background', 'transparent', 'important');
      });
    });
  }
  document.addEventListener('DOMContentLoaded', styleButtons);
  new MutationObserver(styleButtons).observe(document.documentElement, {
    attributes: true, attributeFilter: ['class']
  });
})();
</script>

## Experience

{{< timeline >}}
{{< timelineItem icon="theproptrade" header="thePropTrade" badge="Nov 2025 to Present" subheader="Community Manager" >}}

<p>
Currently managing thePropTrade, with steady community growth and ongoing improvements through new strategies.
</p>
{{< button href="https://www.theproptrade.com" target="_blank" >}}
{{< icon "link" >}} Website
{{< /button >}}
{{< /timelineItem >}}

{{< timelineItem icon="pipfarm" header="PipFarm" badge="Feb 2025 to Nov 2025" subheader="Community and Affiliate Manager" >}}

<p>
  Scaled a Discord trading community from <strong>5,000 to 10,000 members</strong> in five months through targeted engagement, competitions, and affiliate partnerships—driving a <strong>40% increase in activity</strong> and a <strong>25% boost in referrals</strong>.
</p>

{{< button href="https://www.pipfarm.com" target="_blank" >}}
{{< icon "link" >}} Website
{{< /button >}}
{{< /timelineItem >}}

{{< timelineItem icon="pokerfuckindao" header="PokerDAO" badge="Apr 2022 to Dec 2024" subheader="Community Manager" >}}

<p>
  Built and moderated Discord and Telegram communities, growing membership from <strong>3,000 to 7,500</strong> through interactive events and Web3-focused content, while improving support workflows to reduce response times by <strong>50%</strong> and foster an inclusive member experience.
</p>

{{< button href="https://link3.to/pokerdao" target="_blank" >}}
{{< icon "link" >}} Website
{{< /button >}}
{{< /timelineItem >}}

{{< /timeline >}}

## Skills & Projects
{{< tabs >}}

  {{< tab label="Skills" >}}
    <ul>
      <li>Community strategy, growth, and moderation across Discord, Telegram, and X</li>
      <li>Affiliate program management and partnership development</li>
      <li>CRM platforms including Intercom and Zendesk</li>
      <li>Data-driven growth using engagement metrics and analytics</li>
      <li>Sales pitching, copywriting, and content planning</li>
    </ul>
  {{< /tab >}}

  {{< tab label="Projects" >}}
    <ul>
      <li><a href="/posts">{{< icon "link" >}} GodsBattle</a></li>
      <li><a href="https://products.godsbattle.net/" target="_blank">{{< icon "link" >}} 👨🏾‍🚀 Prop Tracker</a></li>
    </ul>
  {{< /tab >}}

  {{< tab label="Achievements" >}}
    <ul>
      <li><a href="https://vidiq.com/certificates/Fgz03Zk3GS/?utm_campaign=achievementsemail&utm_content=9000_subscribers&utm_source=sendgrid&utm_medium=email" target="_blank">{{< icon "fire" >}} 9,000 YouTube Subscribers</a></li>
      <li><a href="https://vidiq.com/certificates/w1bqoYgFge/?utm_campaign=achievementsemail&utm_content=4000000_views&utm_source=sendgrid&utm_medium=email" target="_blank">{{< icon "fire" >}} Over 4.5 Million Views on YouTube</a></li>
    </ul>
  {{< /tab >}}

{{< /tabs >}}

## Expertise
|                        |                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Community Management   | {{< keywordList >}} {{< keyword icon="discord" >}} Discord {{< /keyword >}} {{< keyword icon="x-twitter" >}} X/Twitter {{< /keyword >}} {{< keyword icon="check" >}} Circle {{< /keyword >}} {{< keyword icon="whatsapp" >}} WhatsApp {{< /keyword >}} {{< /keywordList >}} |
| Affiliate Management   | {{< keywordList >}} {{< keyword icon="gleam" >}} Gleam {{< /keyword >}} {{< keyword icon="x-twitter" >}} X/Twitter {{< /keyword >}} {{< keyword icon="instagram" >}} Instagram {{< /keyword >}} {{< keyword icon="envelope" >}} Email {{< /keyword >}} {{< /keywordList >}} |
| Customer Relations     | {{< keywordList >}} {{< keyword icon="intercom" >}} Intercom {{< /keyword >}} {{< keyword icon="zendesk" >}} Zendesk {{< /keyword >}} {{< /keywordList >}} |
| Software Expertise     | {{< keywordList >}} {{< keyword icon="gleam" >}} Gleam {{< /keyword >}} {{< keyword icon="zealy" >}} Zealy {{< /keyword >}} {{< keyword icon="notion" >}} Notion {{< /keyword >}} {{< keyword icon="figma" >}} Figma {{< /keyword >}} {{< keyword icon="clickup" >}} ClickUp {{< /keyword >}} {{< /keywordList >}} |
| Social Media           | {{< keywordList >}} {{< keyword icon="discord" >}} Discord {{< /keyword >}} {{< keyword icon="youtube" >}} YouTube {{< /keyword >}} {{< keyword icon="telegram" >}} Telegram {{< /keyword >}} {{< keyword icon="x-twitter" >}} X/Twitter {{< /keyword >}} {{< keyword icon="check" >}} Many more {{< /keyword >}} {{< /keywordList >}} |
| Communication          | {{< keywordList >}} {{< keyword icon="slack" >}} Slack {{< /keyword >}} {{< /keywordList >}} |
