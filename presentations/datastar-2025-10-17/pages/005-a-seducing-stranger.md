
# A seducing stranger
Forget your first framework love in minutes

<img src="../assets/storage-datastar.png" style="position: absolute; top: 0; right: 0; width: 19vw;" />
<div style="display: flex; gap: 16px; align-items: flex-start; justify-content: space-between;">
    <div style="width: 50%; text-align: left;">
        What does it look like ?
        <ul>
        <li>One-file 10kb frontend JS lib</li>
        <li>Fully declarative, in an HTML compliant syntax</li>
        <li>Backend/CMS "3-functions-only" SDKs</li>
        <li>SSE manager</li>
        <li>No dependencies, no build steps, no config</li>
        <li>For evergreen browsers, over HTTP/2+</li>
        </ul>
    </div>
    <div style="width: 50%; text-align: left;">
        What does it do for a living ?
        <ul>
            <li>data-* attributes</li>
            <li>Crazy fast HTML Fragment merging</li>
            <li>Crazy fast Signals management and merging</li>
            <li>Server-Sent Events management helpers (SSE)</li>
            <li>Plugins sticking to the same principles</li>
            <li><a style="color: blue;" href="https://example.andersmurphy.com/" target="_blank">@see Multiplayer Game of Life</a> by Anders Murphy</li>
        </ul>
    </div>
</div>
<div style="text-align: left;">
```html
  <script type="module" src="path/to/datastar.js"></script>

  <input data-on-input="$msg = event.target.value" />
  <p data-text="$msg"></p>
  <button data-on-click="@post('/send-msg')">send</button>
  <p id="waiting-for-response"></p>
```
Check out <a style="color: blue;" href="http://localhost:667" target="_blank">This hello world example for real!</a> by Anders Murphy
</div>
