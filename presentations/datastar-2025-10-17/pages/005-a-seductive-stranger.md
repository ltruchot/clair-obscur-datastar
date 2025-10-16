# SSEductive stranger
Forget your first framework love in minutes

<img src="../assets/storage-datastar.png" style="position: absolute; top: 0; right: 0; width: 19%" />
<div style="display: flex; gap: 16px; align-items: flex-start; justify-content: space-between;">
    <div style="width: 50%; text-align: left;">
        What does it look like?
        <ul>
            <li>10kb JS lib</li>
            <li>Fully declarative, HTML compliant</li>
            <li>"3-functions-only" SDKs</li>
            <li>No deps, no build steps, no config</li>
            <li>For evergreen browsers, better on HTTP/2+</li>
        </ul>
    </div>
    <div style="width: 50%; text-align: left;">
        What does it do for a living?
        <ul>
            <li>data-* attributes</li>
            <li>Server-Sent Events helpers (SSE)</li>
            <li>Fastest HTML Fragment/Signals merging</li>
            <li>Plugins sticking to the same principles</li>
            <li>A few pro plugins made by greedy devs</li>
        </ul>
    </div>
</div>
<div style="text-align: left;">
```html
  <script type="module" src="path/to/datastar.js"></script>

  <input data-bind-msg />
  <p data-text="$msg"></p>
  <button data-on-click="@post('/send-msg')">send</button>
  <p id="waiting-for-response"></p>
```
Check out <a style="color: blue;" href="https://github.com/ltruchot/clair-obscur-datastar/tree/main/apps/hello-world" target="_blank">my local hello world example</a>
</div>
