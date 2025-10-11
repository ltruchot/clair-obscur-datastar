import { isDevelopment } from '@/infrastructure/config';
import { raw } from 'hono/html';
import type { FC, PropsWithChildren } from 'hono/jsx';

type BaseLayoutProps = PropsWithChildren<{
  title: string;
}>;

export const BaseLayout: FC<BaseLayoutProps> = ({ title, children }) => {
  return (
    <>
      {raw('<!DOCTYPE html>')}
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{title}</title>
          <link rel="icon" href="/assets/favicon/favicon.ico" />

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
        </head>
        <body>
          {children}
          {isDevelopment && raw('<datastar-inspector></datastar-inspector>')}
        </body>
      </html>
    </>
  );
};
