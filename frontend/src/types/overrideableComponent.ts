export type ExtendableComponentProps<C extends React.ElementType, P = Record<never, never>> = Omit<
  React.ComponentPropsWithoutRef<C>,
  keyof P
> &
  P;

export type OverridableComponentProps<C extends React.ElementType, P = Record<never, never>> = ExtendableComponentProps<
  C,
  P
> & { component?: C };
