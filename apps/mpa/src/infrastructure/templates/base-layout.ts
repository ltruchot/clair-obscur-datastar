import { html } from 'hono/html';
import type { HtmlEscapedString } from 'hono/utils/html';

export interface LayoutProps {
  title: string;
  content: HtmlEscapedString | Promise<HtmlEscapedString>;
}

export const baseLayout = ({ title, content }: LayoutProps): HtmlEscapedString | Promise<HtmlEscapedString> => {
  return html` <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.5/bundles/datastar.js"></script>
      </head>
      <body>
        ${content}
      </body>
    </html>`;
};
