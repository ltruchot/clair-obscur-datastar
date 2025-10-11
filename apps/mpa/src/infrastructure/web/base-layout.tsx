import { isDevelopment } from '@/infrastructure/config';
import { raw } from 'hono/html';
import type { FC, PropsWithChildren } from 'hono/jsx';

type BaseLayoutProps = PropsWithChildren<{
  title: string;
}>;

export const BaseLayout: FC<BaseLayoutProps> = ({ title, children }) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <script type="module" src="/web-components/list-element.es.js"></script>
        <script type="module" src="/web-components/font-picker-element.es.js"></script>

        {isDevelopment ? (
          <>
            <script type="module" src="/assets/scripts/datastar-pro/datastar-pro.js"></script>
            <script type="module" src="/assets/scripts/datastar-pro/datastar-inspector.js"></script>
          </>
        ) : (
          <script type="module" src="/assets/scripts/datastar-community/datastar.js"></script>
        )}

        <link rel="icon" href="/assets/favicon/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        {isDevelopment && raw('<datastar-inspector></datastar-inspector>')}
      </body>
    </html>
  );
};
