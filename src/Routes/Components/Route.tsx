import { RoutePaths } from 'Interfaces/RoutePaths';
import React from 'react';
import { Route as ReactRouterRoute, Switch, Redirect } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';

export interface MyRouteProps<TLayoutProps> extends RouteProps {
  layout?: React.ElementType<TLayoutProps>;
  isForbidden?: boolean;
  layoutProps?: Partial<TLayoutProps>;
  forbiddenComponent?: React.FunctionComponent;
  [key: string]: any;
}

const PassThrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

const Forbidden = () => <Redirect to={RoutePaths.BASE_PATH} />;

export function Route<TLayoutProps>({
  layout: Layout = PassThrough,
  component: Component = PassThrough,
  forbiddenComponent: ForbiddenComponent = Forbidden,
  subLayout: SubLayout = undefined,
  layoutProps,
  children,
  isForbidden,
  ...rest
}: MyRouteProps<TLayoutProps>) {
  if (isForbidden) return <ForbiddenComponent />;

  const LayoutComponent = Layout as React.ElementType;

  return (
    <ReactRouterRoute
      {...rest}
      render={props => (
        <LayoutComponent {...layoutProps} {...props}>
          {SubLayout ? (
            <SubLayout {...props}>
              <Component {...props} key={props.location.pathname}>
                {children && <Switch>{children}</Switch>}
              </Component>
            </SubLayout>
          ) : (
            <Component {...props} key={props.location.pathname}>
              {children && <Switch>{children}</Switch>}
            </Component>
          )}
        </LayoutComponent>
      )}
    />
  );
}

export default Route;
